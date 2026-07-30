import { useEffect, useState } from 'react'

const DATA = {
  kpis: {
    sales: { value: 2_450_000, trend: 12.5, count: 48 },
    shift: { cashier: 'Ahmad Fauzan', since: '07:45' },
    expenses: { value: 340_000, trend: -3.2, items: 5 },
  },
  hourlySales: [
    { h: '06', v: 0 }, { h: '07', v: 45_000 }, { h: '08', v: 120_000 },
    { h: '09', v: 280_000 }, { h: '10', v: 350_000 }, { h: '11', v: 410_000 },
    { h: '12', v: 520_000 }, { h: '13', v: 380_000 }, { h: '14', v: 210_000 },
    { h: '15', v: 85_000 }, { h: '16', v: 42_000 }, { h: '17', v: 5_000 },
  ],
  transactions: [
    { id: 'TRX-3001', t: '14:23', n: 3, total: 85_000, pay: 'QRIS', status: 'done' as const },
    { id: 'TRX-3002', t: '14:18', n: 1, total: 45_000, pay: 'Cash', status: 'done' as const },
    { id: 'TRX-3003', t: '14:05', n: 5, total: 210_000, pay: 'Debit', status: 'done' as const },
    { id: 'TRX-3004', t: '13:52', n: 2, total: 120_000, pay: 'QRIS', status: 'done' as const },
    { id: 'TRX-3005', t: '13:40', n: 7, total: 350_000, pay: 'Credit', status: 'done' as const },
    { id: 'TRX-3006', t: '13:22', n: 4, total: 175_000, pay: 'Cash', status: 'pending' as const },
    { id: 'TRX-3007', t: '13:10', n: 2, total: 95_000, pay: 'QRIS', status: 'done' as const },
  ],
  stock: [
    { name: 'Arabica Coffee Beans', stock: 2, unit: 'kg', thresh: 10 },
    { name: 'Fresh Milk', stock: 1, unit: 'L', thresh: 8 },
    { name: 'Vanilla Syrup', stock: 0, unit: 'btl', thresh: 5 },
  ],
  payments: [
    { m: 'QRIS', v: 1_050_000, p: 43 },
    { m: 'Cash', v: 680_000, p: 28 },
    { m: 'Debit', v: 420_000, p: 17 },
    { m: 'Credit', v: 300_000, p: 12 },
  ],
}

const fmtRp = (n: number) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(n)

const fmtShort = (n: number) =>
  n >= 1_000_000 ? `${(n / 1_000_000).toFixed(1)}jt` : n >= 1_000 ? `${(n / 1_000).toFixed(0)}rb` : String(n)

function LiveClock() {
  const [t, setT] = useState(new Date())
  useEffect(() => {
    const id = setInterval(() => setT(new Date()), 1000)
    return () => clearInterval(id)
  }, [])
  return (
    <div className="text-right">
      <p className="text-[11px] text-3 leading-tight">
        {t.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
      </p>
      <p className="num text-xl font-700 text-1 leading-tight tabular-nums">
        {t.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
      </p>
    </div>
  )
}

function KpiCard({
  icon, accentColor, label, value, sub, trend, trendVal, delay,
}: {
  icon: React.ReactNode
  accentColor: string
  label: string
  value: string
  sub?: string
  trend?: 'up' | 'down'
  trendVal?: string
  delay: number
}) {
  const [show, setShow] = useState(false)
  useEffect(() => {
    const t = setTimeout(() => setShow(true), delay)
    return () => clearTimeout(t)
  }, [delay])

  return (
    <div
      className={`card p-5 flex flex-col gap-3 transition-all duration-500 ${show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
    >
      <div className="flex items-center justify-between">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: accentColor + '18', color: accentColor }}
        >
          {icon}
        </div>
        {trend && trendVal && (
          <span
            className="flex items-center gap-1 text-[11px] font-600 px-2 py-0.5 rounded-full"
            style={{
              color: trend === 'up' ? 'var(--green)' : 'var(--red)',
              background: trend === 'up' ? 'var(--green-dim)' : 'var(--red-dim)',
            }}
          >
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              {trend === 'up' ? <polyline points="18 15 12 9 6 15" /> : <polyline points="6 9 12 15 18 9" />}
            </svg>
            {trendVal}
          </span>
        )}
      </div>
      <div>
        <p className="text-[11px] font-500 text-3 uppercase tracking-wider mb-1">{label}</p>
        <p className="num text-2xl font-700 text-1 leading-none tabular-nums">{value}</p>
        {sub && <p className="text-[11px] text-3 mt-1.5">{sub}</p>}
      </div>
    </div>
  )
}

function BarChart({ data }: { data: typeof DATA.hourlySales }) {
  const max = Math.max(...data.map((d) => d.v), 1)
  const now = new Date().getHours()

  return (
    <div className="flex items-end gap-1.5 h-36 pt-2">
      {data.map((d) => {
        const pct = (d.v / max) * 100
        const isNow = parseInt(d.h) === now
        const isPast = parseInt(d.h) < now

        return (
          <div key={d.h} className="flex-1 flex flex-col items-center gap-1 h-full justify-end group cursor-default">
            <div
              className="w-full rounded-t-md min-h-[3px] transition-all duration-700 relative"
              style={{
                height: `${Math.max(pct, 3)}%`,
                background: isNow
                  ? 'var(--green)'
                  : isPast
                  ? 'var(--green-dim)'
                  : 'var(--surface-3)',
                opacity: isNow ? 1 : isPast ? 0.7 : 0.4,
              }}
              title={`${d.h}:00 — ${fmtRp(d.v)}`}
            />
            <span
              className="text-[9px] font-500 tabular-nums"
              style={{ color: isNow ? 'var(--green)' : 'var(--text-3)' }}
            >
              {d.h}
            </span>
          </div>
        )
      })}
    </div>
  )
}

function PaymentBar({ m, v, p }: { m: string; v: number; p: number }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-sm font-500 text-1">{m}</span>
        <div className="flex items-center gap-2">
          <span className="num text-xs font-600 text-2 tabular-nums">Rp {fmtShort(v)}</span>
          <span className="text-[11px] font-600 text-3">{p}%</span>
        </div>
      </div>
      <div className="progress-track">
        <div className="progress-fill" style={{ width: `${p}%` }} />
      </div>
    </div>
  )
}

export default function Dashboard() {
  const totalSales = DATA.hourlySales.reduce((s, h) => s + h.v, 0)
  const peak = DATA.hourlySales.reduce((a, b) => (a.v > b.v ? a : b))

  return (
    <div className="space-y-5 max-w-7xl mx-auto anim-fade">
      {/* Header */}
      <div className="flex flex-col xs:flex-row xs:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-700 text-1 tracking-tight">Selamat pagi, Ahmad 👋</h1>
          <p className="text-sm text-3 mt-0.5">Berikut ringkasan bisnis Anda hari ini.</p>
        </div>
        <LiveClock />
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          icon={
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" />
            </svg>
          }
          accentColor="var(--green)"
          label="Pendapatan Hari Ini"
          value={`Rp ${fmtShort(DATA.kpis.sales.value)}`}
          sub={`${DATA.kpis.sales.count} transaksi`}
          trend="up"
          trendVal={`+${DATA.kpis.sales.trend}%`}
          delay={0}
        />
        <KpiCard
          icon={
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            </svg>
          }
          accentColor="var(--blue)"
          label="Transaksi"
          value={String(DATA.kpis.sales.count)}
          sub={`Avg ${fmtRp(DATA.kpis.sales.value / DATA.kpis.sales.count)}/order`}
          trend="up"
          trendVal="+8"
          delay={80}
        />
        <KpiCard
          icon={
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
            </svg>
          }
          accentColor="var(--green)"
          label="Kasir Aktif"
          value={DATA.kpis.shift.cashier}
          sub={`Sejak ${DATA.kpis.shift.since} WIB`}
          delay={160}
        />
        <KpiCard
          icon={
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" />
              <path d="M3 5v14a2 2 0 0 0 2 2h16v-5" />
              <path d="M18 12a2 2 0 0 0 0 4h4v-4Z" />
            </svg>
          }
          accentColor="var(--red)"
          label="Pengeluaran"
          value={`Rp ${fmtShort(DATA.kpis.expenses.value)}`}
          sub={`${DATA.kpis.expenses.items} entri`}
          trend="down"
          trendVal={`${Math.abs(DATA.kpis.expenses.trend)}%`}
          delay={240}
        />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Bar chart */}
        <div className="card p-5 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm font-600 text-1">Penjualan Harian</p>
              <p className="text-[11px] text-3 mt-0.5">Per jam — hari ini</p>
            </div>
            <div className="flex items-center gap-3 text-[10px] text-3">
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-sm inline-block" style={{ background: 'var(--green)', opacity: 0.3 }} />
                Lalu
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-sm inline-block" style={{ background: 'var(--green)' }} />
                Sekarang
              </span>
            </div>
          </div>
          <BarChart data={DATA.hourlySales} />
          <div
            className="flex items-center justify-between mt-4 pt-4"
            style={{ borderTop: '1px solid var(--border)' }}
          >
            <div>
              <p className="text-[10px] text-3 uppercase tracking-wider font-500 mb-0.5">Total Hari Ini</p>
              <p className="num text-lg font-700 text-green tabular-nums">Rp {fmtShort(totalSales)}</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-3 uppercase tracking-wider font-500 mb-0.5">Jam Puncak</p>
              <p className="num text-lg font-600 text-1">{peak.h}:00</p>
            </div>
          </div>
        </div>

        {/* Payment methods */}
        <div className="card p-5">
          <div className="mb-4">
            <p className="text-sm font-600 text-1">Metode Pembayaran</p>
            <p className="text-[11px] text-3 mt-0.5">Distribusi hari ini</p>
          </div>
          <div className="space-y-4">
            {DATA.payments.map((d) => (
              <PaymentBar key={d.m} m={d.m} v={d.v} p={d.p} />
            ))}
          </div>
          <div className="mt-4 pt-4" style={{ borderTop: '1px solid var(--border)' }}>
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-3">Total Terkumpul</span>
              <span className="num text-sm font-700 text-1 tabular-nums">
                Rp {fmtShort(DATA.payments.reduce((s, p) => s + p.v, 0))}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Recent transactions */}
        <div className="card p-5 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm font-600 text-1">Transaksi Terbaru</p>
              <p className="text-[11px] text-3 mt-0.5">7 transaksi terakhir</p>
            </div>
            <button className="btn-ghost text-xs font-500 px-3 py-1.5">Lihat Semua</button>
          </div>

          {/* Mobile list */}
          <div className="sm:hidden space-y-2">
            {DATA.transactions.map((tx) => (
              <div
                key={tx.id}
                className="flex items-center gap-3 p-3 rounded-xl"
                style={{ background: 'var(--surface-2)' }}
              >
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: 'var(--surface-3)' }}
                >
                  <span className="num text-[10px] font-700 text-2">{tx.id.slice(-3)}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-600 text-1">{tx.t}</p>
                  <p className="text-[10px] text-3">{tx.n} item · {tx.pay}</p>
                </div>
                <div className="text-right">
                  <p className="num text-xs font-700 text-1 tabular-nums">Rp {fmtShort(tx.total)}</p>
                  <span
                    className={`badge mt-0.5 ${tx.status === 'done' ? 'badge-green' : 'badge-amber'}`}
                  >
                    {tx.status === 'done' ? 'Lunas' : 'Pending'}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop table */}
          <div className="hidden sm:block">
            <table className="w-full">
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)' }}>
                  {['ID', 'Waktu', 'Item', 'Total', 'Pembayaran', 'Status'].map((h) => (
                    <th key={h} className="text-left pb-2.5 text-[10px] font-600 text-3 uppercase tracking-wider last:text-right pr-3 last:pr-0">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {DATA.transactions.map((tx) => (
                  <tr
                    key={tx.id}
                    className="group transition-colors"
                    style={{ borderBottom: '1px solid var(--border)' }}
                  >
                    <td className="py-3 pr-3">
                      <span className="num text-[11px] font-600 text-2">{tx.id}</span>
                    </td>
                    <td className="py-3 pr-3">
                      <span className="num text-xs text-2">{tx.t}</span>
                    </td>
                    <td className="py-3 pr-3">
                      <span className="text-xs text-1 font-500">{tx.n}</span>
                    </td>
                    <td className="py-3 pr-3">
                      <span className="num text-xs font-700 text-1 tabular-nums">{fmtRp(tx.total)}</span>
                    </td>
                    <td className="py-3 pr-3">
                      <span className="badge badge-neutral">{tx.pay}</span>
                    </td>
                    <td className="py-3 text-right">
                      <span className={`badge ${tx.status === 'done' ? 'badge-green' : 'badge-amber'}`}>
                        {tx.status === 'done' ? 'Lunas' : 'Pending'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-4">
          {/* Stock alerts */}
          <div className="card p-5">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-sm font-600 text-1">Stok Menipis</p>
                <p className="text-[11px] text-3 mt-0.5">Perlu segera reorder</p>
              </div>
              <span className="badge badge-red">{DATA.stock.length} alert</span>
            </div>
            <div className="space-y-2">
              {DATA.stock.map((item) => (
                <div
                  key={item.name}
                  className="flex items-center gap-3 p-3 rounded-xl"
                  style={{ background: 'var(--red-dim)', border: '1px solid var(--red-border)' }}
                >
                  <div
                    className="w-1 h-8 rounded-full flex-shrink-0"
                    style={{ background: item.stock === 0 ? 'var(--red)' : 'var(--amber)' }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-600 text-1 truncate">{item.name}</p>
                    <p className="text-[10px] text-3 mt-0.5">Min: {item.thresh} {item.unit}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p
                      className="num text-sm font-700 tabular-nums"
                      style={{ color: item.stock === 0 ? 'var(--red)' : 'var(--amber)' }}
                    >
                      {item.stock}/{item.thresh}
                    </p>
                    <p className="text-[9px] text-3 mt-0.5">{item.unit}</p>
                  </div>
                </div>
              ))}
            </div>
            <button
              className="btn-outline w-full text-xs font-500 py-2 mt-3"
            >
              Lihat Semua Inventory
            </button>
          </div>

          {/* Shift card */}
          <div className="card p-5">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-sm font-600 text-1">Shift Aktif</p>
                <p className="text-[11px] text-3 mt-0.5">{DATA.kpis.shift.cashier}</p>
              </div>
              <span className="badge badge-green">
                <span
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ background: 'var(--green)', animation: 'pulse-dot 2s ease-in-out infinite' }}
                />
                Buka
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 mb-3">
              {[
                { label: 'Modal Awal', value: 'Rp 500rb' },
                { label: 'Expected', value: 'Rp 2,95jt' },
              ].map(({ label, value }) => (
                <div
                  key={label}
                  className="text-center p-3 rounded-xl"
                  style={{ background: 'var(--surface-2)' }}
                >
                  <p className="text-[10px] text-3 font-500 uppercase tracking-wider mb-1">{label}</p>
                  <p className="num text-sm font-700 text-1">{value}</p>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <button
                className="btn-primary flex-1 text-xs font-600 py-2.5"
              >
                Tutup Shift
              </button>
              <button className="btn-outline flex-1 text-xs font-500 py-2.5">Laporan</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
