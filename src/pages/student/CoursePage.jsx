import { useState } from 'react'
import { Link, Navigate, useParams } from 'react-router'
import { ArrowLeft, BookOpen, Check, ClipboardCheck, ClipboardList, Lock } from 'lucide-react'
import { getCourse, materialsForWeek, weeksFor } from '../../data/courses'
import { quizzesForWeek } from '../../data/quizzes'
import { useProgress } from '../../context/ProgressContext'
import { ProgressRing } from '../../components/Progress'
import QuizModal from '../../components/QuizModal'

export default function CoursePage() {
  const { courseId } = useParams()
  const course = getCourse(courseId)
  const { courseProgress } = useProgress()
  const weeks = weeksFor(courseId)
  const [weekId, setWeekId] = useState(weeks[0]?.id)
  const [quizState, setQuizState] = useState({ quiz: null, mode: 'take', open: false, session: 0 })

  if (!course) return <Navigate to="/student" replace />

  const week = weeks.find((w) => w.id === weekId)
  const progress = courseProgress(courseId)
  const openQuiz = (quiz, mode) => setQuizState((s) => ({ quiz, mode, open: true, session: s.session + 1 }))

  return (
    <div>
      <Link to="/student" className="inline-flex items-center gap-1.5 text-sm font-bold text-navy hover:underline hover:underline-offset-4">
        <ArrowLeft className="size-4" aria-hidden="true" /> Back to Dashboard
      </Link>

      <h1 className="mt-4 text-4xl font-black tracking-tight text-balance text-navy lg:text-[52px] lg:leading-[1.05]">{course.title}</h1>
      <p className="mt-2 text-lg text-muted lg:text-2xl">{course.description}</p>

      <section className="mt-7 rounded-[18px] bg-sun px-6 py-5 text-navy shadow-card sm:px-8 sm:py-6">
        <h2 className="text-lg font-extrabold">General Instruction</h2>
        <p className="mt-1 text-navy/80">Select a topic from the left sidebar to load its materials. Mark materials as done to track progress.</p>
      </section>

      <div className="mt-6 grid items-start gap-6 lg:grid-cols-[minmax(0,35fr)_minmax(0,65fr)]">
        {/* Left column */}
        <div className="space-y-6">
          <div className="card flex items-center justify-between gap-4 p-5 sm:p-6">
            <div>
              <h2 className="text-lg font-extrabold text-navy">Overall Progress</h2>
              <p className="text-sm text-muted">Based on materials read</p>
            </div>
            <ProgressRing value={progress} label={`${course.title} overall progress`} />
          </div>

          <div className="card p-5 sm:p-6">
            <h2 className="mb-4 text-2xl text-navy">Course Weeks</h2>
            <ul className="space-y-2">
              {weeks.map((w) => {
                const on = w.id === weekId
                return (
                  <li key={w.id}>
                    <button
                      onClick={() => setWeekId(w.id)}
                      disabled={w.is_locked}
                      aria-current={on ? 'true' : undefined}
                      title={w.is_locked ? 'Unlocks after you finish the previous week' : undefined}
                      className={`pressable flex w-full items-center justify-between rounded-pill px-4 py-3 text-left transition-colors duration-150 disabled:cursor-not-allowed disabled:active:scale-100 ${
                        on ? 'bg-sun font-extrabold text-navy shadow-card' : w.is_locked ? 'bg-wash font-semibold text-faint' : 'wipe-soft bg-wash font-semibold text-navy'
                      }`}
                    >
                      Week {w.week_no}
                      {w.is_locked && <Lock className="size-4" aria-label="Locked" />}
                    </button>
                  </li>
                )
              })}
            </ul>
          </div>
        </div>

        {/* Right column */}
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight text-balance text-navy lg:text-[34px] lg:leading-tight">
            Week {week.week_no}: {week.title}
          </h2>

          <div className="card mt-5 p-4 sm:p-6">
            <div className="mb-4 flex items-center gap-3 px-1">
              <ClipboardList className="size-6 text-navy" strokeWidth={1.75} aria-hidden="true" />
              <div>
                <h3 className="text-lg font-extrabold text-navy">Course Content</h3>
                <p className="text-sm text-muted">Materials and Assessments</p>
              </div>
            </div>
            <ul className="space-y-2.5">
              {materialsForWeek(week.id).map((m) => (
                <ReadingRow key={m.id} material={m} />
              ))}
              {quizzesForWeek(week.id).map((q) => (
                <QuizRow key={q.id} quiz={q} onOpen={openQuiz} />
              ))}
            </ul>
          </div>
        </div>
      </div>

      <QuizModal {...quizState} onClose={() => setQuizState((s) => ({ ...s, open: false }))} />
    </div>
  )
}

const rowBase = 'flex flex-col gap-3 rounded-xl border px-4 py-3.5 transition-colors duration-200 sm:flex-row sm:items-center sm:gap-4'
const pill = 'rounded-full border px-2.5 py-0.5 text-xs font-bold tabular-nums'

function ReadingRow({ material }) {
  const { isDone, toggleDone } = useProgress()
  const done = isDone(material.id)
  return (
    <li className={`${rowBase} ${done ? 'border-sky bg-sky-50' : 'border-line'}`}>
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-sky-200 text-navy">
          <BookOpen className="size-5" strokeWidth={1.75} aria-hidden="true" />
        </span>
        <div className="min-w-0">
          <p className="font-bold text-ink">{material.title}</p>
          <p className="text-xs text-muted">{material.meta}</p>
        </div>
      </div>
      <label className="flex cursor-pointer items-center gap-2 self-end text-sm font-bold text-navy sm:self-auto">
        <input type="checkbox" checked={done} onChange={() => toggleDone(material.id)} className="size-[18px] cursor-pointer accent-navy" />
        Mark as done
      </label>
    </li>
  )
}

function QuizRow({ quiz, onOpen }) {
  const { quizStatus } = useProgress()
  const s = quizStatus(quiz)
  return (
    <li className={`${rowBase} ${s.completed ? 'border-sky bg-sky-50' : 'border-line'}`}>
      <div className="flex min-w-0 flex-1 items-start gap-3 sm:items-center">
        <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-sky-100 text-navy">
          <ClipboardCheck className="size-5 fill-sky" strokeWidth={1.75} aria-hidden="true" />
        </span>
        <div className="min-w-0">
          <p className="font-bold text-ink">{quiz.title}</p>
          <div className="mt-1.5 flex flex-wrap gap-1.5">
            <span className={`${pill} border-line text-muted`}>Total: {quiz.total_points}</span>
            {s.best !== null && (
              <span className={`${pill} border-transparent bg-sky-200 text-navy`}>
                Score: {s.best}/{quiz.total_points}
              </span>
            )}
            <span className={`${pill} border-transparent bg-sky-200 text-navy`}>
              Attempts: {s.used} / {quiz.max_attempts}
            </span>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2 self-end sm:self-auto">
        <button
          onClick={() => onOpen(quiz, s.canStart ? 'take' : 'review')}
          className="pressable min-w-[88px] rounded-pill bg-sun px-5 py-2 text-sm font-bold text-navy transition-colors duration-150 wipe"
        >
          {s.canStart ? (s.used ? 'Retake' : 'Start') : 'Review'}
        </button>
        {s.completed && (
          <span className="grid size-8 place-items-center rounded-lg bg-navy text-sun" aria-label="Completed">
            <Check className="size-4" strokeWidth={3} />
          </span>
        )}
      </div>
    </li>
  )
}
