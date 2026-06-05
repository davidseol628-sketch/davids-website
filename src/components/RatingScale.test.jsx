import { useState } from 'react'
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import RatingScale from './RatingScale'

function Harness() {
  const [value, setValue] = useState(null)
  return (
    <>
      <RatingScale name="rating" value={value} onChange={setValue} />
      <output data-testid="value">{value ?? 'none'}</output>
    </>
  )
}

describe('RatingScale', () => {
  it('renders options 1 through 5', () => {
    render(<RatingScale name="rating" value={null} onChange={() => {}} />)
    for (let n = 1; n <= 5; n++) {
      expect(screen.getByRole('radio', { name: String(n) })).toBeInTheDocument()
    }
    expect(screen.getAllByRole('radio')).toHaveLength(5)
  })

  it('reports the selected value when a rating is clicked', async () => {
    const user = userEvent.setup()
    render(<Harness />)

    expect(screen.getByTestId('value')).toHaveTextContent('none')

    await user.click(screen.getByRole('radio', { name: '4' }))

    expect(screen.getByTestId('value')).toHaveTextContent('4')
    expect(screen.getByRole('radio', { name: '4' })).toBeChecked()
  })
})
