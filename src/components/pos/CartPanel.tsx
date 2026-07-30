import { useMemo, useState } from 'react'
import { TAX_RATE, formatRp, type CartItem } from './productData'

export type DiscountType = 'none' | 'percentage' | 'fixed'

interface CartPanelProps {
  items: CartItem[]
  discountType: DiscountType
  discountValue: string
  onDiscountTypeChange: (type: DiscountType) => void
  onDiscountValueChange: (value: string) => void
  onUpdateQuantity: (productId: string, delta: number) => void
  onRemoveItem: (productId: string) => void
  onCheckout: () => void
  onClearCart: () => void
}

export default function CartPanel({
  items, discountType, discountValue,
  onDiscountTypeChange, onDiscountValueChange,
  onUpdateQuantity, onRemoveItem, onCheckout, onClearCart,
}: CartPanelProps) {
  const { subtotal, discountAmount, taxAmount, total, itemCount } = useMemo(() => {
    const sub = items.reduce((s, i) => s + i.product.price * i.quantity, 0)
    const count = items.reduce((s, i) => s + i.quantity, 0)
    const val = parseFloat(discountValue) || 0
    let discAmt = 0
    if (discountType === 'percentage') discAmt = sub * Math.min(val, 100) / 100
    else if (discountType === 'fixed') discAmt = Math.min(val, sub)
    const taxable = sub - discAmt
    const tax = taxable * TAX_RATE
    return { subtotal: sub, discountAmount: discAmt, taxAmount: tax, total: taxable + tax, itemCount: count }
  }, [items, discountType, discountValue])

  const isEmpty = items.length === 0

  return (
    <div className="flex flex-col h-full card p-4 gap-0 anim-slide-right">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 mb-3" style={{ borderBottom: '1px solid var(--border)' }}>
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-700 text-1">Keranjang</h2>
          {itemCount > 0 && (
            <span className="badge badge-green animate-cart-bounce">{itemCount}</span>
          )}
        </div>
        {!isEmpty && (
          <button onClick={onClearCart} className="text-[11px] font-500 text-red hover:opacity-80 transition-all duration-150 btn-press">
            Hapus Semua
          </button>
        )}
      </div>

      {/* Items */}
      <div className="flex-1 overflow-y-auto space-y-2 min-h-0">
        {isEmpty ? (
          <div className="flex flex-col items-center justify-center h-52 gap-3 text-3 anim-fade">
            <div className="animate-cart-bounce">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
              </svg>
            </div>
            <div className="text-center anim-slide-down" style={{ animationDelay: '0.1s' }}>
              <p className="text-sm font-500">Keranjang kosong</p>
              <p className="text-[11px] text-3 mt-0.5">Pilih produk untuk ditambahkan</p>
            </div>
          </div>
        ) : (
          items.map((item, idx) => (
            <CartItemRow key={item.product.id} item={item} onUpdateQuantity={onUpdateQuantity} onRemove={onRemoveItem} index={idx} />
          ))
        )}
      </div>

      {/* Discount + Totals + Checkout */}
      {!isEmpty && (
        <div className="mt-3 pt-3 space-y-3 anim-slide-down" style={{ borderTop: '1px solid var(--border)' }}>
          {/* Discount */}
          <div className="p-3 rounded-xl" style={{ background: 'var(--surface-2)' }}>
            <p className="text-[10px] font-600 text-3 uppercase tracking-wider mb-2">Diskon</p>
            <div className="flex items-center gap-2">
              <div className="flex rounded-lg overflow-hidden" style={{ border: '1px solid var(--border)' }}>
                {(['none', 'percentage', 'fixed'] as DiscountType[]).map((type) => (
                  <button
                    key={type}
                    onClick={() => { onDiscountTypeChange(type); onDiscountValueChange('') }}
                    className="px-2.5 py-1.5 text-[10px] font-600 transition-all duration-200 btn-press"
                    style={
                      discountType === type
                        ? { background: 'var(--green)', color: '#fff' }
                        : { background: 'transparent', color: 'var(--text-3)' }
                    }
                  >
                    {type === 'none' ? 'Off' : type === 'percentage' ? '%' : 'Rp'}
                  </button>
                ))}
              </div>
              {discountType !== 'none' && (
                <input
                  type="number"
                  placeholder="0"
                  value={discountValue}
                  onChange={(e) => onDiscountValueChange(e.target.value)}
                  className="input-base flex-1 px-3 py-1.5 text-xs num"
                />
              )}
            </div>
          </div>

          {/* Totals */}
          <div className="space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-2">Subtotal</span>
              <span className="num font-600 text-1 tabular-nums">{formatRp(subtotal)}</span>
            </div>
            {discountAmount > 0 && (
              <div className="flex justify-between text-green anim-fade">
                <span>Diskon {discountType === 'percentage' ? `(${discountValue}%)` : ''}</span>
                <span className="num font-600 tabular-nums">−{formatRp(discountAmount)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-2">PPN ({(TAX_RATE * 100).toFixed(0)}%)</span>
              <span className="num font-600 text-1 tabular-nums">{formatRp(taxAmount)}</span>
            </div>
            <div className="flex justify-between pt-2" style={{ borderTop: '1px solid var(--border)' }}>
              <span className="font-700 text-1">Total</span>
              <span className="num text-lg font-700 text-green tabular-nums transition-all duration-300">{formatRp(total)}</span>
            </div>
          </div>

          <button
            onClick={onCheckout}
            className="btn-primary w-full py-3.5 text-sm font-700 flex items-center justify-center gap-2 btn-press animate-pulse-glow"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            Bayar {formatRp(total)}
          </button>
        </div>
      )}
    </div>
  )
}

function CartItemRow({
  item, onUpdateQuantity, onRemove, index,
}: {
  item: CartItem
  onUpdateQuantity: (id: string, delta: number) => void
  onRemove: (id: string) => void
  index: number
}) {
  const [qtyFlash, setQtyFlash] = useState(false)
  const [removing, setRemoving] = useState(false)

  const handleUpdate = (delta: number) => {
    setQtyFlash(true)
    onUpdateQuantity(item.product.id, delta)
    setTimeout(() => setQtyFlash(false), 200)
  }

  const handleRemove = () => {
    setRemoving(true)
    setTimeout(() => onRemove(item.product.id), 200)
  }

  return (
    <div
      className="flex items-center gap-3 p-2.5 rounded-xl transition-all duration-200 anim-slide-down"
      style={{
        background: 'var(--surface-2)',
        animationDelay: `${Math.min(index * 0.04, 0.2)}s`,
        opacity: removing ? 0 : 1,
        transform: removing ? 'translateX(30px) scale(0.95)' : undefined,
      }}
    >
      <div
        className="w-9 h-9 rounded-lg flex items-center justify-center text-xl flex-shrink-0 transition-transform duration-200"
        style={{ background: 'var(--surface-3)' }}
      >
        {item.product.image}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[11px] font-600 text-1 truncate">{item.product.name}</p>
        <p className="num text-[10px] text-3 tabular-nums">{formatRp(item.product.price)}</p>
      </div>
      <div className="flex items-center gap-1 flex-shrink-0">
        <button
          onClick={() => handleUpdate(-1)}
          className="w-6 h-6 rounded-md text-sm font-700 text-2 hover:text-red hover:bg-red-dim transition-all duration-150 flex items-center justify-center btn-press"
          style={{ background: 'var(--surface-3)' }}
        >
          −
        </button>
        <span className={`num w-6 text-center text-sm font-700 text-1 tabular-nums ${qtyFlash ? 'qty-flash' : ''}`}>
          {item.quantity}
        </span>
        <button
          onClick={() => handleUpdate(1)}
          className="w-6 h-6 rounded-md text-sm font-700 text-2 hover:text-green hover:bg-green-dim transition-all duration-150 flex items-center justify-center btn-press"
          style={{ background: 'var(--surface-3)' }}
        >
          +
        </button>
      </div>
      <div className="flex-shrink-0 text-right min-w-[52px]">
        <p className="num text-[11px] font-700 text-1 tabular-nums transition-all duration-200">
          {formatRp(item.product.price * item.quantity)}
        </p>
      </div>
      <button
        onClick={handleRemove}
        className="w-6 h-6 flex items-center justify-center text-3 hover:text-red transition-all duration-150 flex-shrink-0 btn-press"
      >
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
    </div>
  )
}
