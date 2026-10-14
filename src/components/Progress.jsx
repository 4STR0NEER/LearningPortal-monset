// Fills use transform (scaleX) and stroke-dashoffset with CSS transitions, so a bump from
// "Mark as done" glides instead of jumping, and a quick second click retargets smoothly.

export function ProgressBar({ value, label }) {
  return (
    <div role="progressbar" aria-valuenow={value} aria-valuemin={0} aria-valuemax={100} aria-label={label} className="h-1.5 overflow-hidden rounded-full bg-line">
      <div
        className="h-full origin-left rounded-full bg-primary-2 transition-transform duration-500 ease-out motion-reduce:transition-none"
        style={{ transform: `scaleX(${value / 100})` }}
      />
    </div>
  )
}

export function ProgressRing({ value, size = 56, label }) {
  const r = 22
  const c = 2 * Math.PI * r
  return (
    <div role="progressbar" aria-valuenow={value} aria-valuemin={0} aria-valuemax={100} aria-label={label} className="relative grid shrink-0 place-items-center" style={{ width: size, height: size }}>
      <svg viewBox="0 0 52 52" className="absolute inset-0 -rotate-90" aria-hidden="true">
        <circle cx="26" cy="26" r={r} fill="none" strokeWidth="5" className="stroke-line" />
        <circle
          cx="26"
          cy="26"
          r={r}
          fill="none"
          strokeWidth="5"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - value / 100)}
          className="stroke-primary-2 transition-[stroke-dashoffset] duration-500 ease-out motion-reduce:transition-none"
        />
      </svg>
      <span className="text-sm font-extrabold text-primary tabular-nums">{value}%</span>
    </div>
  )
}
