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

// Deterministic mock people: the same names every reload, so the demo never shuffles mid-meeting.
const FIRST = ['Maria', 'John', 'Kristine', 'Mark', 'Angelica', 'Jerome', 'Patricia', 'Paolo', 'Jasmine', 'Carlo', 'Bea', 'Miguel', 'Rica', 'Adrian', 'Leah', 'Joshua', 'Camille', 'Rafael', 'Nicole', 'Vincent', 'Trisha', 'Daniel', 'Hazel', 'Kevin', 'Shiela', 'Ramon', 'Ella', 'Gabriel', 'Joy', 'Francis']
const LAST = ['Santos', 'Reyes', 'Bautista', 'Villanueva', 'Ramos', 'Garcia', 'Lim', 'Mendoza', 'Torres', 'Aquino', 'Castillo', 'Navarro', 'Flores', 'Gonzales', 'Rivera', 'Cruz', 'Morales', 'Pascual', 'Domingo', 'Salazar', 'Fernandez', 'Ocampo', 'Valdez', 'Soriano', 'Manalo', 'Tan', 'Ignacio', 'Mercado', 'Rosales', 'Lopez']

export function mockPerson(i) {
  // i -> unique (first, last) pair for i < 900: 7 is coprime with 30, so each first name gets 30 different last names
  const first = FIRST[i % FIRST.length]
  const last = LAST[(Math.floor(i / FIRST.length) * 7 + i * 11) % LAST.length]
  const full_name = `${first} ${last}`
  return { full_name, email: `${first}.${last}${i}@mail.com`.toLowerCase() }
}

// How many enrolled students each program has (Christian is one of the AFA nine).
const PROGRAM_HEADCOUNT = { 'btled-afa': 9, 'btled-het': 46, 'btled-iat': 14, 'btled-ict': 7, btvted: 94, 'unit-earner': 6 }

export const students = [
  { id: 's-001', profile_id: 'u-student-01', student_no: '2026-00142', full_name: 'Christian Jay Dela Cruz', email: 'christian.delacruz@brightwater.edu', program_id: 'btled-afa', year_level: 2, enrolled_at: '2026-06-10' },
  ...Object.entries(PROGRAM_HEADCOUNT)
    .flatMap(([program_id, n]) => Array.from({ length: program_id === 'btled-afa' ? n - 1 : n }, () => program_id))
    .map((program_id, k) => {
      const i = k + 2
      return {
        id: `s-${String(i).padStart(3, '0')}`,
        profile_id: null, // no login account in the demo
        student_no: `2026-${String(i * 3 + 100).padStart(5, '0')}`,
        ...mockPerson(i),
        program_id,
        year_level: (i % 4) + 1,
        enrolled_at: `2026-06-${String((i % 28) + 1).padStart(2, '0')}`,
      }
    }),
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
