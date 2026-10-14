// Teacher dashboard aggregates. In Supabase these would be SQL views (or RPCs) over
// enrollments / material_progress / quiz_attempts, so rows here are already denormalized
// the way a view returns them. Swap each export for a `select * from <view>`.
// Headcounts and the pending count are not here: they change live, so AdminContext counts them.
import { courses } from './courses.js'
import { programs } from './students.js'

// View: course_progress_matrix. One row per (course, program) with active students; zero cells are simply absent.
export const course_progress_matrix = [
  { course_id: 'agri-fishery', program_id: 'btled-afa', active_students: 1 },
  { course_id: 'agri-fishery', program_id: 'btled-ict', active_students: 1 },
  { course_id: 'agri-fishery', program_id: 'unit-earner', active_students: 1 },
  { course_id: 'home-economics', program_id: 'btled-het', active_students: 2 },
  { course_id: 'home-economics', program_id: 'btled-ict', active_students: 1 },
  { course_id: 'home-economics', program_id: 'btvted', active_students: 1 },
  { course_id: 'ict', program_id: 'btled-ict', active_students: 1 },
  { course_id: 'industrial-arts', program_id: 'btled-afa', active_students: 2 },
  { course_id: 'industrial-arts', program_id: 'btled-het', active_students: 1 },
  { course_id: 'industrial-arts', program_id: 'btled-iat', active_students: 2 },
  { course_id: 'industrial-arts', program_id: 'btvted', active_students: 14 },
  { course_id: 'tvted', program_id: 'btvted', active_students: 3 },
]

// View: course_completion_stats. avg_completion is a percent; mastery buckets are student counts.
export const course_completion = [
  { course_id: 'industrial-arts', avg_completion: 38, mastered: 6, proficient: 7, developing: 4, beginning: 2 },
  { course_id: 'agri-fishery', avg_completion: 24, mastered: 1, proficient: 1, developing: 1, beginning: 0 },
  { course_id: 'home-economics', avg_completion: 31, mastered: 1, proficient: 2, developing: 1, beginning: 0 },
  { course_id: 'ict', avg_completion: 12, mastered: 0, proficient: 0, developing: 1, beginning: 0 },
  { course_id: 'tvted', avg_completion: 18, mastered: 0, proficient: 1, developing: 1, beginning: 1 },
  { course_id: 'gen-ed', avg_completion: 0, mastered: 0, proficient: 0, developing: 0, beginning: 0 },
  { course_id: 'prof-ed', avg_completion: 0, mastered: 0, proficient: 0, developing: 0, beginning: 0 },
  { course_id: 'entrepreneurship', avg_completion: 0, mastered: 0, proficient: 0, developing: 0, beginning: 0 },
]

// View: top_scorers (best average quiz score per student, ranked).
export const top_scorers = [
  { rank: 1, student_name: 'Maria Angela Santos', initials: 'MS', program_id: 'btvted', course_id: 'industrial-arts', score_pct: 98 },
  { rank: 2, student_name: 'John Paul Reyes', initials: 'JR', program_id: 'btled-het', course_id: 'home-economics', score_pct: 95 },
  { rank: 3, student_name: 'Kristine Mae Bautista', initials: 'KB', program_id: 'btled-iat', course_id: 'industrial-arts', score_pct: 93 },
  { rank: 4, student_name: 'Mark Anthony Villanueva', initials: 'MV', program_id: 'btvted', course_id: 'tvted', score_pct: 90 },
  { rank: 5, student_name: 'Christian Jay Dela Cruz', initials: 'CJ', program_id: 'btled-afa', course_id: 'agri-fishery', score_pct: 88 },
  { rank: 6, student_name: 'Angelica Ramos', initials: 'AR', program_id: 'btled-ict', course_id: 'ict', score_pct: 86 },
  { rank: 7, student_name: 'Jerome Garcia', initials: 'JG', program_id: 'unit-earner', course_id: 'agri-fishery', score_pct: 84 },
  { rank: 8, student_name: 'Patricia Lim', initials: 'PL', program_id: 'btvted', course_id: 'industrial-arts', score_pct: 81 },
]

// Pivot the matrix view into table rows: one per course (alphabetical, like the reference), a cell per program.
export function matrixRows() {
  return [...courses]
    .sort((a, b) => a.title.localeCompare(b.title))
    .map((course) => {
      const cells = programs.map(
        (p) => course_progress_matrix.find((m) => m.course_id === course.id && m.program_id === p.id)?.active_students ?? 0,
      )
      return { course, cells, total: cells.reduce((a, b) => a + b, 0) }
    })
}
