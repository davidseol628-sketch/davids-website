import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { displaySectionTitle } from './sectionUtils'
import shared from '../components/shared.module.css'

/** Public catalog: all published sections with seats remaining. */
export default function CatalogPage() {
  const [sections, setSections] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const displayTitles = [
    'Environmental Science',
    'Introduction to Artificial Intelligence',
    'Research Methods & Discovery',
    'OPEN HOUSE- June 27th',
  ]

  const displaySections = sections.length > 0
    ? [
        ...sections,
        ...displayTitles
          .filter(
            (title) =>
              !sections.some(
                (s) =>
                  displaySectionTitle(s.title).trim().toLowerCase() ===
                  title.toLowerCase(),
              ),
          )
          .map((title, index) => ({
            id: `static-home-${index}`,
            title,
            capacity: 10,
            student_ids: [],
          })),
      ]
    : []

  function getClassDescription(title) {
    const normalized = title?.trim().toLowerCase()
    if (normalized.includes('3d printing') || normalized.includes('3d')) {
      return 'Learn digital design and 3D modeling to bring your creative ideas to life.'
    }
    if (normalized.includes('environmental science')) {
      return 'Explore ecosystems, sustainability, and the science behind our changing world.'
    }
    if (normalized.includes('artificial intelligence') || normalized.includes('ai')) {
      return 'Learn the basics of intelligent systems, pattern recognition, and problem solving.'
    }
    if (normalized.includes('research methods') || normalized.includes('research')) {
      return 'Build curiosity through inquiry, experimentation, and evidence-based discovery.'
    }
    if (normalized.includes('open house')) {
      return '11:00am - 3:00pm · Free Snacks Provided!'
    }
    return 'A hands-on class designed to inspire curiosity and practical learning.'
  }

  useEffect(() => {
    let active = true
    async function run() {
      if (!supabase) {
        setError('Backend not configured.')
        setLoading(false)
        return
      }
      const { data, error: err } = await supabase
        .from('sections')
        .select('*')
        .eq('status', 'published')
        .order('created_at', { ascending: false })
      if (!active) return
      if (err) setError(err.message)
      else setSections(data || [])
      setLoading(false)
    }
    run()
    return () => {
      active = false
    }
  }, [])

  return (
    <div className={shared.page}>
      <h1>Class catalog</h1>
      <p className={shared.lead}>Browse our published classes and enroll your child.</p>

      {error && <p className={shared.error} role="alert">{error}</p>}

      {loading ? (
        <p className={shared.muted}>Loading…</p>
      ) : displaySections.length === 0 ? (
        <p className={shared.muted}>No classes are available at the moment.</p>
      ) : (
        <div className={shared.grid}>
          {displaySections.map((s) => {
            const title = displaySectionTitle(s.title)
            const isOpenHouse = title.toLowerCase().includes('open house')
            const enrolled = (s.student_ids || []).length
            const seatsLeft = Math.max(0, (s.capacity || 0) - enrolled)
            const full = seatsLeft === 0 && !isOpenHouse
            return (
              <div key={s.id} className={shared.card}>
                <div className={shared.spread}>
                  <h2 className={shared.cardTitle}>{title}</h2>
                  {full && <span className={shared.badge}>Full</span>}
                </div>
                <p className={shared.muted} style={{ marginTop: 8 }}>
                  {getClassDescription(title)}
                </p>
                <p className={shared.muted} style={{ marginTop: 8 }}>
                  {full
                    ? 'No seats available'
                    : `${seatsLeft} seat${seatsLeft === 1 ? '' : 's'} left`}
                </p>
                <div style={{ marginTop: 12 }}>
                  {isOpenHouse ? (
                    <Link to={`/sections/${s.id}`} className={shared.btn}>
                      View &amp; enroll
                    </Link>
                  ) : (
                    <button type="button" className={shared.btn} disabled>
                      View &amp; enroll
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
