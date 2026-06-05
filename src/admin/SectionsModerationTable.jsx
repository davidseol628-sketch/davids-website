import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import shared from '../components/shared.module.css'

/**
 * Admin moderation of tutor-posted sections. Approve sets status 'published'
 * (appears in catalog); reject sets 'cancelled'. Also lists published sections
 * with a cancel action. Admin RLS on sections allows these status updates.
 */
export default function SectionsModerationTable() {
  const [sections, setSections] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [busyId, setBusyId] = useState(null)

  const load = useCallback(async () => {
    if (!supabase) return
    setLoading(true)
    setError('')
    const { data, error: err } = await supabase
      .from('sections')
      .select('*')
      .in('status', ['pending_approval', 'published'])
      .order('created_at', { ascending: false })
    if (err) setError(err.message)
    else setSections(data || [])
    setLoading(false)
  }, [])

  useEffect(() => {
    queueMicrotask(load)
  }, [load])

  async function setStatus(id, status) {
    setBusyId(id)
    setError('')
    const { error: err } = await supabase
      .from('sections')
      .update({ status })
      .eq('id', id)
    if (err) setError(err.message)
    await load()
    setBusyId(null)
  }

  const pending = sections.filter((s) => s.status === 'pending_approval')
  const published = sections.filter((s) => s.status === 'published')

  if (loading) {
    return (
      <div className={shared.page}>
        <p className={shared.muted}>Loading…</p>
      </div>
    )
  }

  return (
    <div className={shared.page}>
      <h1>Section moderation</h1>
      {error && <p className={shared.error} role="alert">{error}</p>}

      <h2 className={shared.cardTitle} style={{ marginTop: 16 }}>
        Pending approval ({pending.length})
      </h2>
      {pending.length === 0 ? (
        <div className={shared.empty}>No sections awaiting approval.</div>
      ) : (
        <div className={shared.tableWrap}>
          <table className={shared.table}>
            <thead>
              <tr>
                <th>Title</th>
                <th>Subject</th>
                <th>Capacity</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {pending.map((s) => (
                <tr key={s.id}>
                  <td>{s.title}</td>
                  <td>{s.subject || '—'}</td>
                  <td>{s.capacity}</td>
                  <td>
                    <div className={shared.row}>
                      <button
                        type="button"
                        className={`${shared.btn} ${shared.btnSmall}`}
                        disabled={busyId === s.id}
                        onClick={() => setStatus(s.id, 'published')}
                      >
                        Approve
                      </button>
                      <button
                        type="button"
                        className={`${shared.btn} ${shared.btnDanger} ${shared.btnSmall}`}
                        disabled={busyId === s.id}
                        onClick={() => setStatus(s.id, 'cancelled')}
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

      <h2 className={shared.cardTitle} style={{ marginTop: 32 }}>
        Published ({published.length})
      </h2>
      {published.length === 0 ? (
        <div className={shared.empty}>No published sections.</div>
      ) : (
        <div className={shared.tableWrap}>
          <table className={shared.table}>
            <thead>
              <tr>
                <th>Title</th>
                <th>Subject</th>
                <th>Enrolled</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {published.map((s) => (
                <tr key={s.id}>
                  <td>{s.title}</td>
                  <td>{s.subject || '—'}</td>
                  <td>{(s.student_ids || []).length} / {s.capacity}</td>
                  <td>
                    <button
                      type="button"
                      className={`${shared.btn} ${shared.btnDanger} ${shared.btnSmall}`}
                      disabled={busyId === s.id}
                      onClick={() => setStatus(s.id, 'cancelled')}
                    >
                      Cancel
                    </button>
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
