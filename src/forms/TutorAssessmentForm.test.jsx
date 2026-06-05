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
  useAuth: () => ({ user: { id: 'tutor-7' }, loading: false }),
}))

import TutorAssessmentForm from './TutorAssessmentForm'
import { TUTOR_ASSESSMENT_QUESTIONS } from './surveyConfigs'

function renderForm() {
  return render(
    <MemoryRouter>
      <TutorAssessmentForm />
    </MemoryRouter>,
  )
}

// This form mixes a required textarea + a required rating, exercising both
// branches of the validate() logic.
const requiredQuestions = TUTOR_ASSESSMENT_QUESTIONS.filter((q) => q.required)
const requiredText = TUTOR_ASSESSMENT_QUESTIONS.find(
  (q) => q.required && q.type === 'textarea',
)
const requiredRating = TUTOR_ASSESSMENT_QUESTIONS.find(
  (q) => q.required && q.type === 'rating',
)

beforeEach(() => {
  insertMock.mockReset()
  insertMock.mockResolvedValue({ error: null })
  fromMock.mockReset()
  fromMock.mockImplementation(() => ({ insert: insertMock }))
})

describe('TutorAssessmentForm', () => {
  it('renders the self-assessment title and questions', () => {
    renderForm()
    expect(
      screen.getByRole('heading', { name: 'Tutor Self-Assessment' }),
    ).toBeInTheDocument()
    for (const q of TUTOR_ASSESSMENT_QUESTIONS) {
      expect(screen.getByText(q.label, { exact: false })).toBeInTheDocument()
    }
  })

  it('shows an error for an empty required textarea and blocks submit', async () => {
    const user = userEvent.setup()
    renderForm()
    await user.click(screen.getByRole('button', { name: /submit/i }))
    const alerts = await screen.findAllByText('This question is required.')
    expect(alerts).toHaveLength(requiredQuestions.length)
    expect(insertMock).not.toHaveBeenCalled()
  })

  it('blocks submit when only the required rating is missing', async () => {
    const user = userEvent.setup()
    renderForm()
    // Fill the required textarea but leave the required rating blank.
    const textareas = screen.getAllByRole('textbox')
    await user.type(textareas[0], 'Patient and clear explanations')
    await user.click(screen.getByRole('button', { name: /submit/i }))

    expect(
      (await screen.findAllByText('This question is required.')).length,
    ).toBe(1)
    expect(insertMock).not.toHaveBeenCalled()
  })

  it('submits to tutor_assessments when required fields are filled', async () => {
    const user = userEvent.setup()
    renderForm()

    const textareas = screen.getAllByRole('textbox')
    await user.type(textareas[0], 'Strong rapport with students')
    const ratingGroup = screen.getByRole('radiogroup', {
      name: requiredRating.name,
    })
    await user.click(within(ratingGroup).getByRole('radio', { name: '5' }))

    await user.click(screen.getByRole('button', { name: /submit/i }))

    await screen.findByRole('heading', { name: 'Thank you!' })
    expect(fromMock).toHaveBeenCalledWith('tutor_assessments')
    const payload = insertMock.mock.calls[0][0]
    expect(payload.responses[requiredText.name]).toBe(
      'Strong rapport with students',
    )
    expect(payload.responses[requiredRating.name]).toBe(5)
  })
})
