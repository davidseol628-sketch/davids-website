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

  it('shows a loading state, then the empty state when there are no sections', async () => {
    sectionsResult = { data: [], error: null }
    renderPage()

    expect(screen.getByText('Loading…')).toBeInTheDocument()
    expect(
      await screen.findByText('No published classes yet. Check back soon.'),
    ).toBeInTheDocument()
  })

  it('queries only published sections, newest first', async () => {
    renderPage()
    await screen.findByText('No published classes yet. Check back soon.')

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
    expect(screen.getByText('Math')).toBeInTheDocument()
    expect(screen.getByText('Grades: 6-8')).toBeInTheDocument()
    // capacity 5 - 2 enrolled = 3 seats left
    expect(screen.getByText('3 seats left')).toBeInTheDocument()

    const link = screen.getByRole('link', { name: /View & enroll/i })
    expect(link).toHaveAttribute('href', '/sections/sec-1')
    // not full -> no Full badge
    expect(screen.queryByText('Full')).not.toBeInTheDocument()
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
