import { useLayoutEffect, useRef } from 'react'
import { Link } from 'react-router'
import { animate, createScope, stagger, utils } from 'animejs'
import { courses } from '../../data/courses'
import { useRole } from '../../context/RoleContext'
import { useProgress } from '../../context/ProgressContext'
import CourseIcon from '../../components/CourseIcon'
import { ProgressBar } from '../../components/Progress'

export default function StudentDashboard() {
  const { user } = useRole()
  const { courseProgress } = useProgress()
  const grid = useRef(null)

  // Card entrance: anime.js stagger on the <li> wrappers. The hover lift lives on the inner <Link>
  // in CSS, so the two never fight over the same transform.
  // useLayoutEffect hides the cards before the first paint, so there's no flash of finished cards.
  useLayoutEffect(() => {
    const scope = createScope({ root: grid, mediaQueries: { reduceMotion: '(prefers-reduced-motion: reduce)' } }).add((self) => {
      if (self.matches.reduceMotion) return
      utils.set('.course-item', { opacity: 0, y: 14 })
      animate('.course-item', { opacity: 1, y: 0, duration: 420, delay: stagger(45), ease: 'out(4)' })
    })
    return () => scope.revert()
  }, [])

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden rounded-[18px] bg-linear-to-r from-navy to-primary px-6 max-sm:to-primary-700 py-9 text-white shadow-card sm:px-10 sm:py-12">
        {/* Soft sky highlight, like sun on water. (A yellow glow mixes with the blue into olive.) Kept clear of the text on phones. */}
        <div className="pointer-events-none absolute -top-24 right-[8%] size-72 rounded-full bg-sky-200/25 blur-3xl max-sm:-top-44 max-sm:-right-32" aria-hidden="true" />
        <h1 className="relative text-3xl font-extrabold tracking-tight text-balance sm:text-4xl lg:text-[44px] lg:leading-[1.1]">
          Welcome back, {user.first_name}!
        </h1>
        <p className="relative mt-3 max-w-[62ch] text-lg leading-relaxed text-white sm:text-xl">
          Ready to continue learning? Select a course below to view your current progress, access learning materials, and complete your assessments.
        </p>
      </section>

      <h2 className="mt-10 mb-6 text-2xl font-extrabold text-navy sm:text-[28px]">Your Enrolled Courses</h2>

      <ul ref={grid} className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:gap-8">
        {courses.map((c) => {
          const pct = courseProgress(c.id)
          return (
            <li key={c.id} className="course-item">
              <Link
                to={`/student/courses/${c.id}`}
                className="card group flex h-full flex-col overflow-hidden transition-[transform,box-shadow] duration-200 ease-out hover-fine:-translate-y-1 hover-fine:shadow-lift active:scale-[0.98]"
              >
                <div className="grid h-36 place-items-center bg-wash">
                  <span className="grid size-[88px] place-items-center rounded-full border border-sky bg-surface shadow-card">
                    <CourseIcon name={c.icon} className="size-9 text-primary" strokeWidth={1.5} />
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <h3 className="text-xl leading-snug font-extrabold text-navy">{c.title}</h3>
                  <p className="mt-1.5 mb-5 line-clamp-2 text-[15px] text-muted">{c.description}</p>
                  <div className="mt-auto">
                    <ProgressBar value={pct} label={`${c.title} progress`} />
                    <p className="mt-2 text-sm text-muted">
                      <span className="font-extrabold text-navy tabular-nums">{pct}%</span> completed
                    </p>
                  </div>
                </div>
              </Link>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
