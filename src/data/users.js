// Table: profiles (one row per auth user). The role toggle picks which demo profile is "signed in".
export const profiles = [
  { id: 'u-student-01', role: 'student', first_name: 'Christian', full_name: 'Christian Jay Dela Cruz', initials: 'CJ', email: 'christian.delacruz@brightwater.edu', program_id: 'btled-afa' },
  { id: 'u-teacher-01', role: 'teacher', first_name: 'Chan', full_name: 'Sir Chan', initials: 'SC', email: 'chan@brightwater.edu', program_id: null },
]

export const profileForRole = (role) => profiles.find((p) => p.role === role)
