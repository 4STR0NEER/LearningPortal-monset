import { useState } from 'react'
import { Navigate, useParams } from 'react-router'
import { BookOpen, ClipboardCheck, Lock, Pencil, Plus } from 'lucide-react'
import { getCourse, materials, materialsForWeek, weeksFor } from '../../data/courses'
import { questionsFor, quizzes, quizzesForWeek } from '../../data/quizzes'
import { course_progress_matrix } from '../../data/matrix'
import { useToast } from '../../components/Toast'
import CourseIcon from '../../components/CourseIcon'

// Teacher version of the course page: same weeks / content structure as the student view, but
// every week is open and each row has Edit. Editing isn't built yet, so the buttons say so in a toast.
export default function TeacherCoursePage() {
  const { courseId } = useParams()
  const course = getCourse(courseId)
  const toast = useToast()
  const weeks = weeksFor(courseId)
  const [weekId, setWeekId] = useState(weeks[0]?.id)

  if (!course) return <Navigate to="/teacher" replace />

  const week = weeks.find((w) => w.id === weekId)
  const weekIds = new Set(weeks.map((w) => w.id))
  const placeholder = (what) => () => toast(`${what} is a placeholder in this demo`)
  const overview = [
    ['Weeks', weeks.length],
    ['Materials', materials.filter((m) => weekIds.has(m.week_id)).length],
    ['Quizzes', quizzes.filter((q) => weekIds.has(q.week_id)).length],
    ['Active students', course_progress_matrix.filter((m) => m.course_id === courseId).reduce((n, m) => n + m.active_students, 0)],
  ]

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-center gap-4">
          <span className="grid size-14 shrink-0 place-items-center rounded-full border border-sky bg-surface shadow-card">
            <CourseIcon name={course.icon} className="size-6 text-primary" strokeWidth={1.5} />
          </span>
          <div>
            <h1 className="text-3xl font-black tracking-tight text-balance text-navy lg:text-4xl">{course.title}</h1>
            <p className="mt-1 text-muted">{course.description}</p>
          </div>
        </div>
        <button onClick={placeholder('Editing course details')} className={`${outlineBtn} self-start`}>
          <Pencil className="size-4" aria-hidden="true" /> Edit course
        </button>
      </div>

      <div className="mt-8 grid items-start gap-6 lg:grid-cols-[minmax(0,35fr)_minmax(0,65fr)]">
        <div className="space-y-6">
          <dl className="card grid grid-cols-2 gap-px overflow-hidden bg-line p-0">
            {overview.map(([k, v]) => (
              <div key={k} className="bg-surface p-4">
                <dt className="text-xs font-semibold text-muted">{k}</dt>
                <dd className="mt-0.5 text-2xl font-black text-navy tabular-nums">{v}</dd>
              </div>
            ))}
          </dl>

          <div className="card p-5 sm:p-6">
            <h2 className="mb-4 text-2xl text-navy">Course Weeks</h2>
            <ul className="space-y-2">
              {weeks.map((w) => {
                const on = w.id === weekId
                return (
                  <li key={w.id}>
                    <button
                      onClick={() => setWeekId(w.id)}
                      aria-current={on ? 'true' : undefined}
                      className={`pressable flex w-full items-center justify-between gap-3 rounded-pill px-4 py-3 text-left transition-colors duration-150 ${
                        on ? 'bg-navy font-extrabold text-white shadow-card' : 'bg-wash font-semibold text-navy hover:bg-sky-100'
                      }`}
                    >
                      Week {w.week_no}
                      {w.is_locked && (
                        <span className={`inline-flex items-center gap-1 text-xs font-semibold ${on ? 'text-white' : 'text-muted'}`}>
                          <Lock className="size-3.5" aria-hidden="true" /> Locked for students
                        </span>
                      )}
                    </button>
                  </li>
                )
              })}
            </ul>
            <button onClick={placeholder('Adding a week')} className="pressable mt-3 flex w-full items-center justify-center gap-2 rounded-pill border border-dashed border-sky px-4 py-3 text-sm font-bold text-navy transition-colors duration-150 hover:bg-sky-50">
              <Plus className="size-4" aria-hidden="true" /> Add week
            </button>
          </div>
        </div>

        <div>
          <div className="flex items-start justify-between gap-4">
            <h2 className="text-2xl font-extrabold tracking-tight text-balance text-navy lg:text-[34px] lg:leading-tight">
              Week {week.week_no}: {week.title}
            </h2>
            <button onClick={placeholder('Editing a week')} aria-label={`Edit week ${week.week_no}`} className="pressable grid size-10 shrink-0 place-items-center rounded-pill border border-line text-navy transition-colors duration-150 hover:bg-wash">
              <Pencil className="size-4" aria-hidden="true" />
            </button>
          </div>

          <div className="card mt-5 p-4 sm:p-6">
            <div className="mb-4 px-1">
              <h3 className="text-lg font-extrabold text-navy">Course Content</h3>
              <p className="text-sm text-muted">Materials and Assessments</p>
            </div>
            <ul className="space-y-2.5">
              {materialsForWeek(week.id).map((m) => (
                <ContentRow key={m.id} icon={BookOpen} tile="bg-sky-200 text-navy" title={m.title} onEdit={placeholder('Editing materials')}>
                  <p className="text-xs text-muted">{m.meta}</p>
                </ContentRow>
              ))}
              {quizzesForWeek(week.id).map((q) => (
                <ContentRow key={q.id} icon={ClipboardCheck} iconClass="fill-sun" tile="bg-sun-100 text-navy" title={q.title} onEdit={placeholder('Editing quizzes')}>
                  <div className="mt-1.5 flex flex-wrap gap-1.5">
                    <span className={`${pill} border-line text-muted`}>Total: {q.total_points}</span>
                    <span className={`${pill} border-transparent bg-sky-200 text-navy`}>{questionsFor(q.id).length} questions</span>
                    <span className={`${pill} border-transparent bg-sky-200 text-navy`}>Max attempts: {q.max_attempts}</span>
                  </div>
                </ContentRow>
              ))}
            </ul>
            <div className="mt-4 flex flex-wrap gap-2">
              <button onClick={placeholder('Adding materials')} className={outlineBtn}>
                <Plus className="size-4" aria-hidden="true" /> Add material
              </button>
              <button onClick={placeholder('Adding quizzes')} className={outlineBtn}>
                <Plus className="size-4" aria-hidden="true" /> Add quiz
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const outlineBtn = 'pressable inline-flex items-center gap-2 rounded-pill border border-line bg-surface px-4 py-2.5 text-sm font-bold text-navy transition-colors duration-150 hover:border-sky hover:bg-wash'
const pill = 'rounded-full border px-2.5 py-0.5 text-xs font-bold tabular-nums'

function ContentRow({ icon: Icon, iconClass = '', tile, title, onEdit, children }) {
  return (
    <li className="flex items-center gap-3 rounded-xl border border-line px-4 py-3.5 sm:gap-4">
      <span className={`grid size-10 shrink-0 place-items-center rounded-xl ${tile}`}>
        <Icon className={`size-5 ${iconClass}`} strokeWidth={1.75} aria-hidden="true" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="font-bold text-ink">{title}</p>
        {children}
      </div>
      <button onClick={onEdit} className="pressable inline-flex shrink-0 items-center gap-1.5 rounded-pill px-3 py-2 text-sm font-bold text-navy transition-colors duration-150 hover:bg-wash">
        <Pencil className="size-4" aria-hidden="true" />
        <span className="max-sm:sr-only">Edit</span>
      </button>
    </li>
  )
}
