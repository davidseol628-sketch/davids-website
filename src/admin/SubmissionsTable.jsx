import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import shared from '../components/shared.module.css'

const TABLES = [
  { key: 'surveys', label: 'Surveys' },
  { key: 'student_evaluations', label: 'Student evaluations' },
  { key: 'tutor_evaluations', label: 'Tutor evaluations' },
  { key: 'tutor_assessments', label: 'Tutor self-assessments' },
  { key: 'parent_assessments', label: 'Parent assessments' },
]

/** Admin: read every form submission (admin-only SELECT RLS) per table. */
export default function SubmissionsTable() {
  const [active, setActive] = useState('surveys')
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let alive = true
    async function run() {
      if (!supabase) return
      setLoading(true)
      setError('')
      const { data, error: err } = await supabase
        .from(active)
        .select('*')
        .order('created_at', { ascending: false })
      if (!alive) return
      if (err) setError(err.message)
      else setRows(data || [])
      setLoading(false)
    }
    run()
    return () => {
      alive = false
    }
  }, [active])

  return (
    <div className={shared.page}>
      <h1>Form submissions</h1>

      <div className={shared.row} style={{ marginBottom: 16 }}>
        {TABLES.map((t) => (
          <button
            key={t.key}
            type="button"
            className={`${shared.btn} ${shared.btnSmall} ${active === t.key ? '' : shared.btnSecondary}`}
            onClick={() => setActive(t.key)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {error && <p className={shared.error} role="alert">{error}</p>}

      {loading ? (
        <p className={shared.muted}>Loading…</p>
      ) : rows.length === 0 ? (
        <div className={shared.empty}>No submissions yet.</div>
      ) : (
        <div className={shared.tableWrap}>
          <table className={shared.table}>
            <thead>
              <tr>
                <th>Submitted</th>
                <th>Responses</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id}>
                  <td>{new Date(r.created_at).toLocaleString()}</td>
                  <td>
                    <pre style={{ margin: 0, whiteSpace: 'pre-wrap', fontSize: 13 }}>
                      {JSON.stringify(r.responses, null, 2)}
                    </pre>
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
