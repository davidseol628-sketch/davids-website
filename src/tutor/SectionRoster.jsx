import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import shared from '../components/shared.module.css'

/**
 * Roster for one section: resolves each id in section.student_ids to a student
 * row (RLS lets a tutor read students enrolled in their own sections), joined
 * to the parent for contact info.
 */
export default function SectionRoster({ section }) {
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(false)

  const ids = section?.student_ids || []
  const key = ids.join(',')

  useEffect(() => {
    let active = true
    async function run() {
      if (!supabase || ids.length === 0) {
        setRows([])
        return
      }
      setLoading(true)
      const { data: students } = await supabase
        .from('students')
        .select('id, full_name, grade, parent_id')
        .in('id', ids)

      const parentIds = [...new Set((students || []).map((s) => s.parent_id).filter(Boolean))]
      let parentsById = {}
      if (parentIds.length > 0) {
        const { data: parents } = await supabase
          .from('parents')
          .select('id, full_name, email, phone')
          .in('id', parentIds)
        for (const p of parents || []) parentsById[p.id] = p
      }
      if (!active) return
      setRows(
        (students || []).map((s) => ({ ...s, parent: parentsById[s.parent_id] })),
      )
      setLoading(false)
    }
    run()
    return () => {
      active = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key])

  if (ids.length === 0) {
    return <p className={shared.muted} style={{ marginTop: 8 }}>No students enrolled.</p>
  }

  if (loading) return <p className={shared.muted} style={{ marginTop: 8 }}>Loading roster…</p>

  return (
    <div className={shared.tableWrap} style={{ marginTop: 8 }}>
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
              <td>
                {r.parent?.email || '—'}
                {r.parent?.phone ? ` · ${r.parent.phone}` : ''}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
