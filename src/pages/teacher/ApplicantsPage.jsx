import { useDeferredValue, useState } from 'react'
import { Check, X } from 'lucide-react'
import { getProgram } from '../../data/students'
import { formatDate } from '../../lib/format'
import { useAdmin } from '../../context/AdminContext'
import { useToast } from '../../components/Toast'
import SearchField, { selectClass } from '../../components/teacher/SearchField'

const statusPill = {
  pending: 'bg-lemon-100 text-ochre-800',
  approved: 'bg-mint-200 text-primary-700',
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

  const onDecide = (a, verdict) => {
    decide(a.id, verdict)
    toast(verdict === 'approved' ? `${a.full_name} approved and enrolled` : `${a.full_name} declined`)
  }

  return (
    <div>
      <h1 className="text-3xl font-extrabold text-primary">Applicants</h1>
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

      <div className="card mt-5 overflow-x-auto">
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
                  {q ? `No applicants match "${query.trim()}".` : `No ${status === 'all' ? '' : status} applicants.`}
                </td>
              </tr>
            ) : (
              rows.map((a) => (
                <tr key={a.id} className="transition-colors duration-150 hover-fine:bg-mint-50">
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
                    {a.status === 'pending' && (
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => onDecide(a, 'approved')}
                          className="pressable inline-flex items-center gap-1.5 rounded-pill bg-primary px-3.5 py-2 text-sm font-bold text-white transition-colors duration-150 hover:bg-primary-700"
                        >
                          <Check className="size-4" strokeWidth={2.5} aria-hidden="true" /> Approve
                        </button>
                        <button
                          onClick={() => onDecide(a, 'declined')}
                          className="pressable inline-flex items-center gap-1.5 rounded-pill border border-line px-3.5 py-2 text-sm font-bold text-muted transition-colors duration-150 hover:border-mint hover:bg-wash hover:text-ink"
                        >
                          <X className="size-4" strokeWidth={2.5} aria-hidden="true" /> Decline
                        </button>
                      </div>
                    )}
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
