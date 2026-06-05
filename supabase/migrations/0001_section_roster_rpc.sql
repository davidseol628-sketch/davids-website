-- Roster for a tutor's own section: returns each enrolled student joined to the
-- parent's contact info.
--
-- Why an RPC: the `parents` table is self-SELECT only under RLS, so a tutor
-- can't read a parent row directly — which left the roster's Parent/Contact
-- columns blank. This SECURITY DEFINER function reads parents/students past RLS
-- but ONLY returns rows for a section the CALLING tutor owns
-- (s.tutor_id = auth.uid()), so it exposes nothing broader than the tutor's own
-- rosters. Execute is granted to authenticated users only.

create or replace function public.section_roster(p_section_id uuid)
returns table (
  student_id   uuid,
  student_name text,
  grade        text,
  parent_name  text,
  email        text,
  phone        text
)
language sql
security definer
set search_path = public
as $$
  select st.id, st.full_name, st.grade, p.full_name, p.email, p.phone
  from sections s
  join students st on st.id = any(s.student_ids)
  left join parents p on p.id = st.parent_id
  where s.id = p_section_id
    and s.tutor_id = auth.uid()
  order by st.full_name;
$$;

revoke all on function public.section_roster(uuid) from public, anon;
grant execute on function public.section_roster(uuid) to authenticated;
