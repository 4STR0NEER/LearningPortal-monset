import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import { applicants as seedApplicants } from '../data/applicants'
import { students as seedStudents } from '../data/students'

// Why a context: the Applicants page changes data the Dashboard reads (Pending count, Total Students).
// Both pages are separate routes, so the rows live above the router outlet and both read them here.
// In-memory only, like ProgressContext: a refresh resets the demo.
const AdminContext = createContext(null)

export function AdminProvider({ children }) {
  const [applicants, setApplicants] = useState(seedApplicants)
  const [students, setStudents] = useState(seedStudents)

  // Approve or decline a pending applicant. Approving also inserts the student row.
  const decide = useCallback(
    (id, status) => {
      const a = applicants.find((x) => x.id === id)
      if (!a || a.status !== 'pending') return
      setApplicants((rows) => rows.map((r) => (r.id === id ? { ...r, status } : r)))
      if (status === 'approved') {
        setStudents((rows) => [
          ...rows,
          {
            id: `s-${String(rows.length + 1).padStart(3, '0')}`,
            profile_id: null,
            student_no: `2026-${String(rows.length * 3 + 100).padStart(5, '0')}`,
            full_name: a.full_name,
            email: a.email,
            program_id: a.program_id,
            year_level: 1,
            enrolled_at: new Date().toISOString().slice(0, 10),
          },
        ])
      }
    },
    [applicants],
  )

  const value = useMemo(
    () => ({
      applicants,
      students,
      decide,
      pendingCount: applicants.filter((a) => a.status === 'pending').length,
      enrolledIn: (programId) => students.filter((s) => s.program_id === programId).length,
    }),
    [applicants, students, decide],
  )

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>
}

export const useAdmin = () => useContext(AdminContext)
