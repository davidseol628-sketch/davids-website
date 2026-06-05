import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import SubmissionsTable from './SubmissionsTable'
import { supabase } from '../lib/supabase'

vi.mock('../lib/supabase', () => ({ supabase: { from: vi.fn() } }))

/** rowsByTable maps table name -> array of submission rows. */
function setupTables(rowsByTable) {
  supabase.from.mockImplementation((table) => ({
    select: vi.fn(() => ({
      order: vi.fn().mockResolvedValue({ data: rowsByTable[table] ?? [], error: null }),
    })),
  }))
}

describe('SubmissionsTable', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders survey submissions by default with serialized responses', async () => {
    setupTables({
      surveys: [
        { id: 'r1', created_at: '2026-01-01T00:00:00Z', responses: { q1: 'yes', rating: 5 } },
      ],
    })

    render(<SubmissionsTable />)

    expect(await screen.findByText(/"q1": "yes"/)).toBeInTheDocument()
    expect(screen.getByText(/"rating": 5/)).toBeInTheDocument()
    expect(supabase.from).toHaveBeenCalledWith('surveys')
  })

  it('shows the empty state when a table has no rows', async () => {
    setupTables({ surveys: [] })

    render(<SubmissionsTable />)

    expect(await screen.findByText('No submissions yet.')).toBeInTheDocument()
  })

  it('switches tables when a tab is clicked', async () => {
    setupTables({
      surveys: [],
      tutor_evaluations: [
        { id: 'te1', created_at: '2026-02-02T00:00:00Z', responses: { score: 9 } },
      ],
    })

    const user = userEvent.setup()
    render(<SubmissionsTable />)

    await screen.findByText('No submissions yet.')

    await user.click(screen.getByRole('button', { name: 'Tutor evaluations' }))

    await waitFor(() => expect(supabase.from).toHaveBeenCalledWith('tutor_evaluations'))
    expect(await screen.findByText(/"score": 9/)).toBeInTheDocument()
  })

  it('renders all five table tabs', () => {
    setupTables({ surveys: [] })
    render(<SubmissionsTable />)

    for (const label of [
      'Surveys',
      'Student evaluations',
      'Tutor evaluations',
      'Tutor self-assessments',
      'Parent assessments',
    ]) {
      expect(screen.getByRole('button', { name: label })).toBeInTheDocument()
    }
  })
})
