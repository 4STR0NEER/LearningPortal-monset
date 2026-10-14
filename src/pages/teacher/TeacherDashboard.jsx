import { lazy, Suspense, useLayoutEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { animate } from 'animejs'
import { BarChart3, CircleCheckBig, GraduationCap, Trophy, UserPlus, Users } from 'lucide-react'
import { courses, getCourse } from '../../data/courses'
import { getProgram, programs } from '../../data/students'
import { matrixRows, top_scorers } from '../../data/matrix'
import { useAdmin } from '../../context/AdminContext'
// Recharts is most of the bundle, and only this tab uses it. lazy() puts it in its own file that
// downloads the first time the tab opens, so every other screen loads faster.
const CompletionCharts = lazy(() => import('../../components/teacher/CompletionCharts'))

// Each tab owns its header copy and body. The dashboard renders the header the same way for all three.
const tabs = [
  { id: 'activity', label: 'Program & Course Activity', icon: CircleCheckBig, title: 'Course Progress Matrix', subtitle: 'Number of students with active progress per program', Body: ProgressMatrix },
  { id: 'mastery', label: 'Completion & Mastery', icon: BarChart3, title: 'Completion & Mastery', subtitle: 'Average completion and mastery level per course', Body: CompletionCharts },
  { id: 'scorers', label: 'Top Scorers', icon: Trophy, title: 'Top Scorers', subtitle: 'Highest average quiz scores across all courses', Body: TopScorers },
]

export default function TeacherDashboard() {
  // dir is +1 when moving to a tab on the right, -1 to the left: the panel slides in from that side.
  const [[tab, dir], setTabState] = useState([tabs[0].id, 0])
  const setTab = (id) => setTabState(([cur]) => [id, Math.sign(tabs.findIndex((t) => t.id === id) - tabs.findIndex((t) => t.id === cur))])
  const tabRefs = useRef({})
  const current = tabs.find((t) => t.id === tab)
  const { students, pendingCount } = useAdmin()
  const stats = [
    { label: 'Total Students', value: students.length, caption: 'Confirmed Enrollees', icon: Users },
    { label: 'Pending Applicants', value: pendingCount, caption: 'Awaiting Review', icon: UserPlus, alert: pendingCount > 0 },
    { label: 'Total Courses', value: courses.length, caption: 'Active Courses', icon: GraduationCap },
  ]

  // Arrow keys move between tabs (the WAI-ARIA tabs pattern): one Tab stop for the whole group.
  const onKeyDown = (e) => {
    const step = { ArrowRight: 1, ArrowLeft: -1 }[e.key]
    if (!step) return
    const i = (tabs.findIndex((t) => t.id === tab) + step + tabs.length) % tabs.length
    setTab(tabs[i].id)
    tabRefs.current[tabs[i].id]?.focus()
  }

  return (
    <div>
      <h1 className="text-3xl font-extrabold text-navy">Admin Dashboard</h1>
      <p className="mt-1 text-muted">Detailed Enrollment Statistics</p>

      <ul className="mt-6 grid gap-3 sm:grid-cols-3 sm:gap-5">
        {stats.map((s) => (
          <li key={s.label} className="rounded-card bg-navy p-5 text-white shadow-card sm:p-6">
            <div className="flex items-start justify-between gap-3">
              <p className="text-sm font-semibold">{s.label}</p>
              <span className="relative shrink-0">
                <s.icon className="size-5" strokeWidth={1.75} aria-hidden="true" />
                {/* Orange dot: there is something waiting for the teacher. */}
                {s.alert && <span className="absolute -top-1 -right-1 size-2.5 rounded-full bg-orange ring-2 ring-navy" aria-hidden="true" />}
              </span>
            </div>
            <p className="mt-2 text-[32px] leading-none font-extrabold tabular-nums sm:mt-3 sm:text-[40px]">
              <CountUp value={s.value} />
            </p>
            <p className="mt-2 text-sm text-white/80">{s.caption}</p>
          </li>
        ))}
      </ul>

      <div role="tablist" aria-label="Dashboard views" onKeyDown={onKeyDown} className="mt-8 grid gap-1 rounded-card border border-line bg-surface p-1.5 sm:flex">
        {tabs.map((t) => {
          const on = t.id === tab
          return (
            <button
              key={t.id}
              ref={(el) => (tabRefs.current[t.id] = el)}
              role="tab"
              id={`tab-${t.id}`}
              aria-selected={on}
              aria-controls={`panel-${t.id}`}
              tabIndex={on ? 0 : -1}
              onClick={() => setTab(t.id)}
              className={`pressable relative shrink-0 rounded-pill px-4 py-2.5 text-left text-sm font-bold whitespace-nowrap sm:text-center transition-colors duration-150 ${on ? 'text-white' : 'wipe-soft text-ink hover-fine:text-navy'}`}
            >
              {/* One shared layoutId: Motion slides this pill from the old tab to the new one. */}
              {on && <motion.span layoutId="dashboard-tab" className="absolute inset-0 rounded-pill bg-navy" transition={{ type: 'spring', duration: 0.3, bounce: 0 }} />}
              <span className="relative">{t.label}</span>
            </button>
          )
        })}
      </div>

      {/* overflow-x-clip: the 16px slide never makes the page scroll sideways on a phone. */}
      <div className="overflow-x-clip">
        {/* mode="wait": the old panel fades out fast (120ms) before the new one slides in, so the two never overlap. */}
        <AnimatePresence mode="wait" initial={false} custom={dir}>
          <motion.section
            key={tab}
            custom={dir}
            variants={panelMotion}
            initial="enter"
            animate="center"
            exit="exit"
            role="tabpanel"
            id={`panel-${tab}`}
            aria-labelledby={`tab-${tab}`}
            className="mt-6"
          >
            <header className="mb-5 flex items-center gap-3">
              <span className="grid size-10 shrink-0 place-items-center rounded-full border border-sky bg-surface text-navy">
                <current.icon className="size-5" strokeWidth={1.75} aria-hidden="true" />
              </span>
              <div>
                <h2 className="text-xl font-extrabold text-ink">{current.title}</h2>
                <p className="text-sm text-muted">{current.subtitle}</p>
              </div>
            </header>
            <Suspense fallback={<div className="card h-[420px] animate-pulse bg-wash motion-reduce:animate-none" aria-label="Loading charts" />}>
              <current.Body />
            </Suspense>
          </motion.section>
        </AnimatePresence>
      </div>
    </div>
  )
}

// Panel switch: a short slide (16px) toward the direction of travel, ease-out in, quicker ease-in out.
// MotionConfig reducedMotion="user" (main.jsx) drops the x movement and keeps the fade.
const panelMotion = {
  enter: (d) => ({ opacity: 0, x: d * 16 }),
  center: { opacity: 1, x: 0, transition: { duration: 0.22, ease: [0.23, 1, 0.32, 1] } },
  exit: (d) => ({ opacity: 0, x: d * -16, transition: { duration: 0.12, ease: [0.4, 0, 1, 1] } }),
}

// Counts from whatever is on screen to `value` with anime.js. Starts from the current number,
// so after an approval the pending count ticks 73 -> 72 instead of restarting at 0.
function CountUp({ value }) {
  const ref = useRef(null)
  useLayoutEffect(() => {
    const el = ref.current
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      el.textContent = value
      return
    }
    const counter = { n: Number(el.dataset.shown ?? 0) }
    const anim = animate(counter, {
      n: value,
      duration: 800,
      ease: 'out(4)',
      onUpdate: () => {
        el.textContent = Math.round(counter.n)
        el.dataset.shown = Math.round(counter.n)
      },
    })
    return () => anim.pause()
  }, [value])
  return (
    <>
      <span ref={ref} aria-hidden="true">0</span>
      <span className="sr-only">{value}</span>
    </>
  )
}

function ProgressMatrix() {
  const rows = matrixRows()
  const empty = rows.every((r) => r.total === 0)
  const { enrolledIn } = useAdmin()

  return (
    <div className="card overflow-x-auto">
      <table className="w-full min-w-[860px] text-sm">
        <thead className="bg-wash">
          <tr>
            {/* Course column stays put while the program columns scroll sideways on narrow screens. */}
            <th scope="col" className="sticky left-0 z-10 bg-wash px-5 py-4 text-left font-extrabold text-ink">Course Name</th>
            {programs.map((p) => (
              <th key={p.id} scope="col" className="px-3 py-4 text-center font-extrabold text-ink">
                {p.code}
                <span className="block text-xs font-normal text-muted">({enrolledIn(p.id)} enrolled)</span>
              </th>
            ))}
            <th scope="col" className="bg-sky-100 px-5 py-4 text-center font-extrabold text-navy">Total</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-line">
          {empty ? (
            <tr>
              <td colSpan={programs.length + 2} className="px-5 py-14 text-center text-muted">
                No course progress data available.
              </td>
            </tr>
          ) : (
            rows.map(({ course, cells, total }) => (
              <tr key={course.id} className="bg-surface transition-colors duration-150 hover-fine:bg-sky-50">
                <th scope="row" className="sticky left-0 z-10 bg-inherit px-5 py-3.5 text-left font-semibold text-ink max-sm:min-w-40">{course.title}</th>
                {cells.map((n, i) => (
                  <td key={programs[i].id} className="px-3 py-3.5 text-center">
                    {n ? (
                      <span className="inline-grid min-w-8 place-items-center rounded-pill bg-sky-200 px-2 py-0.5 font-extrabold text-navy tabular-nums">{n}</span>
                    ) : (
                      <span className="text-faint" aria-label="none">-</span>
                    )}
                  </td>
                ))}
                <td className="bg-sky-100 px-5 py-3.5 text-center font-extrabold text-navy tabular-nums">{total}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}

const rankBadge = {
  1: 'bg-sun text-navy',
  2: 'bg-orange text-navy',
  3: 'bg-orange text-navy',
}

function TopScorers() {
  return (
    <ol className="card divide-y divide-line">
      {top_scorers.map((s) => (
        <li key={s.rank} className="flex items-center gap-4 px-5 py-3.5">
          <span className={`grid size-8 shrink-0 place-items-center rounded-full text-sm font-extrabold tabular-nums ${rankBadge[s.rank] ?? 'bg-wash text-muted'}`}>
            <span className="sr-only">Rank </span>
            {s.rank}
          </span>
          <span className="grid size-10 shrink-0 place-items-center rounded-full bg-sky-200 text-sm font-bold text-navy" aria-hidden="true">
            {s.initials}
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate font-bold text-ink">{s.student_name}</p>
            <p className="truncate text-sm text-muted">
              {getProgram(s.program_id).code} · {getCourse(s.course_id).title}
            </p>
          </div>
          <p className="shrink-0 text-lg font-extrabold text-navy tabular-nums">{s.score_pct}%</p>
        </li>
      ))}
    </ol>
  )
}
