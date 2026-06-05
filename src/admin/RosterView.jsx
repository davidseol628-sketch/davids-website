import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import shared from '../components/shared.module.css'

/** Admin: see who is enrolled in any section, with parent contact info. */
export default function RosterView() {
  const { sectionId } = useParams()
  const [section, setSection] = useState(null)
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    async function run() {
      if (!supabase || !sectionId) return
      setLoading(true)
      setError('')
      try {
        const { data: sec, error: secErr } = await supabase
          .from('sections')
          .select('*')
          .eq('id', sectionId)
          .maybeSingle()
        if (secErr) throw secErr
        if (!active) return
        setSection(sec)

        const ids = sec?.student_ids || []
        if (ids.length === 0) {
          setRows([])
          return
        }
        const { data: students } = await supabase
          .from('students')
          .select('id, full_name, grade, parent_id')
          .in('id', ids)
        const parentIds = [...new Set((students || []).map((s) => s.parent_id))]
        const parentsById = {}
        if (parentIds.length > 0) {
          const { data: parents } = await supabase
            .from('parents')
            .select('id, full_name, email, phone')
            .in('id', parentIds)
          for (const p of parents || []) parentsById[p.id] = p
        }
        if (!active) return
        setRows((students || []).map((s) => ({ ...s, parent: parentsById[s.parent_id] })))
      } catch (err) {
        if (active) setError(err.message)
      } finally {
        if (active) setLoading(false)
      }
    }
    run()
    return () => {
      active = false
    }
  }, [sectionId])

  if (loading) {
    return (
      <div className={shared.page}>
        <p className={shared.muted}>Loading…</p>
      </div>
    )
  }

  return (
    <div className={shared.page}>
      <p className={shared.muted}>
        <Link to="/admin/classes">← Back to classes</Link>
      </p>
      <h1>{section ? section.title : 'Roster'}</h1>
      {error && <p className={shared.error} role="alert">{error}</p>}

      {rows.length === 0 ? (
        <div className={shared.empty}>No students enrolled.</div>
      ) : (
        <div className={shared.tableWrap}>
          <table className={shared.table}>
            <thead>
              <tr>
                <th>Student</th>
                <th>Grade</th>
                <th>Parent</th>
                <th>Contact</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id}>
                  <td>{r.full_name}</td>
                  <td>{r.grade || '—'}</td>
                  <td>{r.parent?.full_name || '—'}</td>
                  <td>{r.parent?.email || '—'}{r.parent?.phone ? ` · ${r.parent.phone}` : ''}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
