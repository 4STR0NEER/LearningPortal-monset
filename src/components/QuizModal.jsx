import { useEffect, useRef, useState } from 'react'
import { Check, ClipboardCheck, X } from 'lucide-react'
import { PASSING_RATIO, POINTS_PER_QUESTION, questionsFor } from '../data/quizzes'
import { useProgress } from '../context/ProgressContext'

// `quiz` stays set while the dialog fades out, so the content doesn't blank mid-close.
// `mode`: 'take' runs the quiz and records an attempt; 'review' shows the answer key.
export default function QuizModal({ quiz, mode, open, session, onClose }) {
  const ref = useRef(null)

  useEffect(() => {
    const d = ref.current
    if (open && !d.open) d.showModal()
    if (!open && d.open) d.close()
  }, [open])

  return (
    <dialog
      ref={ref}
      className="modal"
      aria-labelledby="quiz-title"
      onClose={onClose}
      onClick={(e) => e.target === ref.current && onClose()} // click on the backdrop
    >
      {quiz && (
        <div className="card flex max-h-[calc(100dvh-32px)] flex-col shadow-pop">
          <header className="flex items-start gap-3 border-b border-line p-5 sm:p-6">
            <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-sun-100 text-navy">
              <ClipboardCheck className="size-5 fill-sun" strokeWidth={1.75} aria-hidden="true" />
            </span>
            <div className="min-w-0 flex-1">
              <h2 id="quiz-title" className="text-lg leading-snug font-extrabold text-navy">{quiz.title}</h2>
              <p className="text-sm text-muted">{mode === 'review' ? 'Answer key' : `${quiz.total_points} points · ${POINTS_PER_QUESTION} per question`}</p>
            </div>
            <button onClick={onClose} aria-label="Close quiz" className="pressable -mt-1 -mr-2 grid size-9 place-items-center rounded-lg text-muted hover:bg-wash">
              <X className="size-5" />
            </button>
          </header>
          {/* `session` changes on every open, so each attempt starts fresh (but not while closing) */}
          {mode === 'review' ? <Review quiz={quiz} /> : <Take key={session} quiz={quiz} onClose={onClose} />}
        </div>
      )}
    </dialog>
  )
}

function Take({ quiz, onClose }) {
  const questions = questionsFor(quiz.id)
  const { recordAttempt, quizStatus } = useProgress()
  const [i, setI] = useState(0)
  const [answers, setAnswers] = useState([])
  const [score, setScore] = useState(null)

  const q = questions[i]
  const last = i === questions.length - 1
  const picked = answers[i]

  const next = () => {
    if (!last) return setI(i + 1)
    const s = questions.reduce((sum, x, n) => sum + (answers[n] === x.answer_index ? POINTS_PER_QUESTION : 0), 0)
    recordAttempt(quiz.id, s)
    setScore(s)
  }

  if (score !== null) {
    const status = quizStatus(quiz)
    return (
      <div className="p-6 text-center sm:p-8">
        <p className="text-sm font-semibold text-muted">Your score</p>
        <p className="mt-1 text-6xl font-black text-navy tabular-nums">
          {score}
          <span className="text-3xl text-muted">/{quiz.total_points}</span>
        </p>
        <p className="mx-auto mt-3 max-w-[40ch] text-muted">
          {score >= quiz.total_points * PASSING_RATIO
            ? 'Nicely done. This quiz now counts toward your course progress.'
            : status.canStart
              ? 'Not quite there. Review the reading and try again.'
              : 'That was your last attempt. You can still review the answer key.'}
        </p>
        <p className="mt-4 inline-flex rounded-full border border-sky px-3 py-1 text-sm font-bold text-navy">
          Attempts: {status.used} / {quiz.max_attempts}
          {status.best > score ? ` · Best: ${status.best}` : ''}
        </p>
        <div className="mt-6">
          <button onClick={onClose} className="pressable rounded-pill bg-navy px-6 py-2.5 font-bold text-white transition-colors duration-150 hover:bg-primary-700">
            Back to course
          </button>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="overflow-y-auto p-5 sm:p-6">
        <div className="mb-5 flex items-center gap-3">
          <p className="text-sm font-bold text-muted tabular-nums">
            Question {i + 1} of {questions.length}
          </p>
          <div className="flex flex-1 gap-1" aria-hidden="true">
            {questions.map((x, n) => (
              <span key={x.id} className={`h-1.5 flex-1 rounded-full transition-colors duration-200 ${n <= i ? 'bg-primary' : 'bg-line'}`} />
            ))}
          </div>
        </div>
        <fieldset>
          <legend className="mb-4 text-lg font-bold text-ink">{q.prompt}</legend>
          <div className="space-y-2.5">
            {q.choices.map((choice, n) => (
              <label
                key={choice}
                className={`pressable flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 transition-colors duration-150 has-focus-visible:outline-2 has-focus-visible:outline-sun ${picked === n ? 'border-navy bg-sky-50 text-navy' : 'border-line hover-fine:border-sky hover-fine:bg-wash'}`}
              >
                <input
                  type="radio"
                  name={q.id}
                  checked={picked === n}
                  onChange={() => setAnswers((a) => Object.assign([...a], { [i]: n }))}
                  className="size-4 accent-navy"
                />
                <span className="font-semibold">{choice}</span>
              </label>
            ))}
          </div>
        </fieldset>
      </div>
      <footer className="flex items-center justify-between gap-3 border-t border-line p-5 sm:px-6">
        <button
          onClick={() => setI(i - 1)}
          disabled={i === 0}
          className="pressable rounded-pill px-4 py-2.5 font-bold text-navy transition-colors duration-150 hover:bg-wash disabled:pointer-events-none disabled:opacity-40"
        >
          Back
        </button>
        <button
          onClick={next}
          disabled={picked === undefined}
          className="pressable rounded-pill bg-navy px-6 py-2.5 font-bold text-white transition-colors duration-150 hover:bg-primary-700 disabled:pointer-events-none disabled:opacity-40"
        >
          {last ? 'Submit' : 'Next'}
        </button>
      </footer>
    </>
  )
}

function Review({ quiz }) {
  return (
    <ol className="space-y-5 overflow-y-auto p-5 sm:p-6">
      {questionsFor(quiz.id).map((q, n) => (
        <li key={q.id}>
          <p className="font-bold text-ink">
            {n + 1}. {q.prompt}
          </p>
          <ul className="mt-2 space-y-1.5">
            {q.choices.map((choice, c) => {
              const right = c === q.answer_index
              return (
                <li key={choice} className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-[15px] ${right ? 'bg-sky-100 font-bold text-navy' : 'text-muted'}`}>
                  {right ? <Check className="size-4 shrink-0" aria-label="Correct answer" /> : <span className="size-4 shrink-0" />}
                  {choice}
                </li>
              )
            })}
          </ul>
        </li>
      ))}
    </ol>
  )
}
