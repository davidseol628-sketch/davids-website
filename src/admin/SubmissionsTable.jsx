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

/** Turn a response key (e.g. "parent_name", "q1") into a readable label. */
function formatKey(key) {
  const spaced = String(key).replace(/[_-]+/g, ' ').trim()
  return spaced.charAt(0).toUpperCase() + spaced.slice(1)
}

/** Render a response value in plain language rather than raw JSON. */
function formatValue(value) {
  if (value === null || value === undefined || value === '') return '—'
  if (typeof value === 'boolean') return value ? 'Yes' : 'No'
  if (Array.isArray(value)) return value.map(formatValue).join(', ')
  if (typeof value === 'object') {
    return Object.entries(value)
      .map(([k, v]) => `${formatKey(k)}: ${formatValue(v)}`)
      .join('; ')
  }
  return String(value)
}

/** A submission's responses shown as a readable label/value list. */
function Responses({ responses }) {
  const entries = Object.entries(responses || {})
  if (entries.length === 0) return <span className={shared.muted}>—</span>
  return (
    <dl className={shared.kv}>
      {entries.map(([key, value]) => (
        <div key={key} className={shared.kvRow}>
          <dt>{formatKey(key)}</dt>
          <dd>{formatValue(value)}</dd>
        </div>
      ))}
    </dl>
  )
}

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
                    <Responses responses={r.responses} />
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
