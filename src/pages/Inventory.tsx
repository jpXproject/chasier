import { useState, useMemo } from 'react'
import { PRODUCTS, CATEGORIES, formatRp } from '../components/pos/productData'

/* ============================================================
   Stock status helper
   ============================================================ */
function getStockStatus(stock: number, threshold: number) {
  if (stock === 0) return { label: 'Habis', color: 'var(--red)', bg: 'var(--red-dim)', border: 'var(--red-border)' }
  if (stock <= threshold * 0.3) return { label: 'Kritis', color: 'var(--red)', bg: 'var(--red-dim)', border: 'var(--red-border)' }
  if (stock <= threshold * 0.6) return { label: 'Rendah', color: 'var(--amber)', bg: 'var(--amber-dim)', border: 'var(--amber-border)' }
  return { label: 'Aman', color: 'var(--green)', bg: 'var(--green-dim)', border: 'var(--green-border)' }
}

/* ============================================================
   Add Product Modal
   ============================================================ */
function AddProductModal({ onClose }: { onClose: () => void }) {
  const [form, setForm] = useState({
    name: '', category: 'coffee', price: '', unit: 'cup', stock: '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, this would save to backend
    alert(`Produk "${form.name}" berhasil ditambahkan!`)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm anim-fade">
      <div className="card w-full max-w-md mx-4">
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-base font-700 text-1">Tambah Produk Baru</h2>
              <p className="text-[11px] text-3 mt-0.5">Isi data produk untuk ditambahkan ke inventory</p>
            </div>
            <button type="button" onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg btn-ghost text-2 hover:text-red flex-shrink-0">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          <div className="space-y-3">
            <div>
              <label className="text-[10px] font-600 text-3 uppercase tracking-wider mb-1.5 block">Nama Produk</label>
              <input
                type="text"
                required
                placeholder="Contoh: Espresso"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="input-base w-full px-3 py-2.5 text-sm"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] font-600 text-3 uppercase tracking-wider mb-1.5 block">Kategori</label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="input-base w-full px-3 py-2.5 text-sm"
                >
                  {CATEGORIES.filter(c => c.id !== 'all').map(c => (
                    <option key={c.id} value={c.id}>{c.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-[10px] font-600 text-3 uppercase tracking-wider mb-1.5 block">Satuan</label>
                <select
                  value={form.unit}
                  onChange={(e) => setForm({ ...form, unit: e.target.value })}
                  className="input-base w-full px-3 py-2.5 text-sm"
                >
                  {['cup', 'btl', 'pcs', 'slice', 'bowl', 'bag', 'kg', 'L'].map(u => (
                    <option key={u} value={u}>{u}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] font-600 text-3 uppercase tracking-wider mb-1.5 block">Harga (Rp)</label>
                <input
                  type="number"
                  required
                  min="0"
                  placeholder="0"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  className="input-base w-full px-3 py-2.5 text-sm num"
                />
              </div>
              <div>
                <label className="text-[10px] font-600 text-3 uppercase tracking-wider mb-1.5 block">Stok Awal</label>
                <input
                  type="number"
                  required
                  min="0"
                  placeholder="0"
                  value={form.stock}
                  onChange={(e) => setForm({ ...form, stock: e.target.value })}
                  className="input-base w-full px-3 py-2.5 text-sm num"
                />
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-outline flex-1 py-2.5 text-sm font-600">
              Batal
            </button>
            <button type="submit" className="btn-primary flex-1 py-2.5 text-sm font-700">
              Tambah Produk
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

/* ============================================================
   Main Inventory Page
   ============================================================ */
export default function Inventory() {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState('all')
  const [showAddModal, setShowAddModal] = useState(false)

  const filtered = useMemo(() => {
    return PRODUCTS.filter((p) => {
      const matchesCat = activeCategory === 'all' || p.category === activeCategory
      const matchesSearch = !searchQuery || p.name.toLowerCase().includes(searchQuery.toLowerCase())
      return matchesCat && matchesSearch
    })
  }, [activeCategory, searchQuery])

  const stats = useMemo(() => {
    const totalProducts = PRODUCTS.length
    const totalStock = PRODUCTS.reduce((s, p) => s + p.stock, 0)
    const lowStock = PRODUCTS.filter(p => p.stock <= 50 && p.stock > 0).length
    const outOfStock = PRODUCTS.filter(p => p.stock === 0).length
    const totalValue = PRODUCTS.reduce((s, p) => s + p.price * p.stock, 0)
    return { totalProducts, totalStock, lowStock, outOfStock, totalValue }
  }, [])

  return (
    <div className="space-y-5 max-w-7xl mx-auto anim-fade">
      {/* Header */}
      <div className="flex flex-col xs:flex-row xs:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-700 text-1 tracking-tight">Inventory</h1>
          <p className="text-sm text-3 mt-0.5">Kelola stok dan data produk Anda</p>
        </div>
        <button onClick={() => setShowAddModal(true)} className="btn-primary px-4 py-2.5 text-sm font-600 flex items-center gap-2 flex-shrink-0">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Tambah Produk
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        {[
          { label: 'Total Produk', value: String(stats.totalProducts), icon: '📦', color: 'var(--blue)' },
          { label: 'Total Stok', value: String(stats.totalStock), icon: '📊', color: 'var(--green)' },
          { label: 'Stok Rendah', value: String(stats.lowStock), icon: '⚠️', color: 'var(--amber)', alert: stats.lowStock > 0 },
          { label: 'Stok Habis', value: String(stats.outOfStock), icon: '🚫', color: 'var(--red)', alert: stats.outOfStock > 0 },
          { label: 'Nilai Inventory', value: formatRp(stats.totalValue), icon: '💰', color: 'var(--green)' },
        ].map((s) => (
          <div key={s.label} className="card p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg" style={{ background: s.color + '18' }}>
                {s.icon}
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-500 text-3 uppercase tracking-wider truncate">{s.label}</p>
                <p className={`num text-lg font-700 leading-tight ${s.alert ? 'text-red' : 'text-1'}`}>{s.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-3 pointer-events-none">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </span>
          <input
            type="text"
            placeholder="Cari produk..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-base w-full pl-9 pr-4 py-2.5 text-sm"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className="flex-shrink-0 px-4 py-2 rounded-lg text-xs font-600 transition-all duration-150"
              style={
                activeCategory === cat.id
                  ? { background: 'var(--green)', color: '#fff' }
                  : { background: 'var(--surface-2)', color: 'var(--text-2)' }
              }
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Product Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                {['Produk', 'Kategori', 'Harga', 'Stok', 'Status', 'Aksi'].map((h) => (
                  <th key={h} className="text-left px-5 py-3.5 text-[10px] font-600 text-3 uppercase tracking-wider last:text-right last:pr-5">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((product) => {
                const status = getStockStatus(product.stock, 50)
                return (
                  <tr
                    key={product.id}
                    className="group transition-colors hover:bg-white/[0.02]"
                    style={{ borderBottom: '1px solid var(--border)' }}
                  >
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg flex items-center justify-center text-lg flex-shrink-0" style={{ background: 'var(--surface-2)' }}>
                          {product.image}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-600 text-1 truncate">{product.name}</p>
                          <p className="text-[10px] text-3 mt-0.5">{product.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="badge badge-neutral">{CATEGORIES.find(c => c.id === product.category)?.label ?? product.category}</span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="num text-sm font-600 text-1 tabular-nums">{formatRp(product.price)}</span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="num text-sm font-700 tabular-nums" style={{ color: status.color }}>
                        {product.stock}
                      </span>
                      <span className="text-[10px] text-3 ml-1">{product.unit}</span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span
                        className="badge text-[10px]"
                        style={{ background: status.bg, color: status.color, border: `1px solid ${status.border}` }}
                      >
                        {status.label}
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
                  <td colSpan={6} className="px-5 py-12 text-center">
                    <div className="flex flex-col items-center gap-3 text-3">
                      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                      </svg>
                      <p className="text-sm font-500">Produk tidak ditemukan</p>
                      <p className="text-[11px] text-3">Coba kata kunci atau kategori lain</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="px-5 py-3 flex items-center justify-between" style={{ borderTop: '1px solid var(--border)' }}>
          <p className="text-[11px] text-3">
            Menampilkan {filtered.length} dari {PRODUCTS.length} produk
          </p>
        </div>
      </div>

      {/* Add Product Modal */}
      {showAddModal && <AddProductModal onClose={() => setShowAddModal(false)} />}
    </div>
  )
}
