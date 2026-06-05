import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../lib/auth'
import FormField from '../components/FormField'
import SubmitButton from '../components/SubmitButton'
import shared from '../components/shared.module.css'

/**
 * Parent signup: create a Supabase auth user, ensure we have a session, then
 * insert the matching `parents` row keyed to auth.users.id. Redirects to the
 * dashboard, which prompts to add a first child.
 */
export default function ParentSignupForm() {
  const navigate = useNavigate()
  const { refreshProfile } = useAuth()
  const [form, setForm] = useState({
    full_name: '',
    email: '',
    password: '',
    phone: '',
  })
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  function update(key) {
    return (e) => setForm((f) => ({ ...f, [key]: e.target.value }))
  }

  async function onSubmit(e) {
    e.preventDefault()
    setError('')
    if (!supabase) {
      setError('Backend not configured.')
      return
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }
    setSubmitting(true)
    try {
      const email = form.email.trim()
      const { data: signUpData, error: signUpError } =
        await supabase.auth.signUp({ email, password: form.password })
      if (signUpError) {
        setError(signUpError.message)
        return
      }

      // If email confirmation is required, signUp returns no session. Try to
      // sign in directly so the parent can proceed (works when confirmation is
      // off; otherwise surfaces a clear message).
      let userId = signUpData?.user?.id
      if (!signUpData?.session) {
        const { data: signInData, error: signInError } =
          await supabase.auth.signInWithPassword({ email, password: form.password })
        if (signInError) {
          setError(
            'Account created. Please confirm your email, then log in to continue.',
          )
          return
        }
        userId = signInData?.user?.id ?? userId
      }

      if (!userId) {
        setError('Could not establish a session. Try logging in.')
        return
      }

      const { error: insertError } = await supabase.from('parents').insert({
        id: userId,
        email,
        full_name: form.full_name.trim(),
        phone: form.phone.trim() || null,
      })
      // Ignore duplicate-row errors (e.g. retry); surface anything else.
      if (insertError && insertError.code !== '23505') {
        setError(insertError.message)
        return
      }

      await refreshProfile()
      navigate('/dashboard', { replace: true })
    } catch (err) {
      setError(err.message || 'Signup failed.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div>
      <h1>Parent sign up</h1>
      <p className={shared.lead}>Create your account to enroll your children.</p>

      <form onSubmit={onSubmit} noValidate>
        <FormField label="Full name" htmlFor="full_name" required>
          <input
            id="full_name"
            name="full_name"
            type="text"
            autoComplete="name"
            value={form.full_name}
            onChange={update('full_name')}
            required
          />
        </FormField>

        <FormField label="Email" htmlFor="email" required>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            value={form.email}
            onChange={update('email')}
            required
          />
        </FormField>

        <FormField label="Password" htmlFor="password" hint="At least 6 characters." required>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            value={form.password}
            onChange={update('password')}
            required
          />
        </FormField>

        <FormField label="Phone" htmlFor="phone">
          <input
            id="phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            value={form.phone}
            onChange={update('phone')}
          />
        </FormField>

        {error && <p className={shared.error} role="alert">{error}</p>}

        <SubmitButton loading={submitting}>Create account</SubmitButton>
      </form>

      <p className={shared.muted} style={{ marginTop: 24 }}>
        Already have an account? <Link to="/login">Log in</Link>
      </p>
    </div>
  )
}
