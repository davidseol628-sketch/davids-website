import { useState } from 'react'
import { Link, Navigate, useLocation } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../lib/auth'
import FormField from '../components/FormField'
import RatingScale from '../components/RatingScale'
import SubmitButton from '../components/SubmitButton'
import shared from '../components/shared.module.css'

/**
 * Reusable questionnaire engine used by all five form types.
 *
 * Props:
 *  - title, intro
 *  - questions: [{ name, label, type: 'rating'|'text'|'textarea', required }]
 *  - table: target Supabase table
 *  - extraColumns: object of additional columns to write (e.g. survey_type)
 *
 * All form tables share { submitted_by, responses jsonb, created_at }. RLS
 * requires submitted_by = auth.uid(), so the user must be logged in.
 */
export default function QuestionnaireForm({
  title,
  intro,
  questions,
  table,
  extraColumns = {},
}) {
  const { user, loading } = useAuth()
  const location = useLocation()
  const [values, setValues] = useState({})
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [formError, setFormError] = useState('')

  if (loading) return null

  // Forms require a logged-in submitter (RLS: submitted_by = auth.uid()).
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  function setValue(name, v) {
    setValues((prev) => ({ ...prev, [name]: v }))
    setErrors((prev) => ({ ...prev, [name]: undefined }))
  }

  function validate() {
    const next = {}
    for (const q of questions) {
      if (q.required) {
        const v = values[q.name]
        if (v === undefined || v === null || v === '') {
          next[q.name] = 'This question is required.'
        }
      }
    }
    setErrors(next)
    return Object.keys(next).length === 0
  }

  async function onSubmit(e) {
    e.preventDefault()
    setFormError('')
    if (!validate()) return
    setSubmitting(true)
    try {
      const { error } = await supabase.from(table).insert({
        submitted_by: user.id,
        responses: values,
        ...extraColumns,
      })
      if (error) throw error
      setSubmitted(true)
    } catch (err) {
      setFormError(err.message || 'Submission failed.')
    } finally {
      setSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <div className={`${shared.page} ${shared.narrow}`}>
        <h1>Thank you!</h1>
        <p className={shared.lead}>Your response has been recorded.</p>
        <Link to="/" className={shared.btn}>Back home</Link>
      </div>
    )
  }

  return (
    <div className={`${shared.page} ${shared.narrow}`}>
      <h1>{title}</h1>
      {intro && <p className={shared.lead}>{intro}</p>}

      <form onSubmit={onSubmit} noValidate>
        {questions.map((q) => (
          <FormField
            key={q.name}
            label={q.label}
            htmlFor={q.name}
            required={q.required}
            error={errors[q.name]}
          >
            {q.type === 'rating' ? (
              <RatingScale
                name={q.name}
                value={values[q.name]}
                onChange={(n) => setValue(q.name, n)}
                lowLabel="Low"
                highLabel="High"
              />
            ) : q.type === 'textarea' ? (
              <textarea
                id={q.name}
                className={shared.textarea}
                value={values[q.name] || ''}
                onChange={(e) => setValue(q.name, e.target.value)}
              />
            ) : (
              <input
                id={q.name}
                type="text"
                value={values[q.name] || ''}
                onChange={(e) => setValue(q.name, e.target.value)}
              />
            )}
          </FormField>
        ))}

        {formError && <p className={shared.error} role="alert">{formError}</p>}

        <SubmitButton loading={submitting}>Submit</SubmitButton>
      </form>
    </div>
  )
}
