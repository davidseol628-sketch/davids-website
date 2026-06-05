import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import SectionDetail from './SectionDetail'

// --- router mock: keep MemoryRouter, but stub useNavigate ---------------------
const navigate = vi.fn()
vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal()
  return { ...actual, useNavigate: () => navigate }
})

// --- auth mock ---------------------------------------------------------------
let authValue
vi.mock('../lib/auth', () => ({
  useAuth: () => authValue,
}))

// --- supabase mock -----------------------------------------------------------
// Per-table query results, set by each test.
let tableData // { sections, tutors, students }
const rpc = vi.fn()

function makeFrom() {
  return vi.fn((table) => {
    // build a chainable object whose terminal awaited value depends on method.
    const chain = {
      _table: table,
      select: vi.fn(() => chain),
      eq: vi.fn(() => chain),
      order: vi.fn(() => Promise.resolve({ data: tableData[table] ?? [], error: null })),
      maybeSingle: vi.fn(() =>
        Promise.resolve({ data: tableData[table] ?? null, error: null }),
      ),
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

function renderDetail() {
  return render(
    <MemoryRouter initialEntries={['/sections/sec-1']}>
      <Routes>
        <Route path="/sections/:id" element={<SectionDetail />} />
      </Routes>
    </MemoryRouter>,
  )
}

describe('SectionDetail', () => {
  beforeEach(() => {
    from = makeFrom()
    rpc.mockReset()
    navigate.mockReset()
    authValue = { user: null, role: null }
    tableData = {
      sections: {
        id: 'sec-1',
        title: 'Algebra I',
        subject: 'Math',
        description: 'Intro algebra',
        grade_range: '6-8',
        tutor_id: 'tut-1',
        location: 'Room 5',
        capacity: 10,
        student_ids: ['x'],
      },
      tutors: { full_name: 'Ms. Tutor' },
      students: [],
    }
  })

  it('renders section details once loaded', async () => {
    renderDetail()
    expect(await screen.findByRole('heading', { name: 'Algebra I' })).toBeInTheDocument()
    expect(screen.getByText('Intro algebra')).toBeInTheDocument()
    expect(screen.getByText('Tutor: Ms. Tutor')).toBeInTheDocument()
    expect(screen.getByText('Location: Room 5')).toBeInTheDocument()
    // 10 capacity - 1 enrolled = 9 seats left
    expect(screen.getByText('9 seats left')).toBeInTheDocument()
  })

  it('shows "Section not found" when the section is missing', async () => {
    tableData.sections = null
    renderDetail()
    expect(await screen.findByRole('heading', { name: 'Section not found' })).toBeInTheDocument()
  })

  it('redirects a logged-out visitor to signup on enroll', async () => {
    authValue = { user: null, role: null }
    renderDetail()
    await screen.findByRole('heading', { name: 'Algebra I' })

    await userEvent.click(screen.getByRole('button', { name: 'Enroll' }))
    expect(navigate).toHaveBeenCalledWith('/signup', {
      state: { from: { pathname: '/sections/sec-1' } },
    })
  })

  it('blocks non-parent roles from enrolling', async () => {
    authValue = { user: { id: 'u1' }, role: 'tutor' }
    renderDetail()
    await screen.findByRole('heading', { name: 'Algebra I' })

    await userEvent.click(screen.getByRole('button', { name: 'Enroll' }))
    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Only parent accounts can enroll children.',
    )
    expect(rpc).not.toHaveBeenCalled()
  })

  it('prompts to add a child when the parent has none', async () => {
    authValue = { user: { id: 'p1' }, role: 'parent' }
    tableData.students = []
    renderDetail()
    await screen.findByRole('heading', { name: 'Algebra I' })

    await userEvent.click(screen.getByRole('button', { name: 'Enroll' }))
    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Add a child to your account first.',
    )
    expect(rpc).not.toHaveBeenCalled()
  })

  it('enrolls the only child and shows the success notice', async () => {
    authValue = { user: { id: 'p1' }, role: 'parent' }
    tableData.students = [{ id: 'child-1', full_name: 'Kid One' }]
    rpc.mockResolvedValue({ error: null })
    renderDetail()
    await screen.findByRole('heading', { name: 'Algebra I' })

    await userEvent.click(screen.getByRole('button', { name: 'Enroll' }))

    await waitFor(() =>
      expect(rpc).toHaveBeenCalledWith('enroll_student', {
        section_id: 'sec-1',
        student_id: 'child-1',
      }),
    )
    expect(
      await screen.findByText('Enrolled! You can see it under My sessions.'),
    ).toBeInTheDocument()
  })

  it('requires picking a child when there are several', async () => {
    authValue = { user: { id: 'p1' }, role: 'parent' }
    tableData.students = [
      { id: 'child-1', full_name: 'Kid One' },
      { id: 'child-2', full_name: 'Kid Two' },
    ]
    renderDetail()
    await screen.findByRole('heading', { name: 'Algebra I' })

    // dropdown is rendered, nothing pre-selected -> enroll should complain
    expect(screen.getByLabelText('Enroll which child?')).toBeInTheDocument()
    await userEvent.click(screen.getByRole('button', { name: 'Enroll' }))
    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Please pick a child to enroll.',
    )
  })

  it('shows the friendly "already enrolled" message on that RPC error', async () => {
    authValue = { user: { id: 'p1' }, role: 'parent' }
    tableData.students = [{ id: 'child-1', full_name: 'Kid One' }]
    rpc.mockResolvedValue({ error: { message: 'already_enrolled' } })
    renderDetail()
    await screen.findByRole('heading', { name: 'Algebra I' })

    await userEvent.click(screen.getByRole('button', { name: 'Enroll' }))
    expect(await screen.findByRole('alert')).toHaveTextContent(
      'This child is already enrolled in that section.',
    )
  })

  it('shows the friendly "full" message on that RPC error', async () => {
    authValue = { user: { id: 'p1' }, role: 'parent' }
    tableData.students = [{ id: 'child-1', full_name: 'Kid One' }]
    rpc.mockResolvedValue({ error: { message: 'full' } })
    renderDetail()
    await screen.findByRole('heading', { name: 'Algebra I' })

    await userEvent.click(screen.getByRole('button', { name: 'Enroll' }))
    expect(await screen.findByRole('alert')).toHaveTextContent('That section is full.')
  })

  it('disables enroll and labels the button when the section is full', async () => {
    tableData.sections = { ...tableData.sections, capacity: 1, student_ids: ['x'] }
    renderDetail()
    await screen.findByRole('heading', { name: 'Algebra I' })

    const btn = screen.getByRole('button', { name: 'Section full' })
    expect(btn).toBeDisabled()
  })
})
