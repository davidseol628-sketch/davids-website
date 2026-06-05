import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import SignupChoice from './SignupChoice'

function renderChoice() {
  return render(
    <MemoryRouter>
      <SignupChoice />
    </MemoryRouter>,
  )
}

describe('SignupChoice', () => {
  it('renders the heading and prompt', () => {
    renderChoice()
    expect(
      screen.getByRole('heading', { name: /create an account/i }),
    ).toBeInTheDocument()
    expect(screen.getByText(/who are you signing up as/i)).toBeInTheDocument()
  })

  it('links to the parent and tutor signup routes', () => {
    renderChoice()

    const parentLink = screen.getByRole('link', { name: /i'm a parent/i })
    const tutorLink = screen.getByRole('link', { name: /i'm a tutor/i })

    expect(parentLink).toHaveAttribute('href', '/parent')
    expect(tutorLink).toHaveAttribute('href', '/tutor')
  })

  it('offers a login link for existing accounts', () => {
    renderChoice()
    expect(screen.getByRole('link', { name: /log in/i })).toHaveAttribute(
      'href',
      '/login',
    )
  })
})
