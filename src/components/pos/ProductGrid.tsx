import { useState, useMemo } from 'react'
import NeumorphicCard from '../NeumorphicCard'
import NeumorphicInput from '../NeumorphicInput'
import NeumorphicBadge from '../NeumorphicBadge'
import { CATEGORIES, PRODUCTS, formatRp, type Product } from './productData'

interface ProductGridProps {
  onAddToCart: (product: Product) => void
}

export default function ProductGrid({ onAddToCart }: ProductGridProps) {
  const [activeCategory, setActiveCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((p) => {
      const matchesCategory = activeCategory === 'all' || p.category === activeCategory
      const matchesSearch =
        !searchQuery ||
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase())
      return matchesCategory && matchesSearch
    })
  }, [activeCategory, searchQuery])

  return (
    <div className="flex flex-col h-full">
      {/* Search bar */}
      <div className="mb-4">
        <NeumorphicInput
          placeholder="Search products..."
          icon={
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          }
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Category tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-4 scrollbar-none">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`
              flex-shrink-0 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider
              transition-all duration-200
              ${
                activeCategory === cat.id
                  ? 'neumo-pressed text-phosphor'
                  : 'neumo-raised text-secondary hover:text-primary'
              }
            `}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Product grid */}
      <div className="flex-1 overflow-y-auto -mx-1 px-1">
        {filteredProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-40 text-muted gap-2">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <p className="text-sm font-medium">No products found</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} onAdd={onAddToCart} />
            ))}
          </div>
        )}
      </div>

      {/* Product count */}
      <div className="pt-3 mt-3 border-t border-border-subtle text-[10px] text-muted font-medium">
        {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''} • {activeCategory === 'all' ? 'All categories' : CATEGORIES.find((c) => c.id === activeCategory)?.label}
      </div>
    </div>
  )
}

/* ---- Product Card ---- */
function ProductCard({ product, onAdd }: { product: Product; onAdd: (p: Product) => void }) {
  const [isAdding, setIsAdding] = useState(false)

  const handleClick = () => {
    setIsAdding(true)
    onAdd(product)
    setTimeout(() => setIsAdding(false), 300)
  }

  return (
    <NeumorphicCard
      variant="raised"
      padding="sm"
      className={`
        group cursor-pointer select-none
        transition-all duration-150
        ${isAdding ? 'scale-95 !shadow-neumo-indented' : 'active:scale-95'}
      `}
      onClick={handleClick}
    >
      {/* Product emoji/image */}
      <div className="w-full aspect-square rounded-xl neumo-indented flex items-center justify-center text-3xl mb-2.5">
        {product.image}
      </div>

      {/* Info */}
      <p className="text-xs font-bold text-primary truncate leading-tight">{product.name}</p>
      <div className="flex items-center justify-between mt-1.5">
        <span className="text-sm font-black text-phosphor tabular-nums">
          {formatRp(product.price)}
        </span>
        <NeumorphicBadge variant="neutral" size="sm">
          {product.unit}
        </NeumorphicBadge>
      </div>
    </NeumorphicCard>
  )
}
