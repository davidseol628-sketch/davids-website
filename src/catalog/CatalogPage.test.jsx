import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, within } from '@testing-library/react'
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

  it('renders a card per section with real seat counts and only Open House enroll enabled', async () => {
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
    expect(screen.getByText('3 seats left')).toBeInTheDocument()

    const algebraCard = within(screen.getByText('Algebra I').closest('div').parentElement)
    expect(algebraCard.queryByText('Full')).not.toBeInTheDocument()
    expect(algebraCard.getByRole('button', { name: /View & enroll/i })).toBeDisabled()

    const links = screen.getAllByRole('link', { name: /View & enroll/i })
    expect(links.length).toBe(1)
    expect(links[0].getAttribute('href')).toBe('/sections/static-home-3')
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

  it('marks full sections and shows seats left for non-full sections', async () => {
    sectionsResult = {
      data: [
        { id: 'full-1', title: 'Full Class', capacity: 2, student_ids: ['a', 'b'] },
        { id: 'one-1', title: 'One Seat', capacity: 3, student_ids: ['a', 'b'] },
      ],
      error: null,
    }
    renderPage()

    await screen.findByText('Full Class')
    expect(screen.getAllByText('Full').length).toBeGreaterThanOrEqual(1)
    expect(screen.getByText('No seats available')).toBeInTheDocument()
    expect(screen.getByText('1 seat left')).toBeInTheDocument()
  })

  it('shows an error alert when the query fails', async () => {
    sectionsResult = { data: null, error: { message: 'boom' } }
    renderPage()

    const alert = await screen.findByRole('alert')
    expect(alert).toHaveTextContent('boom')
  })
})
