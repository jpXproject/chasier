import { useEffect, useState } from 'react'
import NeumorphicCard, { CardHeader } from '../components/NeumorphicCard'
import NeumorphicButton from '../components/NeumorphicButton'
import NeumorphicBadge from '../components/NeumorphicBadge'
import NeumorphicDivider from '../components/NeumorphicDivider'

/* ============================================================
   Data
   ============================================================ */
const DATA = {
  kpis: {
    sales: { value: 2_450_000, trend: 12.5, count: 48 },
    shift: { cashier: 'Ahmad F.', since: '07:45' },
    expenses: { value: 340_000, trend: -3.2, items: 5 },
  },
  hourlySales: [
    { h: '06', v: 0 }, { h: '07', v: 45_000 }, { h: '08', v: 120_000 },
    { h: '09', v: 280_000 }, { h: '10', v: 350_000 }, { h: '11', v: 410_000 },
    { h: '12', v: 520_000 }, { h: '13', v: 380_000 }, { h: '14', v: 210_000 },
    { h: '15', v: 85_000 }, { h: '16', v: 42_000 }, { h: '17', v: 5_000 },
  ],
  transactions: [
    { id: 'TRX-001', t: '14:23', n: 3, total: 85_000, pay: 'QRIS', status: 'done' as const },
    { id: 'TRX-002', t: '14:18', n: 1, total: 45_000, pay: 'Cash', status: 'done' as const },
    { id: 'TRX-003', t: '14:05', n: 5, total: 210_000, pay: 'Debit', status: 'done' as const },
    { id: 'TRX-004', t: '13:52', n: 2, total: 120_000, pay: 'QRIS', status: 'done' as const },
    { id: 'TRX-005', t: '13:40', n: 7, total: 350_000, pay: 'Credit', status: 'done' as const },
    { id: 'TRX-006', t: '13:22', n: 4, total: 175_000, pay: 'Cash', status: 'pending' as const },
    { id: 'TRX-007', t: '13:10', n: 2, total: 95_000, pay: 'QRIS', status: 'done' as const },
  ],
  stock: [
    { name: 'Arabica Coffee Beans', stock: 2, unit: 'kg', thresh: 10, cat: 'Raw' },
    { name: 'Fresh Milk', stock: 1, unit: 'L', thresh: 8, cat: 'Raw' },
    { name: 'Vanilla Syrup', stock: 0, unit: 'btl', thresh: 5, cat: 'Raw' },
  ],
  payments: [
    { m: 'QRIS', v: 1_050_000, p: 43 },
    { m: 'Cash', v: 680_000, p: 28 },
    { m: 'Debit', v: 420_000, p: 17 },
    { m: 'Credit', v: 300_000, p: 12 },
  ],
}

/* ============================================================
   Helpers
   ============================================================ */
const fmtRp = (n: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(n)
const fmtShort = (n: number) => n >= 1_000_000 ? `Rp${(n / 1_000_000).toFixed(1)}jt` : n >= 1_000 ? `Rp${(n / 1_000).toFixed(0)}rb` : fmtRp(n)

/* ============================================================
   LiveClock
   ============================================================ */
function LiveClock() {
  const [t, setT] = useState(new Date())
  useEffect(() => { const id = setInterval(() => setT(new Date()), 1000); return () => clearInterval(id) }, [])
  return (
    <div className="text-right">
      <p className="hidden xs:block text-[10px] lg:text-xs text-secondary leading-tight">
        {t.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
      </p>
      <p className="text-xs sm:text-sm lg:text-lg font-black text-primary tabular-nums tracking-tight leading-tight">
        {t.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
      </p>
    </div>
  )
}

/* ============================================================
   Bar Chart
   ============================================================ */
function BarChart({ data }: { data: typeof DATA.hourlySales }) {
  const max = Math.max(...data.map(d => d.v), 1)
  const now = new Date().getHours()

  return (
    <div className="overflow-x-auto -mx-1 px-1 pb-1">
      <div className="flex items-end gap-[3px] sm:gap-1.5 h-28 sm:h-36 min-w-[300px] xs:min-w-0 pt-2">
        {data.map(d => {
          const pct = (d.v / max) * 100
          const isNow = parseInt(d.h) === now
          return (
            <div key={d.h} className="flex-1 flex flex-col items-center gap-[2px] sm:gap-1 h-full justify-end">
              <span className="text-[6px] sm:text-[9px] text-muted font-medium leading-none">{d.v > 0 ? fmtRp(d.v).replace(/Rp\s?/, '').replace(/\..*/, '') : ''}</span>
              <div className={`w-full rounded-t-sm sm:rounded-t-md transition-all duration-500 min-h-[3px] ${isNow ? 'bg-phosphor shadow-[0_0_8px_rgba(34,197,94,0.3)]' : d.h < String(now) ? 'bg-phosphor/60' : 'bg-phosphor/20'}`}
                style={{ height: `${Math.max(pct, 3)}%` }} title={`${d.h}:00 — ${fmtRp(d.v)}`} />
              <span className={`text-[7px] sm:text-[9px] font-semibold ${isNow ? 'text-phosphor' : 'text-muted'}`}>{d.h}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

/* ============================================================
   Payment Bars
   ============================================================ */
function PayBars({ data }: { data: typeof DATA.payments }) {
  return (
    <div className="space-y-2.5 sm:space-y-3">
      {data.map(d => (
        <div key={d.m}>
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] sm:text-xs font-semibold text-primary">{d.m}</span>
            <span className="text-[11px] sm:text-xs font-bold text-primary tabular-nums">{fmtShort(d.v)} <span className="text-muted font-medium">{d.p}%</span></span>
          </div>
          <div className="neumo-indented rounded-full h-2 sm:h-2.5 !p-0 border-0 overflow-hidden">
            <div className="h-full rounded-full bg-phosphor transition-all duration-700" style={{ width: `${d.p}%` }} />
          </div>
        </div>
      ))}
    </div>
  )
}

/* ============================================================
   Transaction Cards (mobile) & Table (desktop)
   ============================================================ */
function TxList({ data }: { data: typeof DATA.transactions }) {
  return (
    <>
      {/* Mobile cards */}
      <div className="sm:hidden space-y-2">
        {data.map(tx => (
          <div key={tx.id} className="neumo-raised rounded-xl px-3.5 py-3 flex items-center gap-3">
            <span className="w-8 h-8 rounded-lg neumo-indented flex items-center justify-center text-xs font-bold text-primary flex-shrink-0">#{tx.id.slice(-3)}</span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-primary">{tx.t}</span>
                <span className="text-[9px] text-muted">{tx.pay}</span>
              </div>
              <p className="text-[10px] text-secondary">{tx.n} item{tx.n > 1 ? 's' : ''}</p>
            </div>
            <div className="text-right flex-shrink-0">
              <p className="text-xs font-black text-primary tabular-nums">{fmtShort(tx.total)}</p>
              <NeumorphicBadge variant={tx.status === 'done' ? 'success' : 'warning'} size="sm" dot={tx.status === 'done'}>
                {tx.status === 'done' ? 'Paid' : 'Pending'}
              </NeumorphicBadge>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop table */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-[10px] text-secondary font-bold uppercase tracking-wider">
              <th className="text-left py-2 pr-3">ID</th>
              <th className="text-left py-2 pr-3">Time</th>
              <th className="text-center py-2 pr-3">Items</th>
              <th className="text-right py-2 pr-3">Total</th>
              <th className="text-center py-2 pr-3">Payment</th>
              <th className="text-right py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {data.map(tx => (
              <tr key={tx.id} className="border-t border-border-subtle transition-colors hover:bg-white/[0.02]">
                <td className="py-2.5 pr-3"><span className="text-[11px] font-mono font-semibold text-primary">{tx.id}</span></td>
                <td className="py-2.5 pr-3 text-secondary font-medium">{tx.t}</td>
                <td className="py-2.5 pr-3 text-center text-primary font-semibold">{tx.n}</td>
                <td className="py-2.5 pr-3 text-right text-primary font-bold tabular-nums">{fmtRp(tx.total)}</td>
                <td className="py-2.5 pr-3 text-center"><span className="text-[10px] font-semibold text-muted">{tx.pay}</span></td>
                <td className="py-2.5 text-right">
                  <NeumorphicBadge variant={tx.status === 'done' ? 'success' : 'warning'} size="sm" dot={tx.status === 'done'}>
                    {tx.status === 'done' ? 'Paid' : 'Pending'}
                  </NeumorphicBadge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}

/* ============================================================
   KPI Card
   ============================================================ */
function KpiCard({ icon, iconColor, badge, badgeVariant, label, value, valueColor, trend, trendVal, sub, delay, glow }: {
  icon: React.ReactNode; iconColor: string; badge: string; badgeVariant: 'success' | 'danger' | 'neutral'
  label: string; value: string; valueColor: string; trend?: 'up' | 'down'; trendVal?: string; sub?: string
  delay: number; glow?: 'green' | 'red' | 'none'
}) {
  const [show, setShow] = useState(false)
  useEffect(() => { const t = setTimeout(() => setShow(true), delay); return () => clearTimeout(t) }, [delay])
  return (
    <NeumorphicCard variant="raised" padding="sm" glow={glow || 'none'} className={`${show ? 'animate-slide-up' : 'opacity-0'}`} style={{ animationDelay: `${delay}ms` }}>
      <div className="flex items-start justify-between mb-2 sm:mb-3">
        <div className={`w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10 rounded-xl neumo-indented flex items-center justify-center ${iconColor}`}>{icon}</div>
        <NeumorphicBadge variant={badgeVariant} dot size="sm">{badge}</NeumorphicBadge>
      </div>
      <p className="text-[9px] sm:text-[10px] text-secondary font-bold uppercase tracking-wider mb-0.5">{label}</p>
      <div className="flex items-center gap-1.5 flex-wrap">
        <span className={`text-sm sm:text-base lg:text-2xl font-black ${valueColor} tabular-nums`}>{value}</span>
        {trend && trendVal && (
          <span className={`text-[9px] sm:text-[10px] font-bold flex items-center gap-0.5 ${trend === 'up' ? 'text-phosphor' : 'text-crimson'}`}>
            <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              {trend === 'up' ? <polyline points="18 15 12 9 6 15" /> : <polyline points="6 9 12 15 18 9" />}
            </svg>
            {trendVal}
          </span>
        )}
      </div>
      {sub && <p className="text-[9px] sm:text-[10px] text-muted mt-0.5">{sub}</p>}
    </NeumorphicCard>
  )
}

/* ============================================================
   Page
   ============================================================ */
export default function Dashboard() {
  const totalSales = DATA.hourlySales.reduce((s, h) => s + h.v, 0)
  const peak = DATA.hourlySales.reduce((a, b) => (a.v > b.v ? a : b))
  const totalPay = DATA.payments.reduce((s, p) => s + p.v, 0)

  return (
    <div className="space-y-4 sm:space-y-5 lg:space-y-6 max-w-7xl mx-auto">
      {/* HEADER */}
      <div className="flex flex-col xs:flex-row xs:items-center justify-between gap-2 animate-fade-in">
        <div>
          <h1 className="text-lg sm:text-xl lg:text-2xl font-black text-primary tracking-tight">Dashboard</h1>
          <p className="text-[11px] sm:text-sm text-secondary mt-0.5 leading-tight">Real-time overview of your business today</p>
        </div>
        <div className="xs:hidden"><LiveClock /></div>
      </div>

      {/* KPI ROW */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 lg:gap-4">
        <KpiCard icon={<svg width="16" height="16" className="sm:w-[18px] sm:h-[18px] lg:w-5 lg:h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" /></svg>}
          iconColor="text-phosphor" badge="Sales" badgeVariant="success" label="Today's Revenue" value={fmtShort(DATA.kpis.sales.value)} valueColor="text-phosphor"
          trend="up" trendVal={`+${DATA.kpis.sales.trend}%`} sub={`${DATA.kpis.sales.count} transactions`} delay={0} />
        <KpiCard icon={<svg width="16" height="16" className="sm:w-[18px] sm:h-[18px] lg:w-5 lg:h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" /><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" /></svg>}
          iconColor="text-primary" badge="Orders" badgeVariant="neutral" label="Transactions" value={String(DATA.kpis.sales.count)} valueColor="text-primary"
          trend="up" trendVal="+8 today" sub={`Avg ${fmtRp(DATA.kpis.sales.value / DATA.kpis.sales.count)}/order`} delay={100} />
        <KpiCard icon={<svg width="16" height="16" className="sm:w-[18px] sm:h-[18px] lg:w-5 lg:h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>}
          iconColor="text-phosphor" badge="Active" badgeVariant="success" label="Cashier" value={DATA.kpis.shift.cashier} valueColor="text-primary"
          sub={`Since ${DATA.kpis.shift.since} WIB`} delay={200} glow="green" />
        <KpiCard icon={<svg width="16" height="16" className="sm:w-[18px] sm:h-[18px] lg:w-5 lg:h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" /><path d="M3 5v14a2 2 0 0 0 2 2h16v-5" /><path d="M18 12a2 2 0 0 0 0 4h4v-4Z" /></svg>}
          iconColor="text-crimson" badge="Expense" badgeVariant="danger" label="Today's Expenses" value={fmtShort(DATA.kpis.expenses.value)} valueColor="text-crimson"
          trend="down" trendVal={`${Math.abs(DATA.kpis.expenses.trend)}%`} sub={`${DATA.kpis.expenses.items} entries`} delay={300} />
      </div>

      {/* CHARTS ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
        {/* Sales Chart */}
        <NeumorphicCard variant="raised" padding="md" className="lg:col-span-2">
          <CardHeader title="Today's Revenue" subtitle="Hourly sales" action={
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-phosphor/60" />
              <span className="text-[8px] sm:text-[9px] text-muted font-semibold">Past</span>
              <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-phosphor" />
              <span className="text-[8px] sm:text-[9px] text-muted font-semibold">Now</span>
            </div>
          } />
          <BarChart data={DATA.hourlySales} />
          <div className="flex items-center justify-between mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-border-subtle">
            <div>
              <p className="text-[9px] sm:text-[10px] text-secondary font-bold uppercase tracking-wider">Total Today</p>
              <p className="text-sm sm:text-base lg:text-xl font-black text-phosphor tabular-nums">{fmtShort(totalSales)}</p>
            </div>
            <div className="text-right">
              <p className="text-[9px] sm:text-[10px] text-secondary font-bold uppercase tracking-wider">Peak</p>
              <p className="text-xs sm:text-sm lg:text-base font-bold text-primary">{peak.h}:00</p>
            </div>
          </div>
        </NeumorphicCard>

        {/* Payment Distribution */}
        <NeumorphicCard variant="raised" padding="md">
          <CardHeader title="Payment Methods" subtitle="Distribution" action={<NeumorphicBadge variant="neutral" size="sm">Today</NeumorphicBadge>} />
          <PayBars data={DATA.payments} />
          <NeumorphicDivider className="my-3 sm:my-4" />
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-xs text-secondary font-semibold">Collected</span>
            <span className="text-sm sm:text-base lg:text-lg font-black text-primary tabular-nums">{fmtShort(totalPay)}</span>
          </div>
        </NeumorphicCard>
      </div>

      {/* BOTTOM ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
        {/* Transactions */}
        <NeumorphicCard variant="raised" padding="md" className="lg:col-span-2">
          <CardHeader title="Recent Transactions" subtitle="Latest orders" action={<NeumorphicButton variant="ghost" size="sm">View All</NeumorphicButton>} />
          <TxList data={DATA.transactions} />
        </NeumorphicCard>

        {/* Right Sidebar */}
        <div className="space-y-4 sm:space-y-5 lg:space-y-6">
          {/* Low Stock */}
          <NeumorphicCard variant="raised" padding="md">
            <CardHeader title="Low Stock" subtitle="Needs reorder" action={<NeumorphicBadge variant="danger" dot size="sm">{DATA.stock.length} Alerts</NeumorphicBadge>} />
            <div className="space-y-2 sm:space-y-2.5">
              {DATA.stock.map(item => (
                <div key={item.name} className="flex items-center justify-between neumo-indented rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 gap-2">
                  <div className="min-w-0 flex-1">
                    <p className="text-xs sm:text-sm font-semibold text-primary truncate">{item.name}</p>
                    <p className="text-[9px] sm:text-[10px] text-muted mt-0.5">Threshold: {item.thresh} {item.unit}</p>
                  </div>
                  <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
                    <span className={`text-xs sm:text-sm font-bold ${item.stock === 0 ? 'text-crimson animate-pulse' : 'text-crimson'}`}>{item.stock}/{item.thresh}</span>
                    <NeumorphicButton variant="ghost" size="sm">Order</NeumorphicButton>
                  </div>
                </div>
              ))}
              <NeumorphicButton variant="neutral" fullWidth size="sm" className="mt-1">View All Inventory</NeumorphicButton>
            </div>
          </NeumorphicCard>

          {/* Shift */}
          <NeumorphicCard variant="raised" padding="md">
            <CardHeader title="Shift" subtitle={'Cashier: ' + DATA.kpis.shift.cashier} action={<NeumorphicBadge variant="success" dot size="sm">Open</NeumorphicBadge>} />
            <div className="space-y-2.5 sm:space-y-3">
              <div className="grid grid-cols-2 gap-2 sm:gap-3">
                <div className="neumo-indented rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 text-center">
                  <p className="text-[8px] sm:text-[9px] text-secondary font-bold uppercase tracking-wider">Start</p>
                  <p className="text-xs sm:text-sm lg:text-base font-black text-primary">Rp 500K</p>
                </div>
                <div className="neumo-indented rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 text-center">
                  <p className="text-[8px] sm:text-[9px] text-secondary font-bold uppercase tracking-wider">Expected</p>
                  <p className="text-xs sm:text-sm lg:text-base font-black text-primary">Rp 2.95M</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 sm:gap-3">
                <NeumorphicButton variant="success" size="sm" icon={<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>}>End Shift</NeumorphicButton>
                <NeumorphicButton variant="ghost" size="sm">Report</NeumorphicButton>
              </div>
            </div>
          </NeumorphicCard>
        </div>
      </div>

      {/* FOOTER */}
      <footer className="pt-3 sm:pt-4">
        <NeumorphicDivider className="mb-3 sm:mb-4" />
        <div className="flex flex-col xs:flex-row items-start xs:items-center justify-between gap-1 text-[8px] sm:text-[10px] text-muted">
          <span>CashierGo v0.1.0</span>
          <span>Data demo • {new Date().toLocaleTimeString('id-ID')}</span>
        </div>
      </footer>
    </div>
  )
}
