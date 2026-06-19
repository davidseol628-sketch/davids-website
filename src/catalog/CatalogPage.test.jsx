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
  it('renders the Open House catalog item with description and seats left', () => {
    renderPage()

    expect(screen.getByText('OPEN HOUSE- June 27th')).toBeInTheDocument()
    expect(screen.getByText('11:00am - 3:00pm · Free Snacks Provided!')).toBeInTheDocument()
    expect(screen.getByText('20 seats left')).toBeInTheDocument()
  })

  it('renders an external Open House registration link and no internal register button', () => {
    renderPage()

    expect(screen.getByRole('link', { name: /Click here to register for the Open House/i })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /Register for Open House/i })).not.toBeInTheDocument()
  })

  it('does not render any other section titles', () => {
    renderPage()

    expect(screen.queryByText('Geometry Lab')).not.toBeInTheDocument()
    expect(screen.queryByText('Environmental Science')).not.toBeInTheDocument()
    expect(screen.queryByText('Introduction to Artificial Intelligence')).not.toBeInTheDocument()
  })
})
