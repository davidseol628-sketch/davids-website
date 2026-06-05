import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../lib/auth'
import FormField from '../components/FormField'
import SubmitButton from '../components/SubmitButton'
import shared from '../components/shared.module.css'

/**
 * Tutor signup: create the auth user, ensure a session, insert a `tutors` row
 * with status 'pending_approval'. A tutor can log in but cannot post sections
 * until an admin approves them (status -> 'active').
 */
export default function TutorSignupForm() {
  const navigate = useNavigate()
  const { refreshProfile } = useAuth()
  const [form, setForm] = useState({
    full_name: '',
    email: '',
    password: '',
    qualifications: '',
    subjects: '',
    bio: '',
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

      const subjects = form.subjects
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean)

      const { error: insertError } = await supabase.from('tutors').insert({
        id: userId,
        email,
        full_name: form.full_name.trim(),
        qualifications: form.qualifications.trim() || null,
        bio: form.bio.trim() || null,
        subjects,
        status: 'pending_approval',
      })
      if (insertError && insertError.code !== '23505') {
        setError(insertError.message)
        return
      }

      await refreshProfile()
      navigate('/tutor', { replace: true })
    } catch (err) {
      setError(err.message || 'Signup failed.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div>
      <h1>Tutor sign up</h1>
      <p className={shared.lead}>
        Create your tutor account. An admin will review it before you can post
        sessions.
      </p>

      <form onSubmit={onSubmit} noValidate>
        <FormField label="Full name" htmlFor="full_name" required>
          <input id="full_name" type="text" autoComplete="name" value={form.full_name} onChange={update('full_name')} required />
        </FormField>

        <FormField label="Email" htmlFor="email" required>
          <input id="email" type="email" autoComplete="email" value={form.email} onChange={update('email')} required />
        </FormField>

        <FormField label="Password" htmlFor="password" hint="At least 6 characters." required>
          <input id="password" type="password" autoComplete="new-password" value={form.password} onChange={update('password')} required />
        </FormField>

        <FormField label="Subjects" htmlFor="subjects" hint="Comma-separated, e.g. Math, Physics">
          <input id="subjects" type="text" value={form.subjects} onChange={update('subjects')} />
        </FormField>

        <FormField label="Qualifications" htmlFor="qualifications">
          <textarea id="qualifications" className={shared.textarea} value={form.qualifications} onChange={update('qualifications')} />
        </FormField>

        <FormField label="Short bio" htmlFor="bio">
          <textarea id="bio" className={shared.textarea} value={form.bio} onChange={update('bio')} />
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
