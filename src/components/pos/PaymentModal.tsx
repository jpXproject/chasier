import { useState, useMemo, useEffect } from 'react'
import NeumorphicCard from '../NeumorphicCard'
import NeumorphicButton from '../NeumorphicButton'
import NeumorphicDivider from '../NeumorphicDivider'
import { formatRp, type CartItem, type PaymentMethod, generateTrxId } from './productData'

interface PaymentModalProps {
  total: number
  items: CartItem[]
  onConfirm: (result: PaymentResult) => void
  onCancel: () => void
}

export interface PaymentResult {
  orderId: string
  paymentMethod: PaymentMethod
  amountTendered: number
  change: number
}

const PAYMENT_OPTIONS: { method: PaymentMethod; label: string; icon: string }[] = [
  { method: 'cash', label: 'Cash', icon: '💰' },
  { method: 'qris', label: 'QRIS', icon: '📱' },
  { method: 'debit', label: 'Debit', icon: '💳' },
  { method: 'credit', label: 'Credit', icon: '💳' },
]

const QUICK_AMOUNTS = [50000, 100000, 150000, 200000, 500000]

export default function PaymentModal({ total, items, onConfirm, onCancel }: PaymentModalProps) {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash')
  const [customAmount, setCustomAmount] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [orderId] = useState(generateTrxId)

  // Reset custom amount when switching away from cash
  useEffect(() => {
    if (paymentMethod !== 'cash') {
      setCustomAmount('')
    }
  }, [paymentMethod])

  // Calculate change for cash payments
  const amountTendered = useMemo(() => {
    if (paymentMethod !== 'cash') return total

    const parsed = parseFloat(customAmount.replace(/[^0-9]/g, ''))
    return isNaN(parsed) ? 0 : parsed
  }, [paymentMethod, customAmount, total])

  const change = useMemo(() => {
    if (paymentMethod !== 'cash') return 0
    return Math.max(0, amountTendered - total)
  }, [paymentMethod, amountTendered, total])

  const isCashShort = paymentMethod === 'cash' && amountTendered > 0 && amountTendered < total
  const canConfirm = paymentMethod !== 'cash' || amountTendered >= total

  const handleConfirm = () => {
    setIsProcessing(true)
    // Simulate processing
    setTimeout(() => {
      onConfirm({
        orderId,
        paymentMethod,
        amountTendered,
        change,
      })
      setIsProcessing(false)
    }, 800)
  }

  // Item count
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in">
      <NeumorphicCard
        variant="raised"
        padding="lg"
        className="w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-lg font-black text-primary tracking-tight">Complete Payment</h2>
            <p className="text-[10px] text-secondary font-medium mt-0.5">
              {itemCount} item{itemCount !== 1 ? 's' : ''} • {orderId}
            </p>
          </div>
          <button
            onClick={onCancel}
            className="w-8 h-8 rounded-xl neumo-raised flex items-center justify-center text-muted hover:text-crimson transition-colors active:scale-90"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Order summary */}
        <div className="neumo-indented rounded-xl p-4 mb-5 space-y-1.5">
          {items.map((item) => (
            <div key={item.product.id} className="flex justify-between text-xs">
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
            <span className="text-sm font-bold text-primary">Total</span>
            <span className="text-lg font-black text-phosphor tabular-nums">{formatRp(total)}</span>
          </div>
        </div>

        {/* Payment method selection */}
        <p className="text-[10px] font-bold uppercase tracking-wider text-secondary mb-2">Payment Method</p>
        <div className="grid grid-cols-4 gap-2 mb-5">
          {PAYMENT_OPTIONS.map((opt) => (
            <button
              key={opt.method}
              onClick={() => setPaymentMethod(opt.method)}
              className={`
                flex flex-col items-center gap-1.5 py-3 rounded-xl text-xs font-bold
                transition-all duration-200
                ${paymentMethod === opt.method ? 'neumo-pressed text-phosphor' : 'neumo-raised text-secondary hover:text-primary'}
              `}
            >
              <span className="text-xl">{opt.icon}</span>
              <span>{opt.label}</span>
            </button>
          ))}
        </div>

        {/* Cash-specific: amount tendered + quick amounts */}
        {paymentMethod === 'cash' && (
          <div className="mb-5 space-y-3">
            <p className="text-[10px] font-bold uppercase tracking-wider text-secondary">Amount Tendered</p>
            <div className="neumo-indented rounded-xl px-4 py-3">
              <div className="flex items-center gap-2">
                <span className="text-sm text-secondary font-semibold">Rp</span>
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="0"
                  value={customAmount}
                  onChange={(e) => setCustomAmount(e.target.value.replace(/[^0-9]/g, ''))}
                  className="flex-1 bg-transparent text-2xl font-black text-primary outline-none border-none placeholder:text-muted/40 tabular-nums"
                  autoFocus
                />
              </div>
            </div>

            {/* Quick amount buttons */}
            <div className="flex gap-2 flex-wrap">
              {QUICK_AMOUNTS.map((amt) => (
                <button
                  key={amt}
                  onClick={() => setCustomAmount(String(amt))}
                  className="neumo-raised px-3 py-1.5 rounded-lg text-[10px] font-bold text-primary hover:text-phosphor transition-colors active:scale-90"
                >
                  Rp {amt.toLocaleString('id-ID')}
                </button>
              ))}
            </div>

            {/* Change display */}
            {amountTendered > 0 && (
              <div className={`flex justify-between items-center py-2 px-3 rounded-xl ${isCashShort ? 'bg-crimson-light/50' : 'bg-phosphor-light/50'}`}>
                <span className="text-xs font-semibold text-secondary">
                  {isCashShort ? 'Shortage' : 'Change'}
                </span>
                <span className={`text-sm font-black tabular-nums ${isCashShort ? 'text-crimson' : 'text-phosphor'}`}>
                  {isCashShort ? formatRp(total - amountTendered) : formatRp(change)}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Non-cash: confirmation note */}
        {paymentMethod !== 'cash' && (
          <div className="mb-5 neumo-indented rounded-xl px-4 py-3">
            <p className="text-xs text-secondary text-center">
              {paymentMethod === 'qris'
                ? 'Customer will scan QRIS code to pay'
                : paymentMethod === 'debit'
                  ? 'Customer will tap/insert Debit Card'
                  : 'Customer will tap/insert Credit Card'}
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3">
          <NeumorphicButton variant="neutral" size="md" fullWidth onClick={onCancel}>
            Cancel
          </NeumorphicButton>
          <NeumorphicButton
            variant="primary"
            size="md"
            fullWidth
            disabled={!canConfirm}
            loading={isProcessing}
            onClick={handleConfirm}
          >
            {paymentMethod === 'cash'
              ? isCashShort
                ? `Short Rp ${(total - amountTendered).toLocaleString('id-ID')}`
                : `Confirm Rp ${total.toLocaleString('id-ID')}`
              : `Charge ${formatRp(total)}`}
          </NeumorphicButton>
        </div>
      </NeumorphicCard>
    </div>
  )
}
