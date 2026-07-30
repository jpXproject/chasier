import { useState } from 'react'
import NeumorphicButton from '../components/NeumorphicButton'
import NeumorphicInput from '../components/NeumorphicInput'
import NeumorphicCard, { CardStat } from '../components/NeumorphicCard'
import NeumorphicBadge from '../components/NeumorphicBadge'
import NeumorphicSelect from '../components/NeumorphicSelect'
import NeumorphicDivider from '../components/NeumorphicDivider'

/* ----- Icon helpers ----- */
const Icons = {
  cart: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" /><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
    </svg>
  ),
  search: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  ),
  rupee: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  ),
  box: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
      <polyline points="3.27 6.96 12 12.01 20.73 6.96" /><line x1="12" y1="22.08" x2="12" y2="12" />
    </svg>
  ),
  users: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  trending: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" />
    </svg>
  ),
  wallet: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" /><path d="M3 5v14a2 2 0 0 0 2 2h16v-5" /><path d="M18 12a2 2 0 0 0 0 4h4v-4Z" />
    </svg>
  ),
  download: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  ),
  check: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
  settings: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  ),
}

function SectionHeading({ label }: { label: string }) {
  return (
    <div className="mb-8">
      <h2 className="text-lg font-bold text-primary tracking-tight">{label}</h2>
      <NeumorphicDivider className="mt-2" />
    </div>
  )
}

function ComponentDemo({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="animate-fade-in">
      <h3 className="text-xs font-bold uppercase tracking-widest text-secondary mb-3">{title}</h3>
      <div className="rounded-2xl bg-surface-card border border-border-subtle p-6">
        {children}
      </div>
    </div>
  )
}

export default function DesignSystem() {
  const [inputValue, setInputValue] = useState('')
  const [selectValue, setSelectValue] = useState('')

  return (
    <div className="min-h-screen bg-surface-bg transition-colors duration-300">
      {/* ----- HEADER ----- */}
      <header className="sticky top-0 z-50 bg-surface-bg/80 backdrop-blur-xl border-b border-border-subtle">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl neumo-raised flex items-center justify-center text-phosphor">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
              </svg>
            </div>
            <div>
              <h1 className="text-lg font-bold text-primary tracking-tight">CashierGo</h1>
              <p className="text-[10px] text-secondary font-medium uppercase tracking-widest">Design System</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <NeumorphicButton variant="neutral" size="sm" onClick={() => window.history.back()}>
              ← Back to Dashboard
            </NeumorphicButton>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8 pb-20">
        {/* ----- HERO SECTION ----- */}
        <section className="mb-16 animate-slide-up">
          <NeumorphicCard variant="raised" padding="lg" glow="green">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div>
                <NeumorphicBadge variant="success" dot size="sm" className="mb-3">
                  v0.1.0 — Neumorphic Dark
                </NeumorphicBadge>
                <h2 className="text-3xl md:text-4xl font-black text-primary tracking-tight leading-tight">
                  Neumorphic 3D<br />
                  <span className="text-phosphor">Design System</span>
                </h2>
                <p className="text-sm text-secondary mt-2 max-w-xl">
                  A premium dark-mode-first UI system built for CashierGo — 
                  featuring raised & indented 3D neumorphism, Phosphor Green accents, 
                  Crimson Red alerts, and Metallic Silver neutrals.
                </p>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0">
                <NeumorphicButton variant="primary" size="md" icon={Icons.download}>
                  Export Tokens
                </NeumorphicButton>
                <NeumorphicButton variant="neutral" size="md">
                  View Source
                </NeumorphicButton>
              </div>
            </div>
          </NeumorphicCard>
        </section>

        {/* ----- COLOR PALETTE ----- */}
        <section className="mb-16">
          <SectionHeading label="Color Palette" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { label: 'Phosphor Green', color: 'bg-phosphor', textClass: 'text-primary', hex: '#22C55E', usage: 'Success, Sales, Active states' },
              { label: 'Crimson Red', color: 'bg-crimson', textClass: 'text-primary', hex: '#EF4444', usage: 'Expenses, Errors, Alerts' },
              { label: 'Metallic Silver', color: 'bg-silver', textClass: 'text-black', hex: '#A3AAB5', usage: 'Typography, Borders, Neutrals' },
            ].map((swatch) => (
              <NeumorphicCard key={swatch.label} variant="raised" padding="md">
                <div className="flex items-center gap-4">
                  <div className={`w-16 h-16 rounded-xl ${swatch.color} ${swatch.textClass} flex items-center justify-center text-xs font-bold shadow-inner`}>
                    {swatch.hex}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-primary">{swatch.label}</h4>
                    <p className="text-xs text-secondary mt-0.5">{swatch.hex}</p>
                    <p className="text-[10px] text-muted mt-0.5">{swatch.usage}</p>
                  </div>
                </div>
              </NeumorphicCard>
            ))}
          </div>
        </section>

        {/* ----- BUTTONS ----- */}
        <section className="mb-16">
          <SectionHeading label="Button Variants" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ComponentDemo title="Variants">
              <div className="flex flex-wrap items-center gap-3">
                <NeumorphicButton variant="primary" size="md">Primary</NeumorphicButton>
                <NeumorphicButton variant="success" size="md">Success</NeumorphicButton>
                <NeumorphicButton variant="danger" size="md">Danger</NeumorphicButton>
                <NeumorphicButton variant="neutral" size="md">Neutral</NeumorphicButton>
                <NeumorphicButton variant="ghost" size="md">Ghost</NeumorphicButton>
              </div>
            </ComponentDemo>
            <ComponentDemo title="Sizes & Icon">
              <div className="flex flex-wrap items-center gap-3">
                <NeumorphicButton variant="primary" size="sm" icon={Icons.check}>Confirm</NeumorphicButton>
                <NeumorphicButton variant="primary" size="md" icon={Icons.cart}>Add to Cart</NeumorphicButton>
                <NeumorphicButton variant="primary" size="lg" icon={Icons.download}>Export</NeumorphicButton>
              </div>
            </ComponentDemo>
            <ComponentDemo title="With Icons (Ghost)">
              <div className="flex flex-wrap items-center gap-3">
                <NeumorphicButton variant="ghost" size="md" icon={Icons.settings}>Settings</NeumorphicButton>
                <NeumorphicButton variant="ghost" size="md" icon={Icons.users}>Team</NeumorphicButton>
                <NeumorphicButton variant="ghost" size="md" icon={Icons.trending}>Reports</NeumorphicButton>
              </div>
            </ComponentDemo>
            <ComponentDemo title="States">
              <div className="flex flex-wrap items-center gap-3">
                <NeumorphicButton variant="primary" size="md" loading>Loading</NeumorphicButton>
                <NeumorphicButton variant="primary" size="md" disabled>Disabled</NeumorphicButton>
                <NeumorphicButton variant="danger" size="md" loading>Deleting</NeumorphicButton>
                <NeumorphicButton variant="ghost" size="md" disabled>Disabled</NeumorphicButton>
              </div>
            </ComponentDemo>
          </div>
        </section>

        {/* ----- FORM CONTROLS ----- */}
        <section className="mb-16">
          <SectionHeading label="Form Controls" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ComponentDemo title="Text Input">
              <div className="space-y-4">
                <NeumorphicInput
                  label="Product Name"
                  placeholder="Enter product name..."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                />
                <NeumorphicInput
                  label="Price (Rp)"
                  type="number"
                  placeholder="0"
                  icon={Icons.rupee}
                  rightElement={<span className="text-[10px] font-semibold text-muted uppercase">IDR</span>}
                />
                <NeumorphicInput
                  label="Search Products"
                  placeholder="Search..."
                  icon={Icons.search}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                />
              </div>
            </ComponentDemo>
            <ComponentDemo title="Error & Help States">
              <div className="space-y-4">
                <NeumorphicInput
                  label="SKU Code"
                  placeholder="e.g. CMD-001"
                  error="This SKU already exists in inventory"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                />
                <NeumorphicInput
                  label="Supplier Email"
                  type="email"
                  placeholder="supplier@example.com"
                  helperText="We'll send the purchase order to this address"
                />
              </div>
            </ComponentDemo>
            <ComponentDemo title="Select Dropdown">
              <div className="space-y-4">
                <NeumorphicSelect
                  label="Product Category"
                  placeholder="Select category..."
                  options={[
                    { value: 'coffee', label: '☕ Coffee & Beverages' },
                    { value: 'food', label: '🍽️ Food & Snacks' },
                    { value: 'merch', label: '👕 Merchandise' },
                    { value: 'raw', label: '📦 Raw Materials' },
                  ]}
                  value={selectValue}
                  onChange={(e) => setSelectValue(e.target.value)}
                />
                <NeumorphicSelect
                  label="Payment Method"
                  placeholder="Choose payment..."
                  options={[
                    { value: 'cash', label: '💰 Cash' },
                    { value: 'qris', label: '📱 QRIS' },
                    { value: 'debit', label: '💳 Debit Card' },
                    { value: 'credit', label: '💳 Credit Card' },
                  ]}
                />
              </div>
            </ComponentDemo>
            <ComponentDemo title="Read-Only Panel">
              <div className="space-y-3 neumo-indented rounded-xl p-4">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-secondary font-medium">Shift Status</span>
                  <NeumorphicBadge variant="success" dot size="sm">Active</NeumorphicBadge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-secondary font-medium">Started At</span>
                  <span className="text-sm text-primary font-semibold">07:45 AM</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-secondary font-medium">Cashier</span>
                  <span className="text-sm text-primary font-semibold">Ahmad F.</span>
                </div>
                <NeumorphicDivider className="my-1" />
                <div className="flex justify-between items-center">
                  <span className="text-xs text-secondary font-medium">Opening Balance</span>
                  <span className="text-sm text-phosphor font-bold">Rp 500,000</span>
                </div>
              </div>
            </ComponentDemo>
          </div>
        </section>

        {/* ----- CARDS & STATS ----- */}
        <section className="mb-16">
          <SectionHeading label="Cards & Stats" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {[
              { label: 'Today\'s Sales', value: 'Rp 2,450,000', trend: 'up' as const, variant: 'success' as const, icon: Icons.trending },
              { label: 'Transactions', value: '48', trend: 'up' as const, variant: 'neutral' as const, icon: Icons.cart },
              { label: 'Active Products', value: '124', variant: 'neutral' as const, icon: Icons.box },
              { label: 'Today\'s Expenses', value: 'Rp 340,000', trend: 'down' as const, variant: 'danger' as const, icon: Icons.wallet },
            ].map((stat) => (
              <NeumorphicCard key={stat.label} variant="raised" padding="md" hoverable>
                <div className="flex items-start justify-between mb-3">
                  <span className="text-muted">{stat.icon}</span>
                  <NeumorphicBadge variant={stat.variant === 'success' ? 'success' : stat.variant === 'danger' ? 'danger' : 'neutral'} size="sm">
                    {stat.variant === 'success' ? 'Sales' : stat.variant === 'danger' ? 'Expense' : 'Items'}
                  </NeumorphicBadge>
                </div>
                <CardStat label={stat.label} value={stat.value} trend={stat.trend} variant={stat.variant} />
              </NeumorphicCard>
            ))}
          </div>
        </section>

        {/* ----- BADGES & DIVIDERS ----- */}
        <section className="mb-16">
          <SectionHeading label="Badges" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ComponentDemo title="Badge Variants">
              <div className="flex flex-wrap items-center gap-3">
                <NeumorphicBadge variant="success" dot>Active</NeumorphicBadge>
                <NeumorphicBadge variant="danger" dot>Expired</NeumorphicBadge>
                <NeumorphicBadge variant="warning" dot>Pending</NeumorphicBadge>
                <NeumorphicBadge variant="info" dot>Updated</NeumorphicBadge>
                <NeumorphicBadge variant="neutral">Draft</NeumorphicBadge>
              </div>
            </ComponentDemo>
            <ComponentDemo title="Sizes & Dividers">
              <div className="space-y-4">
                <div className="flex flex-wrap items-center gap-3">
                  <NeumorphicBadge variant="success" size="sm" dot>Paid</NeumorphicBadge>
                  <NeumorphicBadge variant="danger" size="sm">Overdue</NeumorphicBadge>
                </div>
                <NeumorphicDivider label="Transaction" />
                <NeumorphicDivider />
              </div>
            </ComponentDemo>
          </div>
        </section>

        {/* ----- NESTED NEUMORPHISM ----- */}
        <section className="mb-16">
          <SectionHeading label="Nested Depths — 3D Layering" />
          <NeumorphicCard variant="raised" padding="lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <NeumorphicCard variant="indented" padding="md">
                <p className="text-xs text-secondary mb-2 uppercase tracking-wider font-semibold">Indented Container</p>
                <div className="neumo-raised rounded-xl px-4 py-3">
                  <p className="text-xs text-muted">Nested Raised Layer</p>
                </div>
                <div className="mt-3 neumo-indented rounded-xl px-4 py-3">
                  <p className="text-xs text-muted">Nested Indented Layer</p>
                </div>
              </NeumorphicCard>

              <NeumorphicCard variant="indented" padding="md">
                <p className="text-xs text-secondary mb-2 uppercase tracking-wider font-semibold">Payment Summary</p>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-secondary">Subtotal</span>
                    <span className="text-primary font-semibold">Rp 85,000</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-secondary">Tax (11%)</span>
                    <span className="text-primary font-semibold">Rp 9,350</span>
                  </div>
                  <NeumorphicDivider />
                  <div className="flex justify-between text-base">
                    <span className="text-primary font-bold">Total</span>
                    <span className="text-phosphor font-black">Rp 94,350</span>
                  </div>
                </div>
              </NeumorphicCard>
            </div>
          </NeumorphicCard>
        </section>

        <footer className="text-center py-8">
          <NeumorphicDivider className="mb-6" />
          <p className="text-xs text-muted font-medium uppercase tracking-widest">
            CashierGo Design System · Neumorphic 3D · Dark / Light
          </p>
        </footer>
      </main>
    </div>
  )
}
