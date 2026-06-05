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

      // Preferred path: the section_roster RPC returns students joined to
      // parent contact in one call. It's SECURITY DEFINER so it can read
      // parents (which tutors can't SELECT directly under RLS) but only for a
      // section the calling tutor owns.
      const { data: roster, error: rpcErr } = await supabase.rpc('section_roster', {
        p_section_id: section.id,
      })
      if (!active) return
      if (!rpcErr && roster) {
        setRows(
          roster.map((r) => ({
            id: r.student_id,
            full_name: r.student_name,
            grade: r.grade,
            parent: r.parent_name
              ? { full_name: r.parent_name, email: r.email, phone: r.phone }
              : null,
          })),
        )
        setLoading(false)
        return
      }

      // Fallback (e.g. before the RPC migration is applied): read students
      // directly. Parent contact stays blank because RLS blocks parents reads.
      const { data: students } = await supabase
        .from('students')
        .select('id, full_name, grade, parent_id')
        .in('id', ids)
      if (!active) return
      setRows((students || []).map((s) => ({ ...s, parent: null })))
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
