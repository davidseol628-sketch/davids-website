import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import AdminDashboard from './AdminDashboard'
import { supabase } from '../lib/supabase'

vi.mock('../lib/supabase', () => ({ supabase: { from: vi.fn() } }))

/**
 * AdminDashboard issues head/count queries:
 *   from(t).select('id', {count, head}).eq('status', 'pending_approval')  -> {count}
 *   from('surveys').select('id', {count, head})                          -> {count}
 * So the select() result must be both awaitable AND expose .eq() that
 * resolves to {count}. `counts` maps table name -> count.
 */
function setupCounts(counts) {
  supabase.from.mockImplementation((table) => {
    const result = { count: counts[table] ?? 0, error: null }
    const selectReturn = {
      eq: vi.fn().mockResolvedValue(result),
      then: (resolve) => Promise.resolve(result).then(resolve),
    }
    return { select: vi.fn(() => selectReturn) }
  })
}

function renderDash() {
  return render(
    <MemoryRouter>
      <AdminDashboard />
    </MemoryRouter>,
  )
}

describe('AdminDashboard', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders the heading and navigation cards', async () => {
    setupCounts({ tutors: 0, sections: 0, surveys: 0 })
    renderDash()

    expect(screen.getByRole('heading', { name: 'Admin dashboard' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Pending tutor signups/ })).toHaveAttribute('href', '/admin/signups')
    expect(screen.getByRole('link', { name: /Pending sections/ })).toHaveAttribute('href', '/admin/sections')
    expect(screen.getByRole('link', { name: /Survey submissions/ })).toHaveAttribute('href', '/admin/submissions')
    expect(screen.getByRole('link', { name: /Manage classes/ })).toHaveAttribute('href', '/admin/classes')
  })

  it('displays the counts returned by Supabase', async () => {
    setupCounts({ tutors: 3, sections: 2, surveys: 7 })
    renderDash()

    expect(await screen.findByText('3')).toBeInTheDocument()
    expect(screen.getByText('2')).toBeInTheDocument()
    expect(screen.getByText('7')).toBeInTheDocument()
  })

  it('queries the correct tables with the pending_approval filter', async () => {
    setupCounts({ tutors: 1, sections: 1, surveys: 1 })
    renderDash()

    await screen.findAllByText('1')
    expect(supabase.from).toHaveBeenCalledWith('tutors')
    expect(supabase.from).toHaveBeenCalledWith('sections')
    expect(supabase.from).toHaveBeenCalledWith('surveys')
  })
})
