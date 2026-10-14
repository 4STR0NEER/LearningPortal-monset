import { AnimatePresence, motion } from 'motion/react'

// Initials crossfade when the role flips (CJ <-> SC).
export default function Avatar({ initials, size = 'md' }) {
  const box = size === 'sm' ? 'size-9 text-xs' : 'size-11 text-sm'
  return (
    <span className={`relative grid shrink-0 place-items-center rounded-full bg-primary font-bold text-white ${box}`}>
      <AnimatePresence initial={false}>
        <motion.span
          key={initials}
          className="col-start-1 row-start-1"
          initial={{ opacity: 0, filter: 'blur(2px)' }}
          animate={{ opacity: 1, filter: 'blur(0px)' }}
          exit={{ opacity: 0, filter: 'blur(2px)' }}
          transition={{ duration: 0.18 }}
        >
          {initials}
        </motion.span>
      </AnimatePresence>
    </span>
  )
}
