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
import ParentSignupForm from './ParentSignupForm'

// --- Helpers ----------------------------------------------------------------

function renderForm() {
  return render(
    <MemoryRouter>
      <ParentSignupForm />
    </MemoryRouter>,
  )
}

async function fillForm(user, { email = 'parent@example.com', password = 'secret123' } = {}) {
  await user.type(screen.getByLabelText(/full name/i), 'Jane Parent')
  await user.type(screen.getByLabelText(/email/i), email)
  await user.type(screen.getByLabelText(/password/i), password)
  await user.type(screen.getByLabelText(/phone/i), '5551234567')
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

describe('ParentSignupForm', () => {
  it('renders all fields and the submit button', () => {
    renderForm()
    expect(
      screen.getByRole('heading', { name: /parent sign up/i }),
    ).toBeInTheDocument()
    expect(screen.getByLabelText(/full name/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/phone/i)).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /create account/i }),
    ).toBeInTheDocument()
  })

  it('rejects a too-short password without calling Supabase', async () => {
    const user = userEvent.setup()
    renderForm()
    await fillForm(user, { password: '123' })
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
      error: { message: 'Email already registered' },
    })
    renderForm()
    await fillForm(user)
    await user.click(screen.getByRole('button', { name: /create account/i }))

    expect(
      await screen.findByText(/email already registered/i),
    ).toBeInTheDocument()
    expect(supabase.from).not.toHaveBeenCalled()
    expect(navigateMock).not.toHaveBeenCalled()
  })

  it('creates the parent row and navigates to the dashboard on success', async () => {
    const user = userEvent.setup()
    supabase.auth.signUp.mockResolvedValue({
      data: { user: { id: 'uid-1' }, session: { access_token: 'tok' } },
      error: null,
    })
    const insert = mockInsertReturning({ error: null })

    renderForm()
    await fillForm(user)
    await user.click(screen.getByRole('button', { name: /create account/i }))

    await waitFor(() =>
      expect(navigateMock).toHaveBeenCalledWith('/dashboard', { replace: true }),
    )
    expect(supabase.from).toHaveBeenCalledWith('parents')
    expect(insert).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 'uid-1',
        email: 'parent@example.com',
        full_name: 'Jane Parent',
        phone: '5551234567',
      }),
    )
    expect(refreshProfileMock).toHaveBeenCalled()
    // No session-only signUp -> should not need a password sign-in.
    expect(supabase.auth.signInWithPassword).not.toHaveBeenCalled()
  })

  it('falls back to password sign-in when signUp returns no session', async () => {
    const user = userEvent.setup()
    supabase.auth.signUp.mockResolvedValue({
      data: { user: { id: 'uid-2' }, session: null },
      error: null,
    })
    supabase.auth.signInWithPassword.mockResolvedValue({
      data: { user: { id: 'uid-2' } },
      error: null,
    })
    mockInsertReturning({ error: null })

    renderForm()
    await fillForm(user)
    await user.click(screen.getByRole('button', { name: /create account/i }))

    await waitFor(() =>
      expect(navigateMock).toHaveBeenCalledWith('/dashboard', { replace: true }),
    )
    expect(supabase.auth.signInWithPassword).toHaveBeenCalledWith({
      email: 'parent@example.com',
      password: 'secret123',
    })
  })

  it('shows a confirm-email message when post-signup sign-in fails', async () => {
    const user = userEvent.setup()
    supabase.auth.signUp.mockResolvedValue({
      data: { user: { id: 'uid-3' }, session: null },
      error: null,
    })
    supabase.auth.signInWithPassword.mockResolvedValue({
      data: null,
      error: { message: 'Email not confirmed' },
    })

    renderForm()
    await fillForm(user)
    await user.click(screen.getByRole('button', { name: /create account/i }))

    expect(
      await screen.findByText(/please confirm your email/i),
    ).toBeInTheDocument()
    expect(supabase.from).not.toHaveBeenCalled()
    expect(navigateMock).not.toHaveBeenCalled()
  })

  it('ignores a duplicate-row insert error and still navigates', async () => {
    const user = userEvent.setup()
    supabase.auth.signUp.mockResolvedValue({
      data: { user: { id: 'uid-4' }, session: { access_token: 'tok' } },
      error: null,
    })
    mockInsertReturning({ error: { code: '23505', message: 'duplicate key' } })

    renderForm()
    await fillForm(user)
    await user.click(screen.getByRole('button', { name: /create account/i }))

    await waitFor(() =>
      expect(navigateMock).toHaveBeenCalledWith('/dashboard', { replace: true }),
    )
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })

  it('surfaces a non-duplicate insert error and does not navigate', async () => {
    const user = userEvent.setup()
    supabase.auth.signUp.mockResolvedValue({
      data: { user: { id: 'uid-5' }, session: { access_token: 'tok' } },
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
