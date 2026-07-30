import { useState, useEffect, type ReactNode } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import ThemeToggle from '../components/ThemeToggle'

interface DashboardLayoutProps {
  children?: ReactNode
}

function MenuIcon({ open }: { open: boolean }) {
  return (
    <div className="w-5 h-5 relative flex items-center justify-center">
      <span className={`absolute block h-0.5 w-5 rounded-full bg-current transition-all duration-200 ${open ? 'rotate-45' : '-translate-y-1.5'}`} />
      <span className={`absolute block h-0.5 w-5 rounded-full bg-current transition-all duration-200 ${open ? 'opacity-0' : ''}`} />
      <span className={`absolute block h-0.5 w-5 rounded-full bg-current transition-all duration-200 ${open ? '-rotate-45' : 'translate-y-1.5'}`} />
    </div>
  )
}

function HeaderClock() {
  const [time, setTime] = useState(new Date())
  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(id)
  }, [])

  return (
    <div className="hidden xs:flex neumo-indented rounded-xl px-2 sm:px-3 py-1.5 items-center gap-1.5">
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted flex-shrink-0">
        <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
      </svg>
      <span className="text-[10px] sm:text-xs font-semibold text-primary tabular-nums">
        {time.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
      </span>
    </div>
  )
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-surface-bg transition-colors duration-300">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="lg:pl-64 min-h-screen flex flex-col">
        <header className="sticky top-0 z-20 bg-surface-bg/80 backdrop-blur-xl border-b border-border-subtle">
          <div className="flex items-center justify-between px-4 sm:px-6 lg:px-6 py-2.5 lg:py-3 gap-2">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden w-9 h-9 rounded-xl neumo-raised flex items-center justify-center text-primary flex-shrink-0 active:scale-90 transition-transform"
                aria-label="Toggle sidebar"
              >
                <MenuIcon open={sidebarOpen} />
              </button>
              <div className="hidden sm:block min-w-0">
                <h1 className="text-sm sm:text-base font-bold text-primary truncate">CashierGo</h1>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
              <HeaderClock />

              {/* Sync — hidden on mobile */}
              <div className="hidden sm:flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-phosphor animate-pulse" />
                <span className="text-[10px] font-bold text-phosphor uppercase tracking-wider">Online</span>
              </div>

              <ThemeToggle />
            </div>
          </div>
        </header>

        <main className="flex-1 px-4 sm:px-6 lg:px-6 py-4 sm:py-5 lg:py-6">
          {children || <Outlet />}
        </main>
      </div>
    </div>
  )
}
