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
  supabase: { auth: { signInWithPassword: vi.fn() } },
}))

const refreshProfileMock = vi.fn()
// Logged-out by default so the login form renders (guards don't redirect).
vi.mock('../lib/auth', () => ({
  useAuth: () => ({
    user: null,
    role: null,
    loading: false,
    refreshProfile: refreshProfileMock,
  }),
}))

import { supabase } from '../lib/supabase'
import Login from './Login'

// --- Helpers ----------------------------------------------------------------

function renderLogin(initialEntry = '/login') {
  return render(
    <MemoryRouter initialEntries={[initialEntry]}>
      <Login />
    </MemoryRouter>,
  )
}

async function submitLogin(user) {
  await user.type(screen.getByLabelText(/email/i), 'someone@example.com')
  await user.type(screen.getByLabelText(/password/i), 'secret123')
  await user.click(screen.getByRole('button', { name: /log in/i }))
}

beforeEach(() => {
  vi.clearAllMocks()
  supabase.auth.signInWithPassword.mockResolvedValue({ error: null })
})

// --- Tests ------------------------------------------------------------------

describe('Login redirect on success', () => {
  it('routes to the role home after a successful login', async () => {
    refreshProfileMock.mockResolvedValue({ role: 'parent' })
    const user = userEvent.setup()
    renderLogin()

    await submitLogin(user)

    await waitFor(() =>
      expect(navigateMock).toHaveBeenCalledWith('/dashboard', { replace: true }),
    )
  })

  it('still reroutes (to home) when no role resolves, instead of stranding on /login', async () => {
    refreshProfileMock.mockResolvedValue({ role: null })
    const user = userEvent.setup()
    renderLogin()

    await submitLogin(user)

    await waitFor(() =>
      expect(navigateMock).toHaveBeenCalledWith('/', { replace: true }),
    )
  })

  it('ignores a `from` the role cannot reach and uses the role home', async () => {
    refreshProfileMock.mockResolvedValue({ role: 'parent' })
    const user = userEvent.setup()
    // Arrived at /login after being bounced from /admin (an admin-only area).
    renderLogin({ pathname: '/login', state: { from: { pathname: '/admin' } } })

    await submitLogin(user)

    await waitFor(() =>
      expect(navigateMock).toHaveBeenCalledWith('/dashboard', { replace: true }),
    )
  })

  it('honors a `from` the role can reach', async () => {
    refreshProfileMock.mockResolvedValue({ role: 'parent' })
    const user = userEvent.setup()
    renderLogin({ pathname: '/login', state: { from: { pathname: '/catalog' } } })

    await submitLogin(user)

    await waitFor(() =>
      expect(navigateMock).toHaveBeenCalledWith('/catalog', { replace: true }),
    )
  })

  it('does not navigate when sign-in fails', async () => {
    supabase.auth.signInWithPassword.mockResolvedValue({
      error: { message: 'Invalid login credentials' },
    })
    const user = userEvent.setup()
    renderLogin()

    await submitLogin(user)

    expect(await screen.findByRole('alert')).toHaveTextContent(/invalid login/i)
    expect(navigateMock).not.toHaveBeenCalled()
  })
})
