import { useEffect, useRef, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { useAuth } from '../lib/auth'
import styles from './Nav.module.css'

/**
 * Top navigation bar. Brand on the left, role-aware page links + a Forms
 * dropdown in the middle, auth actions on the right. The links change with the
 * signed-in role:
 *   - guest : Catalog
 *   - parent: Catalog, My Dashboard
 *   - tutor : Catalog, My Sessions
 *   - admin : Catalog, Admin, Sections, Signups, Submissions
 */

// Primary page links per role. Each entry is [to, label, end?]; `end` forces
// exact-match active styling (used for index-style routes like /admin).
const LINKS_BY_ROLE = {
  guest: [['/catalog', 'Catalog']],
  parent: [
    ['/catalog', 'Catalog'],
    ['/dashboard', 'My Dashboard'],
  ],
  tutor: [
    ['/catalog', 'Catalog'],
    ['/tutor', 'My Sessions'],
  ],
  admin: [
    ['/catalog', 'Catalog'],
    ['/admin', 'Admin', true],
    ['/admin/sections', 'Sections'],
    ['/admin/signups', 'Signups'],
    ['/admin/submissions', 'Submissions'],
  ],
}

// Forms relevant to each role, shown in the Forms dropdown. Guests see no
// Forms menu (forms require a signed-in user).
const FORMS_BY_ROLE = {
  parent: [
    ['/forms/parent-assessment', 'Parent Assessment'],
    ['/forms/survey/parent_satisfaction', 'Parent Satisfaction Survey'],
    ['/forms/survey/student_satisfaction', 'Student Satisfaction Survey'],
  ],
  tutor: [
    ['/forms/tutor-assessment', 'Tutor Self-Assessment'],
    ['/forms/student-evaluation', 'Student Evaluation'],
  ],
  admin: [
    ['/forms/student-evaluation', 'Student Evaluation'],
    ['/forms/tutor-evaluation', 'Tutor Evaluation'],
    ['/forms/tutor-assessment', 'Tutor Self-Assessment'],
    ['/forms/parent-assessment', 'Parent Assessment'],
    ['/forms/survey/parent_satisfaction', 'Parent Satisfaction Survey'],
    ['/forms/survey/student_satisfaction', 'Student Satisfaction Survey'],
  ],
}

function FormsMenu({ forms }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  // Close on click outside or Escape.
  useEffect(() => {
    if (!open) return
    const onDown = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('mousedown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  return (
    <div className={styles.dropdown} ref={ref}>
      <button
        type="button"
        className={styles.link}
        aria-haspopup="true"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
      >
        Forms ▾
      </button>
      {open && (
        <div className={styles.menu} role="menu">
          {forms.map(([to, label]) => (
            <NavLink
              key={to}
              to={to}
              role="menuitem"
              className={({ isActive }) =>
                isActive ? `${styles.menuItem} ${styles.active}` : styles.menuItem
              }
              onClick={() => setOpen(false)}
            >
              {label}
            </NavLink>
          ))}
        </div>
      )}
    </div>
  )
}

export default function Nav() {
  const { user, role, signOut } = useAuth()

  const effectiveRole = user ? role || 'guest' : 'guest'
  const links = LINKS_BY_ROLE[effectiveRole]
  const forms = FORMS_BY_ROLE[effectiveRole]

  const linkClass = ({ isActive }) =>
    isActive ? `${styles.link} ${styles.active}` : styles.link

  return (
    <nav className={styles.nav}>
      <Link to="/" className={styles.brand}>
        Enrichment Center
      </Link>

      <div className={styles.links}>
        {links.map(([to, label, end]) => (
          <NavLink key={to} to={to} end={end} className={linkClass}>
            {label}
          </NavLink>
        ))}

        {forms && <FormsMenu forms={forms} />}

        {user ? (
          <button type="button" className={styles.signout} onClick={signOut}>
            Sign out
          </button>
        ) : (
          <>
            <NavLink to="/login" className={linkClass}>
              Log in
            </NavLink>
            <Link to="/signup" className={styles.signup}>
              Sign up
            </Link>
          </>
        )}
      </div>
    </nav>
  )
}
