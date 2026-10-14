import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router'
import { AnimatePresence, motion } from 'motion/react'
import { User } from 'lucide-react'
import { useRole } from '../../context/RoleContext'
import RoleToggle from './RoleToggle'

// One menu, two triggers: the top-bar avatar (opens down) and the sidebar kebab (opens up).
// `trigger` is a render function so each place keeps its own button look.
export default function UserMenu({ trigger, placement = 'down', align = 'right' }) {
  const { user, role } = useRole()
  const [open, setOpen] = useState(false)
  const root = useRef(null)

  useEffect(() => {
    if (!open) return
    const onDown = (e) => !root.current?.contains(e.target) && setOpen(false)
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('pointerdown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('pointerdown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  const up = placement === 'up'

  return (
    <div ref={root} className="relative">
      {trigger({ open, toggle: () => setOpen((o) => !o) })}
      <AnimatePresence>
        {open && (
          <motion.div
            role="menu"
            initial={{ opacity: 0, transform: 'scale(0.96)' }}
            animate={{ opacity: 1, transform: 'scale(1)' }}
            exit={{ opacity: 0, transform: 'scale(0.98)', transition: { duration: 0.1 } }}
            transition={{ duration: 0.16, ease: [0.23, 1, 0.32, 1] }}
            style={{ transformOrigin: `${up ? 'bottom' : 'top'} ${align}` }}
            className={`card absolute ${align === 'left' ? 'left-0' : 'right-0'} z-50 w-64 p-2 shadow-pop ${up ? 'bottom-full mb-2' : 'top-full mt-2'}`}
          >
            <div className="px-2.5 pt-1.5 pb-3">
              <p className="font-bold text-ink">{user.full_name}</p>
              <p className="truncate text-xs text-muted">{user.email}</p>
            </div>
            <div className="border-t border-line px-2.5 pt-3 pb-2">
              <p className="mb-2 text-xs font-semibold text-muted">View as</p>
              <RoleToggle className="w-full [&>button]:flex-1" />
            </div>
            {role === 'student' && (
              <Link
                to="/student/profile"
                role="menuitem"
                onClick={() => setOpen(false)}
                className="mt-1 flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm font-semibold text-ink transition-colors duration-150 hover:bg-wash"
              >
                <User className="size-4 text-primary" aria-hidden="true" /> My profile
              </Link>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
