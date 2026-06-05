import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Routes, Route } from 'react-router-dom'

const insertMock = vi.fn(() => Promise.resolve({ error: null }))
const fromMock = vi.fn(() => ({ insert: insertMock }))
vi.mock('../lib/supabase', () => ({
  supabase: { from: (...args) => fromMock(...args) },
}))
vi.mock('../lib/auth', () => ({
  useAuth: () => ({ user: { id: 'parent-42' }, loading: false }),
}))

import SurveyForm from './SurveyForm'
import { SURVEY_CONFIGS } from './surveyConfigs'

// Render SurveyForm under a route so useParams() resolves :type.
function renderSurvey(type) {
  return render(
    <MemoryRouter initialEntries={[`/forms/survey/${type}`]}>
      <Routes>
        <Route path="/forms/survey/:type" element={<SurveyForm />} />
      </Routes>
    </MemoryRouter>,
  )
}

beforeEach(() => {
  insertMock.mockReset()
  insertMock.mockResolvedValue({ error: null })
  fromMock.mockReset()
  fromMock.mockImplementation(() => ({ insert: insertMock }))
})

describe('SurveyForm', () => {
  it('renders the parent_satisfaction config: title, intro, and all questions', () => {
    const config = SURVEY_CONFIGS.parent_satisfaction
    renderSurvey('parent_satisfaction')

    expect(
      screen.getByRole('heading', { name: config.title }),
    ).toBeInTheDocument()
    expect(screen.getByText(config.intro)).toBeInTheDocument()
    for (const q of config.questions) {
      expect(screen.getByText(q.label, { exact: false })).toBeInTheDocument()
    }
    const ratingCount = config.questions.filter((q) => q.type === 'rating').length
    expect(screen.getAllByRole('radiogroup')).toHaveLength(ratingCount)
  })

  it('renders a different config (student_satisfaction) from the same component', () => {
    const config = SURVEY_CONFIGS.student_satisfaction
    renderSurvey('student_satisfaction')
    expect(
      screen.getByRole('heading', { name: config.title }),
    ).toBeInTheDocument()
    for (const q of config.questions) {
      expect(screen.getByText(q.label, { exact: false })).toBeInTheDocument()
    }
  })

  it('shows an "Unknown survey type" message for an unrecognized :type', () => {
    renderSurvey('does_not_exist')
    expect(
      screen.getByText(/Unknown survey type: does_not_exist/),
    ).toBeInTheDocument()
    // No form rendered for an unknown type.
    expect(screen.queryByRole('button', { name: /submit/i })).not.toBeInTheDocument()
  })

  it('rejects empty required questions and blocks submit', async () => {
    const config = SURVEY_CONFIGS.parent_satisfaction
    const requiredCount = config.questions.filter((q) => q.required).length
    const user = userEvent.setup()
    renderSurvey('parent_satisfaction')

    await user.click(screen.getByRole('button', { name: /submit/i }))
    const alerts = await screen.findAllByText('This question is required.')
    expect(alerts).toHaveLength(requiredCount)
    expect(insertMock).not.toHaveBeenCalled()
  })

  it('submits to the surveys table with survey_type in extraColumns', async () => {
    const config = SURVEY_CONFIGS.parent_satisfaction
    const requiredRatings = config.questions.filter(
      (q) => q.required && q.type === 'rating',
    )
    const user = userEvent.setup()
    renderSurvey('parent_satisfaction')

    for (const q of requiredRatings) {
      const group = screen.getByRole('radiogroup', { name: q.name })
      await user.click(within(group).getByRole('radio', { name: '5' }))
    }
    await user.click(screen.getByRole('button', { name: /submit/i }))

    await screen.findByRole('heading', { name: 'Thank you!' })
    expect(fromMock).toHaveBeenCalledWith('surveys')
    const payload = insertMock.mock.calls[0][0]
    expect(payload.survey_type).toBe('parent_satisfaction')
    expect(payload.submitted_by).toBe('parent-42')
  })
})
