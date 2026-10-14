import { useEffect, useRef } from 'react'
import { animate, createScope, createTimeline, utils } from 'animejs'
import { brand } from '../config/brand'

const FAKE_LOAD_MS = 1800
const TURN_MS = 4000 // one full turn while "loading"

// The one expressive moment in the app. anime.js owns every animated property here.
// onLeave: overlay starts fading (mount the app now so its own entrance plays as it's revealed)
// onDone: overlay is gone (unmount it)
export default function LoadingScreen({ onLeave, onDone }) {
  const root = useRef(null)

  useEffect(() => {
    let timer
    const scope = createScope({ root, mediaQueries: { reduceMotion: '(prefers-reduced-motion: reduce)' } }).add((self) => {
      if (self.matches.reduceMotion) {
        // No spin, no scale: hold, then fade.
        timer = setTimeout(() => {
          onLeave()
          animate(root.current, { opacity: 0, duration: 200, ease: 'linear', onComplete: onDone })
        }, FAKE_LOAD_MS)
        return
      }

      const spin = animate('.emblem', { rotate: 360, duration: TURN_MS, ease: 'linear', loop: true })

      timer = setTimeout(() => {
        spin.pause()
        // Settle forward to the next upright angle, so it never reverses.
        // Duration scales with the distance left, clamped so it never drags.
        const left = 360 - utils.get('.emblem', 'rotate', false)
        const settleMs = Math.min(900, Math.max(420, (left / 360) * 1400))

        createTimeline({ onComplete: onDone })
          .add('.emblem', { rotate: 360, scale: 0.88, duration: settleMs, ease: 'out(3)' })
          .add('.glow', { opacity: 0, scale: 0.8, duration: settleMs, ease: 'out(3)' }, 0)
          .call(onLeave)
          .add(root.current, { opacity: 0, duration: 320, ease: 'out(2)' })
      }, FAKE_LOAD_MS)
    })

    return () => {
      clearTimeout(timer)
      scope.revert() // StrictMode runs effects twice in dev; revert stops the first run's loop
    }
  }, [onLeave, onDone])

  return (
    <div ref={root} role="status" aria-live="polite" className="fixed inset-0 z-[100] grid place-items-center bg-page">
      <div className="relative grid place-items-center">
        <div className="glow absolute size-56 rounded-full bg-sky opacity-70 blur-3xl" aria-hidden="true" />
        <img src={brand.logo} alt="" className="emblem relative size-32 drop-shadow-seal" />
      </div>
      <span className="sr-only">Loading {brand.name}</span>
    </div>
  )
}
