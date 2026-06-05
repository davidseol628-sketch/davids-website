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
  useAuth: () => ({ user: { id: 'admin-9' }, loading: false }),
}))

import TutorEvaluationForm from './TutorEvaluationForm'
import { TUTOR_EVALUATION_QUESTIONS } from './surveyConfigs'

function renderForm() {
  return render(
    <MemoryRouter>
      <TutorEvaluationForm />
    </MemoryRouter>,
  )
}

const requiredRatings = TUTOR_EVALUATION_QUESTIONS.filter(
  (q) => q.required && q.type === 'rating',
)

beforeEach(() => {
  insertMock.mockReset()
  insertMock.mockResolvedValue({ error: null })
  fromMock.mockReset()
  fromMock.mockImplementation(() => ({ insert: insertMock }))
})

describe('TutorEvaluationForm', () => {
  it('renders the title and every configured question', () => {
    renderForm()
    expect(
      screen.getByRole('heading', { name: 'Tutor Evaluation' }),
    ).toBeInTheDocument()
    for (const q of TUTOR_EVALUATION_QUESTIONS) {
      expect(screen.getByText(q.label, { exact: false })).toBeInTheDocument()
    }
  })

  it('rejects empty required fields and blocks the insert', async () => {
    const user = userEvent.setup()
    renderForm()
    await user.click(screen.getByRole('button', { name: /submit/i }))
    const alerts = await screen.findAllByText('This question is required.')
    expect(alerts).toHaveLength(requiredRatings.length)
    expect(insertMock).not.toHaveBeenCalled()
  })

  it('submits to tutor_evaluations and shows the success screen', async () => {
    const user = userEvent.setup()
    renderForm()
    for (const q of requiredRatings) {
      const group = screen.getByRole('radiogroup', { name: q.name })
      await user.click(within(group).getByRole('radio', { name: '4' }))
    }
    await user.click(screen.getByRole('button', { name: /submit/i }))

    await screen.findByRole('heading', { name: 'Thank you!' })
    expect(fromMock).toHaveBeenCalledWith('tutor_evaluations')
    expect(insertMock).toHaveBeenCalledTimes(1)
    expect(insertMock.mock.calls[0][0].submitted_by).toBe('admin-9')
  })
})
