# What We're Building — In Plain English

A website for an enrichment center where parents, tutors, and the admin can do everything online.

---

## What people see first — the landing page

When anyone visits the site (no login needed), they land on a public homepage:

- **Top-right corner**: a **Log in** link and a **Sign up** button.
- **Top-left**: the learning center name / logo.
- **Body**: filler marketing copy — a hero headline, an "about us" paragraph, a "what we offer" section, an "our approach" section, and a contact line. Every paragraph is marked with `[Filler]` so David can find and replace them with the real text easily.
- **Footer**: simple copyright line.

The visitor can click Sign up to make an account, Log in to come back, or just scroll the page to read about the center.

---

## The 3 kinds of people on the site

1. **Parents** — sign up once, add their kids as student profiles inside their account, and enroll those kids in classes.
2. **Tutors** — sign up to teach, post the classes they want to offer (admin reviews each one), see who's in their classes, fill out forms about students.
3. **Admin** (the center owner / staff) — approve new tutors, approve new sessions, review feedback, manage everything.

> **Only parents, tutors, and admins have logins.** Students are NOT accounts — they're cards inside a parent's account. One parent account can hold multiple children.

---

## What each person can do

### 🧑 Parent (after signing up)

- **Sign up once** with email + password.
- **Add a student profile for each child** under the account. A parent can have as many children as they want on the same account.
- **Browse the catalog** of classes (e.g., "Algebra I, Tuesdays 4pm, Ms. Lee, 3 seats left").
- **Click "Enroll"** → pick which child is being enrolled → done.
- **Click "Drop"** to take a child out of a class. Anytime — no cutoff.
- **See "My sessions"** for each child.
- **Fill out the parent assessment form and satisfaction surveys.**

### 👨‍🏫 Tutor (after signing up + getting approved by admin)

- **Sign up** as a tutor with their qualifications.
- **Post a session** — "I want to teach Algebra I, Tues/Thurs 4pm, max 8 students."
- **Wait for admin approval** on each posted session — once approved, it appears in the public catalog.
- **See their roster** — which kids signed up, with the parent's contact info.
- **Fill out forms** — self-assessment, evaluations of students.

### 👨‍💼 Admin

- **Approves new tutors** when they sign up.
- **Approves new sessions** that tutors post (every section needs review before going live).
- **Reviews all the forms and surveys** that come in.
- **Sees everything** — who's in what class, who applied, who left feedback.

---

## How enrollment works under the hood (plain words)

Every class section keeps a list of "kids currently in this class." Enrolling adds a kid to that list (only if there's room). Dropping removes them — the seat is instantly free for someone else. **No waitlist.** **No drop cutoff.**

The one thing the app handles carefully: if two parents both click "Enroll" on the last seat at the same moment, only one of them wins — the app re-checks the seat count at the exact moment it writes, so the section never goes over capacity.

---

## The 5 forms

The paperwork the center collects from different people:

1. **Student Evaluation** — tutor writes about how a student is doing.
2. **Tutor Evaluation** — admin grades how a tutor is doing.
3. **Tutor Self-Assessment** — tutor reflects on their own teaching.
4. **Parent Assessment** — parent rates the tutor + the center.
5. **Surveys** — Parent Satisfaction, Student Satisfaction (and we can add more easily by editing a config file).

Claude will draft sensible default questions for each — David edits the wording once they're on screen.

---

## The big picture in one paragraph

A parent visits the site, makes one account, and adds a student profile for each of their kids. They browse a list of classes the tutors have posted, click "Enroll", pick which kid is going, and they're in. If a kid drops out, they hit "Drop" and the seat opens up immediately. Tutors use the same site to post the sessions they want to teach (admin reviews each one before it goes live) and see who signed up. Admin keeps the whole thing tidy by approving new tutors, approving new sessions, and reading the feedback forms.

---

## What we're using to build it

- **The visible website** — React (a JavaScript tool for building interactive websites).
- **The behind-the-scenes part** (where accounts live and data is saved) — Supabase (a ready-made backend service, like a database + login system in one).
- **Look & feel** — plain CSS so we can style it however David wants without depending on a big design library.

---

## Roughly how long

- **Foundation + accounts**: 1–2 days
- **Catalog + enroll/drop + tutor posting sessions**: 2–3 days
- **All 5 forms**: 1.5–2 days
- **Admin dashboard**: 1 day
- **Polish + put it online**: 0.5 day

Total: **about 1–2 weeks** for a real, working MVP.

---

## Decisions locked in

| Topic | Decision |
|---|---|
| Who has a login | Parents, tutors, admins. Students are NOT accounts — they're records owned by a parent. |
| Waitlist when full | None. Catalog shows "full" and disables the Enroll button. |
| Drop policy | Drop anytime. No cutoff. |
| Payment | Free / handled offline for the MVP. No Stripe yet. |
| Tutor-posted sessions | Need admin approval before they appear in the catalog. |
| Form questions | Claude drafts defaults; David edits later. |
| Multiple kids in different sections | Allowed. |
| Same kid enrolled twice in same section | Blocked. |
| Deleting a child while they're still enrolled | Blocked with a message — drop them from sessions first. |

---

## Defaults applied (Claude picked these; flag if wrong)

- **Tutor resume**: just a URL/link for MVP, not a file upload. (Supabase file uploads is a follow-up.)
- **Email notifications**: none in MVP. Admin uses the dashboard to see what's pending.
- **Hosting**: gcloud (matches what's already in the plan).
