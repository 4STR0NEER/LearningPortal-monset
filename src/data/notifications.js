// Table: notifications (one row per recipient). `link` is the in-app route the item opens.
// Timestamps are made relative to page load so the demo always reads "2h ago", never "3 weeks ago".
const ago = (minutes) => new Date(Date.now() - minutes * 60_000).toISOString()

export const notifications = [
  // Christian (student)
  { id: 'n-s1', profile_id: 'u-student-01', kind: 'grade', title: 'Quiz graded', body: 'Week 1 Quiz Crop Production Part 1: you scored 8/10.', link: '/student/courses/agri-fishery', created_at: ago(25), read_at: null },
  { id: 'n-s2', profile_id: 'u-student-01', kind: 'material', title: 'New reading material', body: 'Computer Hardware Basics was added to ICT, Week 1.', link: '/student/courses/ict', created_at: ago(180), read_at: null },
  { id: 'n-s3', profile_id: 'u-student-01', kind: 'reminder', title: 'Quiz reminder', body: 'Industrial Arts Week 1 quizzes close on Friday.', link: '/student/courses/industrial-arts', created_at: ago(60 * 26), read_at: ago(60 * 20) },
  { id: 'n-s4', profile_id: 'u-student-01', kind: 'announcement', title: 'Week 2 unlocks soon', body: 'Agriculture and Fishery Arts Week 2 opens on Oct 20.', link: '/student/courses/agri-fishery', created_at: ago(60 * 50), read_at: ago(60 * 48) },

  // Sir Chan (teacher)
  { id: 'n-t1', profile_id: 'u-teacher-01', kind: 'applicant', title: 'New applicants', body: '5 people applied today and are waiting for review.', link: '/teacher/applicants', created_at: ago(15), read_at: null },
  { id: 'n-t2', profile_id: 'u-teacher-01', kind: 'grade', title: 'New top score', body: 'Maria Angela Santos scored 98% in Industrial Arts.', link: '/teacher', created_at: ago(95), read_at: null },
  { id: 'n-t3', profile_id: 'u-teacher-01', kind: 'material', title: 'Week completed', body: 'Kristine Mae Bautista finished Industrial Arts, Week 1.', link: '/teacher/courses/industrial-arts', created_at: ago(60 * 7), read_at: null },
  { id: 'n-t4', profile_id: 'u-teacher-01', kind: 'announcement', title: 'September report ready', body: 'Enrollment and completion summaries are up to date.', link: '/teacher/reports', created_at: ago(60 * 30), read_at: ago(60 * 28) },
]

export const notificationsFor = (profileId) => notifications.filter((n) => n.profile_id === profileId)
