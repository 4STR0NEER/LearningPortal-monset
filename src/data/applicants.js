// Table: applicants. status is 'pending' | 'approved' | 'declined'.
// Approving one (in AdminContext) turns it into a students row, like an insert trigger would.
import { mockPerson, programs } from './students.js'

const STATUS_BY_INDEX = (k) => (k < 73 ? 'pending' : k < 79 ? 'approved' : 'declined')

export const applicants = Array.from({ length: 83 }, (_, k) => {
  const i = k + 300 // different index range from students, so names don't repeat in order
  const recent = k < 40 // newest first; nothing after today (Oct 14)
  const day = recent ? 14 - (k % 14) : 30 - (k % 29)
  return {
    id: `a-${String(k + 1).padStart(3, '0')}`,
    ...mockPerson(i),
    program_id: programs[(k * 5) % programs.length].id,
    applied_at: `2026-${recent ? '10' : '09'}-${String(day).padStart(2, '0')}`,
    status: STATUS_BY_INDEX(k),
  }
})
