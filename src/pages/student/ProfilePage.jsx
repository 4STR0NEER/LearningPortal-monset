import { Link } from 'react-router'
import { courses } from '../../data/courses'
import { CURRENT_STUDENT_ID, getProgram, students } from '../../data/students'
import { useProgress } from '../../context/ProgressContext'
import { useRole } from '../../context/RoleContext'
import CourseIcon from '../../components/CourseIcon'
import { ProgressBar } from '../../components/Progress'

export default function ProfilePage() {
  const me = students.find((s) => s.id === CURRENT_STUDENT_ID)
  const program = getProgram(me.program_id)
  const { courseProgress, completedQuizCount } = useProgress()
  const progress = courses.map((c) => ({ ...c, pct: courseProgress(c.id) }))
  const avg = Math.round(progress.reduce((sum, c) => sum + c.pct, 0) / progress.length)
  const { initials } = useRole().user

  const facts = [
    ['Student no.', me.student_no],
    ['Email', me.email],
    ['Program', program.code],
    ['Year level', `Year ${me.year_level}`],
    ['Enrolled since', new Date(me.enrolled_at).toLocaleDateString('en', { month: 'long', year: 'numeric' })],
  ]

  const stats = [
    ['Enrolled courses', courses.length],
    ['Average progress', `${avg}%`],
    ['Quizzes completed', completedQuizCount()],
  ]

  return (
    <div>
      <h1 className="text-3xl font-extrabold text-navy sm:text-[32px]">Profile</h1>
      <p className="mt-1 text-muted">Your account and learning summary</p>

      <div className="mt-6 grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
        <section className="card overflow-hidden">
          <div className="h-20 bg-navy" />
          <div className="-mt-10 px-6 pb-6">
            <span className="grid size-20 place-items-center rounded-full border-4 border-surface bg-navy text-2xl font-black text-white">{initials}</span>
            <h2 className="mt-3 text-xl font-extrabold text-navy">{me.full_name}</h2>
            <p className="text-sm text-muted">{program.name}</p>
            <dl className="mt-5 divide-y divide-line border-t border-line text-sm">
              {facts.map(([k, v]) => (
                <div key={k} className="flex justify-between gap-4 py-2.5">
                  <dt className="text-muted">{k}</dt>
                  <dd className="truncate text-right font-semibold text-ink">{v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        <div className="space-y-6">
          <section className="grid gap-4 sm:grid-cols-3">
            {stats.map(([label, value]) => (
              <div key={label} className="card p-5">
                <p className="text-sm font-semibold text-muted">{label}</p>
                <p className="mt-1 text-3xl font-black text-navy tabular-nums">{value}</p>
              </div>
            ))}
          </section>

          <section className="card p-5 sm:p-6">
            <h2 className="mb-4 text-lg font-extrabold text-navy">Enrolled courses</h2>
            <ul className="divide-y divide-line">
              {progress.map((c) => (
                <li key={c.id}>
                  <Link to={`/student/courses/${c.id}`} className="-mx-2 flex items-center gap-4 rounded-lg px-2 py-3 transition-colors duration-150 hover-fine:bg-wash">
                    <span className="grid size-10 shrink-0 place-items-center rounded-full border border-sky bg-surface">
                      <CourseIcon name={c.icon} className="size-5 text-primary" strokeWidth={1.75} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-bold text-ink">{c.title}</span>
                      <span className="mt-1.5 block max-w-xs">
                        <ProgressBar value={c.pct} label={`${c.title} progress`} />
                      </span>
                    </span>
                    <span className="w-12 text-right text-sm font-extrabold text-navy tabular-nums">{c.pct}%</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </div>
  )
}
