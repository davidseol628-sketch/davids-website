import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Routes, Route } from 'react-router-dom'

const insertMock = vi.fn(() => Promise.resolve({ error: null }))
const fromMock = vi.fn(() => ({ insert: insertMock }))
vi.mock('../lib/supabase', () => ({
  supabase: { from: (...args) => fromMock(...args) },
}))

// Auth is mocked via a mutable holder so individual tests can flip the
// logged-in / loading state that drives the redirect + null-render branches.
const authState = { value: { user: { id: 'u-1' }, loading: false } }
vi.mock('../lib/auth', () => ({
  useAuth: () => authState.value,
}))

import QuestionnaireForm from './QuestionnaireForm'

const QUESTIONS = [
  { name: 'rating_q', label: 'Rate the thing', type: 'rating', required: true },
  { name: 'short_q', label: 'Short answer', type: 'text', required: true },
  { name: 'notes', label: 'Optional notes', type: 'textarea', required: false },
]

function renderForm(props = {}) {
  return render(
    <MemoryRouter initialEntries={['/forms/x']}>
      <Routes>
        <Route
          path="/forms/x"
          element={
            <QuestionnaireForm
              title="Engine Test"
              intro="An intro."
              questions={QUESTIONS}
              table="x_table"
              {...props}
            />
          }
        />
        <Route path="/login" element={<div>Login Page</div>} />
      </Routes>
    </MemoryRouter>,
  )
}

beforeEach(() => {
  authState.value = { user: { id: 'u-1' }, loading: false }
  insertMock.mockReset()
  insertMock.mockResolvedValue({ error: null })
  fromMock.mockReset()
  fromMock.mockImplementation(() => ({ insert: insertMock }))
})

describe('QuestionnaireForm (shared engine)', () => {
  it('renders title, intro, and each question type', () => {
    renderForm()
    expect(screen.getByRole('heading', { name: 'Engine Test' })).toBeInTheDocument()
    expect(screen.getByText('An intro.')).toBeInTheDocument()
    expect(screen.getByRole('radiogroup', { name: 'rating_q' })).toBeInTheDocument()
    // text + textarea both surface as textboxes.
    expect(screen.getAllByRole('textbox')).toHaveLength(2)
  })

  it('redirects to /login when the user is not authenticated', () => {
    authState.value = { user: null, loading: false }
    renderForm()
    expect(screen.getByText('Login Page')).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'Engine Test' })).not.toBeInTheDocument()
  })

  it('renders nothing while auth is loading', () => {
    authState.value = { user: null, loading: true }
    const { container } = renderForm()
    expect(container).toBeEmptyDOMElement()
  })

  it('blocks submit and reports each required field that is empty', async () => {
    const user = userEvent.setup()
    renderForm()
    await user.click(screen.getByRole('button', { name: /submit/i }))
    // Two required fields (rating + text); optional textarea is not flagged.
    expect((await screen.findAllByText('This question is required.')).length).toBe(2)
    expect(insertMock).not.toHaveBeenCalled()
  })

  it('passes extraColumns through to the insert payload on success', async () => {
    const user = userEvent.setup()
    renderForm({ extraColumns: { survey_type: 'demo' } })

    const group = screen.getByRole('radiogroup', { name: 'rating_q' })
    await user.click(within(group).getByRole('radio', { name: '4' }))
    await user.type(screen.getAllByRole('textbox')[0], 'hello')
    await user.click(screen.getByRole('button', { name: /submit/i }))

    await screen.findByRole('heading', { name: 'Thank you!' })
    expect(fromMock).toHaveBeenCalledWith('x_table')
    const payload = insertMock.mock.calls[0][0]
    expect(payload).toMatchObject({
      submitted_by: 'u-1',
      survey_type: 'demo',
    })
    expect(payload.responses).toMatchObject({ rating_q: 4, short_q: 'hello' })
  })

  it('surfaces a thrown insert error as a form-level alert', async () => {
    insertMock.mockResolvedValue({ error: { message: 'boom' } })
    const user = userEvent.setup()
    renderForm()

    const group = screen.getByRole('radiogroup', { name: 'rating_q' })
    await user.click(within(group).getByRole('radio', { name: '1' }))
    await user.type(screen.getAllByRole('textbox')[0], 'x')
    await user.click(screen.getByRole('button', { name: /submit/i }))

    expect(await screen.findByRole('alert')).toHaveTextContent('boom')
    expect(screen.queryByRole('heading', { name: 'Thank you!' })).not.toBeInTheDocument()
  })
})
