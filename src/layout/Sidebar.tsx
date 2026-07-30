import { type ReactNode, useEffect } from 'react'
import { NavLink } from 'react-router-dom'

interface NavItem {
  label: string
  path: string
  icon: ReactNode
  badge?: string
  badgeVariant?: 'success' | 'danger' | 'warning' | 'neutral'
}

const navItems: NavItem[] = [
  {
    label: 'Dashboard',
    path: '/',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="9" /><rect x="14" y="3" width="7" height="5" /><rect x="14" y="12" width="7" height="9" /><rect x="3" y="16" width="7" height="5" />
      </svg>
    ),
  },
  {
    label: 'POS',
    path: '/pos',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" /><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
      </svg>
    ),
  },
  {
    label: 'Inventory',
    path: '/inventory',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
        <polyline points="3.27 6.96 12 12.01 20.73 6.96" /><line x1="12" y1="22.08" x2="12" y2="12" />
      </svg>
    ),
    badge: '3',
    badgeVariant: 'danger',
  },
  {
    label: 'Shift',
    path: '/shift',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
      </svg>
    ),
  },
  {
    label: 'Reports',
    path: '/reports',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" />
      </svg>
    ),
  },
  {
    label: 'Settings',
    path: '/settings',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
      </svg>
    ),
  },
]

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  // Lock body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  const sidebarContent = (
    <>
      {/* Logo */}
      <div className="px-4 lg:px-5 py-4 lg:py-5 border-b border-border-subtle">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 lg:w-10 lg:h-10 rounded-xl neumo-raised flex items-center justify-center text-phosphor flex-shrink-0">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </div>
          <div>
            <h1 className="text-sm lg:text-base font-bold text-primary tracking-tight">CashierGo</h1>
            <p className="text-[8px] lg:text-[9px] text-secondary font-semibold uppercase tracking-widest">Management System</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 lg:px-3 py-3 lg:py-4 overflow-y-auto">
        <ul className="space-y-0.5 lg:space-y-1">
          {navItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                end={item.path === '/'}
                onClick={onClose}
                className={({ isActive }) => `
                  group flex items-center gap-3 px-3 lg:px-4 py-2.5 lg:py-2.5 rounded-xl text-sm font-semibold
                  transition-all duration-200
                  ${
                    isActive
                      ? 'neumo-pressed text-phosphor'
                      : 'text-secondary hover:text-primary hover:neumo-raised'
                  }
                `}
              >
                <span className="flex-shrink-0 w-5 h-5 flex items-center justify-center">{item.icon}</span>
                <span className="flex-1">{item.label}</span>
                {item.badge && (
                  <span className={`
                    flex-shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full
                    ${item.badgeVariant === 'danger' ? 'bg-crimson-light text-crimson' : ''}
                    ${item.badgeVariant === 'success' ? 'bg-phosphor-light text-phosphor' : ''}
                    ${item.badgeVariant === 'warning' ? 'bg-amber-500/10 text-amber-400' : ''}
                    ${!item.badgeVariant ? 'bg-white/5 text-silver' : ''}
                  `}>
                    {item.badge}
                  </span>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Store Info Footer */}
      <div className="px-3 lg:px-4 py-3 lg:py-4 border-t border-border-subtle">
        <div className="neumo-indented rounded-xl px-3 lg:px-4 py-2.5 lg:py-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-phosphor inline-block" />
            <span className="text-[10px] font-bold text-phosphor uppercase tracking-wider">Online</span>
          </div>
          <p className="text-[10px] text-muted mt-0.5">Sync: Real-time</p>
        </div>
      </div>
    </>
  )

  return (
    <>
      {/* Mobile backdrop overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm lg:hidden animate-fade-in"
          onClick={onClose}
        />
      )}

      {/* Mobile drawer */}
      <aside
        className={`
          fixed top-0 left-0 bottom-0 z-40 w-72 lg:w-64 bg-surface-bg border-r border-border-subtle
          flex flex-col
          transition-transform duration-300 ease-out
          lg:translate-x-0
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {sidebarContent}
      </aside>
    </>
  )
}
