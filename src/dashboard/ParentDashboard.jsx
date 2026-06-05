import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../lib/auth'
import { rpcErrorMessage } from '../lib/rpcErrors'
import FormField from '../components/FormField'
import SubmitButton from '../components/SubmitButton'
import shared from '../components/shared.module.css'

/**
 * Parent dashboard:
 *  - lists the parent's children (prompting to add one on first visit)
 *  - shows each child's "My sessions" (sections where the child id is in
 *    student_ids), with a Drop button that calls the drop_student RPC
 *  - lets the parent add more children
 */
export default function ParentDashboard() {
  const { user } = useAuth()
  const [children, setChildren] = useState([])
  const [sections, setSections] = useState([]) // sections this parent's kids are in
  const [tutorsById, setTutorsById] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  // Pending drop awaiting confirmation: { sectionId, studentId, sectionTitle, childName }
  const [pendingDrop, setPendingDrop] = useState(null)
  const [dropping, setDropping] = useState(false)

  const load = useCallback(async () => {
    if (!supabase || !user) return
    setLoading(true)
    setError('')
    try {
      const { data: kids, error: kidsErr } = await supabase
        .from('students')
        .select('*')
        .eq('parent_id', user.id)
        .order('created_at', { ascending: true })
      if (kidsErr) throw kidsErr
      setChildren(kids || [])

      const ids = (kids || []).map((k) => k.id)
      if (ids.length === 0) {
        setSections([])
        setTutorsById({})
        return
      }

      // Sections where any of this parent's children appears in student_ids.
      const { data: secs, error: secErr } = await supabase
        .from('sections')
        .select('*')
        .overlaps('student_ids', ids)
      if (secErr) throw secErr
      setSections(secs || [])

      const tutorIds = [...new Set((secs || []).map((s) => s.tutor_id).filter(Boolean))]
      if (tutorIds.length > 0) {
        const { data: tutors } = await supabase
          .from('tutors')
          .select('id, full_name')
          .in('id', tutorIds)
        const map = {}
        for (const t of tutors || []) map[t.id] = t.full_name
        setTutorsById(map)
      } else {
        setTutorsById({})
      }
    } catch (err) {
      setError(err.message || 'Failed to load your dashboard.')
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => {
    queueMicrotask(load)
  }, [load])

  async function confirmDrop() {
    if (!pendingDrop) return
    setError('')
    setNotice('')
    setDropping(true)
    const { error: rpcErr } = await supabase.rpc('drop_student', {
      section_id: pendingDrop.sectionId,
      student_id: pendingDrop.studentId,
    })
    setDropping(false)
    if (rpcErr) {
      setError(rpcErrorMessage(rpcErr, 'Could not drop the session.'))
      setPendingDrop(null)
      return
    }
    setPendingDrop(null)
    setNotice('Dropped. The seat is now free.')
    await load()
  }

  function sessionsForChild(childId) {
    return sections.filter((s) => (s.student_ids || []).includes(childId))
  }

  if (loading) {
    return (
      <div className={shared.page}>
        <p className={shared.muted}>Loading…</p>
      </div>
    )
  }

  return (
    <div className={shared.page}>
      <div className={shared.spread}>
        <h1>My dashboard</h1>
        <Link to="/catalog" className={shared.btn}>Browse catalog</Link>
      </div>

      {error && <p className={shared.error} role="alert">{error}</p>}
      {notice && <p className={shared.success}>{notice}</p>}

      {children.length === 0 ? (
        <div className={shared.empty}>
          <p style={{ marginBottom: 12 }}>
            Add a child to your account to start enrolling in classes.
          </p>
        </div>
      ) : (
        children.map((child) => {
          const mySessions = sessionsForChild(child.id)
          return (
            <section key={child.id} className={shared.card}>
              <div className={shared.spread}>
                <div>
                  <h2 className={shared.cardTitle}>{child.full_name}</h2>
                  <p className={shared.muted}>
                    {[child.grade && `Grade ${child.grade}`, child.school]
                      .filter(Boolean)
                      .join(' · ') || 'No grade/school on file'}
                  </p>
                </div>
              </div>

              <h3 style={{ fontSize: 15, margin: '16px 0 8px', color: 'var(--text-h)' }}>
                My sessions
              </h3>
              {mySessions.length === 0 ? (
                <p className={shared.muted}>
                  Not enrolled in any sessions yet.{' '}
                  <Link to="/catalog">Find a class</Link>.
                </p>
              ) : (
                <div className={shared.tableWrap}>
                  <table className={shared.table}>
                    <thead>
                      <tr>
                        <th>Class</th>
                        <th>Subject</th>
                        <th>Tutor</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {mySessions.map((s) => (
                        <tr key={s.id}>
                          <td>{s.title}</td>
                          <td>{s.subject || '—'}</td>
                          <td>{tutorsById[s.tutor_id] || '—'}</td>
                          <td>
                            <button
                              type="button"
                              className={`${shared.btn} ${shared.btnDanger} ${shared.btnSmall}`}
                              onClick={() =>
                                setPendingDrop({
                                  sectionId: s.id,
                                  studentId: child.id,
                                  sectionTitle: s.title,
                                  childName: child.full_name,
                                })
                              }
                            >
                              Drop
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          )
        })
      )}

      <AddChildForm parentId={user?.id} onAdded={load} />

      {pendingDrop && (
        <div
          className={shared.overlay}
          role="dialog"
          aria-modal="true"
          aria-label="Confirm drop"
          onClick={() => !dropping && setPendingDrop(null)}
        >
          <div className={shared.modal} onClick={(e) => e.stopPropagation()}>
            <h2>Drop this session?</h2>
            <p className={shared.muted}>
              Remove <strong>{pendingDrop.childName}</strong> from{' '}
              <strong>{pendingDrop.sectionTitle}</strong>? The seat will be freed
              immediately for someone else.
            </p>
            <div className={shared.modalActions}>
              <button
                type="button"
                className={`${shared.btn} ${shared.btnSecondary}`}
                onClick={() => setPendingDrop(null)}
                disabled={dropping}
              >
                Cancel
              </button>
              <button
                type="button"
                className={`${shared.btn} ${shared.btnDanger}`}
                onClick={confirmDrop}
                disabled={dropping}
              >
                {dropping ? 'Dropping…' : 'Drop'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

/** Inline form to add a child profile to the parent's account. */
function AddChildForm({ parentId, onAdded }) {
  const [form, setForm] = useState({ full_name: '', grade: '', school: '' })
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  function update(key) {
    return (e) => setForm((f) => ({ ...f, [key]: e.target.value }))
  }

  async function onSubmit(e) {
    e.preventDefault()
    setError('')
    if (!form.full_name.trim()) {
      setError('A name is required.')
      return
    }
    setSubmitting(true)
    try {
      const { error: insErr } = await supabase.from('students').insert({
        parent_id: parentId,
        full_name: form.full_name.trim(),
        grade: form.grade.trim() || null,
        school: form.school.trim() || null,
      })
      if (insErr) throw insErr
      setForm({ full_name: '', grade: '', school: '' })
      await onAdded()
    } catch (err) {
      setError(err.message || 'Could not add child.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className={shared.card}>
      <h2 className={shared.cardTitle}>Add a child</h2>
      <form onSubmit={onSubmit} noValidate>
        <FormField label="Child's full name" htmlFor="child_name" required>
          <input id="child_name" type="text" value={form.full_name} onChange={update('full_name')} required />
        </FormField>
        <div className={shared.row}>
          <div style={{ flex: 1, minWidth: 160 }}>
            <FormField label="Grade" htmlFor="child_grade">
              <input id="child_grade" type="text" value={form.grade} onChange={update('grade')} />
            </FormField>
          </div>
          <div style={{ flex: 1, minWidth: 160 }}>
            <FormField label="School" htmlFor="child_school">
              <input id="child_school" type="text" value={form.school} onChange={update('school')} />
            </FormField>
          </div>
        </div>
        {error && <p className={shared.error} role="alert">{error}</p>}
        <SubmitButton loading={submitting}>Add child</SubmitButton>
      </form>
    </section>
  )
}
