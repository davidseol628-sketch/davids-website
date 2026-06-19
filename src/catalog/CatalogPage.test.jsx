import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'

vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal()
  const navigateMock = vi.fn()
  return {
    ...actual,
    useNavigate: () => navigateMock,
    __navigateMock: navigateMock,
  }
})

vi.mock('../lib/supabase', () => {
  const fromMock = vi.fn()
  const rpcMock = vi.fn()
  return {
    supabase: { from: fromMock, rpc: rpcMock },
    __fromMock: fromMock,
    __rpcMock: rpcMock,
  }
})

vi.mock('../lib/auth', () => {
  const authState = { user: null, role: null }
  return {
    useAuth: () => authState,
    __authState: authState,
  }
})

import { __fromMock as fromMock, __rpcMock as rpcMock } from '../lib/supabase'
import { __navigateMock as navigateMock } from 'react-router-dom'
import { __authState as authValue } from '../lib/auth'
import CatalogPage from './CatalogPage'

function renderPage() {
  return render(
    <MemoryRouter>
      <CatalogPage />
    </MemoryRouter>,
  )
}

beforeEach(() => {
  vi.clearAllMocks()
  fromMock.mockReset()
  rpcMock.mockReset()
  navigateMock.mockReset()
  authValue.user = null
  authValue.role = null
})

describe('CatalogPage', () => {
  it('renders the Open House catalog item with description and seats left', () => {
    renderPage()

    expect(screen.getByText('OPEN HOUSE- June 27th')).toBeInTheDocument()
    expect(screen.getByText('11:00am - 3:00pm · Free Snacks Provided!')).toBeInTheDocument()
    expect(screen.getByText('20 seats left')).toBeInTheDocument()
  })

  it('renders a register button for Open House', () => {
    renderPage()

    expect(screen.queryByRole('link', { name: /View & enroll/i })).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Register for Open House/i })).toBeInTheDocument()
  })

  it('prompts a signed-out user to sign up when registering for Open House', async () => {
    renderPage()

    await userEvent.click(screen.getByRole('button', { name: /Register for Open House/i }))
    expect(navigateMock).toHaveBeenCalledWith('/signup', {
      state: { from: { pathname: '/catalog' } },
    })
  })

  it('shows a notice after successful Open House registration for parents', async () => {
    Object.assign(authValue, { user: { id: 'p1' }, role: 'parent' })
    fromMock.mockImplementation(() => ({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      order: vi.fn().mockResolvedValue({
        data: [{ id: 'child-1', full_name: 'Kid One' }],
        error: null,
      }),
    }))
    rpcMock.mockResolvedValue({ error: null })

    renderPage()
    await waitFor(() => expect(fromMock).toHaveBeenCalled())

    await userEvent.click(screen.getByRole('button', { name: /Register for Open House/i }))
    await waitFor(() =>
      expect(screen.getByText('Registered for Open House! You can see it under My sessions.')).toBeInTheDocument(),
    )
  })

  it('does not render any other section titles', () => {
    renderPage()

    expect(screen.queryByText('Geometry Lab')).not.toBeInTheDocument()
    expect(screen.queryByText('Environmental Science')).not.toBeInTheDocument()
    expect(screen.queryByText('Introduction to Artificial Intelligence')).not.toBeInTheDocument()
  })
})
