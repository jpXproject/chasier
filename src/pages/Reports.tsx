import { useState, useMemo } from 'react'

/* ============================================================
   Helpers
   ============================================================ */
const fmtCurrency = (n: number) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(n)

const fmtShort = (n: number) =>
  n >= 1_000_000 ? `${(n / 1_000_000).toFixed(1)}jt` : n >= 1_000 ? `${(n / 1_000).toFixed(0)}rb` : String(n)

/* ============================================================
   Mock Data
   ============================================================ */
const WEEKLY_SALES = [
  { day: 'Sen', value: 2_450_000, transactions: 48 },
  { day: 'Sel', value: 2_180_000, transactions: 42 },
  { day: 'Rab', value: 2_890_000, transactions: 55 },
  { day: 'Kam', value: 2_320_000, transactions: 44 },
  { day: 'Jum', value: 3_150_000, transactions: 61 },
  { day: 'Sab', value: 3_780_000, transactions: 72 },
  { day: 'Min', value: 2_950_000, transactions: 56 },
]

const MONTHLY_SALES = [
  { month: 'Jan', revenue: 68_500_000, expenses: 42_300_000 },
  { month: 'Feb', revenue: 72_200_000, expenses: 44_100_000 },
  { month: 'Mar', revenue: 78_900_000, expenses: 45_800_000 },
  { month: 'Apr', revenue: 75_400_000, expenses: 43_200_000 },
  { month: 'Mei', revenue: 82_100_000, expenses: 47_500_000 },
  { month: 'Jun', revenue: 88_700_000, expenses: 49_200_000 },
  { month: 'Jul', revenue: 45_200_000, expenses: 28_400_000 },
]

const TOP_PRODUCTS = [
  { name: 'Caffe Latte', sold: 342, revenue: 12_996_000, category: 'Coffee' },
  { name: 'Cappuccino', sold: 298, revenue: 10_430_000, category: 'Coffee' },
  { name: 'Matcha Latte', sold: 256, revenue: 10_240_000, category: 'Non-Coffee' },
  { name: 'Espresso', sold: 234, revenue: 5_850_000, category: 'Coffee' },
  { name: 'Croissant', sold: 189, revenue: 4_158_000, category: 'Food' },
  { name: 'Tote Bag', sold: 67, revenue: 3_685_000, category: 'Merch' },
]

const CATEGORY_SALES = [
  { category: 'Coffee', value: 48_500_000, percentage: 42 },
  { category: 'Non-Coffee', value: 28_300_000, percentage: 24 },
  { category: 'Food', value: 22_100_000, percentage: 19 },
  { category: 'Merch', value: 17_400_000, percentage: 15 },
]

const EMPLOYEE_PERFORMANCE = [
  { name: 'Ahmad Fauzan', avatar: '👨‍💼', shifts: 22, sales: 52_800_000, avgPerShift: 2_400_000 },
  { name: 'Siti Nurhaliza', avatar: '👩‍💼', shifts: 20, sales: 48_500_000, avgPerShift: 2_425_000 },
  { name: 'Budi Santoso', avatar: '👨‍🍳', shifts: 24, sales: 0, avgPerShift: 0 },
  { name: 'Rina Wati', avatar: '👩‍🍳', shifts: 21, sales: 0, avgPerShift: 0 },
]

const DAILY_AVERAGE = {
  thisWeek: 2_817_000,
  lastWeek: 2_543_000,
  change: 10.8,
}

/* ============================================================
   Bar Chart Component
   ============================================================ */
function BarChart({ data, labelKey, valueKey, color }: { data: Record<string, any>[]; labelKey: string; valueKey: string; color: string }) {
  const max = Math.max(...data.map(d => d[valueKey]), 1)

  return (
    <div className="flex items-end gap-2 h-48 pt-2">
      {data.map((d, i) => {
        const pct = (d[valueKey] / max) * 100
        return (
          <div key={i} className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
            <span className="num text-[9px] font-600 text-2 tabular-nums">{fmtShort(d[valueKey])}</span>
            <div
              className="w-full rounded-t-md min-h-[4px] transition-all duration-500"
              style={{ height: `${Math.max(pct, 3)}%`, background: color }}
            />
            <span className="text-[10px] font-500 text-3">{d[labelKey]}</span>
          </div>
        )
      })}
    </div>
  )
}

/* ============================================================
   Donut Chart Component (CSS-based)
   ============================================================ */
function DonutChart({ data }: { data: typeof CATEGORY_SALES }) {
  const total = data.reduce((s, d) => s + d.value, 0)
  let cumulative = 0

  const colors = ['var(--green)', 'var(--blue)', 'var(--amber)', 'var(--text-3)']

  return (
    <div className="flex items-center gap-6">
      {/* Donut */}
      <div className="relative w-32 h-32 flex-shrink-0">
        <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
          {data.map((d, i) => {
            const pct = (d.value / total) * 100
            const offset = cumulative
            cumulative += pct
            return (
              <circle
                key={i}
                cx="18" cy="18" r="14"
                fill="none"
                stroke={colors[i]}
                strokeWidth="5"
                strokeDasharray={`${pct} ${100 - pct}`}
                strokeDashoffset={`${-offset}`}
                className="transition-all duration-700"
              />
            )
          })}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <p className="num text-lg font-700 text-1">{fmtShort(total)}</p>
          <p className="text-[9px] text-3">Total</p>
        </div>
      </div>

      {/* Legend */}
      <div className="space-y-2.5 flex-1">
        {data.map((d, i) => (
          <div key={d.category}>
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-sm" style={{ background: colors[i] }} />
                <span className="text-xs font-500 text-1">{d.category}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="num text-xs font-600 text-2">{fmtShort(d.value)}</span>
                <span className="text-[10px] text-3">{d.percentage}%</span>
              </div>
            </div>
            <div className="progress-track">
              <div className="progress-fill" style={{ width: `${d.percentage}%`, background: colors[i] }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ============================================================
   Main Reports Page
   ============================================================ */
export default function Reports() {
  const [dateRange, setDateRange] = useState<'week' | 'month' | 'year'>('week')

  const summary = useMemo(() => {
    const totalRevenue = MONTHLY_SALES.reduce((s, m) => s + m.revenue, 0)
    const totalExpenses = MONTHLY_SALES.reduce((s, m) => s + m.expenses, 0)
    const netProfit = totalRevenue - totalExpenses
    const profitMargin = totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0
    return { totalRevenue, totalExpenses, netProfit, profitMargin }
  }, [])

  return (
    <div className="space-y-5 max-w-7xl mx-auto anim-fade">
      {/* Header */}
      <div className="flex flex-col xs:flex-row xs:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-700 text-1 tracking-tight">Reports & Analytics</h1>
          <p className="text-sm text-3 mt-0.5">Analisis performa bisnis Anda</p>
        </div>
        <div className="flex gap-2">
          <div className="flex rounded-lg overflow-hidden" style={{ border: '1px solid var(--border)' }}>
            {(['week', 'month', 'year'] as const).map(r => (
              <button
                key={r}
                onClick={() => setDateRange(r)}
                className="px-4 py-2 text-xs font-600 transition-colors"
                style={
                  dateRange === r
                    ? { background: 'var(--green)', color: '#fff' }
                    : { background: 'transparent', color: 'var(--text-2)' }
                }
              >
                {r === 'week' ? 'Minggu' : r === 'month' ? 'Bulan' : 'Tahun'}
              </button>
            ))}
          </div>
          <button className="btn-outline px-4 py-2 text-xs font-600 flex items-center gap-2">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            Export
          </button>
        </div>
      </div>

      {/* Summary KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: 'Total Revenue', value: fmtCurrency(summary.totalRevenue), icon: '💰', color: 'var(--green)', trend: '+12.5%' },
          { label: 'Total Expenses', value: fmtCurrency(summary.totalExpenses), icon: '💸', color: 'var(--red)', trend: '+8.2%' },
          { label: 'Net Profit', value: fmtCurrency(summary.netProfit), icon: '📈', color: 'var(--blue)', trend: '+15.3%' },
          { label: 'Profit Margin', value: `${summary.profitMargin.toFixed(1)}%`, icon: '📊', color: 'var(--amber)', trend: '+2.1%' },
        ].map((s) => (
          <div key={s.label} className="card p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg" style={{ background: s.color + '18' }}>
                {s.icon}
              </div>
              <span className="flex items-center gap-0.5 text-[10px] font-600 px-1.5 py-0.5 rounded-full" style={{ background: 'var(--green-dim)', color: 'var(--green)' }}>
                <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="18 15 12 9 6 15" /></svg>
                {s.trend}
              </span>
            </div>
            <p className="text-[10px] font-500 text-3 uppercase tracking-wider">{s.label}</p>
            <p className="num text-lg font-700 text-1 leading-tight mt-0.5">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Weekly Sales Bar Chart */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm font-600 text-1">Penjualan Mingguan</p>
              <p className="text-[11px] text-3 mt-0.5">7 hari terakhir</p>
            </div>
            <span className="badge badge-green">+10.8%</span>
          </div>
          <BarChart data={WEEKLY_SALES} labelKey="day" valueKey="value" color="var(--green)" />
          <div className="grid grid-cols-3 gap-3 mt-4 pt-4" style={{ borderTop: '1px solid var(--border)' }}>
            <div className="text-center">
              <p className="text-[9px] text-3 uppercase tracking-wider">Rata-rata/Hari</p>
              <p className="num text-sm font-700 text-1">{fmtShort(DAILY_AVERAGE.thisWeek)}</p>
            </div>
            <div className="text-center">
              <p className="text-[9px] text-3 uppercase tracking-wider">Total Minggu</p>
              <p className="num text-sm font-700 text-green">{fmtShort(WEEKLY_SALES.reduce((s, d) => s + d.value, 0))}</p>
            </div>
            <div className="text-center">
              <p className="text-[9px] text-3 uppercase tracking-wider">Total Transaksi</p>
              <p className="num text-sm font-700 text-1">{WEEKLY_SALES.reduce((s, d) => s + d.transactions, 0)}</p>
            </div>
          </div>
        </div>

        {/* Category Distribution */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm font-600 text-1">Distribusi Kategori</p>
              <p className="text-[11px] text-3 mt-0.5">Bulan ini</p>
            </div>
          </div>
          <DonutChart data={CATEGORY_SALES} />
        </div>
      </div>

      {/* Monthly Revenue vs Expenses */}
      <div className="card p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm font-600 text-1">Revenue vs Expenses</p>
            <p className="text-[11px] text-3 mt-0.5">7 bulan terakhir</p>
          </div>
          <div className="flex items-center gap-4 text-[10px]">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm" style={{ background: 'var(--green)' }} />
              Revenue
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm" style={{ background: 'var(--red)' }} />
              Expenses
            </span>
          </div>
        </div>
        <div className="flex items-end gap-3 h-56 pt-2">
          {MONTHLY_SALES.map((d, i) => {
            const maxRev = Math.max(...MONTHLY_SALES.map(m => m.revenue))
            const revPct = (d.revenue / maxRev) * 100
            const expPct = (d.expenses / maxRev) * 100
            return (
              <div key={i} className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
                <div className="flex gap-1 items-end w-full" style={{ height: '85%' }}>
                  <div
                    className="flex-1 rounded-t-sm transition-all duration-500"
                    style={{ height: `${revPct}%`, background: 'var(--green)' }}
                  />
                  <div
                    className="flex-1 rounded-t-sm transition-all duration-500"
                    style={{ height: `${expPct}%`, background: 'var(--red)', opacity: 0.7 }}
                  />
                </div>
                <span className="text-[10px] font-500 text-3">{d.month}</span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Top Products */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm font-600 text-1">Top Products</p>
              <p className="text-[11px] text-3 mt-0.5">Produk terlaris bulan ini</p>
            </div>
          </div>
          <div className="space-y-3">
            {TOP_PRODUCTS.map((p, i) => (
              <div key={p.name} className="flex items-center gap-3">
                <span className="num text-xs font-700 text-3 w-5 text-right">#{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-500 text-1 truncate">{p.name}</p>
                    <span className="num text-xs font-600 text-1">{fmtShort(p.revenue)}</span>
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <span className="badge badge-neutral text-[9px]">{p.category}</span>
                    <span className="text-[10px] text-3">{p.sold} terjual</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Employee Performance */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm font-600 text-1">Performa Karyawan</p>
              <p className="text-[11px] text-3 mt-0.5">Kasir & Barista bulan ini</p>
            </div>
          </div>
          <div className="space-y-3">
            {EMPLOYEE_PERFORMANCE.map((e) => {
              const maxSales = Math.max(...EMPLOYEE_PERFORMANCE.map(emp => emp.sales))
              const pct = maxSales > 0 ? (e.sales / maxSales) * 100 : 0
              return (
                <div key={e.name}>
                  <div className="flex items-center gap-3 mb-1.5">
                    <span className="text-lg">{e.avatar}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-500 text-1 truncate">{e.name}</p>
                      <p className="text-[10px] text-3">{e.shifts} shift · Avg {fmtShort(e.avgPerShift)}/shift</p>
                    </div>
                    <span className="num text-sm font-700 text-1">{fmtShort(e.sales)}</span>
                  </div>
                  <div className="progress-track ml-8">
                    <div className="progress-fill" style={{ width: `${Math.max(pct, 2)}%` }} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Quick Stats Footer */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: 'Avg Order Value', value: fmtCurrency(58_000), icon: '🧾' },
          { label: 'Items Sold', value: '1,245', icon: '📦' },
          { label: 'New Customers', value: '89', icon: '👥' },
          { label: 'Return Rate', value: '12%', icon: '🔄' },
        ].map((s) => (
          <div key={s.label} className="card p-4 text-center">
            <span className="text-xl">{s.icon}</span>
            <p className="text-[10px] font-500 text-3 uppercase tracking-wider mt-1">{s.label}</p>
            <p className="num text-lg font-700 text-1 mt-0.5">{s.value}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
