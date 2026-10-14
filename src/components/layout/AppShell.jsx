import { useEffect, useState } from 'react'
import { Navigate, Outlet, useLocation } from 'react-router'
import { motion } from 'motion/react'
import { useRole } from '../../context/RoleContext'
import Sidebar from './Sidebar'
import TopBar from './TopBar'

const DESKTOP = '(min-width: 1024px)'

export default function AppShell() {
  const { role } = useRole()
  const { pathname } = useLocation()
  const [collapsed, setCollapsed] = useState(false) // desktop: icons-only rail
  const [drawerOpen, setDrawerOpen] = useState(false) // mobile: slide-in drawer

  useEffect(() => setDrawerOpen(false), [pathname])

  useEffect(() => {
    if (!drawerOpen) return
    const onKey = (e) => e.key === 'Escape' && setDrawerOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [drawerOpen])

  // Route guard: a URL from the other role (bookmark, back button after switching) sends you home.
  // This is also what makes the role toggle "swap the routes": flip the role, this redirects.
  if (!pathname.startsWith(`/${role}`)) return <Navigate to={`/${role}`} replace />

  const toggleSidebar = () => {
    if (window.matchMedia(DESKTOP).matches) setCollapsed((c) => !c)
    else setDrawerOpen(true)
  }

  return (
    <div className="min-h-dvh">
      {/* Desktop rail. Width changes instantly on collapse: it's a layout change, and animating width janks. */}
      <aside className={`fixed inset-y-0 left-0 z-30 hidden border-r border-line bg-wash/60 lg:block ${collapsed ? 'w-20' : 'w-68'}`}>
        <Sidebar collapsed={collapsed} onExpand={() => setCollapsed(false)} />
      </aside>

      {/* Mobile drawer: transform-only slide, CSS transition so a quick open/close can reverse mid-way. */}
      <div
        className={`fixed inset-0 z-40 bg-ink/30 transition-opacity duration-200 lg:hidden ${drawerOpen ? 'opacity-100' : 'pointer-events-none opacity-0'}`}
        onClick={() => setDrawerOpen(false)}
        aria-hidden="true"
      />
      <aside
        inert={!drawerOpen}
        aria-label="Main menu"
        className={`fixed inset-y-0 left-0 z-50 w-72 max-w-[85vw] border-r border-line bg-page shadow-pop transition-transform duration-300 ease-drawer motion-reduce:transition-none lg:hidden ${drawerOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <Sidebar onClose={() => setDrawerOpen(false)} />
      </aside>

      <div className={collapsed ? 'lg:pl-20' : 'lg:pl-68'}>
        <TopBar onToggleSidebar={toggleSidebar} drawerOpen={drawerOpen} />
        <main className="mx-auto max-w-[1400px] px-4 py-6 sm:px-6 lg:px-10 lg:py-8">
          {/* Page transition: quick fade + 8px rise. No exit animation, so navigation never waits. */}
          <motion.div
            key={pathname}
            initial={{ opacity: 0, transform: 'translateY(8px)' }}
            animate={{ opacity: 1, transform: 'translateY(0px)' }}
            transition={{ duration: 0.22, ease: [0.23, 1, 0.32, 1] }}
          >
            <Outlet />
          </motion.div>
        </main>
      </div>
    </div>
  )
}
