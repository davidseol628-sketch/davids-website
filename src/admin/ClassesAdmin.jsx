import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import FormField from '../components/FormField'
import SubmitButton from '../components/SubmitButton'
import shared from '../components/shared.module.css'

/**
 * Admin can create sections directly (published, assigned to a tutor) and view
 * all sections regardless of status. Admin RLS permits inserting any status.
 */
export default function ClassesAdmin() {
  const [sections, setSections] = useState([])
  const [tutors, setTutors] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [form, setForm] = useState({
    title: '',
    subject: '',
    capacity: '10',
    tutor_id: '',
  })

  const load = useCallback(async () => {
    if (!supabase) return
    setLoading(true)
    setError('')
    const [secRes, tutRes] = await Promise.all([
      supabase.from('sections').select('*').order('created_at', { ascending: false }),
      supabase.from('tutors').select('id, full_name, status'),
    ])
    if (secRes.error) setError(secRes.error.message)
    setSections(secRes.data || [])
    setTutors(tutRes.data || [])
    setLoading(false)
  }, [])

  useEffect(() => {
    queueMicrotask(load)
  }, [load])

  function update(key) {
    return (e) => setForm((f) => ({ ...f, [key]: e.target.value }))
  }

  async function onSubmit(e) {
    e.preventDefault()
    setError('')
    if (!form.title.trim() || !form.tutor_id) {
      setError('Title and tutor are required.')
      return
    }
    setSubmitting(true)
    try {
      const { error: err } = await supabase.from('sections').insert({
        title: form.title.trim(),
        subject: form.subject.trim() || null,
        capacity: parseInt(form.capacity, 10) || 0,
        tutor_id: form.tutor_id,
        status: 'published',
        student_ids: [],
      })
      if (err) throw err
      setForm({ title: '', subject: '', capacity: '10', tutor_id: '' })
      await load()
    } catch (err) {
      setError(err.message || 'Could not create class.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className={shared.page}>
      <h1>Manage classes</h1>
      {error && <p className={shared.error} role="alert">{error}</p>}

      <section className={shared.card}>
        <h2 className={shared.cardTitle}>Create a class</h2>
        <form onSubmit={onSubmit} noValidate>
          <FormField label="Title" htmlFor="ca_title" required>
            <input id="ca_title" type="text" value={form.title} onChange={update('title')} required />
          </FormField>
          <div className={shared.row}>
            <div style={{ flex: 1, minWidth: 160 }}>
              <FormField label="Subject" htmlFor="ca_subject">
                <input id="ca_subject" type="text" value={form.subject} onChange={update('subject')} />
              </FormField>
            </div>
            <div style={{ flex: 1, minWidth: 120 }}>
              <FormField label="Capacity" htmlFor="ca_cap">
                <input id="ca_cap" type="number" min="0" value={form.capacity} onChange={update('capacity')} />
              </FormField>
            </div>
          </div>
          <FormField label="Tutor" htmlFor="ca_tutor" required>
            <select id="ca_tutor" className={shared.select} value={form.tutor_id} onChange={update('tutor_id')} required>
              <option value="">Select a tutor…</option>
              {tutors.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.full_name || t.id} ({t.status})
                </option>
              ))}
            </select>
          </FormField>
          <SubmitButton loading={submitting}>Create class</SubmitButton>
        </form>
      </section>

      <h2 className={shared.cardTitle} style={{ marginTop: 24 }}>All sections</h2>
      {loading ? (
        <p className={shared.muted}>Loading…</p>
      ) : sections.length === 0 ? (
        <div className={shared.empty}>No sections yet.</div>
      ) : (
        <div className={shared.tableWrap}>
          <table className={shared.table}>
            <thead>
              <tr>
                <th>Title</th>
                <th>Status</th>
                <th>Enrolled</th>
                <th>Roster</th>
              </tr>
            </thead>
            <tbody>
              {sections.map((s) => (
                <tr key={s.id}>
                  <td>{s.title}</td>
                  <td><span className={shared.badge}>{s.status}</span></td>
                  <td>{(s.student_ids || []).length} / {s.capacity}</td>
                  <td><Link to={`/admin/rosters/${s.id}`}>View</Link></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
