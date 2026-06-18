import { useCallback, useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../lib/auth'
import { rpcErrorMessage } from '../lib/rpcErrors'
import { displaySectionTitle } from './sectionUtils'
import shared from '../components/shared.module.css'

const OPEN_HOUSE_ID = 'static-open-house'
const openHouseSection = {
  id: OPEN_HOUSE_ID,
  title: 'OPEN HOUSE- June 27th',
  description: 'Register your child for our free Open House event. 11:00am - 3:00pm · Free Snacks Provided!',
  capacity: 20,
  student_ids: [],
}

/**
 * Section detail + enroll flow. A logged-in parent picks which child to enroll
 * and the enroll_student RPC appends them (with a server-side capacity check).
 * Logged-out visitors are routed to signup when they try to enroll.
 */
export default function SectionDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user, role } = useAuth()

  const [section, setSection] = useState(null)
  const [tutorName, setTutorName] = useState('')
  const [children, setChildren] = useState([])
  const [childId, setChildId] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [enrolling, setEnrolling] = useState(false)
  const [openHouseRegistering, setOpenHouseRegistering] = useState(false)

  const load = useCallback(async () => {
    if (!supabase || !id) return
    setLoading(true)
    setError('')
    try {
      const { data: sec, error: secErr } = await supabase
        .from('sections')
        .select('*')
        .eq('id', id)
        .maybeSingle()
      if (secErr) throw secErr
      setSection(sec || (id === OPEN_HOUSE_ID ? openHouseSection : null))

      if (sec?.tutor_id) {
        const { data: tutor } = await supabase
          .from('tutors')
          .select('full_name')
          .eq('id', sec.tutor_id)
          .maybeSingle()
        setTutorName(tutor?.full_name || '')
      }

      if (user && role === 'parent') {
        const { data: kids } = await supabase
          .from('students')
          .select('id, full_name')
          .eq('parent_id', user.id)
          .order('created_at', { ascending: true })
        setChildren(kids || [])
        if ((kids || []).length === 1) setChildId(kids[0].id)
      }
    } catch (err) {
      setError(err.message || 'Failed to load section.')
    } finally {
      setLoading(false)
    }
  }, [id, user, role])

  useEffect(() => {
    queueMicrotask(load)
  }, [load])

  async function enroll() {
    setError('')
    setNotice('')

    if (!user) {
      navigate('/signup', { state: { from: { pathname: `/sections/${id}` } } })
      return
    }
    if (role !== 'parent') {
      setError('Only parent accounts can enroll children.')
      return
    }
    if (children.length === 0) {
      setError('Add a child to your account first.')
      return
    }
    if (!childId) {
      setError('Please pick a child to enroll.')
      return
    }

    setEnrolling(true)
    try {
      const { error: rpcErr } = await supabase.rpc('enroll_student', {
        section_id: id,
        student_id: childId,
      })
      if (rpcErr) {
        setError(rpcErrorMessage(rpcErr, 'Could not enroll.'))
        return
      }
      setNotice('Enrolled! You can see it under My sessions.')
      await load()
    } finally {
      setEnrolling(false)
    }
  }

  async function registerOpenHouse() {
    if (!user) {
      navigate('/signup', { state: { from: { pathname: `/sections/${id}` } } })
      return
    }
    if (role !== 'parent') {
      setError('Only parent accounts can register children.')
      return
    }
    if (children.length === 0) {
      setError('Add a child to your account first.')
      return
    }
    if (!childId) {
      setError('Please pick a child to register.')
      return
    }

    setOpenHouseRegistering(true)
    setError('')
    setNotice('')
    try {
      const { error: rpcErr } = await supabase.rpc('enroll_student', {
        section_id: id,
        student_id: childId,
      })
      if (rpcErr) {
        setError(rpcErrorMessage(rpcErr, 'Could not register.'))
        return
      }
      setNotice('Registered for Open House! Redirecting to My sessions...')
      await load()
      navigate('/dashboard')
    } finally {
      setOpenHouseRegistering(false)
    }
  }

  if (loading) {
    return (
      <div className={shared.page}>
        <p className={shared.muted}>Loading…</p>
      </div>
    )
  }

  if (!section) {
    return (
      <div className={shared.page}>
        <h1>Section not found</h1>
        <p className={shared.muted}>
          <Link to="/catalog">Back to catalog</Link>
        </p>
      </div>
    )
  }

  const enrolled = (section.student_ids || []).length
  const seatsLeft = Math.max(0, (section.capacity || 0) - enrolled)
  const full = seatsLeft === 0
  const isOpenHouse = section.id === OPEN_HOUSE_ID || section.title.toLowerCase().includes('open house')

  return (
    <div className={`${shared.page} ${shared.narrow}`}>
      <p className={shared.muted}>
        <Link to="/catalog">← Back to catalog</Link>
      </p>
      <h1>{displaySectionTitle(section.title)}</h1>

      <div className={shared.card}>
        {section.description && <p style={{ marginBottom: 12 }}>{section.description}</p>}
        {tutorName && <p className={shared.muted}>Tutor: {tutorName}</p>}
        {section.location && <p className={shared.muted}>Location: {section.location}</p>}
        <p className={shared.muted} style={{ marginTop: 8 }}>
          {full ? 'No seats available' : `${seatsLeft} seat${seatsLeft === 1 ? '' : 's'} left`}
        </p>
      </div>

      {error && <p className={shared.error} role="alert">{error}</p>}
      {notice && <p className={shared.success}>{notice}</p>}

      {isOpenHouse ? (
        <>
          {role === 'parent' && children.length > 1 && (
            <div style={{ marginBottom: 12 }}>
              <label htmlFor="childPick" className={shared.muted}>Register which child?</label>
              <select
                id="childPick"
                className={shared.select}
                value={childId}
                onChange={(e) => setChildId(e.target.value)}
                style={{ marginTop: 6 }}
              >
                <option value="">Select a child…</option>
                {children.map((c) => (
                  <option key={c.id} value={c.id}>{c.full_name}</option>
                ))}
              </select>
            </div>
          )}

          <button
            type="button"
            className={shared.btn}
            onClick={registerOpenHouse}
            disabled={openHouseRegistering || full}
          >
            {full ? 'Open House full' : openHouseRegistering ? 'Registering…' : 'Register for Open House'}
          </button>

          {!user && (
            <p className={shared.muted} style={{ marginTop: 12 }}>
              You'll be asked to sign up or log in first.
            </p>
          )}
        </>
      ) : (
        <>
          {role === 'parent' && children.length > 1 && (
            <div style={{ marginBottom: 12 }}>
              <label htmlFor="childPick" className={shared.muted}>Enroll which child?</label>
              <select
                id="childPick"
                className={shared.select}
                value={childId}
                onChange={(e) => setChildId(e.target.value)}
                style={{ marginTop: 6 }}
              >
                <option value="">Select a child…</option>
                {children.map((c) => (
                  <option key={c.id} value={c.id}>{c.full_name}</option>
                ))}
              </select>
            </div>
          )}

          <button
            type="button"
            className={shared.btn}
            onClick={enroll}
            disabled={enrolling || full}
          >
            {full ? 'Section full' : enrolling ? 'Enrolling…' : 'Enroll'}
          </button>

          {!user && (
            <p className={shared.muted} style={{ marginTop: 12 }}>
              You'll be asked to sign up or log in first.
            </p>
          )}
        </>
      )}
    </div>
  )
}
