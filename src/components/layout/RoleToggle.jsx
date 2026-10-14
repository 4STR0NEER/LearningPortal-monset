import { useId } from 'react'
import { motion } from 'motion/react'
import { useRole } from '../../context/RoleContext'

const options = [
  { value: 'student', label: 'Student' },
  { value: 'teacher', label: 'Teacher' },
]

// Segmented control. The white pill slides between options via Motion's layoutId.
// useId keeps the two instances (top bar + avatar menu) from fighting over one pill.
export default function RoleToggle({ className = '' }) {
  const { role, setRole } = useRole()
  const pillId = useId()

  return (
    <div role="radiogroup" aria-label="View as" className={`inline-flex rounded-full border border-line bg-wash p-1 ${className}`}>
      {options.map((o) => {
        const active = role === o.value
        return (
          <button
            key={o.value}
            role="radio"
            aria-checked={active}
            onClick={() => setRole(o.value)}
            className={`pressable relative rounded-full px-3.5 py-1.5 text-sm font-bold transition-colors duration-150 ${active ? 'text-primary' : 'text-muted hover:text-ink'}`}
          >
            {active && (
              <motion.span
                layoutId={pillId}
                className="absolute inset-0 rounded-full bg-surface shadow-card"
                transition={{ type: 'spring', bounce: 0, duration: 0.3 }}
              />
            )}
            <span className="relative">{o.label}</span>
          </button>
        )
      })}
    </div>
  )
}
