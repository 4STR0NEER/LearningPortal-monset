import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Info } from 'lucide-react'

// One toast at a time: a new message replaces the old one, so rapid clicks never stack a tower.
// Any component calls `const toast = useToast(); toast('Saved')`.
const ToastContext = createContext(() => {})

export function ToastProvider({ children }) {
  const [msg, setMsg] = useState(null) // { id, text }
  const timer = useRef()

  const toast = useCallback((text) => {
    clearTimeout(timer.current)
    setMsg({ id: Date.now(), text })
    timer.current = setTimeout(() => setMsg(null), 2800)
  }, [])

  useEffect(() => () => clearTimeout(timer.current), [])

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div aria-live="polite" className="pointer-events-none fixed inset-x-4 bottom-4 z-[90] flex justify-center sm:inset-x-auto sm:right-6 sm:bottom-6">
        <AnimatePresence initial={false} mode="popLayout">
          {msg && (
            <motion.p
              key={msg.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
              className="pointer-events-auto flex items-center gap-2.5 rounded-pill bg-ink px-4 py-3 text-sm font-semibold text-white shadow-pop"
            >
              <Info className="size-4 shrink-0 text-sun" aria-hidden="true" />
              {msg.text}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  )
}

export const useToast = () => useContext(ToastContext)
