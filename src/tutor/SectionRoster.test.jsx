import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import SectionRoster from './SectionRoster'

// from('students').select().in()  -> students
// from('parents').select().in()   -> parents
let tableData
function makeFrom() {
  return vi.fn((table) => ({
    select: vi.fn(() => ({
      in: vi.fn(() => Promise.resolve({ data: tableData[table] ?? [], error: null })),
    })),
  }))
}

let from
vi.mock('../lib/supabase', () => ({
  get supabase() {
    return { from }
  },
}))

describe('SectionRoster', () => {
  beforeEach(() => {
    from = makeFrom()
    tableData = { students: [], parents: [] }
  })

  it('shows an empty message when no students are enrolled', () => {
    render(<SectionRoster section={{ student_ids: [] }} />)
    expect(screen.getByText('No students enrolled.')).toBeInTheDocument()
  })

  it('resolves student ids to a roster joined with parent contact info', async () => {
    tableData.students = [
      { id: 's1', full_name: 'Kid One', grade: '5', parent_id: 'p1' },
    ]
    tableData.parents = [
      { id: 'p1', full_name: 'Parent One', email: 'p1@example.com', phone: '555-1234' },
    ]
    render(<SectionRoster section={{ student_ids: ['s1'] }} />)

    expect(await screen.findByText('Kid One')).toBeInTheDocument()
    expect(screen.getByText('5')).toBeInTheDocument()
    expect(screen.getByText('Parent One')).toBeInTheDocument()
    expect(screen.getByText('p1@example.com · 555-1234')).toBeInTheDocument()
  })

  it('falls back to dashes when grade and parent are missing', async () => {
    tableData.students = [
      { id: 's1', full_name: 'No Parent Kid', grade: null, parent_id: null },
    ]
    render(<SectionRoster section={{ student_ids: ['s1'] }} />)

    expect(await screen.findByText('No Parent Kid')).toBeInTheDocument()
    // grade cell and parent cell and contact cell all render an em dash
    expect(screen.getAllByText('—').length).toBeGreaterThanOrEqual(2)
  })
})
