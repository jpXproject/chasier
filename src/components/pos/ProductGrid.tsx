import { useState, useMemo } from 'react'
import { CATEGORIES, PRODUCTS, formatRp, type Product } from './productData'

interface ProductGridProps {
  onAddToCart: (product: Product) => void
}

export default function ProductGrid({ onAddToCart }: ProductGridProps) {
  const [activeCategory, setActiveCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

  const filtered = useMemo(() => {
    return PRODUCTS.filter((p) => {
      const matchesCat = activeCategory === 'all' || p.category === activeCategory
      const matchesSearch =
        !searchQuery || p.name.toLowerCase().includes(searchQuery.toLowerCase())
      return matchesCat && matchesSearch
    })
  }, [activeCategory, searchQuery])

  return (
    <div className="flex flex-col h-full gap-3">
      {/* Search */}
      <div className="relative">
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

      {/* Category tabs */}
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

      {/* Grid */}
      <div className="flex-1 overflow-y-auto">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-40 gap-2 text-3">
            <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <p className="text-sm">Produk tidak ditemukan</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
            {filtered.map((product) => (
              <ProductCard key={product.id} product={product} onAdd={onAddToCart} />
            ))}
          </div>
        )}
      </div>

      <p className="text-[11px] text-3 pt-2" style={{ borderTop: '1px solid var(--border)' }}>
        {filtered.length} produk ·{' '}
        {activeCategory === 'all' ? 'Semua kategori' : CATEGORIES.find((c) => c.id === activeCategory)?.label}
      </p>
    </div>
  )
}

function ProductCard({ product, onAdd }: { product: Product; onAdd: (p: Product) => void }) {
  const [flash, setFlash] = useState(false)

  const handleClick = () => {
    setFlash(true)
    onAdd(product)
    setTimeout(() => setFlash(false), 250)
  }

  return (
    <button
      onClick={handleClick}
      className="card card-hover p-3.5 flex flex-col items-center gap-2.5 cursor-pointer select-none text-left w-full transition-all duration-150 active:scale-95"
      style={flash ? { background: 'var(--green-dim)', borderColor: 'var(--green-border)' } : {}}
    >
      <div
        className="w-full aspect-square rounded-xl flex items-center justify-center text-3xl"
        style={{ background: 'var(--surface-2)' }}
      >
        {product.image}
      </div>
      <div className="w-full">
        <p className="text-[11px] font-600 text-1 truncate leading-tight">{product.name}</p>
        <div className="flex items-center justify-between mt-1">
          <span className="num text-xs font-700 text-green tabular-nums">
            {formatRp(product.price)}
          </span>
          <span
            className="text-[9px] font-500 px-1.5 py-0.5 rounded-md"
            style={{ background: 'var(--surface-2)', color: 'var(--text-3)' }}
          >
            {product.unit}
          </span>
        </div>
      </div>
    </button>
  )
}
