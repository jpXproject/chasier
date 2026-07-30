import { useState, useEffect, type ReactNode } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Sidebar from './Sidebar'
import ThemeToggle from '../components/ThemeToggle'

const PAGE_TITLES: Record<string, string> = {
  '/': 'Dashboard',
  '/pos': 'Point of Sale',
  '/inventory': 'Inventory',
  '/purchasing': 'Pembelian',
  '/employment': 'Employment',
  '/expenses': 'Pengeluaran',
  '/reports': 'Reports',
  '/settings': 'Settings',
}

function Clock() {
  const [t, setT] = useState(new Date())
  useEffect(() => {
    const id = setInterval(() => setT(new Date()), 1000)
    return () => clearInterval(id)
  }, [])
  return (
    <div className="hidden xs:flex items-center gap-1.5 px-3 py-1.5 rounded-lg" style={{ background: 'var(--surface-2)' }}>
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-3 flex-shrink-0">
        <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
      </svg>
      <span className="num text-xs font-500 text-2">
        {t.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
      </span>
    </div>
  )
}

function MenuIcon({ open }: { open: boolean }) {
  return (
    <div className="w-5 h-5 relative flex items-center justify-center">
      <span className={`absolute block h-0.5 w-5 rounded-full bg-current transition-all duration-200 ${open ? 'rotate-45' : '-translate-y-1.5'}`} />
      <span className={`absolute block h-0.5 w-5 rounded-full bg-current transition-all duration-200 ${open ? 'opacity-0 scale-x-0' : ''}`} />
      <span className={`absolute block h-0.5 w-5 rounded-full bg-current transition-all duration-200 ${open ? '-rotate-45' : 'translate-y-1.5'}`} />
    </div>
  )
}

export default function DashboardLayout({ children }: { children?: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()
  const pageTitle = PAGE_TITLES[location.pathname] ?? 'CashierGo'

  return (
    <div className="min-h-screen bg-bg">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="lg:pl-[228px] min-h-screen flex flex-col">
        {/* Header */}
        <header
          className="sticky top-0 z-20 border-b border-token"
          style={{ background: 'var(--surface)', backdropFilter: 'blur(16px)' }}
        >
          <div className="flex items-center justify-between px-4 sm:px-6 h-14 gap-3">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden w-9 h-9 flex items-center justify-center rounded-lg btn-ghost text-1 active:scale-90 transition-transform"
                aria-label="Toggle sidebar"
              >
                <MenuIcon open={sidebarOpen} />
              </button>
              <h1 className="text-sm sm:text-base font-600 text-1 tracking-tight">{pageTitle}</h1>
            </div>

            <div className="flex items-center gap-2">
              <Clock />
              <div className="hidden sm:flex items-center gap-1.5">
                <span
                  className="w-1.5 h-1.5 rounded-full"
                  style={{
                    background: 'var(--green)',
                    boxShadow: '0 0 5px var(--green)',
                    animation: 'pulse-dot 2s ease-in-out infinite',
                  }}
                />
                <span className="text-[11px] font-600 text-green uppercase tracking-wider">Live</span>
              </div>
              <ThemeToggle />
            </div>
          </div>
        </header>

        <main className="flex-1 px-4 sm:px-6 py-5 sm:py-6">
          {children ?? <Outlet />}
        </main>
      </div>
    </div>
  )
}
