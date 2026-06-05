# Implementation Plan — Enrichment Center Forms & Enrollment App

## Goal

Build a React app for an enrichment center with:

1. Student Evaluation Form
2. Tutor Evaluation Form
3. Tutor Self-Assessment Form
4. Parent Assessment Form (of tutor and the enrichment center)
5. Surveys — Parent Satisfaction, Student Satisfaction, etc.
6. Account signup for new tutors and parents. **Students are not accounts** — they're profiles inside a parent's account (a parent can hold multiple student profiles, one per child).
7. **Class catalog + per-section enrollment** — once signed up, parents browse available sections and enroll their kids in the ones they want, from inside their dashboard
8. **Tutor-created sessions** — tutors can post their own sessions/sections (title, subject, schedule, capacity) from inside their tutor dashboard; **admin approval is required** before a section goes live in the public catalog
9. **Self-service join & drop** — parents can enroll a child in new sessions and drop a child from sessions, anytime (no cutoff), from their dashboard. Dropping frees the seat immediately. **No waitlist.**

## Decisions (locked in)

- **Backend / persistence**: Supabase (Postgres + Auth + Storage, via MCP)
- **Styling**: Plain CSS modules (no Tailwind, no component library)
- **Frontend**: Existing Vite + React 19 starter
- **Forms**: `react-hook-form` + `zod` for validation
- **Routing**: `react-router-dom`

## Decisions locked in (open questions resolved)

- [x] **Auth scope** — Three roles: `admin`, `tutor`, `parent`. Students are NOT accounts — they're profiles owned by a parent (a parent can have multiple). Tutors and admins are individuals.
- [x] **Scope of MVP** — Ship all 5 forms + signup + catalog + tutor-posted sections + admin dashboard.
- [x] **Form questions** — I'll draft sensible defaults; David edits the wording after seeing them on screen.
- [x] **Tutor session approval** — Required. Every tutor-posted section needs admin approval before it appears in the public catalog.
- [x] **Payment** — Free / handled offline for the MVP. No Stripe integration. Easy to add later without breaking the data model.
- [x] **Capacity & waitlist** — No waitlist. If a section is full, the catalog shows "full" and the Enroll button is disabled.
- [x] **Drop policy** — Parents can drop a child from a section anytime. No cutoff. No refund logic (since no payment).
- [x] **Enrollment model** — Each section stores a `student_ids uuid[]` array of currently enrolled students. Enroll = append (after a capacity check). Drop = remove. No history kept on drop. Single-table writes only — no join table.

## Defaults applied (not asked, sensible for MVP — flag if wrong)

- [x] **File uploads** — Tutor resume is a **PDF uploaded to Supabase Storage** (`application/pdf` only, ~5 MB cap), stored in a private `resumes` bucket. `tutors.resume_url` holds the storage path. (Upgraded from the earlier URL-only default.)
- [x] **Email notifications** — None in MVP. Admin uses the dashboard to see what's pending. Email via Edge Function + Resend is a follow-up.
- [x] **Hosting** — gcloud (per the existing Phase G).
- [x] **Deleting a student profile while enrolled** — Blocked with a message ("drop this child from their sessions first"). Avoids dangling IDs in section arrays.
- [x] **Multiple sections per student** — Allowed. A child can be in many sections at once.
- [x] **Same section twice** — Blocked. Enroll is a no-op (or shows "already enrolled") if the child is already in the array.

## Task Analysis

- **Type**: Feature (multi-form app + account signup + class catalog + section enrollment + tutor-posted sessions + admin dashboard)
- **Complexity**: Very Large
- **Estimated Time**: 1–2 weeks for a solid MVP (was 3–5 days before catalog + tutor sessions + join/drop were added)

## Architecture

```
React 19 (Vite)
  ├── react-router-dom         routing (Home, Enroll, Forms, Login, Admin)
  ├── react-hook-form + zod    form state + validation
  ├── @supabase/supabase-js    auth, database, storage
  └── CSS Modules              per-component styles
```

**Roles**: `admin`, `tutor`, `parent`. (Students are NOT a role — they are records owned by a parent account.)

## Implementation Phases

### Phase A — Foundation (~0.5 day)

- [ ] Install: `react-router-dom`, `react-hook-form`, `zod`, `@hookform/resolvers`, `@supabase/supabase-js`
- [ ] Replace starter `App.jsx` with a router + layout shell (header, nav, footer)
- [ ] Create `.env.local` with `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` (and add to `.gitignore`)
- [ ] Build reusable primitives:
  - `FormField` (label + input + error message)
  - `RatingScale` (1–5 radio scale, used heavily in evaluations)
  - `SubmitButton` (loading state)
  - `Layout`, `Nav`
- [ ] **Public landing page** (`/`, rendered by `routes/Home.jsx`):
  - Top-right corner of the header: a **Log in** link and a **Sign up** button (linking to `/login` and `/signup`)
  - Center name / logo in the top-left
  - Body: filler marketing sections (hero headline, "about us", "what we offer", "our approach", contact info) — placeholder copy with `[Filler]` markers so David can find and edit them quickly
  - Footer with copyright
  - No auth required to view; the page is the entry point for anyone arriving at the site

### Phase B — Supabase schema & auth (~0.5 day)

Tables to create via Supabase MCP.

> **Notes on this schema**
> - Email + password are managed by Supabase Auth (its own `auth.users` table). The login-bearing tables below (`parents`, `tutors`, `admins`) each store `auth.users.id` as their primary key so we can look the auth user up. We never store raw passwords.
> - **Students do NOT have logins.** A student row is a plain record with `parent_id` pointing at the parent that owns it. Its `id` is a fresh `uuid`, NOT an auth user id.
> - **Enrollment is one-sided.** Each `sections` row carries a `student_ids uuid[]` of currently enrolled students. There is no enrollments table and no waitlist. Enroll = append; drop = remove. No history is kept on drop.
> - The enroll/drop operations go through a Postgres function (RPC) that re-checks capacity inside a transaction, so two simultaneous clicks on the last seat can't oversell the section.

- **`parents`** — `id uuid pk` (= auth.users.id), `email`, `full_name`, `phone`, `created_at`
- **`students`** — `id uuid pk` (fresh uuid, NOT an auth id), `parent_id uuid` (→ parents.id), `full_name`, `grade`, `school`, `date_of_birth` (optional), `created_at`
- **`tutors`** — `id uuid pk` (= auth.users.id), `email`, `full_name`, `bio`, `qualifications`, `subjects text[]`, `availability jsonb`, `resume_url` (path to the uploaded PDF in the `resumes` Storage bucket), `status` (`pending_approval` / `active` / `inactive`), `created_at`
- **`admins`** — `id uuid pk` (= auth.users.id), `email`, `full_name`, `created_at` — admins are added manually
- **`sections`** — `id uuid pk`, `title`, `subject`, `description`, `grade_range`, `tutor_id` (→ tutors.id), `schedule jsonb` (days + times), `start_date`, `end_date`, `capacity int`, `location`, `status` (`pending_approval` / `published` / `cancelled`), `student_ids uuid[]` (currently enrolled), `created_at`
- **Form tables** — each table has `id`, `submitted_by` (auth user id), `responses jsonb`, `created_at`, plus the relevant subject column(s):
  - `student_evaluations` — `student_id`, `tutor_id`, optional `section_id`
  - `tutor_evaluations` — `tutor_id` (and the submitter is admin)
  - `tutor_assessments` — `tutor_id` (tutor evaluating self)
  - `parent_assessments` — `parent_id`, `tutor_id`
  - `surveys` — `survey_type` (text — `parent_satisfaction`, `student_satisfaction`, etc.)

**Storage** (Supabase Storage):
- `resumes` bucket — **private**. Tutor resume PDFs only (`application/pdf`, ~5 MB cap). Path convention `resumes/{tutor_id}/{filename}.pdf`.
- Storage RLS: a tutor can `INSERT`/`UPDATE`/`SELECT`/`DELETE` only objects under their own `{tutor_id}/` prefix; admins can read all; no public read (admin views resumes from the dashboard via a short-lived signed URL).

**RPCs** (called from the client; writes to `sections.student_ids` go ONLY through these):
- `enroll_student(section_id uuid, student_id uuid)` — locks the section row, checks `array_length(student_ids) < capacity`, checks the student isn't already in the array, appends. Returns the updated row or an error code (`full`, `already_enrolled`, `not_published`, `not_authorized`).
- `drop_student(section_id uuid, student_id uuid)` — locks the section row, removes the student from `student_ids`. Returns the updated row.

**RLS policies** (high-level):
- `sections` → public `SELECT` for `status = 'published'`; tutor `INSERT`/`UPDATE` (non-status fields) on rows where `tutor_id = auth.uid()`; admin can do anything; `student_ids` is NOT updatable from the client — only the RPCs above can touch it.
- `tutors` → public `SELECT` for `status = 'active'` (bio shown on section pages); self `UPDATE`; admin everything.
- `parents` → self `SELECT`/`UPDATE` only; admin everything.
- `students` → parent (`parent_id = auth.uid()`) `SELECT`/`INSERT`/`UPDATE`/`DELETE` on rows they own; tutors can `SELECT` students whose ids appear in `student_ids` of one of their sections (so they can render the roster); admin everything.
  - **Deletion guard**: a trigger blocks `DELETE FROM students` if the student's id still appears in any `sections.student_ids`. UI surfaces "drop this child from their sessions first."
- Form tables → authenticated `INSERT` (any logged-in user can submit); `SELECT` admin-only (plus the tutor can read evaluations they wrote about their own students, if we want that — TBD).

**Auth**:
- Supabase email/password
- One auth user per row in `parents`, `tutors`, or `admins` (matched by id). Students do NOT have an auth user.
- `AuthProvider` context + `useAuth()` hook resolves the current `auth.users.id` to the right table by checking which of `parents` / `tutors` / `admins` contains it; that table determines the role.
- `<RequireAuth as="tutor|parent|admin">` wrapper for role-gated routes.

### Phase C — Parent and tutor signup (~1 day)

- [ ] `/signup` chooser page → "I'm a parent" vs "I'm a tutor"
- [ ] `ParentSignupForm` — name, email, password, phone. On submit: create Supabase auth user; insert `parents` row keyed to `auth.users.id`; redirect to dashboard.
- [ ] On the first dashboard visit (gated by a check): prompt the parent to **add at least one student profile** ("Add a child to your account.") via `StudentProfileForm`. A parent can add more children at any time afterward.
- [ ] `TutorSignupForm` — full_name, email, password, qualifications, subjects taught, availability (jsonb), **resume PDF upload** (to the `resumes` Storage bucket; `application/pdf`, ~5 MB max). On submit: create Supabase auth user; upload the PDF to `resumes/{tutor_id}/` and store its path in `resume_url`; insert `tutors` row with `status = 'pending_approval'`; show a "pending admin approval" screen (tutor can log in but can't post sections until approved).
- [ ] Admins are NOT self-signup. An admin runs a one-off SQL or seed script to insert an `admins` row pointing at an existing auth user.

### Phase D — Class catalog, section enrollment, tutor-posted sessions (~2–3 days)

This is the new "core" of the app on top of the form-handling shell.

**D1. Public catalog**
- [ ] `/catalog` — list of all published sections, filterable by subject / grade / day
- [ ] `/sections/:id` — section detail (description, schedule, tutor name, seats remaining)
- [ ] If logged-out user clicks "Enroll", redirect to `/signup`

**D2. Parent dashboard — manage children, join & drop**
- [ ] `/dashboard` — list of the parent's children, each showing "My sessions" + a button to browse the catalog
- [ ] **Manage children**: "Add a child" (name, grade, school, optional dob), "Edit", "Remove" (blocked by the DB trigger if the child still appears in any `sections.student_ids` — UI says "drop this child from their sessions first")
- [ ] **"My sessions" for one child**: query is `SELECT * FROM sections WHERE $1 = ANY(student_ids)` with that child's id, joined to `tutors` for the tutor name
- [ ] **Join flow**: from a section detail page, click "Enroll" → pick which child to enroll (skip picker if only one child) → call `enroll_student(section_id, student_id)` RPC → success or error toast (`full` / `already_enrolled`)
- [ ] **Drop flow**: from a child's "My sessions", click "Drop" → confirmation modal → call `drop_student(section_id, student_id)` → row in section's `student_ids` is removed; seat is immediately free for someone else. No waitlist promotion (no waitlist).

**D3. Tutor dashboard — post sessions**
- [ ] `/tutor` — "My sections" + "Post a new session" button. Gated: tutor must be `status = 'active'` (approved by admin) before they can post.
- [ ] `SectionForm` (create / edit) — title, subject, description, grade range, schedule, capacity, location, start/end dates
- [ ] On submit: insert `sections` row with `status = 'pending_approval'`, `tutor_id = self`, `student_ids = '{}'`. Section is invisible in the public catalog until admin approves.
- [ ] **Roster view**: for each of the tutor's sections, look up each id in `section.student_ids` against `students` and join up to `parents` for contact email/phone.

**D4. Admin moderation**
- [ ] `/admin/sections` — list of pending tutor-posted sections with approve (→ `status = 'published'`) and reject (→ `status = 'cancelled'`) buttons. Also a "cancel a published section" action.

### Phase E — The five forms (~1.5–2 days, ~3 hrs each)

Each form follows the same pattern: zod schema → `react-hook-form` → Supabase insert → success screen. **Question wording defaults will be drafted by Claude; David edits later.**

- [ ] **Student Evaluation Form** (tutor evaluates student progress) → writes to `student_evaluations`
- [ ] **Tutor Evaluation Form** (admin evaluates tutor performance) → writes to `tutor_evaluations`
- [ ] **Tutor Self-Assessment Form** (tutor reflects on own teaching) → writes to `tutor_assessments`
- [ ] **Parent Assessment Form** (parent rates both the tutor and the enrichment center) → writes to `parent_assessments`
- [ ] **Surveys** — single config-driven `SurveyForm` component → writes to `surveys` with `survey_type` set per config:
  - Parent Satisfaction Survey (`survey_type = 'parent_satisfaction'`)
  - Student Satisfaction Survey (`survey_type = 'student_satisfaction'`)
  - (Easy to add more by adding a config entry)

### Phase F — Admin dashboard (~1 day)

- [ ] `/admin` — landing page with counts (pending tutor signups, pending sections, recent form submissions)
- [ ] `/admin/signups` — list of pending tutor/student signups with approve / reject
- [ ] `/admin/sections` — moderate tutor-posted sections (approve / reject / cancel)
- [ ] `/admin/classes` — admin can also create classes/sections directly
- [ ] `/admin/rosters/:sectionId` — see who's enrolled in any section
- [ ] `/admin/submissions` — filterable list of every form submission with detail view

### Phase G — Polish & deploy (~0.5 day)

- [ ] Loading + error states on every async call
- [ ] Toasts / success screens for submissions
- [ ] Mobile-responsive pass
- [ ] Deploy gcloud
- [ ] README with setup instructions

## Files to Create

```
src/
  lib/
    supabase.js                       Supabase client
    auth.jsx                          AuthProvider, useAuth, RequireAuth
  routes/
    Home.jsx                          public landing page — header with Log in / Sign up in top-right, filler marketing copy in body
    Login.jsx
    Signup.jsx
    NotFound.jsx
  signup/
    SignupChoice.jsx                  "I'm a parent" vs "I'm a tutor"
    ParentSignupForm.jsx
    TutorSignupForm.jsx
    *.module.css
  catalog/
    CatalogPage.jsx                   /catalog — list + filters (status='published' only)
    SectionDetail.jsx                 /sections/:id (shows tutor bio, seats-left from student_ids.length)
    SectionCard.jsx
    *.module.css
  dashboard/
    ParentDashboard.jsx               /dashboard — list of children + their sessions
    ChildList.jsx                     cards for each child under the parent
    StudentProfileForm.jsx            add / edit a child (name, grade, school, dob)
    MySessionsList.jsx                sessions for one child (sections WHERE student_id = ANY(student_ids))
    EnrollPickChildDialog.jsx         picker when parent has multiple children
    DropSessionDialog.jsx
    *.module.css
  tutor/
    TutorDashboard.jsx                /tutor — my sections + post new
    SectionForm.jsx                   create / edit a section
    SectionRoster.jsx                 see who's enrolled
    *.module.css
  forms/
    StudentEvaluationForm.jsx
    TutorEvaluationForm.jsx
    TutorAssessmentForm.jsx
    ParentAssessmentForm.jsx
    SurveyForm.jsx                    config-driven, used by all surveys
    schemas.js                        zod schemas for every form
    surveyConfigs.js                  question definitions per survey type
    *.module.css
  components/
    FormField.jsx
    RatingScale.jsx
    SubmitButton.jsx
    FileUpload.jsx                     PDF upload to Supabase Storage (resumes bucket; used by tutor signup)
    Layout.jsx
    Nav.jsx
    *.module.css
  admin/
    AdminDashboard.jsx
    SignupsTable.jsx
    SectionsModerationTable.jsx
    ClassesAdmin.jsx
    RosterView.jsx
    SubmissionsTable.jsx
    *.module.css
```

## Files to Modify

- `src/App.jsx` — replace starter with router + layout
- `src/main.jsx` — wrap with `AuthProvider` + `BrowserRouter`
- `src/index.css` — base styles, CSS variables for theme
- `package.json` — new dependencies
- `index.html` — title, meta description
- `.gitignore` — add `.env.local`

## Risks & Mitigations

| Risk | Mitigation |
|---|---|
| Scope creep across 5 forms | Ship each form thin first (core fields only), iterate. `responses jsonb` keeps the schema stable while questions evolve. |
| Capacity race on the last seat | All writes to `sections.student_ids` go through the `enroll_student` RPC, which locks the section row and re-checks capacity in one transaction. |
| Dangling student ids after deletion | DB trigger blocks `DELETE FROM students` if the id still appears in any section's `student_ids`. UI guides the parent to drop first. |
| Forgotten admin approval gate | Catalog query filters on `status = 'published'` (not just != 'draft'); RLS enforces it server-side too. |
| Form question content TBD | Draft sensible defaults now; use config files for surveys so questions can change without code edits. |
| File uploads (tutor resume) | PDF upload to a private Supabase Storage `resumes` bucket; validate `application/pdf` + size client-side and via bucket config; admin views via short-lived signed URL. |
| Email notifications | None in MVP. Supabase Edge Function + Resend/SendGrid as a follow-up. |

## Success Criteria

- A new parent can sign up at `/signup`, add one or more children to their account, and reach their dashboard
- A logged-in parent can browse `/catalog`, pick which child to enroll, and see the section appear in that child's "My sessions" (concurrent clicks on the last seat never oversell)
- A logged-in parent can drop a child from a session; the seat is instantly free for someone else
- A new tutor can sign up, get approved by admin (`tutors.status = 'active'`), log into `/tutor`, and post a new section. The section appears in the public catalog only after admin approves it (`sections.status = 'published'`).
- A tutor can see the roster of every section they teach, with each child's parent's contact info
- All 5 form types validate, submit, persist to DB, and show a success screen
- Admin can log in, approve/reject pending tutor signups, moderate tutor-posted sections, and view all form submissions
- `npm run lint` and `npm run build` pass; site is mobile-responsive and deployed to gcloud
