import { useDeferredValue, useState } from 'react'
import { Check, X } from 'lucide-react'
import { getProgram } from '../../data/students'
import { formatDate } from '../../lib/format'
import { useAdmin } from '../../context/AdminContext'
import { useToast } from '../../components/Toast'
import SearchField, { selectClass } from '../../components/teacher/SearchField'

const statusPill = {
  pending: 'bg-orange-100 text-orange-800',
  approved: 'bg-sky-200 text-navy',
  declined: 'bg-wash text-muted',
}
const statusOrder = { pending: 0, approved: 1, declined: 2 }

export default function ApplicantsPage() {
  const { applicants, pendingCount, decide } = useAdmin()
  const toast = useToast()
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState('pending')
  // useDeferredValue: typing stays instant, the table filter catches up a frame later.
  const q = useDeferredValue(query.trim().toLowerCase())

  const rows = applicants
    .filter((a) => status === 'all' || a.status === status)
    .filter((a) => !q || a.full_name.toLowerCase().includes(q) || a.email.includes(q) || getProgram(a.program_id).code.toLowerCase().includes(q))
    .sort((a, b) => statusOrder[a.status] - statusOrder[b.status] || b.applied_at.localeCompare(a.applied_at))

  const emptyText = q ? `No applicants match "${query.trim()}".` : `No ${status === 'all' ? '' : status} applicants.`

  const onDecide = (a, verdict) => {
    decide(a.id, verdict)
    toast(verdict === 'approved' ? `${a.full_name} approved and enrolled` : `${a.full_name} declined`)
  }

  return (
    <div>
      <h1 className="text-3xl font-extrabold text-navy">Applicants</h1>
      <p className="mt-1 text-muted">
        <span className="font-bold text-ink tabular-nums">{pendingCount}</span> awaiting review
      </p>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <SearchField value={query} onChange={setQuery} label="Search name, email or program" className="flex-1" />
        <label className="flex items-center gap-2">
          <span className="sr-only">Status</span>
          <select value={status} onChange={(e) => setStatus(e.target.value)} className={`${selectClass} w-full sm:w-auto`}>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="declined">Declined</option>
            <option value="all">All statuses</option>
          </select>
        </label>
      </div>

      {/* Phones: one card per applicant, so Approve / Decline are always on screen (a wide table hides them off to the right). */}
      <ul className="card mt-5 divide-y divide-line md:hidden">
        {rows.length === 0 ? (
          <li className="px-5 py-14 text-center text-muted">{emptyText}</li>
        ) : (
          rows.map((a) => (
            <li key={a.id} className="p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-bold text-ink">{a.full_name}</p>
                  <p className="truncate text-xs text-muted">{a.email}</p>
                </div>
                <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-bold capitalize ${statusPill[a.status]}`}>{a.status}</span>
              </div>
              <p className="mt-2 text-sm text-muted">
                <span className="font-semibold text-ink">{getProgram(a.program_id).code}</span> · Applied {formatDate(a.applied_at)}
              </p>
              {a.status === 'pending' && <Actions applicant={a} onDecide={onDecide} className="mt-3 [&>button]:h-11 [&>button]:flex-1 [&>button]:justify-center" />}
            </li>
          ))
        )}
      </ul>

      <div className="card mt-5 hidden overflow-x-auto md:block">
        <table className="w-full min-w-[760px] text-sm">
          <thead className="bg-wash text-left">
            <tr>
              <th scope="col" className="px-5 py-3.5 font-extrabold text-ink">Applicant</th>
              <th scope="col" className="px-3 py-3.5 font-extrabold text-ink">Program</th>
              <th scope="col" className="px-3 py-3.5 font-extrabold text-ink">Date applied</th>
              <th scope="col" className="px-3 py-3.5 font-extrabold text-ink">Status</th>
              <th scope="col" className="px-5 py-3.5 text-right font-extrabold text-ink">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {rows.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-5 py-14 text-center text-muted">
                  {emptyText}
                </td>
              </tr>
            ) : (
              rows.map((a) => (
                <tr key={a.id} className="transition-colors duration-150 hover-fine:bg-sky-50">
                  <th scope="row" className="px-5 py-3 text-left font-normal">
                    <span className="block font-bold text-ink">{a.full_name}</span>
                    <span className="block text-xs text-muted">{a.email}</span>
                  </th>
                  <td className="px-3 py-3 font-semibold text-ink">{getProgram(a.program_id).code}</td>
                  <td className="px-3 py-3 text-muted tabular-nums">{formatDate(a.applied_at)}</td>
                  <td className="px-3 py-3">
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold capitalize ${statusPill[a.status]}`}>{a.status}</span>
                  </td>
                  <td className="px-5 py-3">
                    {a.status === 'pending' && <Actions applicant={a} onDecide={onDecide} />}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <p className="mt-3 text-xs text-muted">
        Showing {rows.length} of {applicants.length} applicants
      </p>
    </div>
  )
}

function Actions({ applicant, onDecide, className = 'justify-end' }) {
  return (
    <div className={`flex gap-2 ${className}`}>
      <button
        onClick={() => onDecide(applicant, 'approved')}
        className="pressable inline-flex items-center gap-1.5 rounded-pill bg-navy px-3.5 py-2 text-sm font-bold text-white transition-colors duration-150 hover:bg-primary-700"
      >
        <Check className="size-4" strokeWidth={2.5} aria-hidden="true" /> Approve
      </button>
      <button
        onClick={() => onDecide(applicant, 'declined')}
        className="pressable inline-flex items-center gap-1.5 rounded-pill border border-line px-3.5 py-2 text-sm font-bold text-muted transition-colors duration-150 hover:border-sky hover:bg-wash hover:text-ink"
      >
        <X className="size-4" strokeWidth={2.5} aria-hidden="true" /> Decline
      </button>
    </div>
  )
}
