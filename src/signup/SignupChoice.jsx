import { Link } from 'react-router-dom'
import shared from '../components/shared.module.css'

/** Chooser: "I'm a parent" vs "I'm a tutor". */
export default function SignupChoice() {
  return (
    <div>
      <h1>Create an account</h1>
      <p className={shared.lead}>Who are you signing up as?</p>

      <div className={shared.grid}>
        <Link to="parent" className={shared.card} style={{ textDecoration: 'none' }}>
          <h2 className={shared.cardTitle}>I'm a parent</h2>
          <p className={shared.muted}>
            Enroll your children in classes and manage their sessions.
          </p>
        </Link>

        <Link to="tutor" className={shared.card} style={{ textDecoration: 'none' }}>
          <h2 className={shared.cardTitle}>I'm a tutor</h2>
          <p className={shared.muted}>
            Post sessions and teach. Accounts require admin approval.
          </p>
        </Link>
      </div>

      <p className={shared.muted} style={{ marginTop: 24 }}>
        Already have an account? <Link to="/login">Log in</Link>
      </p>
    </div>
  )
}
