import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../lib/auth'
import { rpcErrorMessage } from '../lib/rpcErrors'
import shared from '../components/shared.module.css'

const openHouseItem = {
  id: 'static-open-house',
  title: 'OPEN HOUSE- June 27th',
  capacity: 20,
  student_ids: [],
}

function getClassDescription(title) {
  const normalized = title?.trim().toLowerCase()
  if (normalized.includes('open house')) {
    return '11:00am - 3:00pm · Free Snacks Provided!'
  }
  return 'A hands-on class designed to inspire curiosity and practical learning.'
}

export default function CatalogPage() {
  const { user, role } = useAuth()
  const navigate = useNavigate()
  const [children, setChildren] = useState([])
  const [childId, setChildId] = useState('')
  const [enrolled, setEnrolled] = useState((openHouseItem.student_ids || []).length)
  const [registering, setRegistering] = useState(false)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')

  useEffect(() => {
    setError('')
    setNotice('')
    setChildId('')

    if (!user || role !== 'parent') {
      setChildren([])
      return
    }

    let active = true
    async function loadChildren() {
      const { data: kids, error: kidsErr } = await supabase
        .from('students')
        .select('id, full_name')
        .eq('parent_id', user.id)
        .order('created_at', { ascending: true })

      if (!active) return
      if (kidsErr) {
        setError('Failed to load your children.')
        return
      }

      setChildren(kids || [])
      if ((kids || []).length === 1) {
        setChildId(kids[0].id)
      }
    }

    loadChildren()
    return () => {
      active = false
    }
  }, [user, role])

  const seatsLeft = Math.max(0, (openHouseItem.capacity || 0) - enrolled)
  const full = seatsLeft === 0

  async function registerOpenHouse() {
    setError('')
    setNotice('')

    if (!user) {
      navigate('/signup', { state: { from: { pathname: '/catalog' } } })
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

    setRegistering(true)
    try {
      const { error: rpcErr } = await supabase.rpc('enroll_student', {
        section_id: openHouseItem.id,
        student_id: childId,
      })
      if (rpcErr) {
        setError(rpcErrorMessage(rpcErr, 'Could not register.'))
        return
      }
      setNotice('Registered for Open House! You can see it under My sessions.')
      setEnrolled((prev) => prev + 1)
    } finally {
      setRegistering(false)
    }
  }

  return (
    <div className={shared.page}>
      <h1>Registration</h1>
      <p className={shared.lead}>Browse our published classes and enroll your child.</p>

      <div className={shared.grid}>
        <div className={shared.card}>
          <div className={shared.spread}>
            <h2 className={shared.cardTitle}>{openHouseItem.title}</h2>
          </div>
          <p className={shared.muted} style={{ marginTop: 8 }}>
            {getClassDescription(openHouseItem.title)}
          </p>
          <p className={shared.lead} style={{ marginTop: 8 }}>
            <a
              href="https://docs.google.com/forms/d/e/1FAIpQLSfzicZLAZmYWDzNV3xT2LMu953BJbDErN50_rL9Nov6I0aKoQ/viewform?usp=publish-editor"
              target="_blank"
              rel="noreferrer noopener"
            >
              Click here to register for the Open House.
            </a>
          </p>
          <p className={shared.muted} style={{ marginTop: 8 }}>
            {`${seatsLeft} seat${seatsLeft === 1 ? '' : 's'} left`}
          </p>

          {role === 'parent' && children.length > 1 && (
            <div style={{ marginTop: 12 }}>
              <label htmlFor="childPick" className={shared.muted}>
                Register which child?
              </label>
              <select
                id="childPick"
                className={shared.select}
                value={childId}
                onChange={(e) => setChildId(e.target.value)}
                style={{ marginTop: 6 }}
              >
                <option value="">Select a child…</option>
                {children.map((child) => (
                  <option key={child.id} value={child.id}>
                    {child.full_name}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div style={{ marginTop: 12 }}>
            <button
              type="button"
              className={shared.btn}
              onClick={registerOpenHouse}
              disabled={registering || full}
            >
              {full ? 'Open House full' : registering ? 'Registering…' : 'Register for Open House'}
            </button>
          </div>

          {error && (
            <p className={shared.error} role="alert" style={{ marginTop: 12 }}>
              {error}
            </p>
          )}
          {notice && (
            <p className={shared.success} style={{ marginTop: 12 }}>
              {notice}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
