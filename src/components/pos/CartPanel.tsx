import { useMemo } from 'react'
import NeumorphicCard from '../NeumorphicCard'
import NeumorphicButton from '../NeumorphicButton'
import NeumorphicBadge from '../NeumorphicBadge'
import NeumorphicDivider from '../NeumorphicDivider'
import NeumorphicInput from '../NeumorphicInput'
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
  items,
  discountType,
  discountValue,
  onDiscountTypeChange,
  onDiscountValueChange,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
  onClearCart,
}: CartPanelProps) {
  // Calculations (display only — actual totals live in POS.tsx)
  const { subtotal, discountAmount, taxAmount, total, itemCount } = useMemo(() => {
    const sub = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
    const count = items.reduce((sum, item) => sum + item.quantity, 0)

    let discAmt = 0
    const val = parseFloat(discountValue) || 0
    if (discountType === 'percentage') {
      discAmt = sub * Math.min(val, 100) / 100
    } else if (discountType === 'fixed') {
      discAmt = Math.min(val, sub)
    }

    const taxable = sub - discAmt
    const tax = taxable * TAX_RATE

    return {
      subtotal: sub,
      discountAmount: discAmt,
      taxAmount: tax,
      total: taxable + tax,
      itemCount: count,
    }
  }, [items, discountType, discountValue])

  const isEmpty = items.length === 0

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-bold text-primary">Cart</h2>
          {itemCount > 0 && (
            <NeumorphicBadge variant="success" size="sm">{itemCount}</NeumorphicBadge>
          )}
        </div>
        {!isEmpty && (
          <NeumorphicButton variant="ghost" size="sm" onClick={onClearCart}>
            Clear All
          </NeumorphicButton>
        )}
      </div>

      {/* Cart Items (scrollable) */}
      <div className="flex-1 overflow-y-auto -mx-1 px-1 space-y-2">
        {isEmpty ? (
          <div className="flex flex-col items-center justify-center h-64 text-muted gap-3">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            </svg>
            <p className="text-sm font-medium">Cart is empty</p>
            <p className="text-[10px] text-muted/60">Tap a product to add it</p>
          </div>
        ) : (
          items.map((item) => (
            <CartItemRow
              key={item.product.id}
              item={item}
              onUpdateQuantity={onUpdateQuantity}
              onRemove={onRemoveItem}
            />
          ))
        )}
      </div>

      {/* Discount & Totals */}
      {!isEmpty && (
        <div className="mt-4 space-y-3">
          {/* Discount section */}
          <NeumorphicCard variant="indented" padding="sm">
            <div className="flex items-center gap-2 mb-2">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted">
                <line x1="20" y1="4" x2="4" y2="20" /><circle cx="8" cy="8" r="1.5" fill="currentColor" /><circle cx="16" cy="16" r="1.5" fill="currentColor" />
              </svg>
              <span className="text-[10px] font-bold uppercase tracking-wider text-secondary">Discount</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex gap-1">
                {(['none', 'percentage', 'fixed'] as DiscountType[]).map((type) => (
                  <button
                    key={type}
                    onClick={() => { onDiscountTypeChange(type); onDiscountValueChange('') }}
                    className={`
                      px-2.5 py-1 rounded-lg text-[9px] font-bold uppercase tracking-wider
                      transition-all duration-150
                      ${discountType === type ? 'neumo-pressed text-phosphor' : 'text-muted hover:text-primary'}
                    `}
                  >
                    {type === 'none' ? 'Off' : type === 'percentage' ? '%' : 'Rp'}
                  </button>
                ))}
              </div>
              {discountType !== 'none' && (
                <NeumorphicInput
                  placeholder={discountType === 'percentage' ? '0%' : '0'}
                  type="number"
                  value={discountValue}
                  onChange={(e) => onDiscountValueChange(e.target.value)}
                  className="flex-1 !py-1 !px-2.5 text-xs"
                />
              )}
            </div>
          </NeumorphicCard>

          {/* Totals */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="text-secondary">Subtotal</span>
              <span className="text-primary font-semibold tabular-nums">{formatRp(subtotal)}</span>
            </div>
            {discountAmount > 0 && (
              <div className="flex justify-between text-xs">
                <span className="text-phosphor">Discount {discountType === 'percentage' ? `(${discountValue}%)` : ''}</span>
                <span className="text-phosphor font-semibold tabular-nums">−{formatRp(discountAmount)}</span>
              </div>
            )}
            <div className="flex justify-between text-xs">
              <span className="text-secondary">PPN ({(TAX_RATE * 100).toFixed(0)}%)</span>
              <span className="text-primary font-semibold tabular-nums">{formatRp(taxAmount)}</span>
            </div>
            <NeumorphicDivider />
            <div className="flex justify-between text-sm">
              <span className="text-primary font-bold">Total</span>
              <span className="text-phosphor font-black text-lg tabular-nums">{formatRp(total)}</span>
            </div>
          </div>

          {/* Checkout button */}
          <NeumorphicButton
            variant="primary"
            size="lg"
            fullWidth
            icon={
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            }
            onClick={onCheckout}
          >
            Charge {formatRp(total)}
          </NeumorphicButton>
        </div>
      )}
    </div>
  )
}

/* ---- Cart Item Row ---- */
function CartItemRow({
  item,
  onUpdateQuantity,
  onRemove,
}: {
  item: CartItem
  onUpdateQuantity: (id: string, delta: number) => void
  onRemove: (id: string) => void
}) {
  return (
    <div className="neumo-raised rounded-xl px-3 py-2.5 flex items-center gap-3">
      {/* Emoji */}
      <div className="w-9 h-9 rounded-lg neumo-indented flex items-center justify-center text-lg flex-shrink-0">
        {item.product.image}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="text-xs font-bold text-primary truncate">{item.product.name}</p>
        <p className="text-[10px] text-secondary font-semibold tabular-nums">{formatRp(item.product.price)}/{item.product.unit}</p>
      </div>

      {/* Quantity controls */}
      <div className="flex items-center gap-1 flex-shrink-0">
        <button
          onClick={() => onUpdateQuantity(item.product.id, -1)}
          className="w-7 h-7 rounded-lg neumo-raised flex items-center justify-center text-xs font-bold text-primary hover:text-crimson transition-colors active:scale-90"
        >
          −
        </button>
        <span className="w-7 text-center text-sm font-bold text-primary tabular-nums">{item.quantity}</span>
        <button
          onClick={() => onUpdateQuantity(item.product.id, 1)}
          className="w-7 h-7 rounded-lg neumo-raised flex items-center justify-center text-xs font-bold text-primary hover:text-phosphor transition-colors active:scale-90"
        >
          +
        </button>
      </div>

      {/* Line total */}
      <div className="text-right flex-shrink-0 min-w-[60px]">
        <p className="text-xs font-bold text-primary tabular-nums">
          {formatRp(item.product.price * item.quantity)}
        </p>
      </div>

      {/* Remove */}
      <button
        onClick={() => onRemove(item.product.id)}
        className="w-6 h-6 rounded-lg flex items-center justify-center text-muted hover:text-crimson transition-colors active:scale-90"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
    </div>
  )
}
