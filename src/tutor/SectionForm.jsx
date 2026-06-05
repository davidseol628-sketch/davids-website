import { useState } from 'react'
import { supabase } from '../lib/supabase'
import FormField from '../components/FormField'
import SubmitButton from '../components/SubmitButton'
import shared from '../components/shared.module.css'

/**
 * Create a new section. Inserted with status 'pending_approval', tutor_id =
 * self, and an empty student_ids array (required by the insert RLS policy).
 * The section is invisible in the public catalog until an admin publishes it.
 */
export default function SectionForm({ tutorId, onCreated }) {
  const [form, setForm] = useState({
    title: '',
    subject: '',
    description: '',
    grade_range: '',
    capacity: '10',
    location: '',
  })
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  function update(key) {
    return (e) => setForm((f) => ({ ...f, [key]: e.target.value }))
  }

  async function onSubmit(e) {
    e.preventDefault()
    setError('')
    if (!form.title.trim()) {
      setError('A title is required.')
      return
    }
    const capacity = parseInt(form.capacity, 10)
    if (Number.isNaN(capacity) || capacity < 0) {
      setError('Capacity must be a non-negative number.')
      return
    }
    setSubmitting(true)
    try {
      const { error: insErr } = await supabase.from('sections').insert({
        tutor_id: tutorId,
        title: form.title.trim(),
        subject: form.subject.trim() || null,
        description: form.description.trim() || null,
        grade_range: form.grade_range.trim() || null,
        capacity,
        location: form.location.trim() || null,
        status: 'pending_approval',
        student_ids: [],
      })
      if (insErr) throw insErr
      await onCreated?.()
    } catch (err) {
      setError(err.message || 'Could not post the session.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className={shared.card}>
      <h2 className={shared.cardTitle}>Post a new session</h2>
      <form onSubmit={onSubmit} noValidate>
        <FormField label="Title" htmlFor="sec_title" required>
          <input id="sec_title" type="text" value={form.title} onChange={update('title')} required />
        </FormField>
        <div className={shared.row}>
          <div style={{ flex: 1, minWidth: 160 }}>
            <FormField label="Subject" htmlFor="sec_subject">
              <input id="sec_subject" type="text" value={form.subject} onChange={update('subject')} />
            </FormField>
          </div>
          <div style={{ flex: 1, minWidth: 160 }}>
            <FormField label="Grade range" htmlFor="sec_grade">
              <input id="sec_grade" type="text" value={form.grade_range} onChange={update('grade_range')} />
            </FormField>
          </div>
        </div>
        <FormField label="Description" htmlFor="sec_desc">
          <textarea id="sec_desc" className={shared.textarea} value={form.description} onChange={update('description')} />
        </FormField>
        <div className={shared.row}>
          <div style={{ flex: 1, minWidth: 120 }}>
            <FormField label="Capacity" htmlFor="sec_cap" required>
              <input id="sec_cap" type="number" min="0" value={form.capacity} onChange={update('capacity')} required />
            </FormField>
          </div>
          <div style={{ flex: 1, minWidth: 160 }}>
            <FormField label="Location" htmlFor="sec_loc">
              <input id="sec_loc" type="text" value={form.location} onChange={update('location')} />
            </FormField>
          </div>
        </div>
        {error && <p className={shared.error} role="alert">{error}</p>}
        <SubmitButton loading={submitting}>Submit for approval</SubmitButton>
      </form>
    </section>
  )
}
