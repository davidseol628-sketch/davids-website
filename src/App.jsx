import { Routes, Route } from 'react-router-dom'

import Layout from './components/Layout'
import { RequireAuth } from './lib/auth'

// Public routes
import Home from './routes/Home'
import Login from './routes/Login'
import Signup from './routes/Signup'
import NotFound from './routes/NotFound'

// Signup flow
import SignupChoice from './signup/SignupChoice'
import ParentSignupForm from './signup/ParentSignupForm'
import TutorSignupForm from './signup/TutorSignupForm'

// Catalog
import CatalogPage from './catalog/CatalogPage'
import SectionDetail from './catalog/SectionDetail'

// Tutors
import Tutors from './routes/Tutors'
import Classes from './routes/Classes'
import Microscopy from './routes/Microscopy'
import Cad from './routes/Cad'
import Scratch from './routes/Scratch'
import DigitalElectronics from './routes/DigitalElectronics'
import Epidemiology from './routes/Epidemiology'

// Dashboards
import ParentDashboard from './dashboard/ParentDashboard'
import TutorDashboard from './tutor/TutorDashboard'

// Forms
import StudentEvaluationForm from './forms/StudentEvaluationForm'
import TutorEvaluationForm from './forms/TutorEvaluationForm'
import TutorAssessmentForm from './forms/TutorAssessmentForm'
import ParentAssessmentForm from './forms/ParentAssessmentForm'
import SurveyForm from './forms/SurveyForm'

// Admin
import AdminDashboard from './admin/AdminDashboard'
import SignupsTable from './admin/SignupsTable'
import SectionsModerationTable from './admin/SectionsModerationTable'
import ClassesAdmin from './admin/ClassesAdmin'
import RosterView from './admin/RosterView'
import SubmissionsTable from './admin/SubmissionsTable'

/**
 * App is the single owner of the route table. Every route component named in
 * plan.md is wired up here. Components not yet built are thin placeholder stubs
 * so the app builds end-to-end during Phase A.
 */
export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        {/* Public */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />

        {/* Signup flow. Signup renders an <Outlet/> for the nested routes. */}
        <Route path="/signup" element={<Signup />}>
          <Route index element={<SignupChoice />} />
          <Route path="parent" element={<ParentSignupForm />} />
          <Route path="tutor" element={<TutorSignupForm />} />
        </Route>

        {/* Catalog (public) */}
        <Route path="/catalog" element={<CatalogPage />} />
        <Route path="/classes" element={<Classes />} />
        <Route path="/classes/microscopy" element={<Microscopy />} />
        <Route path="/classes/cad" element={<Cad />} />
        <Route path="/classes/scratch" element={<Scratch />} />
        <Route path="/classes/digital-electronics" element={<DigitalElectronics />} />
        <Route path="/classes/epidemiology" element={<Epidemiology />} />
        <Route path="/tutors" element={<Tutors />} />
        <Route path="/sections/:id" element={<SectionDetail />} />

        {/* Parent area */}
        <Route
          path="/dashboard"
          element={
            <RequireAuth as="parent">
              <ParentDashboard />
            </RequireAuth>
          }
        />

        {/* Tutor area */}
        <Route
          path="/tutor"
          element={
            <RequireAuth as="tutor">
              <TutorDashboard />
            </RequireAuth>
          }
        />

        {/* Forms */}
        <Route
          path="/forms/student-evaluation"
          element={<StudentEvaluationForm />}
        />
        <Route
          path="/forms/tutor-evaluation"
          element={<TutorEvaluationForm />}
        />
        <Route
          path="/forms/tutor-assessment"
          element={<TutorAssessmentForm />}
        />
        <Route
          path="/forms/parent-assessment"
          element={<ParentAssessmentForm />}
        />
        <Route path="/forms/survey/:type" element={<SurveyForm />} />

        {/* Admin area */}
        <Route
          path="/admin"
          element={
            <RequireAuth as="admin">
              <AdminDashboard />
            </RequireAuth>
          }
        />
        <Route
          path="/admin/signups"
          element={
            <RequireAuth as="admin">
              <SignupsTable />
            </RequireAuth>
          }
        />
        <Route
          path="/admin/sections"
          element={
            <RequireAuth as="admin">
              <SectionsModerationTable />
            </RequireAuth>
          }
        />
        <Route
          path="/admin/classes"
          element={
            <RequireAuth as="admin">
              <ClassesAdmin />
            </RequireAuth>
          }
        />
        <Route
          path="/admin/rosters/:sectionId"
          element={
            <RequireAuth as="admin">
              <RosterView />
            </RequireAuth>
          }
        />
        <Route
          path="/admin/submissions"
          element={
            <RequireAuth as="admin">
              <SubmissionsTable />
            </RequireAuth>
          }
        />

        {/* Catch-all */}
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}
