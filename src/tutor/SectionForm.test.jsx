import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import SectionForm from './SectionForm'

const insert = vi.fn()
vi.mock('../lib/supabase', () => ({
  get supabase() {
    return { from: () => ({ insert }) }
  },
}))

describe('SectionForm', () => {
  beforeEach(() => {
    insert.mockReset().mockResolvedValue({ error: null })
  })

  it('requires a title', async () => {
    render(<SectionForm tutorId="tut-1" onCreated={vi.fn()} />)
    await userEvent.click(screen.getByRole('button', { name: 'Submit for approval' }))

    expect(await screen.findByText('A title is required.')).toBeInTheDocument()
    expect(insert).not.toHaveBeenCalled()
  })

  it('rejects a negative capacity', async () => {
    render(<SectionForm tutorId="tut-1" onCreated={vi.fn()} />)
    await userEvent.type(screen.getByLabelText(/Title/), 'My Class')

    const cap = screen.getByLabelText(/Capacity/)
    await userEvent.clear(cap)
    await userEvent.type(cap, '-3')
    await userEvent.click(screen.getByRole('button', { name: 'Submit for approval' }))

    expect(
      await screen.findByText('Capacity must be a non-negative number.'),
    ).toBeInTheDocument()
    expect(insert).not.toHaveBeenCalled()
  })

  it('rejects a non-numeric capacity', async () => {
    render(<SectionForm tutorId="tut-1" onCreated={vi.fn()} />)
    await userEvent.type(screen.getByLabelText(/Title/), 'My Class')

    const cap = screen.getByLabelText(/Capacity/)
    await userEvent.clear(cap) // empty -> parseInt NaN
    await userEvent.click(screen.getByRole('button', { name: 'Submit for approval' }))

    expect(
      await screen.findByText('Capacity must be a non-negative number.'),
    ).toBeInTheDocument()
    expect(insert).not.toHaveBeenCalled()
  })

  it('inserts a pending_approval section with trimmed values and empty roster', async () => {
    const onCreated = vi.fn()
    render(<SectionForm tutorId="tut-1" onCreated={onCreated} />)

    await userEvent.type(screen.getByLabelText(/Title/), '  Algebra I  ')
    await userEvent.type(screen.getByLabelText(/Subject/), 'Math')
    await userEvent.clear(screen.getByLabelText(/Capacity/))
    await userEvent.type(screen.getByLabelText(/Capacity/), '12')
    await userEvent.click(screen.getByRole('button', { name: 'Submit for approval' }))

    await waitFor(() => expect(insert).toHaveBeenCalledTimes(1))
    expect(insert).toHaveBeenCalledWith({
      tutor_id: 'tut-1',
      title: 'Algebra I',
      subject: 'Math',
      description: null,
      grade_range: null,
      capacity: 12,
      location: null,
      status: 'pending_approval',
      student_ids: [],
    })
    await waitFor(() => expect(onCreated).toHaveBeenCalled())
  })

  it('surfaces an insert error', async () => {
    insert.mockResolvedValue({ error: { message: 'RLS denied' } })
    render(<SectionForm tutorId="tut-1" onCreated={vi.fn()} />)

    await userEvent.type(screen.getByLabelText(/Title/), 'My Class')
    await userEvent.click(screen.getByRole('button', { name: 'Submit for approval' }))

    expect(await screen.findByRole('alert')).toHaveTextContent('RLS denied')
  })
})
