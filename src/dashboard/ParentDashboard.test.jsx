import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import ParentDashboard from './ParentDashboard'

// --- auth mock ---------------------------------------------------------------
let authValue
vi.mock('../lib/auth', () => ({
  useAuth: () => authValue,
}))

// --- supabase mock -----------------------------------------------------------
// students:  from('students').select().eq().order()  -> resolves
// sections:  from('sections').select().overlaps()     -> resolves
// tutors:    from('tutors').select().in()             -> resolves
// insert:    from('students').insert()                -> resolves
let tableData
const insert = vi.fn()
const rpc = vi.fn()

function makeFrom() {
  return vi.fn((table) => {
    const result = { data: tableData[table] ?? [], error: null }
    const chain = {
      select: vi.fn(() => chain),
      eq: vi.fn(() => chain),
      in: vi.fn(() => Promise.resolve(result)),
      overlaps: vi.fn(() => Promise.resolve(result)),
      order: vi.fn(() => Promise.resolve(result)),
      insert: (...args) => insert(...args),
    }
    return chain
  })
}

let from
vi.mock('../lib/supabase', () => ({
  get supabase() {
    return { from, rpc }
  },
}))

function renderDash() {
  return render(
    <MemoryRouter>
      <ParentDashboard />
    </MemoryRouter>,
  )
}

describe('ParentDashboard', () => {
  beforeEach(() => {
    from = makeFrom()
    insert.mockReset().mockResolvedValue({ error: null })
    rpc.mockReset()
    authValue = { user: { id: 'parent-1' } }
    tableData = { students: [], sections: [], tutors: [] }
  })

  it('shows the empty state when the parent has no children', async () => {
    renderDash()
    expect(
      await screen.findByText('Add a child to your account to start enrolling in classes.'),
    ).toBeInTheDocument()
  })

  it('lists children and their enrolled sessions with tutor names', async () => {
    tableData.students = [
      { id: 'kid-1', full_name: 'Kid One', grade: '7', school: 'Lincoln' },
    ]
    tableData.sections = [
      { id: 'sec-1', title: 'Algebra I', subject: 'Math', tutor_id: 'tut-1', student_ids: ['kid-1'] },
    ]
    tableData.tutors = [{ id: 'tut-1', full_name: 'Ms. Tutor' }]
    renderDash()

    expect(await screen.findByText('Kid One')).toBeInTheDocument()
    expect(screen.getByText('Grade 7 · Lincoln')).toBeInTheDocument()
    expect(screen.getByText('Algebra I')).toBeInTheDocument()
    expect(screen.getByText('Ms. Tutor')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Drop' })).toBeInTheDocument()
  })

  it('shows "not enrolled" for a child with no sessions', async () => {
    tableData.students = [{ id: 'kid-1', full_name: 'Kid One' }]
    tableData.sections = []
    renderDash()

    await screen.findByText('Kid One')
    expect(screen.getByText(/Not enrolled in any sessions yet/)).toBeInTheDocument()
  })

  it('drops a session via the RPC and shows the success notice', async () => {
    tableData.students = [{ id: 'kid-1', full_name: 'Kid One' }]
    tableData.sections = [
      { id: 'sec-1', title: 'Algebra I', subject: 'Math', tutor_id: 'tut-1', student_ids: ['kid-1'] },
    ]
    tableData.tutors = [{ id: 'tut-1', full_name: 'Ms. Tutor' }]
    rpc.mockResolvedValue({ error: null })
    renderDash()

    await screen.findByText('Algebra I')
    await userEvent.click(screen.getByRole('button', { name: 'Drop' }))

    // Confirm in the dialog — the RPC fires only after confirmation.
    const dialog = await screen.findByRole('dialog')
    expect(rpc).not.toHaveBeenCalled()
    await userEvent.click(within(dialog).getByRole('button', { name: 'Drop' }))

    await waitFor(() =>
      expect(rpc).toHaveBeenCalledWith('drop_student', {
        section_id: 'sec-1',
        student_id: 'kid-1',
      }),
    )
    expect(await screen.findByText('Dropped. The seat is now free.')).toBeInTheDocument()
  })

  it('shows the fallback error message when drop RPC fails with an unknown code', async () => {
    tableData.students = [{ id: 'kid-1', full_name: 'Kid One' }]
    tableData.sections = [
      { id: 'sec-1', title: 'Algebra I', subject: 'Math', tutor_id: 'tut-1', student_ids: ['kid-1'] },
    ]
    rpc.mockResolvedValue({ error: { message: 'weird-db-thing' } })
    renderDash()

    await screen.findByText('Algebra I')
    await userEvent.click(screen.getByRole('button', { name: 'Drop' }))
    const dialog = await screen.findByRole('dialog')
    await userEvent.click(within(dialog).getByRole('button', { name: 'Drop' }))

    // rpcErrorMessage returns the raw message when no known code matches
    expect(await screen.findByRole('alert')).toHaveTextContent('weird-db-thing')
  })

  it('add-child form validates a required name', async () => {
    renderDash()
    await screen.findByText('Add a child')

    await userEvent.click(screen.getByRole('button', { name: 'Add child' }))
    expect(await screen.findByText('A name is required.')).toBeInTheDocument()
    expect(insert).not.toHaveBeenCalled()
  })

  it('add-child form inserts a trimmed student row', async () => {
    renderDash()
    await screen.findByText('Add a child')

    const form = screen.getByText('Add a child').closest('section')
    await userEvent.type(within(form).getByLabelText(/Child's full name/), '  New Kid  ')
    await userEvent.type(within(form).getByLabelText('Grade'), '4')
    await userEvent.click(screen.getByRole('button', { name: 'Add child' }))

    await waitFor(() => expect(insert).toHaveBeenCalledTimes(1))
    expect(insert).toHaveBeenCalledWith(
      expect.objectContaining({
        parent_id: 'parent-1',
        full_name: 'New Kid',
        grade: '4',
        school: null,
      }),
    )
  })
})
