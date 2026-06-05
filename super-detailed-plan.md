# Super-Detailed Architecture — Enrichment Center App

> A complete conceptual walkthrough of what was built, how the pieces fit together, and the design decisions made along the way. This is the "understand the whole system" document — it describes architecture and data flow, not specific code. Written 2026-06-05.
>
> Companion docs: **`simple.md`** (plain-English overview), **`plan.md`** (original implementation plan + dated progress log).

---

## 1. What this system is, in one paragraph

It's a web application for an enrichment / tutoring center. Three kinds of people use it — **parents**, **tutors**, and an **admin** — each with their own login and their own area of the app. Parents add their children as profiles and enroll them in classes. Tutors post the classes they want to teach (admin must approve each one before it goes public) and see who's enrolled. The admin approves tutors and classes, and reads the feedback forms. Students themselves are **not** accounts — they're records owned by a parent. The whole thing is a single-page React app talking directly to a Supabase backend (Postgres + Auth), with all the security enforced inside the database rather than in the browser.

---

## 2. The technology stack and why each piece is there

| Layer | Technology | Why |
|---|---|---|
| UI framework | **React 19** (via **Vite**) | Fast dev/build tooling; component model fits a multi-role dashboard app. |
| Routing | **react-router-dom v7** | Client-side routing for the single-page app; one central route table. |
| Backend | **Supabase** (Postgres + Auth) | A hosted database + authentication + row-level security in one. No custom server to run. |
| DB access | **@supabase/supabase-js** | The browser talks directly to Postgres through this client, using a public key. |
| Styling | **Plain CSS Modules** | No Tailwind, no component library — scoped per-component styles, full control over look. |
| Testing | **Vitest + Testing Library + jsdom** | Component and logic tests that run without a browser or live backend. |
| Hosting | **GitHub Pages + GitHub Actions** | Free static hosting; every push auto-builds and deploys. |

**Notable:** `react-hook-form`, `zod`, and `@hookform/resolvers` are listed as dependencies (and were in the original plan), but **the code does not actually use them**. Forms are built with plain React state and hand-written validation instead. This is a divergence from the plan worth knowing — those packages can either be removed or adopted later.

---

## 3. The shape of the whole system

```
┌─────────────────────────────────────────────────────────┐
│  Browser (the React SPA, served as static files)         │
│                                                          │
│   React Router ── Layout(Nav/Footer) ── feature pages    │
│        │                                                 │
│   AuthProvider (React context: who am I + what role)     │
│        │                                                 │
│   @supabase/supabase-js  ── uses the PUBLIC anon key ──┐ │
└────────────────────────────────────────────────────────┼─┘
                                                         │
              HTTPS (every request carries the user's JWT)
                                                         │
┌────────────────────────────────────────────────────────┼─┐
│  Supabase (Postgres)                                    ▼ │
│                                                          │
│   Auth (auth.users)  ──  email/password, issues JWTs     │
│                                                          │
│   Tables: parents, tutors, admins, students, sections,   │
│           + 5 form tables                                │
│                                                          │
│   RLS policies on EVERY table  ── the real security      │
│                                                          │
│   RPCs: enroll_student / drop_student (capacity-safe)    │
│         + section_roster (tutor sees parent contact)     │
│         + private.is_admin() helper                      │
└──────────────────────────────────────────────────────────┘
```

The single most important architectural idea: **the browser is untrusted, and security lives in the database.** The frontend only ever holds a *public* key. What any given user is allowed to see or change is decided by Postgres Row-Level Security (RLS) policies that run on every query, keyed off the user's identity (`auth.uid()`) carried in their JWT. The frontend cannot bypass this no matter what it does.

---

## 4. The data model

### Who has a login
Three "principal" tables, each keyed by the **same id as the Supabase Auth user** (`auth.users.id`). A person is exactly one of these:

- **`parents`** — id (= auth id), email, full_name, phone.
- **`tutors`** — id (= auth id), email, full_name, bio, qualifications, subjects, plus a **`status`** of `pending_approval` / `active` / `inactive`. A `resume_url` points at an uploaded PDF.
- **`admins`** — id (= auth id), email, full_name. Added manually; never self-signup.

### Who does NOT have a login
- **`students`** — a plain record with a fresh UUID (not an auth id) and a `parent_id` pointing at the owning parent. One parent can own many students. This is the key modeling decision: **children are data, not accounts.**

### The classes
- **`sections`** — a class offering: title, subject, description, grade range, `tutor_id`, schedule, `capacity`, `location`, a **`status`** of `pending_approval` / `published` / `cancelled`, and crucially a **`student_ids`** array — the UUIDs of the currently enrolled students.

### The paperwork
Five form tables, all sharing the same shape — `submitted_by` (the auth user), a `responses` JSON blob (all the answers), `created_at`, plus a couple of subject columns:
- `student_evaluations`, `tutor_evaluations`, `tutor_assessments`, `parent_assessments`, and `surveys` (which has a `survey_type` so one table holds many survey kinds).

### Storage
- A **private `resumes` bucket** for tutor resume PDFs, with its own access policies (a tutor can only touch files under their own folder; admins can read all).

---

## 5. The enrollment model — and the one genuinely hard problem

### One-sided enrollment
There is **no join/enrollments table** and **no waitlist**. Each `sections` row simply carries an array of the student UUIDs currently in it. Enrolling = append a UUID to that array. Dropping = remove it. Dropping instantly frees the seat. "Which classes is this child in?" is answered by asking which sections have that child's UUID in their array. This keeps the model dead simple.

### The hard part: the last-seat race
If two parents both click "Enroll" on the final seat at the same instant, a naive "read count, then write" would let both in and oversell the class. The solution is that **all writes to `student_ids` go through a database function (RPC), never through a direct table write.** The `enroll_student` function:

1. Verifies the caller actually owns that student (or is an admin).
2. **Locks the section row** for the duration of the transaction (`FOR UPDATE`).
3. Re-checks, under that lock: the section exists, is `published`, the child isn't already in, and there's still room (`enrolled < capacity`).
4. Only then appends and commits.

Because the row is locked, the second click waits for the first to finish, then re-checks capacity and correctly sees the section is full. Overselling is impossible. The function signals problems by raising specific errors (`not_authorized`, `not_found`, `not_published`, `already_enrolled`, `full`), which the frontend maps to friendly messages. `drop_student` works the same way (lock, verify ownership, remove).

**The frontend literally cannot write to `student_ids` directly** — table-level grants and RLS forbid it. The RPC is the only door.

---

## 6. The security model (this is the backbone — worth understanding fully)

Every table has RLS turned on, and policies define exactly who can read/write which rows. The recurring pattern is "**this row is yours, OR you're an admin**":

- **`sections`**: anyone (even logged-out) can *read* `published` sections (that's the public catalog). A tutor can read/write their *own* sections, but only while `pending_approval`, and **cannot** set `student_ids` or self-publish. Admins can do anything. Publishing is an admin-only state change.
- **`students`**: a parent can fully manage students where `parent_id` is them. A **tutor** can *read* a student only if that student appears in one of the tutor's own sections (so the tutor can render a roster). Admins see all.
- **`parents`**: a parent can read/update only their own row. Critically, **tutors cannot read the `parents` table at all** — this is why the roster needed a special function (see §9).
- **`tutors`**: the public can read `active` tutors (so their name/bio shows on a class page); a tutor can update their own row; admins everything.
- **Form tables**: any logged-in user can *insert* (submit a form); only admins can *read* them back.

### The admin check and the "private schema" hardening
"Are you an admin?" is asked constantly inside policies. That's a function, `is_admin()`, which checks whether your id is in the `admins` table. 

Originally this and the enroll/drop functions lived in the public schema and were `SECURITY DEFINER` (they run with elevated privilege). Supabase's security linter flags publicly-callable elevated functions as a risk. The remediation — done **without changing any behavior** — was:

- Move the privileged logic (`is_admin`, and the real `enroll_student`/`drop_student` workers) into a **non-public `private` schema** that the API layer doesn't expose.
- In the public schema, keep only **thin wrapper functions** that simply call the private workers and run as the *caller* (`SECURITY INVOKER`, which the linter doesn't flag).
- Repoint every RLS policy to `private.is_admin()`.
- Revoke broader-than-needed write grants that anonymous users technically held (RLS already blocked them, but this removes the surface entirely).

Net effect: the public API contract is identical (the frontend still calls `enroll_student` the same way), the elevated logic is hidden where it can't be invoked directly, and the security advisor goes to zero DB-fixable findings. One remaining item — enabling leaked-password protection — is an Auth dashboard toggle, not a database change.

---

## 7. Identity and roles — how the app knows who you are

Supabase Auth handles email/password and issues a JWT. But the app needs more than "you're logged in" — it needs to know **which role** you are, because a parent, tutor, and admin see completely different apps.

### Role resolution
There is no "role" column on the auth user. Instead, the app **resolves your role by looking you up.** Given your auth id, it checks the `admins` table, then `tutors`, then `parents` (most-privileged first) and returns the first match. You belong to exactly one. This is simpler than maintaining a separate roles system and it can't drift out of sync — your role *is* which table owns you.

### The AuthProvider
A single React context (`AuthProvider`) wraps the whole app and holds: your session, your `user`, your resolved `role`, your `profile` (the matching table row), and a `loading` flag. On startup it hydrates any saved session and subscribes to auth changes (sign-in/out) so the role stays current. Components read all this through a `useAuth()` hook. Sign-out clears it.

### Route gating
A `RequireAuth` wrapper guards protected pages. While the session is still resolving it renders nothing (no flicker). If you're not logged in, it sends you to `/login` and **remembers where you were headed**. If a role is required and yours doesn't match, it sends you home. Authentication (who you are) is Supabase's job; authorization (what you can reach) is enforced both here in the UI *and* — the real guarantee — by RLS in the database.

### The login-redirect bug that was fixed this session
After a successful login the app sometimes failed to send you to your dashboard — it would sit on the login page or bounce you to the home page. Two root causes, both fixed:

1. **Stale session reads.** The login code resolved your role by re-reading the "current session," which could momentarily return a *leftover/overlapping* session and resolve the wrong role (or none). Fix: resolve the role **directly from the user object the login call returns**, ignoring ambient session state.
2. **Race clobbering.** Two role-resolutions could run at once (one from the login, one from the auth-change listener); if a slower, stale one finished last it could overwrite the correct role with `null`. Fix: the provider now **ignores any resolution whose user no longer matches the current session**, so a late stale result can't clobber the live one.

Plus a smaller correctness fix: the post-login redirect now only honors a "return to where you were headed" destination if your role can actually reach it (a parent bounced off an admin-only page lands on their own dashboard, not a dead end).

---

## 8. The frontend architecture

### One central route table
`App.jsx` defines every route in one place, all nested under a single `Layout` (which provides the header/nav and footer). Routes group by area:
- **Public:** home, login, signup flow, catalog, section detail.
- **Parent:** dashboard (role-gated).
- **Tutor:** tutor dashboard (role-gated).
- **Admin:** dashboard, signups, sections moderation, classes, rosters, submissions (all role-gated).
- **Forms:** reachable by any logged-in user.

### Role-aware navigation
The `Nav` reads your role and shows different links accordingly — a guest sees just "Catalog"; a parent sees their dashboard; an admin sees the moderation tools — plus a role-specific "Forms" dropdown. The UI never offers a parent an admin link, but even if it did, RLS would refuse the data.

### State philosophy
There is **no global state library** (no Redux/Zustand). The only cross-cutting state is auth, via context. Every page manages its own local state — the list it's showing, loading/error flags, dialog open/closed. Components fetch what they need on mount and guard against updating after unmount. This keeps each feature self-contained and easy to reason about, at the cost of some repeated fetching logic.

### Graceful no-backend mode
The Supabase client is built only if both env vars are present; otherwise it's `null`. This lets the app build and the test suite run with no live backend — pages degrade to a "backend not configured" state and tests mock the client. Every consumer null-checks first.

---

## 9. The feature flows, end to end

### Signup
`/signup` offers a parent-vs-tutor choice. Each form creates the auth user (`signUp`), and because a session is needed immediately, signs in right after. It then inserts the matching role-table row (`parents`, or `tutors` with `status = pending_approval`), refreshes the auth context so the role is known, and routes to the right dashboard. A tutor can log in immediately but sees a "pending approval" state and can't get classes published until an admin approves them.

> There is also an **`auth-signup` edge function** in the repo built for the case where email confirmation is enabled (it creates an already-confirmed user server-side with the secret key, which never leaves the server). The current client forms use the direct `signUp` + `signInWithPassword` path; the edge function stands ready as the alternative if email confirmation gets turned on.

### Catalog → enroll → drop
- The **catalog** queries `published` sections and shows seats remaining (capacity minus the length of `student_ids`).
- On a **section detail** page, a logged-in parent picks which child to enroll; the app calls the `enroll_student` RPC. A logged-out visitor is routed to signup and brought back afterward.
- In the **parent dashboard**, each child shows "my sessions" (the sections containing that child's id). Dropping pops a confirmation, then calls `drop_student`.
- RPC errors are translated to plain language ("That section is full.", "This child is already enrolled.", etc.) by a small mapping helper.

### Tutor area
The tutor dashboard lists the tutor's own sections (any status) and, if approved, lets them post a new one via a section form (which always creates it as `pending_approval` with an empty roster — RLS enforces both). For each section, a **roster** shows the enrolled students with their parents' contact info.

> **Why the roster needed a special function:** tutors are forbidden by RLS from reading the `parents` table, so the parent name/email/phone columns came back blank. The fix is the **`section_roster` RPC** — a `SECURITY DEFINER` function that *can* read parents, but only returns rows for a section the **calling tutor actually owns** (`section.tutor_id = auth.uid()`). It exposes nothing beyond the tutor's own rosters. The roster component prefers this RPC and falls back to the blank-contact direct query if the function isn't present. **(Heads-up: this function's migration may not yet be applied to the live database — see §12.)**

### Forms
All five forms share one engine: a `QuestionnaireForm` component driven by a **config** that lists each question's key, label, type (rating 1–5 / short text / long text), and whether it's required. Surveys go a step further — a single `SurveyForm` reads a `surveyConfigs` entry by URL parameter, so adding a new survey is a config edit, not new code. Every submission writes `{ submitted_by, responses, ...subject columns }` to its table; RLS guarantees the submitter is the logged-in user. Reading submissions back is admin-only.

### Admin
A dashboard with pending counts links to: **signups** (approve/reject tutors by flipping `status`), **sections moderation** (publish or cancel pending classes; cancel published ones), **classes** (admin can create a section directly, published immediately), **rosters** (view any section's enrolled students with full contact info — admins *can* read parents), and **submissions** (browse every form table's entries).

---

## 10. Deployment architecture

The app is a pile of static files (HTML/JS/CSS) — there's no server to run — so it's hosted on **GitHub Pages**, with **GitHub Actions** as the build-and-publish pipeline.

### The pipeline (runs on every push to `main`)
1. Install dependencies.
2. **Run the test suite** — *a failing test blocks the deploy.*
3. Build the production bundle, injecting the Supabase URL + public key from **GitHub repository secrets** (the secret service key is deliberately never provided to the build).
4. Copy the built `index.html` to `404.html` (see SPA note below).
5. Publish to GitHub Pages via a trusted token exchange (OIDC) — no stored deploy credentials.

### Two sub-path details that mattered
Because the site lives at `username.github.io/davids-website/` (a sub-path, not a root domain):
- The build is told its **base path** is `/davids-website/` so asset URLs resolve; the dev server still runs at root.
- The router is told the same **base name** so routes work under the sub-path.

### The single-page-app fallback
GitHub Pages serves static files and knows nothing about client-side routes like `/dashboard`. If someone deep-links or refreshes on such a URL, Pages would 404. The trick: provide a `404.html` that's a copy of the app's `index.html`. Pages serves it for any unknown path, the app boots, and the router takes over and renders the right page. (You'll see a harmless 404 in the network log on a deep link — that's this mechanism working, not a bug.)

### Secrets discipline
The browser bundle only ever contains the **public** Supabase key — safe to ship, because RLS is what actually protects data. The **secret** service key exists only in the local `.env` (git-ignored) and is never put into GitHub or the build. This separation is load-bearing for the whole security model.

---

## 11. The design decisions, collected

1. **Security lives in the database, not the browser.** The frontend is untrusted and holds only a public key. RLS on every table is the real guarantee.
2. **Children are data, not accounts.** Only parents/tutors/admins log in; students are records a parent owns. Simplifies auth and matches reality (kids don't log in).
3. **Role = which table owns you.** No separate roles system to keep in sync; resolved by lookup, admin-first.
4. **One-sided enrollment, no waitlist.** A section just holds an array of enrolled student ids. Enroll/drop are array append/remove.
5. **All seat writes go through a locking RPC.** The only way to oversell is blocked at the database level via row locks + re-check in a transaction.
6. **Privileged logic hidden in a `private` schema** behind thin public wrappers — satisfies the security linter without changing behavior.
7. **Config-driven forms.** One questionnaire engine + config objects; new surveys are config, not code.
8. **No global state manager.** Auth via context; everything else is local component state. Deliberately lightweight.
9. **Graceful degradation with no backend.** Builds and tests run against a `null` client.
10. **Tests gate deployment.** CI won't publish a broken build.
11. **Admin approval gates publishing.** Tutors draft; only an admin flips a section to `published` (enforced in RLS, not just UI).

---

## 12. Known gaps and follow-ups

- **`section_roster` migration may not be applied to the live database.** Deploying the frontend does *not* run migrations. Until this function exists on the Supabase project, the tutor roster's Parent/Contact columns stay blank in production. (Verification was pending at time of writing.)
- **Supabase Auth redirect URLs** should include the live Pages URL, or password-reset / email-confirmation / OAuth redirects will point to the wrong place.
- **`react-hook-form` / `zod` are installed but unused.** Either adopt them (the plan intended to) or drop them to slim the bundle.
- **Email confirmation path.** The `auth-signup` edge function exists for the confirmation-enabled flow but isn't wired into the current client forms, which assume confirmation is off.
- **Leaked-password protection** is an Auth dashboard toggle that the DB migrations can't set — left for manual enablement.
- **CI actions run on Node 20**, which GitHub is deprecating (mid-2026); bump the action versions eventually.
- **No email notifications, no payments** — both intentionally out of scope for the MVP.

---

*This document describes the system as it stands after the 2026-06-05 deployment and auth-fix work. For the chronological record of what changed when, see the Progress Log in `plan.md`.*
