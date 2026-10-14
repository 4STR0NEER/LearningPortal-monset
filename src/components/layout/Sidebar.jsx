import { useState } from 'react'
import { Link, useLocation } from 'react-router'
import { motion } from 'motion/react'
import { ChevronRight, EllipsisVertical, FileText, GraduationCap, LayoutGrid, User, UserPlus, Users, X } from 'lucide-react'
import { brand } from '../../config/brand'
import { courses } from '../../data/courses'
import { useRole } from '../../context/RoleContext'
import Avatar from './Avatar'
import UserMenu from './UserMenu'

// Menus per role. `match` decides the active pill: the student course page keeps "Dashboard" lit,
// like the reference screenshot, because you got there from the dashboard.
const menus = {
  student: [
    { label: 'Dashboard', to: '/student', icon: LayoutGrid, match: (p) => p === '/student' || p.startsWith('/student/courses') },
    { label: 'Profile', to: '/student/profile', icon: User },
  ],
  teacher: [
    { label: 'Dashboard', to: '/teacher', icon: LayoutGrid, match: (p) => p === '/teacher' },
    { label: 'Applicants', to: '/teacher/applicants', icon: UserPlus },
    { label: 'Students Enrolled', to: '/teacher/students', icon: Users },
    { label: 'Courses', icon: GraduationCap, children: courses.map((c) => ({ label: c.title, to: `/teacher/courses/${c.id}` })) },
    { label: 'Reports', to: '/teacher/reports', icon: FileText },
  ],
}

const itemBase = 'pressable flex w-full items-center gap-3 rounded-pill px-3 py-2.5 text-[15px] font-semibold transition-colors duration-150'
const idle = 'text-primary hover:bg-mint-100'
const active = 'bg-primary text-white shadow-card'

export default function Sidebar({ collapsed = false, onExpand, onClose }) {
  const { role, user } = useRole()
  const { pathname } = useLocation()

  return (
    <div className="flex h-full flex-col">
      {/* Brand */}
      <div className={`flex h-[88px] shrink-0 items-center gap-3 border-b border-line ${collapsed ? 'justify-center px-2' : 'px-5'}`}>
        <img src={brand.logo} alt="" className="size-12 shrink-0" />
        {!collapsed && (
          <div className="min-w-0 flex-1">
            <p className="truncate text-[22px] leading-none font-black tracking-tight text-primary [font-stretch:80%]">{brand.wordmark}</p>
            <p className="mt-1.5 flex items-center gap-1.5 text-[9px] leading-tight font-semibold text-muted">
              <span className="h-px w-2 shrink-0 bg-line" />
              <span className="line-clamp-2">{brand.tagline}</span>
              <span className="h-px w-2 shrink-0 bg-line" />
            </p>
          </div>
        )}
        {onClose && (
          <button onClick={onClose} aria-label="Close menu" className="pressable -mr-2 grid size-9 place-items-center rounded-lg text-muted hover:bg-wash">
            <X className="size-5" />
          </button>
        )}
      </div>

      {/* Menu. Keyed by role so it crossfades in when the role flips. */}
      <motion.nav
        key={role}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.18 }}
        aria-label="Menus"
        className={`flex-1 overflow-y-auto py-5 ${collapsed ? 'px-3' : 'px-4'}`}
      >
        {!collapsed && <p className="mb-2 px-3 text-xs font-semibold text-muted">Menus</p>}
        <ul className="space-y-1">
          {menus[role].map((item) =>
            item.children ? (
              <CourseGroup key={item.label} item={item} pathname={pathname} collapsed={collapsed} onExpand={onExpand} />
            ) : (
              <li key={item.to}>
                <Link
                  to={item.to}
                  title={collapsed ? item.label : undefined}
                  aria-current={isActive(item, pathname) ? 'page' : undefined}
                  className={`${itemBase} ${collapsed ? 'justify-center px-0' : ''} ${isActive(item, pathname) ? active : idle}`}
                >
                  <item.icon className="size-5 shrink-0" strokeWidth={1.75} aria-hidden="true" />
                  {!collapsed && <span className="truncate">{item.label}</span>}
                </Link>
              </li>
            ),
          )}
        </ul>
      </motion.nav>

      {/* Signed-in user */}
      <div className={`flex shrink-0 items-center gap-3 border-t border-line py-4 ${collapsed ? 'justify-center px-2' : 'px-5'}`}>
        {collapsed ? (
          <UserMenu
            placement="up"
            align="left"
            trigger={({ open, toggle }) => (
              <button onClick={toggle} aria-haspopup="menu" aria-expanded={open} aria-label="Account menu" className="pressable rounded-full">
                <Avatar initials={user.initials} size="sm" />
              </button>
            )}
          />
        ) : (
          <>
            <Avatar initials={user.initials} size="sm" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-bold text-ink">{user.full_name}</p>
              <p className="truncate text-xs text-muted">{user.email}</p>
            </div>
            <UserMenu
              placement="up"
              trigger={({ open, toggle }) => (
                <button
                  onClick={toggle}
                  aria-haspopup="menu"
                  aria-expanded={open}
                  aria-label="Account menu"
                  className="pressable -mr-2 grid size-8 place-items-center rounded-lg text-muted transition-colors duration-150 hover:bg-mint-100 hover:text-primary"
                >
                  <EllipsisVertical className="size-4" />
                </button>
              )}
            />
          </>
        )}
      </div>
    </div>
  )
}

function isActive(item, pathname) {
  return item.match ? item.match(pathname) : pathname.startsWith(item.to)
}

function CourseGroup({ item, pathname, collapsed, onExpand }) {
  const inside = pathname.startsWith('/teacher/courses')
  const [open, setOpen] = useState(inside)
  const Icon = item.icon

  const onClick = () => {
    // The icons-only rail has no room for the list, so open the rail first.
    if (collapsed) {
      onExpand?.()
      setOpen(true)
    } else setOpen((o) => !o)
  }

  return (
    <li>
      <button
        onClick={onClick}
        aria-expanded={open && !collapsed}
        title={collapsed ? item.label : undefined}
        className={`${itemBase} ${collapsed ? 'justify-center px-0' : ''} ${collapsed && inside ? active : idle}`}
      >
        <Icon className="size-5 shrink-0" strokeWidth={1.75} aria-hidden="true" />
        {!collapsed && (
          <>
            <span className="flex-1 truncate text-left">{item.label}</span>
            <ChevronRight className={`size-4 shrink-0 transition-transform duration-200 ease-out ${open ? 'rotate-90' : ''}`} aria-hidden="true" />
          </>
        )}
      </button>
      {open && !collapsed && (
        <ul className="mt-1 mb-2 ml-[22px] space-y-0.5 border-l border-mint pl-3 transition-opacity duration-150 starting:opacity-0">
          {item.children.map((c) => {
            const on = pathname === c.to
            return (
              <li key={c.to}>
                <Link
                  to={c.to}
                  aria-current={on ? 'page' : undefined}
                  className={`pressable block truncate rounded-lg px-3 py-1.5 text-sm transition-colors duration-150 ${on ? 'bg-mint-200 font-bold text-primary-700' : 'font-medium text-muted hover:bg-mint-50 hover:text-primary'}`}
                >
                  {c.label}
                </Link>
              </li>
            )
          })}
        </ul>
      )}
    </li>
  )
}
