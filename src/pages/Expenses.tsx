import { useState, useMemo } from 'react'
import { EXPENSES, EXPENSE_CATEGORIES, type ExpenseCategory } from '../data/purchasingData'

/* ============================================================
   Helper
   ============================================================ */
const fmtCurrency = (n: number) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(n)

/* ============================================================
   Add Expense Modal
   ============================================================ */
function AddExpenseModal({ onClose }: { onClose: () => void }) {
  const [form, setForm] = useState({
    category: 'operational' as ExpenseCategory,
    description: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    paymentMethod: 'cash' as 'cash' | 'transfer' | 'card',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    alert(`Pengeluaran "${form.description}" berhasil dicatat!`)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm anim-fade">
      <div className="card w-full max-w-md mx-4">
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-base font-700 text-1">Catat Pengeluaran</h2>
              <p className="text-[11px] text-3 mt-0.5">Tambah data pengeluaran baru</p>
            </div>
            <button type="button" onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg btn-ghost text-2 hover:text-red flex-shrink-0">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          <div className="space-y-3">
            <div>
              <label className="text-[10px] font-600 text-3 uppercase tracking-wider mb-1.5 block">Kategori</label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value as ExpenseCategory })}
                className="input-base w-full px-3 py-2.5 text-sm"
              >
                {Object.entries(EXPENSE_CATEGORIES).map(([key, cat]) => (
                  <option key={key} value={key}>{cat.icon} {cat.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-[10px] font-600 text-3 uppercase tracking-wider mb-1.5 block">Deskripsi</label>
              <input
                type="text"
                required
                placeholder="Contoh: Listrik bulanan"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="input-base w-full px-3 py-2.5 text-sm"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] font-600 text-3 uppercase tracking-wider mb-1.5 block">Jumlah (Rp)</label>
                <input
                  type="number"
                  required
                  min="0"
                  placeholder="0"
                  value={form.amount}
                  onChange={(e) => setForm({ ...form, amount: e.target.value })}
                  className="input-base w-full px-3 py-2.5 text-sm num"
                />
              </div>
              <div>
                <label className="text-[10px] font-600 text-3 uppercase tracking-wider mb-1.5 block">Tanggal</label>
                <input
                  type="date"
                  required
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                  className="input-base w-full px-3 py-2.5 text-sm"
                />
              </div>
            </div>
            <div>
              <label className="text-[10px] font-600 text-3 uppercase tracking-wider mb-1.5 block">Metode Bayar</label>
              <div className="flex gap-2">
                {[
                  { value: 'cash' as const, label: '💵 Tunai' },
                  { value: 'transfer' as const, label: '🏦 Transfer' },
                  { value: 'card' as const, label: '💳 Kartu' },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setForm({ ...form, paymentMethod: opt.value })}
                    className="flex-1 px-3 py-2 rounded-lg text-xs font-600 transition-all border"
                    style={
                      form.paymentMethod === opt.value
                        ? { background: 'var(--green-dim)', borderColor: 'var(--green-border)', color: 'var(--green)' }
                        : { background: 'var(--surface-2)', borderColor: 'var(--border)', color: 'var(--text-2)' }
                    }
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-outline flex-1 py-2.5 text-sm font-600">Batal</button>
            <button type="submit" className="btn-primary flex-1 py-2.5 text-sm font-700">Catat Pengeluaran</button>
          </div>
        </form>
      </div>
    </div>
  )
}

/* ============================================================
   Main Expenses Page
   ============================================================ */
export default function Expenses() {
  const [showAddModal, setShowAddModal] = useState(false)
  const [filterCategory, setFilterCategory] = useState<'all' | ExpenseCategory>('all')

  const filtered = useMemo(() => {
    if (filterCategory === 'all') return EXPENSES
    return EXPENSES.filter(e => e.category === filterCategory)
  }, [filterCategory])

  const stats = useMemo(() => {
    const totalThisMonth = EXPENSES.reduce((s, e) => s + e.amount, 0)
    const byCategory = Object.entries(EXPENSE_CATEGORIES).map(([key, cat]) => {
      const amount = EXPENSES.filter(e => e.category === key).reduce((s, e) => s + e.amount, 0)
      return { category: key as ExpenseCategory, label: cat.label, icon: cat.icon, color: cat.color, amount, percentage: totalThisMonth > 0 ? (amount / totalThisMonth) * 100 : 0 }
    })
    const byPayment = {
      cash: EXPENSES.filter(e => e.paymentMethod === 'cash').reduce((s, e) => s + e.amount, 0),
      transfer: EXPENSES.filter(e => e.paymentMethod === 'transfer').reduce((s, e) => s + e.amount, 0),
      card: EXPENSES.filter(e => e.paymentMethod === 'card').reduce((s, e) => s + e.amount, 0),
    }
    return { totalThisMonth, byCategory, byPayment }
  }, [])

  return (
    <div className="space-y-5 max-w-7xl mx-auto anim-fade">
      {/* Header */}
      <div className="flex flex-col xs:flex-row xs:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-700 text-1 tracking-tight">Pengeluaran</h1>
          <p className="text-sm text-3 mt-0.5">Catat dan lacak semua biaya pengeluaran</p>
        </div>
        <button onClick={() => setShowAddModal(true)} className="btn-primary px-4 py-2.5 text-sm font-600 flex items-center gap-2 flex-shrink-0">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Catat Pengeluaran
        </button>
      </div>

      {/* KPI + Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Total */}
        <div className="card p-5">
          <p className="text-[10px] font-500 text-3 uppercase tracking-wider mb-2">Total Pengeluaran</p>
          <p className="num text-3xl font-700 text-red leading-none tabular-nums">{fmtCurrency(stats.totalThisMonth)}</p>
          <p className="text-[11px] text-3 mt-2">{EXPENSES.length} transaksi tercatat</p>
        </div>

        {/* By Category */}
        <div className="card p-5 lg:col-span-2">
          <p className="text-sm font-600 text-1 mb-4">Ringkasan per Kategori</p>
          <div className="space-y-3">
            {stats.byCategory.map((cat) => (
              <div key={cat.category}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-500 text-1">{cat.icon} {cat.label}</span>
                  <div className="flex items-center gap-2">
                    <span className="num text-xs font-600 text-2 tabular-nums">{fmtCurrency(cat.amount)}</span>
                    <span className="text-[10px] text-3">{cat.percentage.toFixed(0)}%</span>
                  </div>
                </div>
                <div className="progress-track">
                  <div className="progress-fill" style={{ width: `${cat.percentage}%`, background: cat.color }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Payment Method Summary */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: '💵 Tunai', value: stats.byPayment.cash, color: 'var(--green)' },
          { label: '🏦 Transfer', value: stats.byPayment.transfer, color: 'var(--blue)' },
          { label: '💳 Kartu', value: stats.byPayment.card, color: 'var(--amber)' },
        ].map((pm) => (
          <div key={pm.label} className="card p-4 text-center">
            <p className="text-[10px] font-500 text-3 uppercase tracking-wider mb-1">{pm.label}</p>
            <p className="num text-lg font-700 text-1 leading-tight tabular-nums">{fmtCurrency(pm.value)}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        <button
          onClick={() => setFilterCategory('all')}
          className="flex-shrink-0 px-4 py-2 rounded-lg text-xs font-600 transition-all duration-150"
          style={
            filterCategory === 'all'
              ? { background: 'var(--green)', color: '#fff' }
              : { background: 'var(--surface-2)', color: 'var(--text-2)' }
          }
        >
          Semua
        </button>
        {Object.entries(EXPENSE_CATEGORIES).map(([key, cat]) => (
          <button
            key={key}
            onClick={() => setFilterCategory(key as ExpenseCategory)}
            className="flex-shrink-0 px-4 py-2 rounded-lg text-xs font-600 transition-all duration-150"
            style={
              filterCategory === key
                ? { background: 'var(--green)', color: '#fff' }
                : { background: 'var(--surface-2)', color: 'var(--text-2)' }
            }
          >
            {cat.icon} {cat.label}
          </button>
        ))}
      </div>

      {/* Expenses Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                {['ID', 'Kategori', 'Deskripsi', 'Jumlah', 'Tanggal', 'Bayar', 'Aksi'].map((h) => (
                  <th key={h} className="text-left px-5 py-3.5 text-[10px] font-600 text-3 uppercase tracking-wider last:text-right">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((expense) => {
                const cat = EXPENSE_CATEGORIES[expense.category]
                return (
                  <tr key={expense.id} className="group transition-colors hover:bg-white/[0.02]" style={{ borderBottom: '1px solid var(--border)' }}>
                    <td className="px-5 py-3.5">
                      <span className="num text-[11px] font-600 text-2">{expense.id}</span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="badge" style={{ background: cat.color + '18', color: cat.color }}>
                        {cat.icon} {cat.label}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="text-sm font-500 text-1">{expense.description}</span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="num text-sm font-700 text-red tabular-nums">{fmtCurrency(expense.amount)}</span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="num text-xs text-2">{expense.date}</span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="badge badge-neutral">
                        {expense.paymentMethod === 'cash' ? '💵 Tunai' : expense.paymentMethod === 'transfer' ? '🏦 Transfer' : '💳 Kartu'}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button className="w-8 h-8 flex items-center justify-center rounded-lg btn-ghost text-2 hover:text-blue transition-colors" title="Edit">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                          </svg>
                        </button>
                        <button className="w-8 h-8 flex items-center justify-center rounded-lg btn-ghost text-2 hover:text-red transition-colors" title="Hapus">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="3 6 5 6 21 6" />
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center">
                    <p className="text-sm text-3">Tidak ada pengeluaran ditemukan</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="px-5 py-3 flex items-center justify-between" style={{ borderTop: '1px solid var(--border)' }}>
          <p className="text-[11px] text-3">Menampilkan {filtered.length} dari {EXPENSES.length} pengeluaran</p>
        </div>
      </div>

      {/* Add Expense Modal */}
      {showAddModal && <AddExpenseModal onClose={() => setShowAddModal(false)} />}
    </div>
  )
}
