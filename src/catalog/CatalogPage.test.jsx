import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import CatalogPage from './CatalogPage'

// --- Mocked Supabase client --------------------------------------------------
// CatalogPage builds: supabase.from('sections').select(...).eq(...).order(...)
// The terminal .order() resolves to { data, error }.
let sectionsResult

const order = vi.fn(() => Promise.resolve(sectionsResult))
const eq = vi.fn(() => ({ order }))
const select = vi.fn(() => ({ eq }))
const from = vi.fn(() => ({ select }))

vi.mock('../lib/supabase', () => ({
  get supabase() {
    return { from }
  },
}))

function renderPage() {
  return render(
    <MemoryRouter>
      <CatalogPage />
    </MemoryRouter>,
  )
}

describe('CatalogPage', () => {
  beforeEach(() => {
    sectionsResult = { data: [], error: null }
    vi.clearAllMocks()
  })

  it('shows a loading state, then renders a no-classes fallback when there are no sections', async () => {
    sectionsResult = { data: [], error: null }
    renderPage()

    expect(screen.getByText('Loading…')).toBeInTheDocument()
    expect(await screen.findByText('No classes are available at the moment.')).toBeInTheDocument()
  })

  it('queries only published sections, newest first', async () => {
    renderPage()
    expect(await screen.findByText('No classes are available at the moment.')).toBeInTheDocument()

    expect(from).toHaveBeenCalledWith('sections')
    expect(eq).toHaveBeenCalledWith('status', 'published')
    expect(order).toHaveBeenCalledWith('created_at', { ascending: false })
  })

  it('renders a card per section with seats-left text and an enroll link', async () => {
    sectionsResult = {
      data: [
        {
          id: 'sec-1',
          title: 'Algebra I',
          subject: 'Math',
          grade_range: '6-8',
          capacity: 5,
          student_ids: ['a', 'b'],
        },
      ],
      error: null,
    }
    renderPage()

    expect(await screen.findByText('Algebra I')).toBeInTheDocument()
    expect(screen.queryByText('Math')).not.toBeInTheDocument()
    expect(screen.queryByText('Grades: 6-8')).not.toBeInTheDocument()
    // capacity 5 - 2 enrolled = 3 seats left
    expect(screen.getByText('3 seats left')).toBeInTheDocument()

    // Multiple "View & enroll" links now exist (Research card + Algebra I), so check all
    const links = screen.getAllByRole('link', { name: /View & enroll/i })
    expect(links.length).toBeGreaterThanOrEqual(2) // Algebra I + Research
    expect(links.some((link) => link.getAttribute('href') === '/sections/sec-1')).toBe(true)
    // not full -> no Full badge
    expect(screen.queryByText('Full')).not.toBeInTheDocument()
  })

  it('renames Geometry Lab to 3-D Printing and hides subject/grade details', async () => {
    sectionsResult = {
      data: [
        {
          id: 'geo-1',
          title: 'Geometry Lab',
          subject: 'Math',
          grade_range: '6-8',
          capacity: 4,
          student_ids: ['a'],
        },
      ],
      error: null,
    }
    renderPage()

    expect(await screen.findByText('3-D Printing')).toBeInTheDocument()
    expect(screen.queryByText('Geometry Lab')).not.toBeInTheDocument()
    expect(screen.queryByText('Math')).not.toBeInTheDocument()
    expect(screen.queryByText('Grades: 6-8')).not.toBeInTheDocument()
  })

  it('marks a section Full and singularizes the seat label', async () => {
    sectionsResult = {
      data: [
        { id: 'full-1', title: 'Full Class', capacity: 2, student_ids: ['a', 'b'] },
        { id: 'one-1', title: 'One Seat', capacity: 3, student_ids: ['a', 'b'] },
      ],
      error: null,
    }
    renderPage()

    await screen.findByText('Full Class')
    expect(screen.getByText('Full')).toBeInTheDocument()
    expect(screen.getByText('No seats available')).toBeInTheDocument()
    // capacity 3 - 2 = 1 -> singular "seat"
    expect(screen.getByText('1 seat left')).toBeInTheDocument()
  })

  it('shows an error alert when the query fails', async () => {
    sectionsResult = { data: null, error: { message: 'boom' } }
    renderPage()

    const alert = await screen.findByRole('alert')
    expect(alert).toHaveTextContent('boom')
  })
})
