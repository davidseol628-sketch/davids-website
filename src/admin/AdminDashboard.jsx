import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import shared from '../components/shared.module.css'

/** Admin landing page: quick counts + links into the moderation tools. */
export default function AdminDashboard() {
  const [counts, setCounts] = useState({
    pendingTutors: null,
    pendingSections: null,
    surveys: null,
  })

  useEffect(() => {
    let active = true
    async function run() {
      if (!supabase) return
      const [tutors, sections, surveys] = await Promise.all([
        supabase.from('tutors').select('id', { count: 'exact', head: true }).eq('status', 'pending_approval'),
        supabase.from('sections').select('id', { count: 'exact', head: true }).eq('status', 'pending_approval'),
        supabase.from('surveys').select('id', { count: 'exact', head: true }),
      ])
      if (!active) return
      setCounts({
        pendingTutors: tutors.count ?? 0,
        pendingSections: sections.count ?? 0,
        surveys: surveys.count ?? 0,
      })
    }
    run()
    return () => {
      active = false
    }
  }, [])

  return (
    <div className={shared.page}>
      <h1>Admin dashboard</h1>
      <p className={shared.lead}>Moderate signups, sections, and view submissions.</p>

      <div className={shared.grid}>
        <Link to="/admin/signups" className={shared.card} style={{ textDecoration: 'none' }}>
          <h2 className={shared.cardTitle}>Pending tutor signups</h2>
          <p className={shared.muted}>{counts.pendingTutors ?? '…'}</p>
        </Link>
        <Link to="/admin/sections" className={shared.card} style={{ textDecoration: 'none' }}>
          <h2 className={shared.cardTitle}>Pending sections</h2>
          <p className={shared.muted}>{counts.pendingSections ?? '…'}</p>
        </Link>
        <Link to="/admin/submissions" className={shared.card} style={{ textDecoration: 'none' }}>
          <h2 className={shared.cardTitle}>Survey submissions</h2>
          <p className={shared.muted}>{counts.surveys ?? '…'}</p>
        </Link>
        <Link to="/admin/classes" className={shared.card} style={{ textDecoration: 'none' }}>
          <h2 className={shared.cardTitle}>Manage classes</h2>
          <p className={shared.muted}>Create sections directly</p>
        </Link>
      </div>
    </div>
  )
}
