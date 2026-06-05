import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../lib/auth'
import shared from '../components/shared.module.css'
import SectionForm from './SectionForm'
import SectionRoster from './SectionRoster'

const STATUS_LABEL = {
  pending_approval: 'Pending approval',
  published: 'Published',
  cancelled: 'Cancelled',
}

/**
 * Tutor dashboard: shows the tutor's own sections (any status), a form to post
 * a new session (inserted as pending_approval), and the roster for each.
 */
export default function TutorDashboard() {
  const { user, profile } = useAuth()
  const [sections, setSections] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showForm, setShowForm] = useState(false)

  const load = useCallback(async () => {
    if (!supabase || !user) return
    setLoading(true)
    setError('')
    try {
      const { data, error: err } = await supabase
        .from('sections')
        .select('*')
        .eq('tutor_id', user.id)
        .order('created_at', { ascending: false })
      if (err) throw err
      setSections(data || [])
    } catch (err) {
      setError(err.message || 'Failed to load your sections.')
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => {
    queueMicrotask(load)
  }, [load])

  const approved = profile?.status === 'active'

  return (
    <div className={shared.page}>
      <div className={shared.spread}>
        <h1>Tutor dashboard</h1>
        <button
          type="button"
          className={shared.btn}
          onClick={() => setShowForm((v) => !v)}
        >
          {showForm ? 'Close' : 'Post a new session'}
        </button>
      </div>

      {!approved && (
        <div className={shared.card} style={{ borderColor: 'var(--accent-border)' }}>
          <p className={shared.muted}>
            Your tutor account is <strong>pending admin approval</strong>. You can
            draft sessions now; they go live in the catalog only after an admin
            approves them.
          </p>
        </div>
      )}

      {error && <p className={shared.error} role="alert">{error}</p>}

      {showForm && (
        <SectionForm
          tutorId={user?.id}
          onCreated={() => {
            setShowForm(false)
            load()
          }}
        />
      )}

      {loading ? (
        <p className={shared.muted}>Loading…</p>
      ) : sections.length === 0 ? (
        <div className={shared.empty}>
          You haven't posted any sessions yet.
        </div>
      ) : (
        sections.map((s) => (
          <section key={s.id} className={shared.card}>
            <div className={shared.spread}>
              <div>
                <h2 className={shared.cardTitle}>{s.title}</h2>
                <p className={shared.muted}>{s.subject || 'General'}</p>
              </div>
              <span className={shared.badge}>
                {STATUS_LABEL[s.status] || s.status}
              </span>
            </div>
            <p className={shared.muted} style={{ marginTop: 8 }}>
              Capacity {s.capacity} · {(s.student_ids || []).length} enrolled
            </p>
            <SectionRoster section={s} />
          </section>
        ))
      )}
    </div>
  )
}
