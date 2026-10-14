import { createContext, useContext, useMemo, useState } from 'react'
import { course_weeks, materials } from '../data/courses'
import { quizzes, PASSING_RATIO } from '../data/quizzes'
import { CURRENT_STUDENT_ID, material_progress, quiz_attempts } from '../data/students'

// Why a context: the dashboard cards, the course page ring and the profile all show the same
// progress. Keeping done-materials and quiz attempts in one place means marking something done on
// the course page is already reflected when you go Back to Dashboard. In-memory only: a refresh
// resets the demo to its starting state, which is handy before a client meeting.
const ProgressContext = createContext(null)

const courseOfWeek = Object.fromEntries(course_weeks.map((w) => [w.id, w.course_id]))

export function ProgressProvider({ children }) {
  const [doneMaterials, setDoneMaterials] = useState(
    () => new Set(material_progress.filter((r) => r.student_id === CURRENT_STUDENT_ID).map((r) => r.material_id)),
  )
  const [attempts, setAttempts] = useState(() => quiz_attempts.filter((a) => a.student_id === CURRENT_STUDENT_ID))

  const value = useMemo(() => {
    const quizStatus = (quiz) => {
      const mine = attempts.filter((a) => a.quiz_id === quiz.id)
      const best = mine.length ? Math.max(...mine.map((a) => a.score)) : null
      const passed = best !== null && best >= quiz.total_points * PASSING_RATIO
      const exhausted = mine.length >= quiz.max_attempts
      return { used: mine.length, best, completed: passed || exhausted, canStart: !passed && !exhausted }
    }

    const courseProgress = (courseId) => {
      const mats = materials.filter((m) => courseOfWeek[m.week_id] === courseId)
      const qs = quizzes.filter((q) => courseOfWeek[q.week_id] === courseId)
      const done = mats.filter((m) => doneMaterials.has(m.id)).length + qs.filter((q) => quizStatus(q).completed).length
      return Math.round((done / (mats.length + qs.length)) * 100)
    }

    return {
      isDone: (materialId) => doneMaterials.has(materialId),
      toggleDone: (materialId) =>
        setDoneMaterials((prev) => {
          const next = new Set(prev)
          next.has(materialId) ? next.delete(materialId) : next.add(materialId)
          return next
        }),
      quizStatus,
      recordAttempt: (quizId, score) =>
        setAttempts((prev) => [...prev, { id: crypto.randomUUID(), student_id: CURRENT_STUDENT_ID, quiz_id: quizId, score, taken_at: new Date().toISOString() }]),
      courseProgress,
      completedQuizCount: () => quizzes.filter((q) => quizStatus(q).completed).length,
    }
  }, [doneMaterials, attempts])

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>
}

export const useProgress = () => useContext(ProgressContext)
