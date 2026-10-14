import { createContext, useContext, useEffect, useState } from 'react'
import { profileForRole } from '../data/users'

// Why a context: role is read by the sidebar, top bar, avatar menu and the route guard.
// Passing it down as props through every layer would be noisy; context lets any component ask for it.
const RoleContext = createContext(null)
const KEY = 'lp.role'

function readSaved() {
  try {
    const saved = localStorage.getItem(KEY)
    return saved === 'teacher' ? 'teacher' : 'student'
  } catch {
    return 'student' // private mode / blocked storage: still works, just doesn't remember
  }
}

export function RoleProvider({ children }) {
  const [role, setRole] = useState(readSaved)

  useEffect(() => {
    try {
      localStorage.setItem(KEY, role)
    } catch {}
  }, [role])

  return <RoleContext.Provider value={{ role, setRole, user: profileForRole(role) }}>{children}</RoleContext.Provider>
}

export const useRole = () => useContext(RoleContext)
