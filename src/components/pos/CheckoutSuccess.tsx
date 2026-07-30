import NeumorphicCard from '../NeumorphicCard'
import NeumorphicButton from '../NeumorphicButton'
import NeumorphicDivider from '../NeumorphicDivider'
import { formatRp, type CartItem, type PaymentMethod } from './productData'

interface CheckoutSuccessProps {
  orderId: string
  items: CartItem[]
  subtotal: number
  discountAmount: number
  taxAmount: number
  total: number
  paymentMethod: PaymentMethod
  amountTendered: number
  change: number
  onNewOrder: () => void
}

export default function CheckoutSuccess({
  orderId,
  items,
  subtotal,
  discountAmount,
  taxAmount,
  total,
  paymentMethod,
  amountTendered,
  change,
  onNewOrder,
}: CheckoutSuccessProps) {
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in">
      <NeumorphicCard variant="raised" padding="lg" className="w-full max-w-sm mx-4">
        {/* Success icon */}
        <div className="flex flex-col items-center mb-5">
          <div className="w-16 h-16 rounded-full bg-phosphor-light flex items-center justify-center mb-3 animate-bounce">
            <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="var(--color-phosphor)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <h2 className="text-xl font-black text-primary tracking-tight">Payment Successful!</h2>
          <p className="text-[10px] text-muted font-medium mt-1">{orderId}</p>
        </div>

        {/* Receipt */}
        <div className="neumo-indented rounded-xl p-4 space-y-2 text-xs mb-5">
          <div className="text-center border-b border-border-subtle pb-2 mb-2">
            <p className="text-[9px] font-bold uppercase tracking-widest text-muted">CashierGo</p>
            <p className="text-[8px] text-muted/60 mt-0.5">{new Date().toLocaleString('id-ID')}</p>
          </div>

          {items.map((item) => (
            <div key={item.product.id} className="flex justify-between">
              <span className="text-secondary truncate mr-2">
                {item.quantity}x {item.product.name}
              </span>
              <span className="text-primary font-semibold tabular-nums flex-shrink-0">
                {formatRp(item.product.price * item.quantity)}
              </span>
            </div>
          ))}

          <NeumorphicDivider />
          <div className="flex justify-between">
            <span className="text-secondary">Subtotal</span>
            <span className="text-primary font-semibold tabular-nums">{formatRp(subtotal)}</span>
          </div>
          {discountAmount > 0 && (
            <div className="flex justify-between text-phosphor">
              <span>Discount</span>
              <span className="tabular-nums">−{formatRp(discountAmount)}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-secondary">PPN 11%</span>
            <span className="text-primary font-semibold tabular-nums">{formatRp(taxAmount)}</span>
          </div>
          <NeumorphicDivider />
          <div className="flex justify-between text-sm">
            <span className="font-bold text-primary">Total</span>
            <span className="font-black text-phosphor tabular-nums">{formatRp(total)}</span>
          </div>

          <div className="border-t border-border-subtle pt-2 mt-2 space-y-1">
            <div className="flex justify-between">
              <span className="text-secondary">Payment</span>
              <span className="font-semibold text-primary">
                {paymentMethod === 'cash' ? '💰 Cash' : paymentMethod === 'qris' ? '📱 QRIS' : paymentMethod === 'debit' ? '💳 Debit' : '💳 Credit'}
              </span>
            </div>
            {paymentMethod === 'cash' && (
              <>
                <div className="flex justify-between">
                  <span className="text-secondary">Tendered</span>
                  <span className="font-semibold text-primary tabular-nums">{formatRp(amountTendered)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-secondary">Change</span>
                  <span className="font-semibold text-phosphor tabular-nums">{formatRp(change)}</span>
                </div>
              </>
            )}
          </div>

          <div className="text-center text-[8px] text-muted/60 pt-1">
            {itemCount} item{itemCount !== 1 ? 's' : ''} • Thank you!
          </div>
        </div>

        <NeumorphicButton variant="primary" size="lg" fullWidth onClick={onNewOrder}>
          New Order
        </NeumorphicButton>
      </NeumorphicCard>
    </div>
  )
}
