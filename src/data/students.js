// Tables: programs, students, enrollments, material_progress, quiz_attempts.
import { courses } from './courses.js'

export const programs = [
  { id: 'btled-afa', code: 'BTLEd - AFA', name: 'Technology and Livelihood Education, Agri-Fishery Arts' },
  { id: 'btled-het', code: 'BTLEd - HET', name: 'Technology and Livelihood Education, Home Economics' },
  { id: 'btled-iat', code: 'BTLEd - IAT', name: 'Technology and Livelihood Education, Industrial Arts' },
  { id: 'btled-ict', code: 'BTLEd - ICT', name: 'Technology and Livelihood Education, ICT' },
  { id: 'btvted', code: 'BTVTED', name: 'Technical-Vocational Teacher Education' },
  { id: 'unit-earner', code: 'Unit Earner', name: 'Teaching Certificate (Unit Earner)' },
]

export const students = [
  { id: 's-001', profile_id: 'u-student-01', student_no: '2026-00142', full_name: 'Christian Jay Dela Cruz', email: 'christian.delacruz@brightwater.edu', program_id: 'btled-afa', year_level: 2, enrolled_at: '2026-06-10' },
]

export const CURRENT_STUDENT_ID = 's-001' // stand-in for the signed-in user until there is auth

export const enrollments = courses.map((c) => ({ id: `e-001-${c.id}`, student_id: 's-001', course_id: c.id, enrolled_at: '2026-06-10' }))

// What Christian has already done. Progress is computed from these, never stored.
export const material_progress = [{ student_id: 's-001', material_id: 'industrial-arts-w1-reading', done_at: '2026-09-02' }]

export const quiz_attempts = [
  ...[4, 6, 6, 8, 8].map((score, i) => ({ id: `qa-afa-${i + 1}`, student_id: 's-001', quiz_id: 'agri-fishery-w1-q1', score, taken_at: `2026-09-0${i + 3}` })),
  { id: 'qa-ia-1', student_id: 's-001', quiz_id: 'industrial-arts-w1-q1', score: 8, taken_at: '2026-09-04' },
]

export const getProgram = (id) => programs.find((p) => p.id === id)
