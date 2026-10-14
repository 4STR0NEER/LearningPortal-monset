import { PanelLeft } from 'lucide-react'
import { useRole } from '../../context/RoleContext'
import Avatar from './Avatar'
import RoleToggle from './RoleToggle'
import UserMenu from './UserMenu'

export default function TopBar({ onToggleSidebar, drawerOpen }) {
  const { user } = useRole()

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-line bg-surface px-4 sm:px-6 lg:h-[72px] lg:px-10">
      <button
        onClick={onToggleSidebar}
        aria-label="Toggle sidebar"
        aria-expanded={drawerOpen}
        className="pressable -ml-2 grid size-10 place-items-center rounded-lg text-navy transition-colors duration-150 hover:bg-wash"
      >
        <PanelLeft className="size-5" strokeWidth={1.75} />
      </button>

      <div className="ml-auto flex items-center gap-3">
        <RoleToggle />
        <UserMenu
          trigger={({ open, toggle }) => (
            <button onClick={toggle} aria-haspopup="menu" aria-expanded={open} aria-label={`Account menu for ${user.full_name}`} className="pressable rounded-full">
              <Avatar initials={user.initials} />
            </button>
          )}
        />
      </div>
    </header>
  )
}
