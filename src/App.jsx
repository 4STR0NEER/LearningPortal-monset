import { lazy, useCallback, useState } from 'react'
import { Navigate, Route, Routes } from 'react-router'
import AppShell from './components/layout/AppShell'
import LoadingScreen from './components/LoadingScreen'
import StudentDashboard from './pages/student/StudentDashboard'
import CoursePage from './pages/student/CoursePage'
import ProfilePage from './pages/student/ProfilePage'

// Teacher pages load on demand: a student session never downloads them, and the first screen arrives sooner.
const TeacherDashboard = lazy(() => import('./pages/teacher/TeacherDashboard'))
const ApplicantsPage = lazy(() => import('./pages/teacher/ApplicantsPage'))
const StudentsPage = lazy(() => import('./pages/teacher/StudentsPage'))
const TeacherCoursePage = lazy(() => import('./pages/teacher/TeacherCoursePage'))
const ReportsPage = lazy(() => import('./pages/teacher/ReportsPage'))
import { useRole } from './context/RoleContext'

export default function App() {
  const { role } = useRole()
  // 'loading' -> 'leaving' (app mounts under the fading overlay, so its entrance plays as it's revealed) -> 'done'
  const [boot, setBoot] = useState('loading')
  const onLeave = useCallback(() => setBoot('leaving'), [])
  const onDone = useCallback(() => setBoot('done'), [])

  return (
    <>
      {boot !== 'loading' && (
        <Routes>
          <Route element={<AppShell />}>
            <Route path="student">
              <Route index element={<StudentDashboard />} />
              <Route path="courses/:courseId" element={<CoursePage />} />
              <Route path="profile" element={<ProfilePage />} />
            </Route>
            <Route path="teacher">
              <Route index element={<TeacherDashboard />} />
              <Route path="applicants" element={<ApplicantsPage />} />
              <Route path="students" element={<StudentsPage />} />
              <Route path="courses/:courseId" element={<TeacherCoursePage />} />
              <Route path="reports" element={<ReportsPage />} />
            </Route>
          </Route>
          <Route path="*" element={<Navigate to={`/${role}`} replace />} />
        </Routes>
      )}
      {boot !== 'done' && <LoadingScreen onLeave={onLeave} onDone={onDone} />}
    </>
  )
}
