import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import SectionRoster from './SectionRoster'

// Primary path: supabase.rpc('section_roster') -> roster rows.
// Fallback path (rpc errors): supabase.from('students').select().in() -> students.
let rpcResult
let tableData
function makeSupabase() {
  return {
    rpc: vi.fn(() => Promise.resolve(rpcResult)),
    from: vi.fn((table) => ({
      select: vi.fn(() => ({
        in: vi.fn(() => Promise.resolve({ data: tableData[table] ?? [], error: null })),
      })),
    })),
  }
}

let sb
vi.mock('../lib/supabase', () => ({
  get supabase() {
    return sb
  },
}))

describe('SectionRoster', () => {
  beforeEach(() => {
    sb = makeSupabase()
    rpcResult = { data: [], error: null }
    tableData = { students: [] }
  })

  it('shows an empty message when no students are enrolled', () => {
    render(<SectionRoster section={{ id: 'sec1', student_ids: [] }} />)
    expect(screen.getByText('No students enrolled.')).toBeInTheDocument()
  })

  it('renders the roster from the section_roster RPC, with parent contact', async () => {
    rpcResult = {
      data: [
        {
          student_id: 's1',
          student_name: 'Kid One',
          grade: '5',
          parent_name: 'Parent One',
          email: 'p1@example.com',
          phone: '555-1234',
        },
      ],
      error: null,
    }
    render(<SectionRoster section={{ id: 'sec1', student_ids: ['s1'] }} />)

    expect(await screen.findByText('Kid One')).toBeInTheDocument()
    expect(screen.getByText('5')).toBeInTheDocument()
    expect(screen.getByText('Parent One')).toBeInTheDocument()
    expect(screen.getByText('p1@example.com · 555-1234')).toBeInTheDocument()
    expect(sb.rpc).toHaveBeenCalledWith('section_roster', { p_section_id: 'sec1' })
  })

  it('shows dashes when a roster row has no grade or parent', async () => {
    rpcResult = {
      data: [
        { student_id: 's1', student_name: 'No Parent Kid', grade: null, parent_name: null, email: null, phone: null },
      ],
      error: null,
    }
    render(<SectionRoster section={{ id: 'sec1', student_ids: ['s1'] }} />)

    expect(await screen.findByText('No Parent Kid')).toBeInTheDocument()
    expect(screen.getAllByText('—').length).toBeGreaterThanOrEqual(2)
  })

  it('falls back to a students-only read when the RPC is unavailable', async () => {
    rpcResult = { data: null, error: { message: 'function section_roster does not exist' } }
    tableData.students = [
      { id: 's1', full_name: 'Fallback Kid', grade: '4', parent_id: 'p1' },
    ]
    render(<SectionRoster section={{ id: 'sec1', student_ids: ['s1'] }} />)

    // Student still shows; parent/contact are blank in the fallback.
    expect(await screen.findByText('Fallback Kid')).toBeInTheDocument()
    expect(screen.getByText('4')).toBeInTheDocument()
    expect(screen.getAllByText('—').length).toBeGreaterThanOrEqual(2)
  })
})
