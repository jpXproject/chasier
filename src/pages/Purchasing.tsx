import { useState, useMemo } from 'react'
import { PURCHASE_ORDERS, SUPPLIERS, formatRp, type PurchaseOrder } from '../data/purchasingData'

/* ============================================================
   Status Badge
   ============================================================ */
function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, { bg: string; color: string; border: string }> = {
    pending: { bg: 'var(--amber-dim)', color: 'var(--amber)', border: 'var(--amber-border)' },
    received: { bg: 'var(--green-dim)', color: 'var(--green)', border: 'var(--green-border)' },
    cancelled: { bg: 'var(--red-dim)', color: 'var(--red)', border: 'var(--red-border)' },
    paid: { bg: 'var(--green-dim)', color: 'var(--green)', border: 'var(--green-border)' },
    unpaid: { bg: 'var(--red-dim)', color: 'var(--red)', border: 'var(--red-border)' },
    partial: { bg: 'var(--amber-dim)', color: 'var(--amber)', border: 'var(--amber-border)' },
  }
  const s = styles[status] || styles.pending
  return (
    <span className="badge text-[10px]" style={{ background: s.bg, color: s.color, border: `1px solid ${s.border}` }}>
      {status === 'pending' ? 'Pending' : status === 'received' ? 'Diterima' : status === 'cancelled' ? 'Dibatalkan' : status === 'paid' ? 'Lunas' : status === 'unpaid' ? 'Belum Bayar' : 'Sebagian'}
    </span>
  )
}

/* ============================================================
   Add Purchase Modal
   ============================================================ */
function AddPurchaseModal({ onClose }: { onClose: () => void }) {
  const [form, setForm] = useState({
    supplier: '', date: new Date().toISOString().split('T')[0], notes: '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    alert(`Pesanan pembelian ke "${form.supplier}" berhasil dibuat!`)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm anim-fade">
      <div className="card w-full max-w-md mx-4">
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-base font-700 text-1">Pesanan Pembelian Baru</h2>
              <p className="text-[11px] text-3 mt-0.5">Buat pesanan ke supplier</p>
            </div>
            <button type="button" onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg btn-ghost text-2 hover:text-red flex-shrink-0">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          <div className="space-y-3">
            <div>
              <label className="text-[10px] font-600 text-3 uppercase tracking-wider mb-1.5 block">Supplier</label>
              <select
                required
                value={form.supplier}
                onChange={(e) => setForm({ ...form, supplier: e.target.value })}
                className="input-base w-full px-3 py-2.5 text-sm"
              >
                <option value="">Pilih supplier...</option>
                {SUPPLIERS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
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
            <div>
              <label className="text-[10px] font-600 text-3 uppercase tracking-wider mb-1.5 block">Catatan</label>
              <textarea
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                className="input-base w-full px-3 py-2.5 text-sm min-h-[80px] resize-none"
                placeholder="Catatan tambahan..."
              />
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-outline flex-1 py-2.5 text-sm font-600">Batal</button>
            <button type="submit" className="btn-primary flex-1 py-2.5 text-sm font-700">Buat Pesanan</button>
          </div>
        </form>
      </div>
    </div>
  )
}

/* ============================================================
   Main Purchasing Page
   ============================================================ */
export default function Purchasing() {
  const [showAddModal, setShowAddModal] = useState(false)
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'received' | 'cancelled'>('all')

  const filtered = useMemo(() => {
    if (filterStatus === 'all') return PURCHASE_ORDERS
    return PURCHASE_ORDERS.filter(po => po.status === filterStatus)
  }, [filterStatus])

  const stats = useMemo(() => {
    const totalPO = PURCHASE_ORDERS.length
    const pendingPO = PURCHASE_ORDERS.filter(po => po.status === 'pending').length
    const totalSpend = PURCHASE_ORDERS.filter(po => po.status !== 'cancelled').reduce((s, po) => s + po.total, 0)
    const unpaidTotal = PURCHASE_ORDERS.filter(po => po.paymentStatus === 'unpaid' || po.paymentStatus === 'partial').reduce((s, po) => s + po.total, 0)
    return { totalPO, pendingPO, totalSpend, unpaidTotal }
  }, [])

  return (
    <div className="space-y-5 max-w-7xl mx-auto anim-fade">
      {/* Header */}
      <div className="flex flex-col xs:flex-row xs:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-700 text-1 tracking-tight">Pembelian</h1>
          <p className="text-sm text-3 mt-0.5">Kelola pesanan pembelian ke supplier</p>
        </div>
        <button onClick={() => setShowAddModal(true)} className="btn-primary px-4 py-2.5 text-sm font-600 flex items-center gap-2 flex-shrink-0">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Pesanan Baru
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: 'Total PO', value: String(stats.totalPO), icon: '📋', color: 'var(--blue)' },
          { label: 'Pending', value: String(stats.pendingPO), icon: '⏳', color: 'var(--amber)' },
          { label: 'Total Pengeluaran', value: formatRp(stats.totalSpend), icon: '💸', color: 'var(--red)' },
          { label: 'Belum Dibayar', value: formatRp(stats.unpaidTotal), icon: '⚠️', color: stats.unpaidTotal > 0 ? 'var(--red)' : 'var(--green)' },
        ].map((s) => (
          <div key={s.label} className="card p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg" style={{ background: s.color + '18' }}>
                {s.icon}
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-500 text-3 uppercase tracking-wider truncate">{s.label}</p>
                <p className="num text-lg font-700 text-1 leading-tight truncate">{s.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {[
          { id: 'all' as const, label: 'Semua' },
          { id: 'pending' as const, label: 'Pending' },
          { id: 'received' as const, label: 'Diterima' },
          { id: 'cancelled' as const, label: 'Dibatalkan' },
        ].map((f) => (
          <button
            key={f.id}
            onClick={() => setFilterStatus(f.id)}
            className="flex-shrink-0 px-4 py-2 rounded-lg text-xs font-600 transition-all duration-150"
            style={
              filterStatus === f.id
                ? { background: 'var(--green)', color: '#fff' }
                : { background: 'var(--surface-2)', color: 'var(--text-2)' }
            }
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Purchase Orders Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                {['ID', 'Supplier', 'Tanggal', 'Items', 'Total', 'Status', 'Pembayaran', 'Aksi'].map((h) => (
                  <th key={h} className="text-left px-5 py-3.5 text-[10px] font-600 text-3 uppercase tracking-wider last:text-right">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((po) => (
                <tr key={po.id} className="group transition-colors hover:bg-white/[0.02]" style={{ borderBottom: '1px solid var(--border)' }}>
                  <td className="px-5 py-3.5">
                    <span className="num text-[11px] font-600 text-2">{po.id}</span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="text-sm font-500 text-1">{po.supplier}</span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="num text-xs text-2">{po.date}</span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="text-xs text-2">{po.items.length} item</span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="num text-sm font-700 text-1 tabular-nums">{formatRp(po.total)}</span>
                  </td>
                  <td className="px-5 py-3.5">
                    <StatusBadge status={po.status} />
                  </td>
                  <td className="px-5 py-3.5">
                    <StatusBadge status={po.paymentStatus} />
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <button className="btn-ghost text-xs font-500 px-3 py-1.5">Detail</button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-5 py-12 text-center">
                    <p className="text-sm text-3">Tidak ada pesanan ditemukan</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="px-5 py-3 flex items-center justify-between" style={{ borderTop: '1px solid var(--border)' }}>
          <p className="text-[11px] text-3">Menampilkan {filtered.length} dari {PURCHASE_ORDERS.length} pesanan</p>
        </div>
      </div>

      {/* Add Purchase Modal */}
      {showAddModal && <AddPurchaseModal onClose={() => setShowAddModal(false)} />}
    </div>
  )
}
