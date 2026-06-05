export const meta = {
  name: 'implement-plan',
  description: 'Implement plan.md — Enrichment Center forms & enrollment app (Supabase + React 19) with verifiable checkpoints, Vitest tests, and Playwright/Supabase E2E.',
  whenToUse: 'Build the app described in plan.md, phase by phase, gated by self-healing checkpoints and tests. DB on a Supabase branch by default.',
  phases: [
    { title: 'A: Foundation' },
    { title: 'CP-A: build+unit+smoke' },
    { title: 'B: Schema & Auth' },
    { title: 'CP-B: DB behavior tests' },
    { title: 'C/D/E/F: Features+tests' },
    { title: 'CP-features: lint+build+unit' },
    { title: 'CP-E2E: Playwright flows' },
    { title: 'CP-security: adversarial' },
  ],
}

// ----- knobs (decided at launch time via args) -----
// args = { dbTarget?: 'branch'|'prod', stopAfter?: 'A'|'B'|null, maxFix?: number }
const dbTarget = (args && args.dbTarget) || 'prod'      // prod = writes directly to the live Supabase project (NOT reversible)
const stopAfter = (args && args.stopAfter) || null       // null = run everything
const MAX_FIX = (args && args.maxFix) || 2               // checkpoint repair rounds

const PLAN = 'Read plan.md in the repo root and follow it exactly. Match the file layout in its "Files to Create" section.'

const FILE_REPORT = {
  type: 'object', required: ['summary', 'files'],
  properties: {
    summary: { type: 'string' },
    files: { type: 'array', items: { type: 'string' } },
    tests: { type: 'array', items: { type: 'string' }, description: 'test files written' },
    notes: { type: 'string' },
  },
}
const VERDICT = {
  type: 'object', required: ['pass', 'evidence', 'findings'],
  properties: {
    pass: { type: 'boolean' },
    evidence: { type: 'string', description: 'command output / observations proving the verdict' },
    findings: { type: 'array', items: { type: 'string' } },
  },
}

// A VERIFIABLE CHECKPOINT: run the check; if it fails, spawn a fixer with
// the findings and re-check, up to MAX_FIX rounds. Returns the final
// verdict (with .rounds). This is the deterministic gate the user asked for.
async function checkpoint(name, checkPrompt, fixPromptFor) {
  let v = await agent(checkPrompt, { label: name, phase: name, schema: VERDICT })
  let rounds = 0
  while (v && !v.pass && rounds < MAX_FIX) {
    rounds++
    log(`[${name}] FAILED (round ${rounds}/${MAX_FIX}): ${(v.findings || []).join('; ')}`)
    await agent(fixPromptFor(v), { label: `${name}:fix${rounds}`, phase: name, schema: FILE_REPORT })
    v = await agent(checkPrompt, { label: `${name}:recheck${rounds}`, phase: name, schema: VERDICT })
  }
  if (!v || !v.pass) log(`[${name}] STILL FAILING after ${rounds} fix rounds — surfacing as a blocker.`)
  else log(`[${name}] PASSED${rounds ? ` after ${rounds} fix round(s)` : ''}.`)
  return { ...(v || { pass: false }), rounds }
}

// =====================================================================
// Phase A — Foundation. ONE agent owns shared files (package.json,
// main.jsx, App.jsx) and declares the FULL router up front so later
// feature agents only fill route-component stubs and never collide.
// Also wires the test stack so checkpoints have something to run.
// =====================================================================
phase('A: Foundation')
const foundation = await agent(`${PLAN}

Implement Phase A (Foundation) ONLY:
- Install runtime deps: react-router-dom, react-hook-form, zod, @hookform/resolvers, @supabase/supabase-js.
- Install TEST deps: vitest, @testing-library/react, @testing-library/jest-dom, @testing-library/user-event, jsdom. Add a "test": "vitest run" script to package.json and configure vitest (jsdom env, setup file with jest-dom) in vite.config.js. Add a src/test/setup.js.
- Replace starter App.jsx with a react-router-dom router + Layout shell (header/nav/footer).
- IMPORTANT: declare the COMPLETE route table now, importing EVERY route component named in plan.md's "Files to Create" (Home, Login, Signup, SignupChoice, ParentSignupForm, TutorSignupForm, CatalogPage, SectionDetail, ParentDashboard, TutorDashboard, the 5 forms, the admin pages, NotFound). Create thin placeholder stubs for any that don't exist yet so the app builds. App.jsx is the SINGLE owner of routing — no other agent edits it.
- Wrap main.jsx with AuthProvider + BrowserRouter.
- Primitives with .module.css: FormField, RatingScale, SubmitButton, Layout, Nav.
- Home.jsx landing page: log in / sign up top-right, centered logo top-left, [Filler] marketing sections, footer.
- index.css base + theme vars. Update index.html title/meta. Add .env.local to .gitignore.
- Write at least one passing unit test (e.g. RatingScale renders 1-5 and reports selection).
Return the file report (include test files in "tests").`, { phase: 'A: Foundation', schema: FILE_REPORT })

const cpA = await checkpoint('CP-A: build+unit+smoke',
  `Verify Phase A. Run in repo root: "npm run lint", "npm run build", "npm run test". Then start the dev server with "npm run dev" in the BACKGROUND, load mcp__playwright__ tools via ToolSearch, navigate to the local dev URL, and confirm the landing page renders with a visible "Log in" and "Sign up" control (take a snapshot). Put the actual command output + what you saw in evidence. pass=true only if lint+build+tests exit 0 AND the landing page renders.`,
  v => `${PLAN}\nPhase A checkpoint failed: ${v.findings.join('; ')}\nEvidence: ${v.evidence}\nFix these so lint, build, vitest, and the landing-page render all pass. Return the file report.`)

if (stopAfter === 'A') return { stoppedAfter: 'A', foundation, cpA }

// =====================================================================
// Phase B — Supabase schema & auth via Supabase MCP. Branch by default.
// =====================================================================
phase('B: Schema & Auth')
const dbInstruction = dbTarget === 'branch'
  ? 'FIRST create a Supabase dev branch via the Supabase MCP (create_branch) and apply ALL schema THERE — do NOT touch production. Report the branch name/ref in notes.'
  : 'Apply schema directly to the production Supabase project via the Supabase MCP. This is NOT reversible — be careful.'

const schema = await agent(`${PLAN}

Implement Phase B (Supabase schema & auth) with the Supabase MCP tools (ToolSearch: list_tables, apply_migration, execute_sql, get_advisors, create_branch).
${dbInstruction}

Create EXACTLY the tables, RPCs, RLS policies, and trigger from Phase B of plan.md:
- Tables: parents, students, tutors, admins, sections, + the 5 form tables.
- RPCs enroll_student / drop_student: row-lock + capacity recheck in a transaction; documented error codes (full, already_enrolled, not_published, not_authorized).
- RLS on EVERY table per the plan; sections.student_ids NOT client-writable (only the RPCs touch it).
- Trigger blocking DELETE of a student still present in any sections.student_ids.
- Storage: create a PRIVATE 'resumes' bucket (application/pdf only, ~5 MB cap) with Storage RLS so a tutor can read/write only objects under their own {tutor_id}/ prefix and admins can read all; no public read.

Then write client code:
- src/lib/supabase.js (createClient from VITE_SUPABASE_URL + VITE_SUPABASE_PUBLISHABLE_KEY; NEVER reference the secret key client-side).
- src/lib/auth.jsx (AuthProvider, useAuth resolving auth.users.id to parent/tutor/admin, RequireAuth as="role").
Return the file report; in notes give the branch ref and the exact migration SQL.`, { phase: 'B: Schema & Auth', schema: FILE_REPORT })

// Checkpoint B = DB BEHAVIOR TESTS via Supabase MCP (not just advisors).
const cpB = await checkpoint('CP-B: DB behavior tests',
  `Verify Phase B against ${dbTarget === 'branch' ? 'the dev branch from the previous step (ref in its notes: ' + (schema && schema.notes ? schema.notes.slice(0, 200) : 'see notes') + ')' : 'the production project'}, using Supabase MCP get_advisors + execute_sql.
1) Run security + performance advisors — zero ERROR-severity security findings required. WARN-level advisories that are project-plan/config recommendations rather than schema defects (e.g. auth_leaked_password_protection) are ACCEPTABLE — list them in evidence but do NOT fail on them.
2) Behavioral tests via execute_sql against a throwaway tutor/section/students set: (a) enroll up to capacity succeeds; (b) one more enroll returns 'full'; (c) enrolling the same student twice returns 'already_enrolled'; (d) drop_student frees a seat and a new enroll then succeeds; (e) DELETE of an enrolled student is blocked by the trigger; (f) confirm direct UPDATE of sections.student_ids by a non-RPC path is rejected by RLS.
Put the SQL results in evidence. Clean up test rows. pass=true only if every check behaves exactly as plan.md specifies.`,
  v => `Fix the Supabase schema/RPCs/RLS/trigger via the Supabase MCP so these fail: ${v.findings.join('; ')}\nEvidence: ${v.evidence}\nRe-apply the migration to the same ${dbTarget}. Return the file report.`)

if (stopAfter === 'B') return { stoppedAfter: 'B', foundation, cpA, schema, cpB }

// =====================================================================
// Phases C/D/E/F — features WITH their own Vitest tests. Each owns a
// distinct directory and only fills Phase A's route stubs, so they run
// concurrently (worktree-isolated) without colliding on App.jsx.
// pipeline: build dir+tests -> self-review.
// =====================================================================
phase('C/D/E/F: Features+tests')
const FEATURES = [
  { key: 'C-signup', dir: 'src/signup/ src/components/FileUpload.jsx', desc: 'Phase C: parent & tutor signup + login. Insert parents/tutors keyed to auth.users.id; tutor status=pending_approval; prompt new parents to add a child. Tutor signup uploads a resume PDF (application/pdf, ~5 MB) to the private resumes Storage bucket at resumes/{tutor_id}/ and stores the path in resume_url — build a reusable src/components/FileUpload.jsx for this and validate type+size client-side.' },
  { key: 'D-catalog', dir: 'src/catalog/ src/dashboard/ src/tutor/', desc: 'Phase D: public catalog (published only), section detail, parent dashboard (children CRUD + my-sessions + enroll/drop via RPCs with error toasts), tutor dashboard (post sections pending_approval, roster), admin section moderation.' },
  { key: 'E-forms', dir: 'src/forms/', desc: 'Phase E: the 5 forms — StudentEvaluationForm, TutorEvaluationForm, TutorAssessmentForm, ParentAssessmentForm, config-driven SurveyForm. zod schemas in schemas.js, survey configs in surveyConfigs.js. zod -> react-hook-form -> Supabase insert -> success screen.' },
  { key: 'F-admin', dir: 'src/admin/', desc: 'Phase F: admin dashboard (counts), signups moderation, sections moderation, classes admin, roster view, submissions table + detail. Gate with RequireAuth as="admin".' },
]

const featureResults = await pipeline(
  FEATURES,
  f => agent(`${PLAN}

Implement ${f.desc}
Create files ONLY under ${f.dir} (plus matching *.module.css). Do NOT edit App.jsx/main.jsx or anything outside your directory — Phase A declared your routes; import primitives from src/components/ and clients from src/lib/.
ALSO write Vitest + @testing-library tests next to your components covering the happy path and validation/error states (e.g. zod rejects bad input; enroll shows the 'full'/'already_enrolled' toast on RPC error using a mocked supabase client). Return the file report with tests listed.`,
    { label: f.key, phase: 'C/D/E/F: Features+tests', schema: FILE_REPORT, isolation: 'worktree' }),
  (built, f) => agent(`Review ${f.key} files (${built && built.files ? built.files.join(', ') : f.dir}). Verify imports resolve, zod schemas match form fields, Supabase table/RPC names match plan.md, RequireAuth gating is correct, and the tests actually assert behavior. List concrete problems. pass=true only if you'd ship it.`,
    { label: 'review:' + f.key, phase: 'C/D/E/F: Features+tests', schema: VERDICT }),
)

// =====================================================================
// Final checkpoints — the hard gates.
// =====================================================================
const cpFeatures = await checkpoint('CP-features: lint+build+unit',
  `Run "npm run lint", "npm run build", "npm run test" in repo root. Fix any failures (imports, leftover stubs, broken tests) and re-run. Put final output in evidence. pass=true only when all three exit 0.`,
  v => `Make lint, build, and vitest all pass. Failures: ${v.findings.join('; ')}\n${v.evidence}\nReturn the file report.`)

const cpE2E = await checkpoint('CP-E2E: Playwright flows',
  `End-to-end test the plan.md success criteria with Playwright (ToolSearch mcp__playwright__) against a backgrounded "npm run dev", using the Supabase MCP (against ${dbTarget === 'branch' ? 'the dev branch' : 'prod'}) to seed/inspect/clean data. Drive these flows in a real browser and assert each: (1) parent signs up -> adds a child -> reaches dashboard; (2) parent enrolls the child in a published section from the catalog -> it appears in that child's My Sessions; (3) parent drops the child -> seat frees; (4) tutor posts a section (pending) -> admin approves -> it appears in the public catalog; (5) one form submits and persists a row. Take a screenshot per flow. Clean up seeded data. Put per-flow results in evidence. pass=true only if all 5 flows pass.`,
  v => `Fix the app so these E2E flows pass: ${v.findings.join('; ')}\n${v.evidence}\nReturn the file report.`)

const cpSecurity = await checkpoint('CP-security: adversarial',
  `Adversarially security-review src/. Look for: Supabase secret key leaking into VITE-bundled client code, missing auth checks before mutations, trusting client-supplied role/ids, writes to sections.student_ids outside the RPCs, XSS via dangerouslySetInnerHTML. Cross-check plan.md's RLS model. pass=true only if none found; put specifics in evidence.`,
  v => `Fix these security issues: ${v.findings.join('; ')}\n${v.evidence}\nReturn the file report.`)

return {
  dbTarget,
  foundation, cpA,
  schema, cpB,
  features: featureResults,
  cpFeatures, cpE2E, cpSecurity,
  done: [cpA, cpB, cpFeatures, cpE2E, cpSecurity].every(c => c && c.pass),
  blockers: [cpA, cpB, cpFeatures, cpE2E, cpSecurity].filter(c => !(c && c.pass)).map(c => c && c.findings),
}
