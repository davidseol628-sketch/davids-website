import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import RosterView from './RosterView'
import { supabase } from '../lib/supabase'

vi.mock('../lib/supabase', () => ({ supabase: { from: vi.fn() } }))

/**
 * RosterView queries:
 *   from('sections').select('*').eq('id', id).maybeSingle() -> {data: section}
 *   from('students').select(...).in('id', ids)              -> {data: students}
 *   from('parents').select(...).in('id', parentIds)         -> {data: parents}
 */
function setup({ section, students = [], parents = [] }) {
  supabase.from.mockImplementation((table) => {
    if (table === 'sections') {
      return {
        select: vi.fn(() => ({
          eq: vi.fn(() => ({
            maybeSingle: vi.fn().mockResolvedValue({ data: section, error: null }),
          })),
        })),
      }
    }
    if (table === 'students') {
      return {
        select: vi.fn(() => ({
          in: vi.fn().mockResolvedValue({ data: students, error: null }),
        })),
      }
    }
    // parents
    return {
      select: vi.fn(() => ({
        in: vi.fn().mockResolvedValue({ data: parents, error: null }),
      })),
    }
  })
}

function renderRoster(sectionId = 'sec1') {
  return render(
    <MemoryRouter initialEntries={[`/admin/rosters/${sectionId}`]}>
      <Routes>
        <Route path="/admin/rosters/:sectionId" element={<RosterView />} />
      </Routes>
    </MemoryRouter>,
  )
}

describe('RosterView', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders the section title and enrolled students with parent contact', async () => {
    setup({
      section: { id: 'sec1', title: 'Algebra I', student_ids: ['stu1'] },
      students: [{ id: 'stu1', full_name: 'Sam Student', grade: '7', parent_id: 'p1' }],
      parents: [{ id: 'p1', full_name: 'Pat Parent', email: 'pat@example.com', phone: '555-1234' }],
    })

    renderRoster()

    expect(await screen.findByRole('heading', { name: 'Algebra I' })).toBeInTheDocument()
    expect(screen.getByText('Sam Student')).toBeInTheDocument()
    expect(screen.getByText('7')).toBeInTheDocument()
    expect(screen.getByText('Pat Parent')).toBeInTheDocument()
    expect(screen.getByText(/pat@example.com · 555-1234/)).toBeInTheDocument()
  })

  it('shows the empty state when no students are enrolled', async () => {
    setup({
      section: { id: 'sec1', title: 'Empty Class', student_ids: [] },
    })

    renderRoster()

    expect(await screen.findByRole('heading', { name: 'Empty Class' })).toBeInTheDocument()
    expect(screen.getByText('No students enrolled.')).toBeInTheDocument()
  })

  it('renders a back link to the classes page', async () => {
    setup({ section: { id: 'sec1', title: 'Algebra I', student_ids: [] } })

    renderRoster()

    await screen.findByRole('heading', { name: 'Algebra I' })
    expect(screen.getByRole('link', { name: /Back to classes/ })).toHaveAttribute('href', '/admin/classes')
  })
})
