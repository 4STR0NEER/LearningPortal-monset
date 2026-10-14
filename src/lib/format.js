const dateFmt = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' })

// '2026-10-14' -> 'Oct 14, 2026'. The T00:00 keeps it local time, so the day never shifts by timezone.
export const formatDate = (iso) => dateFmt.format(new Date(`${iso}T00:00:00`))
