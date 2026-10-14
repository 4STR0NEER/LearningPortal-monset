import { useEffect } from 'react'

// Close a popover on a click outside `ref` or on Escape. Used by the account menu and the bell.
export function useDismiss(ref, open, close) {
  useEffect(() => {
    if (!open) return
    const onDown = (e) => !ref.current?.contains(e.target) && close()
    const onKey = (e) => e.key === 'Escape' && close()
    document.addEventListener('pointerdown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('pointerdown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [ref, open, close])
}
