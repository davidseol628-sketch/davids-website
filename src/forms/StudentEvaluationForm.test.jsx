import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'

// --- Mock Supabase: capture insert calls, control resolved value. ---
const insertMock = vi.fn(() => Promise.resolve({ error: null }))
const fromMock = vi.fn(() => ({ insert: insertMock }))
vi.mock('../lib/supabase', () => ({
  supabase: { from: (...args) => fromMock(...args) },
}))

// --- Mock auth: logged-in, ready user. ---
vi.mock('../lib/auth', () => ({
  useAuth: () => ({ user: { id: 'user-123' }, loading: false }),
}))

import StudentEvaluationForm from './StudentEvaluationForm'
import { STUDENT_EVALUATION_QUESTIONS } from './surveyConfigs'

function renderForm() {
  return render(
    <MemoryRouter>
      <StudentEvaluationForm />
    </MemoryRouter>,
  )
}

const requiredRatings = STUDENT_EVALUATION_QUESTIONS.filter(
  (q) => q.required && q.type === 'rating',
)

beforeEach(() => {
  insertMock.mockReset()
  insertMock.mockResolvedValue({ error: null })
  fromMock.mockReset()
  fromMock.mockImplementation(() => ({ insert: insertMock }))
})

describe('StudentEvaluationForm', () => {
  it('renders the title and a field for every configured question', () => {
    renderForm()
    expect(
      screen.getByRole('heading', { name: 'Student Evaluation' }),
    ).toBeInTheDocument()
    for (const q of STUDENT_EVALUATION_QUESTIONS) {
      expect(screen.getByText(q.label, { exact: false })).toBeInTheDocument()
    }
    // Each required rating renders a radiogroup.
    expect(screen.getAllByRole('radiogroup')).toHaveLength(requiredRatings.length)
  })

  it('blocks submit and shows errors when required fields are empty', async () => {
    const user = userEvent.setup()
    renderForm()

    await user.click(screen.getByRole('button', { name: /submit/i }))

    const alerts = await screen.findAllByText('This question is required.')
    expect(alerts).toHaveLength(requiredRatings.length)
    expect(insertMock).not.toHaveBeenCalled()
  })

  it('clears a field error once the user answers it', async () => {
    const user = userEvent.setup()
    renderForm()

    await user.click(screen.getByRole('button', { name: /submit/i }))
    expect(
      (await screen.findAllByText('This question is required.')).length,
    ).toBe(requiredRatings.length)

    // Answer the first required rating; its error should disappear.
    const firstGroup = screen.getByRole('radiogroup', {
      name: requiredRatings[0].name,
    })
    await user.click(within(firstGroup).getByRole('radio', { name: '4' }))

    await waitFor(() =>
      expect(screen.getAllByText('This question is required.')).toHaveLength(
        requiredRatings.length - 1,
      ),
    )
  })

  it('submits to the correct table and shows the success screen', async () => {
    const user = userEvent.setup()
    renderForm()

    // Fill every required rating with a value.
    for (const q of requiredRatings) {
      const group = screen.getByRole('radiogroup', { name: q.name })
      await user.click(within(group).getByRole('radio', { name: '5' }))
    }

    await user.click(screen.getByRole('button', { name: /submit/i }))

    await screen.findByRole('heading', { name: 'Thank you!' })
    expect(fromMock).toHaveBeenCalledWith('student_evaluations')
    expect(insertMock).toHaveBeenCalledTimes(1)
    const payload = insertMock.mock.calls[0][0]
    expect(payload.submitted_by).toBe('user-123')
    expect(payload.responses).toMatchObject(
      Object.fromEntries(requiredRatings.map((q) => [q.name, 5])),
    )
  })

  it('shows a form-level error when the insert fails', async () => {
    insertMock.mockResolvedValue({ error: { message: 'insert blocked by RLS' } })
    const user = userEvent.setup()
    renderForm()

    for (const q of requiredRatings) {
      const group = screen.getByRole('radiogroup', { name: q.name })
      await user.click(within(group).getByRole('radio', { name: '3' }))
    }
    await user.click(screen.getByRole('button', { name: /submit/i }))

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'insert blocked by RLS',
    )
    expect(
      screen.queryByRole('heading', { name: 'Thank you!' }),
    ).not.toBeInTheDocument()
  })
})
