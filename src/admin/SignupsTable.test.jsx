import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import SignupsTable from './SignupsTable'
import { supabase } from '../lib/supabase'

vi.mock('../lib/supabase', () => ({ supabase: { from: vi.fn() } }))

/**
 * Build a chainable query mock. `selectResult` is what the
 * select()/order() chain resolves to; `updateImpl` is the spy used for updates.
 */
function makeFrom({ rows = [], updateSpy }) {
  const update = updateSpy || vi.fn(() => ({ eq: vi.fn().mockResolvedValue({ error: null }) }))
  return () => ({
    select: vi.fn(() => ({
      order: vi.fn().mockResolvedValue({ data: rows, error: null }),
    })),
    update,
  })
}

describe('SignupsTable', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders tutor rows from mocked Supabase data', async () => {
    supabase.from.mockImplementation(
      makeFrom({
        rows: [
          {
            id: 't1',
            full_name: 'Jane Tutor',
            email: 'jane@example.com',
            subjects: ['Math', 'Science'],
            status: 'pending_approval',
          },
        ],
      }),
    )

    render(<SignupsTable />)

    expect(await screen.findByText('Jane Tutor')).toBeInTheDocument()
    expect(screen.getByText('jane@example.com')).toBeInTheDocument()
    expect(screen.getByText('Math, Science')).toBeInTheDocument()
    expect(screen.getByText('pending_approval')).toBeInTheDocument()
  })

  it('shows the empty state when there are no tutors', async () => {
    supabase.from.mockImplementation(makeFrom({ rows: [] }))

    render(<SignupsTable />)

    expect(await screen.findByText('No tutor accounts yet.')).toBeInTheDocument()
  })

  it('approves a tutor by updating status to active', async () => {
    const eq = vi.fn().mockResolvedValue({ error: null })
    const updateSpy = vi.fn(() => ({ eq }))
    supabase.from.mockImplementation(
      makeFrom({
        rows: [
          { id: 't1', full_name: 'Jane', email: 'j@x.com', subjects: [], status: 'pending_approval' },
        ],
        updateSpy,
      }),
    )

    const user = userEvent.setup()
    render(<SignupsTable />)

    await screen.findByText('Jane')
    await user.click(screen.getByRole('button', { name: 'Approve' }))

    await waitFor(() => expect(updateSpy).toHaveBeenCalledWith({ status: 'active' }))
    expect(eq).toHaveBeenCalledWith('id', 't1')
  })

  it('rejects a tutor by updating status to inactive', async () => {
    const eq = vi.fn().mockResolvedValue({ error: null })
    const updateSpy = vi.fn(() => ({ eq }))
    supabase.from.mockImplementation(
      makeFrom({
        rows: [
          { id: 't2', full_name: 'Bob', email: 'b@x.com', subjects: [], status: 'pending_approval' },
        ],
        updateSpy,
      }),
    )

    const user = userEvent.setup()
    render(<SignupsTable />)

    await screen.findByText('Bob')
    await user.click(screen.getByRole('button', { name: 'Reject' }))

    await waitFor(() => expect(updateSpy).toHaveBeenCalledWith({ status: 'inactive' }))
    expect(eq).toHaveBeenCalledWith('id', 't2')
  })

  it('disables Approve for an already-active tutor', async () => {
    supabase.from.mockImplementation(
      makeFrom({
        rows: [{ id: 't3', full_name: 'Active Al', email: 'a@x.com', subjects: [], status: 'active' }],
      }),
    )

    render(<SignupsTable />)

    await screen.findByText('Active Al')
    expect(screen.getByRole('button', { name: 'Approve' })).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Reject' })).toBeEnabled()
  })
})
