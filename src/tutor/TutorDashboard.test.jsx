import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import TutorDashboard from './TutorDashboard'

// --- auth mock ---------------------------------------------------------------
let authValue
vi.mock('../lib/auth', () => ({
  useAuth: () => authValue,
}))

// --- supabase mock -----------------------------------------------------------
// TutorDashboard:  from('sections').select().eq().order() -> tutor's sections
// SectionForm:     from('sections').insert()
// SectionRoster:   from('students'/'parents').select().in()
let tableData
const insert = vi.fn()

function makeFrom() {
  return vi.fn((table) => {
    const result = { data: tableData[table] ?? [], error: null }
    const chain = {
      select: vi.fn(() => chain),
      eq: vi.fn(() => chain),
      order: vi.fn(() => Promise.resolve(result)),
      in: vi.fn(() => Promise.resolve(result)),
      insert: (...args) => insert(...args),
    }
    return chain
  })
}

let from
// SectionRoster calls supabase.rpc('section_roster', ...); return an empty
// roster so the dashboard renders without error.
const rpc = vi.fn(() => Promise.resolve({ data: [], error: null }))
vi.mock('../lib/supabase', () => ({
  get supabase() {
    return { from, rpc }
  },
}))

function renderDash() {
  return render(<TutorDashboard />)
}

describe('TutorDashboard', () => {
  beforeEach(() => {
    from = makeFrom()
    insert.mockReset().mockResolvedValue({ error: null })
    authValue = { user: { id: 'tut-1' }, profile: { status: 'active' } }
    tableData = { sections: [], students: [], parents: [] }
  })

  it('shows the empty state when the tutor has no sections', async () => {
    renderDash()
    expect(
      await screen.findByText("You haven't posted any sessions yet."),
    ).toBeInTheDocument()
  })

  it('warns when the tutor account is not yet approved', async () => {
    authValue = { user: { id: 'tut-1' }, profile: { status: 'pending' } }
    renderDash()
    expect(await screen.findByText(/pending admin approval/)).toBeInTheDocument()
  })

  it('does not show the pending warning for an active tutor', async () => {
    renderDash()
    await screen.findByText("You haven't posted any sessions yet.")
    expect(screen.queryByText(/pending admin approval/)).not.toBeInTheDocument()
  })

  it('lists the tutor sections with status, capacity and enrolled count', async () => {
    tableData.sections = [
      {
        id: 'sec-1',
        title: 'Algebra I',
        subject: 'Math',
        status: 'published',
        capacity: 10,
        student_ids: ['a', 'b'],
      },
    ]
    renderDash()

    expect(await screen.findByText('Algebra I')).toBeInTheDocument()
    expect(screen.getByText('Published')).toBeInTheDocument()
    expect(screen.getByText('Capacity 10 · 2 enrolled')).toBeInTheDocument()
  })

  it('toggles the new-session form open and closed', async () => {
    renderDash()
    await screen.findByText("You haven't posted any sessions yet.")

    // the toggle button text matches the form heading, so target the heading.
    expect(
      screen.queryByRole('heading', { name: 'Post a new session' }),
    ).not.toBeInTheDocument()
    await userEvent.click(screen.getByRole('button', { name: 'Post a new session' }))
    expect(
      await screen.findByRole('heading', { name: 'Post a new session' }),
    ).toBeInTheDocument()
    // the Title field only exists when the form is open
    expect(screen.getByLabelText(/Title/)).toBeInTheDocument()

    await userEvent.click(screen.getByRole('button', { name: 'Close' }))
    await waitFor(() =>
      expect(
        screen.queryByRole('heading', { name: 'Post a new session' }),
      ).not.toBeInTheDocument(),
    )
  })

  it('shows an error when loading sections fails', async () => {
    from = vi.fn(() => ({
      select: vi.fn(function () {
        return this
      }),
      eq: vi.fn(function () {
        return this
      }),
      order: vi.fn(() => Promise.resolve({ data: null, error: { message: 'load failed' } })),
    }))
    renderDash()
    expect(await screen.findByRole('alert')).toHaveTextContent('load failed')
  })
})
