import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import CatalogPage from './CatalogPage'

function renderPage() {
  return render(
    <MemoryRouter>
      <CatalogPage />
    </MemoryRouter>,
  )
}

describe('CatalogPage', () => {
  it('renders the Open House catalog item with updated time details', () => {
    renderPage()

    expect(screen.getByText('OPEN HOUSE- June 27th')).toBeInTheDocument()
    expect(screen.getByText('11:00am - 4:00pm • 12 people attending')).toBeInTheDocument()
    expect(screen.queryByText('20 seats left')).not.toBeInTheDocument()
    expect(screen.queryByText(/Free Snacks Provided!/i)).not.toBeInTheDocument()
  })

  it('renders an external Open House registration link and no internal register button', () => {
    renderPage()

    expect(screen.getByRole('link', { name: /Click here to register for the Open House/i })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /Register for Open House/i })).not.toBeInTheDocument()
  })

  it('renders a disabled View details button', () => {
    renderPage()

    const button = screen.getByRole('button', { name: /View details/i })
    expect(button).toBeDisabled()
  })

  it('does not render any other section titles', () => {
    renderPage()

    expect(screen.queryByText('Geometry Lab')).not.toBeInTheDocument()
    expect(screen.queryByText('Environmental Science')).not.toBeInTheDocument()
    expect(screen.queryByText('Introduction to Artificial Intelligence')).not.toBeInTheDocument()
  })
})
