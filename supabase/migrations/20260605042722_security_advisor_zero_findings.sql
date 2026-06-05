-- ============================================================================
-- Security-advisor remediation: drive get_advisors(security) toward ZERO
-- DB-fixable findings, WITHOUT changing any behavioral guarantee from plan.md.
--
-- This file consolidates the three migrations applied to prod, in order:
--   1. security_advisor_remediation
--   2. grant_private_schema_usage
--   3. move_is_admin_to_private_schema
--
-- Findings addressed (4 of 5 cleared in DB; #5 is an Auth-config toggle):
--   1. WARN anon_security_definer_function_executable: public.is_admin()
--   2. WARN authenticated_security_definer_function_executable: drop_student
--   3. WARN authenticated_security_definer_function_executable: enroll_student
--   4. WARN authenticated_security_definer_function_executable: public.is_admin()
--   5. WARN auth_leaked_password_protection  -> NOT DB-fixable. Enable in
--      Supabase Dashboard: Authentication > Policies > "Leaked password
--      protection" (HaveIBeenPwned), or via Management API
--      PATCH /v1/projects/{ref}/config/auth { "password_hibp_enabled": true }.
--
-- STRATEGY
--   The linter flags SECURITY DEFINER functions that live in a PostgREST-
--   exposed schema (public) and are EXECUTE-able by anon/authenticated. Three
--   ways to clear it: revoke EXECUTE, switch to SECURITY INVOKER, or move out
--   of the exposed schema. We use a mix that preserves behavior exactly:
--
--   * enroll_student / drop_student MUST stay callable by authenticated and
--     MUST run privileged (to write the client-blocked sections.student_ids
--     under a row lock). We keep the privileged DEFINER logic but relocate it
--     to a non-exposed `private` schema, and expose thin SECURITY INVOKER
--     wrappers in `public` with the identical signature + return type. The
--     wrappers are INVOKER (not flagged); the workers live in `private`
--     (not introspected by PostgREST, so not flagged).
--
--   * is_admin() is only an internal helper for RLS policies (and the
--     enroll/drop workers). It is NOT meant to be a public RPC. We move it to
--     `private` and repoint every RLS policy (public tables + storage.objects
--     resumes bucket) and the workers to private.is_admin(), then drop the
--     public one.
--
--   KEY GOTCHA: RLS policy USING/WITH CHECK expressions are evaluated as the
--   INVOKING role, and Postgres DOES enforce EXECUTE privilege on functions
--   referenced inside them. So is_admin() must stay EXECUTE-able by
--   anon + authenticated -- but because it now lives in `private` (not an
--   exposed API schema), that grant does not make it a public RPC and the
--   linter no longer flags it. Likewise the INVOKER wrappers need USAGE on the
--   `private` schema to reach the workers.
--
--   Defense-in-depth (side observation): anon held table-level INSERT/UPDATE/
--   DELETE (incl. student_ids) on public.sections. RLS already blocked anon
--   writes (no anon write policy), but the grants were broader than necessary,
--   so we revoke them. authenticated keeps its column-restricted UPDATE grants,
--   which already EXCLUDE student_ids (relied on by behavioral check f).
-- ============================================================================

create schema if not exists private;

-- ---------------------------------------------------------------------------
-- 1) is_admin() -> private, EXECUTE to anon+authenticated (needed by RLS).
-- ---------------------------------------------------------------------------
create or replace function private.is_admin()
returns boolean
language sql
stable
security definer
set search_path to 'public'
as $$
  select exists (select 1 from public.admins a where a.id = auth.uid());
$$;

grant usage on schema private to anon, authenticated;
revoke all on function private.is_admin() from public;
grant execute on function private.is_admin() to anon, authenticated;

-- ---------------------------------------------------------------------------
-- 2) Privileged enroll/drop workers in `private` (SECURITY DEFINER).
--    auth.uid() reads the request JWT GUC and propagates through the call
--    chain, so ownership/admin checks behave identically to the originals.
-- ---------------------------------------------------------------------------
create or replace function private.enroll_student(section_id uuid, student_id uuid)
returns public.sections
language plpgsql
security definer
set search_path to 'public'
as $$
declare
  sec public.sections;
  owns_child boolean;
begin
  -- caller must own the student (or be admin)
  select exists (
    select 1 from public.students st
    where st.id = enroll_student.student_id
      and st.parent_id = auth.uid()
  ) into owns_child;

  if not owns_child and not private.is_admin() then
    raise exception 'not_authorized' using errcode = 'P0001';
  end if;

  -- lock the section row for the txn (prevents oversell on the last seat)
  select * into sec from public.sections s
  where s.id = enroll_student.section_id for update;

  if not found then raise exception 'not_found' using errcode = 'P0001'; end if;
  if sec.status <> 'published' then raise exception 'not_published' using errcode = 'P0001'; end if;
  if enroll_student.student_id = any(sec.student_ids) then raise exception 'already_enrolled' using errcode = 'P0001'; end if;
  if coalesce(array_length(sec.student_ids, 1), 0) >= sec.capacity then raise exception 'full' using errcode = 'P0001'; end if;

  update public.sections
  set student_ids = array_append(student_ids, enroll_student.student_id)
  where id = enroll_student.section_id
  returning * into sec;

  return sec;
end;
$$;

create or replace function private.drop_student(section_id uuid, student_id uuid)
returns public.sections
language plpgsql
security definer
set search_path to 'public'
as $$
declare
  sec public.sections;
  owns_child boolean;
begin
  select exists (
    select 1 from public.students st
    where st.id = drop_student.student_id
      and st.parent_id = auth.uid()
  ) into owns_child;

  if not owns_child and not private.is_admin() then
    raise exception 'not_authorized' using errcode = 'P0001';
  end if;

  select * into sec from public.sections s
  where s.id = drop_student.section_id for update;

  if not found then raise exception 'not_found' using errcode = 'P0001'; end if;

  update public.sections
  set student_ids = array_remove(student_ids, drop_student.student_id)
  where id = drop_student.section_id
  returning * into sec;

  return sec;
end;
$$;

revoke all on function private.enroll_student(uuid, uuid) from public;
revoke all on function private.drop_student(uuid, uuid)  from public;
grant execute on function private.enroll_student(uuid, uuid) to authenticated;
grant execute on function private.drop_student(uuid, uuid)  to authenticated;

-- ---------------------------------------------------------------------------
-- 3) Drop the old public DEFINER enroll/drop, replace with INVOKER wrappers.
--    Identical signature + return type -> client/RPC contract unchanged.
-- ---------------------------------------------------------------------------
drop function if exists public.enroll_student(uuid, uuid);
drop function if exists public.drop_student(uuid, uuid);

create or replace function public.enroll_student(section_id uuid, student_id uuid)
returns public.sections
language sql
security invoker
set search_path to 'public'
as $$
  select * from private.enroll_student(section_id, student_id);
$$;

create or replace function public.drop_student(section_id uuid, student_id uuid)
returns public.sections
language sql
security invoker
set search_path to 'public'
as $$
  select * from private.drop_student(section_id, student_id);
$$;

-- Signed-in only (matches plan.md): grant authenticated, never anon.
revoke all on function public.enroll_student(uuid, uuid) from public;
revoke all on function public.drop_student(uuid, uuid)  from public;
revoke execute on function public.enroll_student(uuid, uuid) from anon;
revoke execute on function public.drop_student(uuid, uuid)  from anon;
grant execute on function public.enroll_student(uuid, uuid) to authenticated;
grant execute on function public.drop_student(uuid, uuid)  to authenticated;

-- ---------------------------------------------------------------------------
-- 4) Repoint every RLS policy from public.is_admin() to private.is_admin().
-- ---------------------------------------------------------------------------
-- admins
alter policy admins_admin_all  on public.admins using (private.is_admin()) with check (private.is_admin());
alter policy admins_self_select on public.admins using ((id = auth.uid()) or private.is_admin());

-- parent_assessments
alter policy parent_assessments_admin_select on public.parent_assessments using (private.is_admin());

-- parents
alter policy parents_admin_delete on public.parents using (private.is_admin());
alter policy parents_self_select  on public.parents using ((id = auth.uid()) or private.is_admin());
alter policy parents_self_update  on public.parents
  using ((id = auth.uid()) or private.is_admin())
  with check ((id = auth.uid()) or private.is_admin());

-- sections
alter policy sections_admin_delete on public.sections using (private.is_admin());
alter policy sections_public_select on public.sections
  using ((status = 'published'::text) or (tutor_id = auth.uid()) or private.is_admin());
alter policy sections_tutor_insert on public.sections
  with check (private.is_admin() or ((tutor_id = auth.uid()) and (status = 'pending_approval'::text) and (student_ids = '{}'::uuid[])));
alter policy sections_tutor_update on public.sections
  using ((tutor_id = auth.uid()) or private.is_admin())
  with check (private.is_admin() or ((tutor_id = auth.uid()) and (status = 'pending_approval'::text)));

-- student_evaluations
alter policy student_evaluations_admin_select on public.student_evaluations using (private.is_admin());

-- students
alter policy students_parent_delete on public.students using ((parent_id = auth.uid()) or private.is_admin());
alter policy students_parent_select on public.students
  using ((parent_id = auth.uid()) or private.is_admin() or (exists (
    select 1 from public.sections s
    where ((s.tutor_id = auth.uid()) and (students.id = any (s.student_ids))))));
alter policy students_parent_update on public.students
  using ((parent_id = auth.uid()) or private.is_admin())
  with check ((parent_id = auth.uid()) or private.is_admin());

-- surveys / tutor forms
alter policy surveys_admin_select          on public.surveys          using (private.is_admin());
alter policy tutor_assessments_admin_select on public.tutor_assessments using (private.is_admin());
alter policy tutor_evaluations_admin_select on public.tutor_evaluations using (private.is_admin());

-- tutors
alter policy tutors_admin_delete on public.tutors using (private.is_admin());
alter policy tutors_public_select on public.tutors
  using ((status = 'active'::text) or (id = auth.uid()) or private.is_admin());
alter policy tutors_self_update on public.tutors
  using ((id = auth.uid()) or private.is_admin())
  with check ((id = auth.uid()) or private.is_admin());

-- storage.objects (resumes bucket)
alter policy resumes_tutor_select on storage.objects
  using ((bucket_id = 'resumes'::text) and (((storage.foldername(name))[1] = (auth.uid())::text) or private.is_admin()));
alter policy resumes_tutor_delete on storage.objects
  using ((bucket_id = 'resumes'::text) and (((storage.foldername(name))[1] = (auth.uid())::text) or private.is_admin()));

-- ---------------------------------------------------------------------------
-- 5) Now nothing references public.is_admin(); drop it.
-- ---------------------------------------------------------------------------
drop function if exists public.is_admin();

-- ---------------------------------------------------------------------------
-- 6) Defense-in-depth: revoke broader-than-needed anon write grants on
--    public.sections. (RLS already blocked anon writes; this removes the grant
--    surface entirely. authenticated column grants are untouched and still
--    EXCLUDE student_ids.)
-- ---------------------------------------------------------------------------
revoke insert, update, delete on public.sections from anon;
