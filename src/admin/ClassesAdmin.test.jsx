import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import ClassesAdmin from './ClassesAdmin'
import { supabase } from '../lib/supabase'

vi.mock('../lib/supabase', () => ({ supabase: { from: vi.fn() } }))

/**
 * ClassesAdmin loads:
 *   from('sections').select('*').order(...)   -> {data, error}
 *   from('tutors').select('id, full_name, status') (awaited directly) -> {data}
 * and inserts via from('sections').insert(...).
 */
function setup({ sections = [], tutors = [], insertSpy }) {
  const insert = insertSpy || vi.fn().mockResolvedValue({ error: null })
  supabase.from.mockImplementation((table) => {
    if (table === 'sections') {
      const orderResult = { data: sections, error: null }
      const selectReturn = {
        order: vi.fn().mockResolvedValue(orderResult),
      }
      return { select: vi.fn(() => selectReturn), insert }
    }
    // tutors: select(...) is awaited directly
    return {
      select: vi.fn().mockResolvedValue({ data: tutors, error: null }),
    }
  })
  return { insert }
}

function renderPage() {
  return render(
    <MemoryRouter>
      <ClassesAdmin />
    </MemoryRouter>,
  )
}

describe('ClassesAdmin', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders existing sections and tutor options from mocked data', async () => {
    setup({
      sections: [{ id: 's1', title: 'Algebra I', status: 'published', capacity: 10, student_ids: ['a'] }],
      tutors: [{ id: 't1', full_name: 'Jane Tutor', status: 'active' }],
    })

    renderPage()

    expect(await screen.findByText('Algebra I')).toBeInTheDocument()
    expect(screen.getByText('1 / 10')).toBeInTheDocument()
    expect(screen.getByRole('option', { name: 'Jane Tutor (active)' })).toBeInTheDocument()
  })

  it('shows the empty state when there are no sections', async () => {
    setup({ sections: [], tutors: [] })

    renderPage()

    expect(await screen.findByText('No sections yet.')).toBeInTheDocument()
  })

  it('validates that title and tutor are required before inserting', async () => {
    const { insert } = setup({ sections: [], tutors: [{ id: 't1', full_name: 'Jane', status: 'active' }] })

    const user = userEvent.setup()
    renderPage()

    await screen.findByText('No sections yet.')
    await user.click(screen.getByRole('button', { name: 'Create class' }))

    expect(await screen.findByText('Title and tutor are required.')).toBeInTheDocument()
    expect(insert).not.toHaveBeenCalled()
  })

  it('inserts a new published section with the form values', async () => {
    const insertSpy = vi.fn().mockResolvedValue({ error: null })
    setup({
      sections: [],
      tutors: [{ id: 't1', full_name: 'Jane Tutor', status: 'active' }],
      insertSpy,
    })

    const user = userEvent.setup()
    renderPage()

    await screen.findByText('No sections yet.')

    await user.type(screen.getByLabelText(/Title/), 'Geometry')
    await user.type(screen.getByLabelText(/Subject/), 'Math')
    await user.selectOptions(screen.getByLabelText(/Tutor/), 't1')
    await user.click(screen.getByRole('button', { name: 'Create class' }))

    await waitFor(() => expect(insertSpy).toHaveBeenCalledTimes(1))
    expect(insertSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'Geometry',
        subject: 'Math',
        capacity: 10,
        tutor_id: 't1',
        status: 'published',
        student_ids: [],
      }),
    )
  })
})
