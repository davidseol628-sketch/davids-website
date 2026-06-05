import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import shared from '../components/shared.module.css'

/** Admin: approve (status 'active') or reject (status 'inactive') tutor signups. */
export default function SignupsTable() {
  const [tutors, setTutors] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [busyId, setBusyId] = useState(null)

  const load = useCallback(async () => {
    if (!supabase) return
    setLoading(true)
    setError('')
    const { data, error: err } = await supabase
      .from('tutors')
      .select('*')
      .order('created_at', { ascending: false })
    if (err) setError(err.message)
    else setTutors(data || [])
    setLoading(false)
  }, [])

  useEffect(() => {
    queueMicrotask(load)
  }, [load])

  async function setStatus(id, status) {
    setBusyId(id)
    setError('')
    const { error: err } = await supabase.from('tutors').update({ status }).eq('id', id)
    if (err) setError(err.message)
    await load()
    setBusyId(null)
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
      <h1>Tutor signups</h1>
      {error && <p className={shared.error} role="alert">{error}</p>}

      {tutors.length === 0 ? (
        <div className={shared.empty}>No tutor accounts yet.</div>
      ) : (
        <div className={shared.tableWrap}>
          <table className={shared.table}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Subjects</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {tutors.map((t) => (
                <tr key={t.id}>
                  <td>{t.full_name || '—'}</td>
                  <td>{t.email}</td>
                  <td>{(t.subjects || []).join(', ') || '—'}</td>
                  <td><span className={shared.badge}>{t.status}</span></td>
                  <td>
                    <div className={shared.row}>
                      <button
                        type="button"
                        className={`${shared.btn} ${shared.btnSmall}`}
                        disabled={busyId === t.id || t.status === 'active'}
                        onClick={() => setStatus(t.id, 'active')}
                      >
                        Approve
                      </button>
                      <button
                        type="button"
                        className={`${shared.btn} ${shared.btnDanger} ${shared.btnSmall}`}
                        disabled={busyId === t.id || t.status === 'inactive'}
                        onClick={() => setStatus(t.id, 'inactive')}
                      >
                        Reject
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
