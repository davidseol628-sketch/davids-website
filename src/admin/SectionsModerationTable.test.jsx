import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import SectionsModerationTable from './SectionsModerationTable'
import { supabase } from '../lib/supabase'

vi.mock('../lib/supabase', () => ({ supabase: { from: vi.fn() } }))

function makeFrom({ rows = [], updateSpy }) {
  const update = updateSpy || vi.fn(() => ({ eq: vi.fn().mockResolvedValue({ error: null }) }))
  return () => ({
    select: vi.fn(() => ({
      in: vi.fn(() => ({
        order: vi.fn().mockResolvedValue({ data: rows, error: null }),
      })),
    })),
    update,
  })
}

describe('SectionsModerationTable', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders pending and published sections from mocked data', async () => {
    supabase.from.mockImplementation(
      makeFrom({
        rows: [
          { id: 's1', title: 'Algebra I', subject: 'Math', capacity: 10, status: 'pending_approval' },
          { id: 's2', title: 'Biology', subject: 'Science', capacity: 8, student_ids: ['a', 'b'], status: 'published' },
        ],
      }),
    )

    render(<SectionsModerationTable />)

    expect(await screen.findByText('Algebra I')).toBeInTheDocument()
    expect(screen.getByText('Biology')).toBeInTheDocument()
    expect(screen.getByText('Pending approval (1)')).toBeInTheDocument()
    expect(screen.getByText('Published (1)')).toBeInTheDocument()
    // Enrolled count for published section
    expect(screen.getByText('2 / 8')).toBeInTheDocument()
  })

  it('shows empty states for both sections when there is no data', async () => {
    supabase.from.mockImplementation(makeFrom({ rows: [] }))

    render(<SectionsModerationTable />)

    expect(await screen.findByText('No sections awaiting approval.')).toBeInTheDocument()
    expect(screen.getByText('No published sections.')).toBeInTheDocument()
  })

  it('approves a pending section by setting status to published', async () => {
    const eq = vi.fn().mockResolvedValue({ error: null })
    const updateSpy = vi.fn(() => ({ eq }))
    supabase.from.mockImplementation(
      makeFrom({
        rows: [{ id: 's1', title: 'Algebra I', subject: 'Math', capacity: 10, status: 'pending_approval' }],
        updateSpy,
      }),
    )

    const user = userEvent.setup()
    render(<SectionsModerationTable />)

    await screen.findByText('Algebra I')
    await user.click(screen.getByRole('button', { name: 'Approve' }))

    await waitFor(() => expect(updateSpy).toHaveBeenCalledWith({ status: 'published' }))
    expect(eq).toHaveBeenCalledWith('id', 's1')
  })

  it('rejects a pending section by setting status to cancelled', async () => {
    const eq = vi.fn().mockResolvedValue({ error: null })
    const updateSpy = vi.fn(() => ({ eq }))
    supabase.from.mockImplementation(
      makeFrom({
        rows: [{ id: 's1', title: 'Algebra I', subject: 'Math', capacity: 10, status: 'pending_approval' }],
        updateSpy,
      }),
    )

    const user = userEvent.setup()
    render(<SectionsModerationTable />)

    await screen.findByText('Algebra I')
    await user.click(screen.getByRole('button', { name: 'Reject' }))

    await waitFor(() => expect(updateSpy).toHaveBeenCalledWith({ status: 'cancelled' }))
    expect(eq).toHaveBeenCalledWith('id', 's1')
  })

  it('cancels a published section by setting status to cancelled', async () => {
    const eq = vi.fn().mockResolvedValue({ error: null })
    const updateSpy = vi.fn(() => ({ eq }))
    supabase.from.mockImplementation(
      makeFrom({
        rows: [{ id: 's2', title: 'Biology', subject: 'Science', capacity: 8, student_ids: [], status: 'published' }],
        updateSpy,
      }),
    )

    const user = userEvent.setup()
    render(<SectionsModerationTable />)

    await screen.findByText('Biology')
    await user.click(screen.getByRole('button', { name: 'Cancel' }))

    await waitFor(() => expect(updateSpy).toHaveBeenCalledWith({ status: 'cancelled' }))
    expect(eq).toHaveBeenCalledWith('id', 's2')
  })
})
