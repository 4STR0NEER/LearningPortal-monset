import { Download } from 'lucide-react'
import { getCourse } from '../../data/courses'
import { programs } from '../../data/students'
import { course_completion } from '../../data/matrix'
import { useAdmin } from '../../context/AdminContext'
import { useToast } from '../../components/Toast'
import { ProgressBar } from '../../components/Progress'

export default function ReportsPage() {
  const { students, applicants, enrolledIn } = useAdmin()
  const toast = useToast()

  const pipeline = [
    { label: 'Pending', status: 'pending', className: 'bg-orange-100 text-orange-800' },
    { label: 'Approved', status: 'approved', className: 'bg-sky-200 text-navy' },
    { label: 'Declined', status: 'declined', className: 'bg-wash text-muted' },
  ].map((p) => ({ ...p, count: applicants.filter((a) => a.status === p.status).length }))

  const byCompletion = [...course_completion].sort((a, b) => b.avg_completion - a.avg_completion)

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-navy">Reports</h1>
          <p className="mt-1 text-muted">Enrollment and course performance summaries</p>
        </div>
        <button
          onClick={() => toast('Export to PDF and Excel is coming soon')}
          className="pressable inline-flex items-center gap-2 self-start rounded-pill bg-navy px-5 py-2.5 text-sm font-bold text-white transition-colors duration-150 wipe sm:self-auto"
        >
          <Download className="size-4" aria-hidden="true" /> Export
        </button>
      </div>

      <div className="mt-6 grid items-start gap-6 lg:grid-cols-2">
        <section className="card p-5 sm:p-6">
          <h2 className="font-extrabold text-navy">Enrollment by program</h2>
          <p className="text-sm text-muted">{students.length} confirmed enrollees</p>
          <ul className="mt-5 space-y-4">
            {programs.map((p) => {
              const n = enrolledIn(p.id)
              const share = Math.round((n / students.length) * 100)
              return (
                <li key={p.id}>
                  <div className="mb-1.5 flex items-baseline justify-between gap-3 text-sm">
                    <span className="font-bold text-ink">{p.code}</span>
                    <span className="text-muted tabular-nums">
                      <span className="font-extrabold text-navy">{n}</span> · {share}%
                    </span>
                  </div>
                  <ProgressBar value={share} label={`${p.code} share of enrollees`} />
                </li>
              )
            })}
          </ul>
        </section>

        <section className="card p-5 sm:p-6">
          <h2 className="font-extrabold text-navy">Applicant pipeline</h2>
          <p className="text-sm text-muted">{applicants.length} applications this term</p>
          <ul className="mt-5 grid grid-cols-3 gap-3">
            {pipeline.map((p) => (
              <li key={p.status} className="rounded-xl border border-line p-4">
                <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${p.className}`}>{p.label}</span>
                <p className="mt-3 text-3xl font-black text-navy tabular-nums">{p.count}</p>
              </li>
            ))}
          </ul>
        </section>

        <section className="card p-5 sm:p-6 lg:col-span-2">
          <h2 className="font-extrabold text-navy">Course completion</h2>
          <p className="text-sm text-muted">Average share of materials finished, with students at mastery level</p>
          <ul className="mt-5 grid gap-x-10 gap-y-4 md:grid-cols-2">
            {byCompletion.map((c) => (
              <li key={c.course_id}>
                <div className="mb-1.5 flex items-baseline justify-between gap-3 text-sm">
                  <span className="truncate font-bold text-ink">{getCourse(c.course_id).title}</span>
                  <span className="shrink-0 text-muted tabular-nums">
                    <span className="font-extrabold text-navy">{c.avg_completion}%</span> · {c.mastered} mastered
                  </span>
                </div>
                <ProgressBar value={c.avg_completion} label={`${getCourse(c.course_id).title} average completion`} />
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  )
}
