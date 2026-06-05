import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'

const insertMock = vi.fn(() => Promise.resolve({ error: null }))
const fromMock = vi.fn(() => ({ insert: insertMock }))
vi.mock('../lib/supabase', () => ({
  supabase: { from: (...args) => fromMock(...args) },
}))
vi.mock('../lib/auth', () => ({
  useAuth: () => ({ user: { id: 'parent-3' }, loading: false }),
}))

import ParentAssessmentForm from './ParentAssessmentForm'
import { PARENT_ASSESSMENT_QUESTIONS } from './surveyConfigs'

function renderForm() {
  return render(
    <MemoryRouter>
      <ParentAssessmentForm />
    </MemoryRouter>,
  )
}

const requiredRatings = PARENT_ASSESSMENT_QUESTIONS.filter(
  (q) => q.required && q.type === 'rating',
)
const optionalComment = PARENT_ASSESSMENT_QUESTIONS.find((q) => !q.required)

beforeEach(() => {
  insertMock.mockReset()
  insertMock.mockResolvedValue({ error: null })
  fromMock.mockReset()
  fromMock.mockImplementation(() => ({ insert: insertMock }))
})

describe('ParentAssessmentForm', () => {
  it('renders the title and every configured question', () => {
    renderForm()
    expect(
      screen.getByRole('heading', { name: 'Parent Assessment' }),
    ).toBeInTheDocument()
    for (const q of PARENT_ASSESSMENT_QUESTIONS) {
      expect(screen.getByText(q.label, { exact: false })).toBeInTheDocument()
    }
  })

  it('rejects empty required ratings and blocks the insert', async () => {
    const user = userEvent.setup()
    renderForm()
    await user.click(screen.getByRole('button', { name: /submit/i }))
    const alerts = await screen.findAllByText('This question is required.')
    expect(alerts).toHaveLength(requiredRatings.length)
    expect(insertMock).not.toHaveBeenCalled()
  })

  it('submits with only required ratings, omitting the optional comment', async () => {
    const user = userEvent.setup()
    renderForm()
    for (const q of requiredRatings) {
      const group = screen.getByRole('radiogroup', { name: q.name })
      await user.click(within(group).getByRole('radio', { name: '2' }))
    }
    await user.click(screen.getByRole('button', { name: /submit/i }))

    await screen.findByRole('heading', { name: 'Thank you!' })
    expect(fromMock).toHaveBeenCalledWith('parent_assessments')
    const payload = insertMock.mock.calls[0][0]
    expect(payload.submitted_by).toBe('parent-3')
    // Optional, untouched field is not present in the responses payload.
    expect(payload.responses).not.toHaveProperty(optionalComment.name)
  })
})
