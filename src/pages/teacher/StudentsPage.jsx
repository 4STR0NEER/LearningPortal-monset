import { useDeferredValue, useState } from 'react'
import { getProgram, programs } from '../../data/students'
import { useAdmin } from '../../context/AdminContext'
import { formatDate } from '../../lib/format'
import SearchField, { selectClass } from '../../components/teacher/SearchField'

const YEAR = ['1st', '2nd', '3rd', '4th']

export default function StudentsPage() {
  const { students } = useAdmin()
  const [query, setQuery] = useState('')
  const [program, setProgram] = useState('all')
  const q = useDeferredValue(query.trim().toLowerCase())

  const rows = students
    .filter((s) => program === 'all' || s.program_id === program)
    .filter((s) => !q || s.full_name.toLowerCase().includes(q) || s.email.includes(q) || s.student_no.includes(q))
    .sort((a, b) => a.full_name.localeCompare(b.full_name))

  return (
    <div>
      <h1 className="text-3xl font-extrabold text-navy">Students Enrolled</h1>
      <p className="mt-1 text-muted">
        <span className="font-bold text-ink tabular-nums">{students.length}</span> confirmed enrollees across {programs.length} programs
      </p>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <SearchField value={query} onChange={setQuery} label="Search name, email or student no." className="flex-1" />
        <label>
          <span className="sr-only">Program</span>
          <select value={program} onChange={(e) => setProgram(e.target.value)} className={`${selectClass} w-full sm:w-auto`}>
            <option value="all">All programs</option>
            {programs.map((p) => (
              <option key={p.id} value={p.id}>
                {p.code}
              </option>
            ))}
          </select>
        </label>
      </div>

      <ul className="card mt-5 divide-y divide-line md:hidden">
        {rows.length === 0 ? (
          <li className="px-5 py-14 text-center text-muted">No students match your search.</li>
        ) : (
          rows.map((s) => (
            <li key={s.id} className="flex items-start justify-between gap-3 p-4">
              <div className="min-w-0">
                <p className="font-bold text-ink">{s.full_name}</p>
                <p className="truncate text-xs text-muted">{s.email}</p>
                <p className="mt-1.5 text-xs text-muted tabular-nums">
                  {s.student_no} · {YEAR[s.year_level - 1]} year
                </p>
              </div>
              <span className="shrink-0 rounded-full bg-sky-200 px-2.5 py-0.5 text-xs font-bold text-navy">{getProgram(s.program_id).code}</span>
            </li>
          ))
        )}
      </ul>

      <div className="card mt-5 hidden overflow-x-auto md:block">
        <table className="w-full min-w-[720px] text-sm">
          <thead className="bg-wash text-left">
            <tr>
              <th scope="col" className="px-5 py-3.5 font-extrabold text-ink">Student</th>
              <th scope="col" className="px-3 py-3.5 font-extrabold text-ink">Student no.</th>
              <th scope="col" className="px-3 py-3.5 font-extrabold text-ink">Program</th>
              <th scope="col" className="px-3 py-3.5 font-extrabold text-ink">Year</th>
              <th scope="col" className="px-5 py-3.5 font-extrabold text-ink">Enrolled</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {rows.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-5 py-14 text-center text-muted">
                  No students match your search.
                </td>
              </tr>
            ) : (
              rows.map((s) => (
                <tr key={s.id} className="transition-colors duration-150 hover-fine:bg-sky-50">
                  <th scope="row" className="px-5 py-3 text-left font-normal">
                    <span className="block font-bold text-ink">{s.full_name}</span>
                    <span className="block text-xs text-muted">{s.email}</span>
                  </th>
                  <td className="px-3 py-3 text-muted tabular-nums">{s.student_no}</td>
                  <td className="px-3 py-3">
                    <span className="rounded-full bg-sky-200 px-2.5 py-0.5 text-xs font-bold text-navy">{getProgram(s.program_id).code}</span>
                  </td>
                  <td className="px-3 py-3 text-ink">{YEAR[s.year_level - 1]} year</td>
                  <td className="px-5 py-3 text-muted tabular-nums">{formatDate(s.enrolled_at)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <p className="mt-3 text-xs text-muted">
        Showing {rows.length} of {students.length} students
      </p>
    </div>
  )
}
