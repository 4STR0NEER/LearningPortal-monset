import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import { MotionConfig } from 'motion/react'
import { RoleProvider } from './context/RoleContext'
import { ProgressProvider } from './context/ProgressContext'
import { AdminProvider } from './context/AdminContext'
import { ToastProvider } from './components/Toast'
import App from './App'
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      {/* reducedMotion="user": every Motion animation drops movement when the OS asks for less motion */}
      <MotionConfig reducedMotion="user">
        <RoleProvider>
          <ProgressProvider>
            <AdminProvider>
              <ToastProvider>
                <App />
              </ToastProvider>
            </AdminProvider>
          </ProgressProvider>
        </RoleProvider>
      </MotionConfig>
    </BrowserRouter>
  </StrictMode>,
)
