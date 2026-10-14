import { useCallback, useRef, useState } from 'react'
import { Link } from 'react-router'
import { AnimatePresence, motion } from 'motion/react'
import { Bell, BookOpen, ClipboardCheck, Megaphone, UserPlus, Clock } from 'lucide-react'
import { useRole } from '../../context/RoleContext'
import { notificationsFor } from '../../data/notifications'
import { useDismiss } from '../../lib/useDismiss'

// Icon tile per kind. Fills follow the palette roles: sun for quizzes, orange for "new / pending",
// sky for everything informational. Navy icons on all of them (7.7:1 or better).
const kinds = {
  grade: { icon: ClipboardCheck, tile: 'bg-sun-100' },
  applicant: { icon: UserPlus, tile: 'bg-orange-100' },
  reminder: { icon: Clock, tile: 'bg-orange-100' },
  material: { icon: BookOpen, tile: 'bg-sky-200' },
  announcement: { icon: Megaphone, tile: 'bg-sky-100' },
}

const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto', style: 'short' })
function timeAgo(iso) {
  const min = Math.round((Date.now() - new Date(iso)) / 60_000)
  if (min < 60) return rtf.format(-Math.max(min, 1), 'minute')
  if (min < 60 * 24) return rtf.format(-Math.round(min / 60), 'hour')
  return rtf.format(-Math.round(min / (60 * 24)), 'day')
}

export default function NotificationBell() {
  const { user } = useRole()
  const [open, setOpen] = useState(false)
  // Read state is in memory, like the rest of the demo. Seeded from read_at in the data.
  const [readIds, setReadIds] = useState(() => new Set())
  const root = useRef(null)
  const close = useCallback(() => setOpen(false), [])
  useDismiss(root, open, close)

  const items = notificationsFor(user.id)
  const isRead = (n) => n.read_at !== null || readIds.has(n.id)
  const unread = items.filter((n) => !isRead(n)).length
  const markRead = (ids) => setReadIds((s) => new Set([...s, ...ids]))

  return (
    <div ref={root} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-label={unread ? `Notifications, ${unread} unread` : 'Notifications'}
        className="pressable relative grid size-10 place-items-center rounded-lg text-navy transition-colors duration-150 hover:bg-wash"
      >
        <Bell className="size-5" strokeWidth={1.75} aria-hidden="true" />
        {unread > 0 && (
          <span className="absolute top-1 right-1 grid h-4 min-w-4 place-items-center rounded-full bg-navy px-1 text-[10px] leading-none font-extrabold text-sun tabular-nums ring-2 ring-surface" aria-hidden="true">
            {unread}
          </span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            role="dialog"
            aria-label="Notifications"
            initial={{ opacity: 0, transform: 'scale(0.96)' }}
            animate={{ opacity: 1, transform: 'scale(1)' }}
            exit={{ opacity: 0, transform: 'scale(0.98)', transition: { duration: 0.1 } }}
            transition={{ duration: 0.16, ease: [0.23, 1, 0.32, 1] }}
            style={{ transformOrigin: 'top right' }}
            // Phones: pinned under the top bar edge to edge, so it never runs off the left side.
            className="card z-50 overflow-hidden shadow-pop max-sm:fixed max-sm:inset-x-4 max-sm:top-[72px] sm:absolute sm:top-full sm:right-0 sm:mt-2 sm:w-96"
          >
            <div className="flex items-center justify-between gap-3 border-b border-line px-4 py-3">
              <p className="font-extrabold text-navy">
                Notifications
                {unread > 0 && <span className="ml-2 rounded-full bg-orange-100 px-2 py-0.5 text-xs font-bold text-orange-800 tabular-nums">{unread} new</span>}
              </p>
              {unread > 0 && (
                <button onClick={() => markRead(items.map((n) => n.id))} className="pressable rounded-lg px-2 py-1 text-sm font-bold text-primary-700 transition-colors duration-150 hover:bg-wash">
                  Mark all as read
                </button>
              )}
            </div>

            {items.length === 0 ? (
              <p className="px-4 py-10 text-center text-sm text-muted">You're all caught up.</p>
            ) : (
              <ul className="max-h-[min(420px,70dvh)] divide-y divide-line overflow-y-auto">
                {items.map((n) => {
                  const { icon: Icon, tile } = kinds[n.kind]
                  const fresh = !isRead(n)
                  return (
                    <li key={n.id}>
                      <Link
                        to={n.link}
                        onClick={() => {
                          markRead([n.id])
                          close()
                        }}
                        className={`flex gap-3 px-4 py-3 transition-colors duration-150 hover-fine:bg-sky-100 ${fresh ? 'bg-sky-50' : ''}`}
                      >
                        <span className={`grid size-9 shrink-0 place-items-center rounded-xl text-navy ${tile}`}>
                          <Icon className="size-4" strokeWidth={1.75} aria-hidden="true" />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="flex items-baseline justify-between gap-2">
                            <span className={`truncate text-sm text-ink ${fresh ? 'font-extrabold' : 'font-semibold'}`}>{n.title}</span>
                            <span className="shrink-0 text-xs text-muted">{timeAgo(n.created_at)}</span>
                          </span>
                          <span className="mt-0.5 block text-sm text-muted">{n.body}</span>
                        </span>
                        {fresh && <span className="mt-1.5 size-2 shrink-0 rounded-full bg-primary" aria-label="Unread" />}
                      </Link>
                    </li>
                  )
                })}
              </ul>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
