import { useEffect, useState } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../lib/auth'
import FormField from '../components/FormField'
import SubmitButton from '../components/SubmitButton'
import shared from '../components/shared.module.css'

/** Where to send a user after login, based on their resolved role. */
function homeForRole(role) {
  if (role === 'admin') return '/admin'
  if (role === 'tutor') return '/tutor'
  if (role === 'parent') return '/dashboard'
  return '/'
}

/**
 * Is `path` reachable by `role`? Role-specific areas are guarded by RequireAuth,
 * so honoring a `from` that points into another role's area would just bounce the
 * user to "/". Shared/public paths (catalog, forms, home) are open to any role.
 */
function pathAllowsRole(path, role) {
  if (path === '/admin' || path.startsWith('/admin/')) return role === 'admin'
  if (path === '/tutor' || path.startsWith('/tutor/')) return role === 'tutor'
  if (path === '/dashboard' || path.startsWith('/dashboard/')) return role === 'parent'
  return true
}

/** Post-login destination: the intended `from` if the role can reach it, else home. */
function destForRole(from, role) {
  return from && pathAllowsRole(from, role) ? from : homeForRole(role)
}

export default function Login() {
  const { user, role, loading, refreshProfile } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const from = location.state?.from?.pathname

  // Once a session resolves to a role, leave the login page.
  useEffect(() => {
    if (!loading && user && role) {
      navigate(destForRole(from, role), { replace: true })
    }
  }, [loading, user, role, from, navigate])

  // Already logged in with a known role: bounce immediately.
  if (!loading && user && role) {
    return <Navigate to={destForRole(from, role)} replace />
  }

  async function onSubmit(e) {
    e.preventDefault()
    setError('')
    if (!supabase) {
      setError('Backend not configured.')
      return
    }
    setSubmitting(true)
    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      })
      if (signInError) {
        setError(signInError.message)
        return
      }
      // Resolve the role now and route immediately if we got it. If the role
      // hasn't resolved yet (auth state can lag a beat), stay put — the effect
      // above redirects as soon as `role` lands, so we never bounce to "/".
      const { role: resolved } = await refreshProfile()
      if (resolved) {
        navigate(destForRole(from, resolved), { replace: true })
      }
    } catch (err) {
      setError(err.message || 'Login failed.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className={`${shared.page} ${shared.narrow}`}>
      <h1>Log in</h1>
      <p className={shared.lead}>Welcome back. Log in to your account.</p>

      <form onSubmit={onSubmit} noValidate>
        <FormField label="Email" htmlFor="email" required>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </FormField>

        <FormField label="Password" htmlFor="password" required>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </FormField>

        {error && <p className={shared.error} role="alert">{error}</p>}

        <SubmitButton loading={submitting}>Log in</SubmitButton>
      </form>

      <p className={shared.muted} style={{ marginTop: 24 }}>
        No account yet? <Link to="/signup">Sign up</Link>
      </p>
    </div>
  )
}
