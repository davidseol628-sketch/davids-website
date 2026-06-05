import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'

// --- Mocks ------------------------------------------------------------------

const navigateMock = vi.fn()
vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal()
  return { ...actual, useNavigate: () => navigateMock }
})

vi.mock('../lib/supabase', () => ({
  supabase: {
    auth: { signUp: vi.fn(), signInWithPassword: vi.fn() },
    from: vi.fn(),
  },
}))

const refreshProfileMock = vi.fn().mockResolvedValue(undefined)
vi.mock('../lib/auth', () => ({
  useAuth: () => ({ refreshProfile: refreshProfileMock }),
}))

import { supabase } from '../lib/supabase'
import TutorSignupForm from './TutorSignupForm'

// --- Helpers ----------------------------------------------------------------

function renderForm() {
  return render(
    <MemoryRouter>
      <TutorSignupForm />
    </MemoryRouter>,
  )
}

async function fillForm(
  user,
  { email = 'tutor@example.com', password = 'secret123', subjects = 'Math, Physics' } = {},
) {
  await user.type(screen.getByLabelText(/full name/i), 'Tom Tutor')
  await user.type(screen.getByLabelText(/email/i), email)
  await user.type(screen.getByLabelText(/password/i), password)
  if (subjects) await user.type(screen.getByLabelText(/subjects/i), subjects)
}

function mockInsertReturning(result) {
  const insert = vi.fn().mockResolvedValue(result)
  supabase.from.mockReturnValue({ insert })
  return insert
}

beforeEach(() => {
  vi.clearAllMocks()
})

// --- Tests ------------------------------------------------------------------

describe('TutorSignupForm', () => {
  it('renders all fields and the submit button', () => {
    renderForm()
    expect(
      screen.getByRole('heading', { name: /tutor sign up/i }),
    ).toBeInTheDocument()
    expect(screen.getByLabelText(/full name/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/subjects/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/qualifications/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/short bio/i)).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /create account/i }),
    ).toBeInTheDocument()
  })

  it('rejects a too-short password without calling Supabase', async () => {
    const user = userEvent.setup()
    renderForm()
    await fillForm(user, { password: '12' })
    await user.click(screen.getByRole('button', { name: /create account/i }))

    expect(
      await screen.findByText(/password must be at least 6 characters/i),
    ).toBeInTheDocument()
    expect(supabase.auth.signUp).not.toHaveBeenCalled()
  })

  it('surfaces a Supabase signUp error', async () => {
    const user = userEvent.setup()
    supabase.auth.signUp.mockResolvedValue({
      data: null,
      error: { message: 'Signup is disabled' },
    })
    renderForm()
    await fillForm(user)
    await user.click(screen.getByRole('button', { name: /create account/i }))

    expect(await screen.findByText(/signup is disabled/i)).toBeInTheDocument()
    expect(supabase.from).not.toHaveBeenCalled()
    expect(navigateMock).not.toHaveBeenCalled()
  })

  it('inserts a pending tutor with parsed subjects and navigates to /tutor', async () => {
    const user = userEvent.setup()
    supabase.auth.signUp.mockResolvedValue({
      data: { user: { id: 'tid-1' }, session: { access_token: 'tok' } },
      error: null,
    })
    const insert = mockInsertReturning({ error: null })

    renderForm()
    await fillForm(user, { subjects: 'Math, Physics ,,Chemistry' })
    await user.click(screen.getByRole('button', { name: /create account/i }))

    await waitFor(() =>
      expect(navigateMock).toHaveBeenCalledWith('/tutor', { replace: true }),
    )
    expect(supabase.from).toHaveBeenCalledWith('tutors')
    expect(insert).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 'tid-1',
        email: 'tutor@example.com',
        full_name: 'Tom Tutor',
        status: 'pending_approval',
        subjects: ['Math', 'Physics', 'Chemistry'],
      }),
    )
    expect(refreshProfileMock).toHaveBeenCalled()
  })

  it('sends an empty subjects array when the field is blank', async () => {
    const user = userEvent.setup()
    supabase.auth.signUp.mockResolvedValue({
      data: { user: { id: 'tid-2' }, session: { access_token: 'tok' } },
      error: null,
    })
    const insert = mockInsertReturning({ error: null })

    renderForm()
    await fillForm(user, { subjects: '' })
    await user.click(screen.getByRole('button', { name: /create account/i }))

    await waitFor(() => expect(insert).toHaveBeenCalled())
    expect(insert.mock.calls[0][0].subjects).toEqual([])
  })

  it('falls back to password sign-in when signUp returns no session', async () => {
    const user = userEvent.setup()
    supabase.auth.signUp.mockResolvedValue({
      data: { user: { id: 'tid-3' }, session: null },
      error: null,
    })
    supabase.auth.signInWithPassword.mockResolvedValue({
      data: { user: { id: 'tid-3' } },
      error: null,
    })
    mockInsertReturning({ error: null })

    renderForm()
    await fillForm(user)
    await user.click(screen.getByRole('button', { name: /create account/i }))

    await waitFor(() =>
      expect(navigateMock).toHaveBeenCalledWith('/tutor', { replace: true }),
    )
    expect(supabase.auth.signInWithPassword).toHaveBeenCalledWith({
      email: 'tutor@example.com',
      password: 'secret123',
    })
  })

  it('ignores a duplicate-row insert error and still navigates', async () => {
    const user = userEvent.setup()
    supabase.auth.signUp.mockResolvedValue({
      data: { user: { id: 'tid-4' }, session: { access_token: 'tok' } },
      error: null,
    })
    mockInsertReturning({ error: { code: '23505', message: 'duplicate key' } })

    renderForm()
    await fillForm(user)
    await user.click(screen.getByRole('button', { name: /create account/i }))

    await waitFor(() =>
      expect(navigateMock).toHaveBeenCalledWith('/tutor', { replace: true }),
    )
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })

  it('surfaces a non-duplicate insert error and does not navigate', async () => {
    const user = userEvent.setup()
    supabase.auth.signUp.mockResolvedValue({
      data: { user: { id: 'tid-5' }, session: { access_token: 'tok' } },
      error: null,
    })
    mockInsertReturning({
      error: { code: '42501', message: 'permission denied' },
    })

    renderForm()
    await fillForm(user)
    await user.click(screen.getByRole('button', { name: /create account/i }))

    expect(await screen.findByText(/permission denied/i)).toBeInTheDocument()
    expect(navigateMock).not.toHaveBeenCalled()
  })
})
