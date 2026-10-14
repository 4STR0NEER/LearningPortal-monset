import { Search } from 'lucide-react'

// type="search" gives the native clear (x) button and Escape-to-clear for free.
export default function SearchField({ value, onChange, label, className = '' }) {
  return (
    <label className={`relative block ${className}`}>
      <span className="sr-only">{label}</span>
      <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted" aria-hidden="true" />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={label}
        className="h-11 w-full rounded-pill border border-line bg-surface pr-3 pl-10 text-[15px] text-ink placeholder:text-muted"
      />
    </label>
  )
}

// Shared look for the native <select> filters, so they sit flush next to the search field.
export const selectClass = 'h-11 rounded-pill border border-line bg-surface px-3 text-[15px] font-semibold text-ink'
