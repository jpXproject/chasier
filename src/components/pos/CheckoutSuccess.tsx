import { useState, useEffect, useMemo } from 'react'
import { formatRp, type CartItem, type PaymentMethod } from './productData'

const PAY_LABEL: Record<PaymentMethod, string> = {
  cash: '💵 Tunai',
  qris: '📲 QRIS',
  debit: '💳 Debit',
  credit: '💳 Kredit',
}

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
  orderId, items, subtotal, discountAmount, taxAmount, total,
  paymentMethod, amountTendered, change, onNewOrder,
}: CheckoutSuccessProps) {
  const itemCount = items.reduce((s, i) => s + i.quantity, 0)
  const [showConfetti, setShowConfetti] = useState(true)

  const confettiParticles = useMemo(() =>
    Array.from({ length: 20 }).map(() => ({
      left: Math.random() * 100,
      size: Math.random() * 8 + 4,
      color: ['var(--green)', 'var(--amber)', 'var(--blue)', '#a855f7', '#ec4899'][Math.floor(Math.random() * 5)],
      delay: Math.random() * 0.5,
      duration: Math.random() * 1.5 + 1,
    })), [])

  useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(false), 3000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm anim-fade">
      {/* Confetti particles */}
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {confettiParticles.map((p, i) => (
            <div
              key={i}
              className="absolute rounded-sm"
              style={{
                left: `${p.left}%`,
                top: '-10px',
                width: `${p.size}px`,
                height: `${p.size}px`,
                background: p.color,
                animation: `confetti-fall ${p.duration}s ease-out forwards`,
                animationDelay: `${p.delay}s`,
                opacity: 0.8,
              }}
            />
          ))}
        </div>
      )}

      <div className="card w-full max-w-sm mx-4 p-6 anim-bounce relative">
        {/* Success icon */}
        <div className="flex flex-col items-center gap-2 mb-5">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center anim-bounce animate-pulse-glow"
            style={{ background: 'var(--green-dim)' }}
          >
            <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="var(--green)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="anim-pop">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <div className="text-center anim-slide-down" style={{ animationDelay: '0.2s' }}>
            <h2 className="text-lg font-700 text-1">Pembayaran Berhasil!</h2>
            <p className="num text-[11px] text-3 mt-0.5">{orderId}</p>
          </div>
        </div>

        {/* Receipt */}
        <div
          className="p-4 rounded-xl space-y-2 text-xs mb-5 anim-slide-down"
          style={{ background: 'var(--surface-2)', animationDelay: '0.3s' }}
        >
          <div className="text-center pb-2" style={{ borderBottom: '1px dashed var(--border-strong)' }}>
            <p className="text-[10px] font-700 text-1 uppercase tracking-widest">CashierGo</p>
            <p className="text-[10px] text-3 mt-0.5">{new Date().toLocaleString('id-ID')}</p>
          </div>

          {items.map((item, idx) => (
            <div key={item.product.id} className="flex justify-between anim-slide-down" style={{ animationDelay: `${0.35 + idx * 0.03}s` }}>
              <span className="text-2 truncate mr-3">{item.quantity}× {item.product.name}</span>
              <span className="num font-600 text-1 tabular-nums flex-shrink-0">
                {formatRp(item.product.price * item.quantity)}
              </span>
            </div>
          ))}

          <div className="pt-2 space-y-1.5" style={{ borderTop: '1px dashed var(--border-strong)' }}>
            <div className="flex justify-between">
              <span className="text-2">Subtotal</span>
              <span className="num font-600 text-1 tabular-nums">{formatRp(subtotal)}</span>
            </div>
            {discountAmount > 0 && (
              <div className="flex justify-between text-green">
                <span>Diskon</span>
                <span className="num font-600 tabular-nums">−{formatRp(discountAmount)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-2">PPN 11%</span>
              <span className="num font-600 text-1 tabular-nums">{formatRp(taxAmount)}</span>
            </div>
            <div className="flex justify-between pt-1.5" style={{ borderTop: '1px dashed var(--border-strong)' }}>
              <span className="font-700 text-1 text-sm">Total</span>
              <span className="num font-700 text-green text-base tabular-nums">{formatRp(total)}</span>
            </div>
          </div>

          <div className="pt-2 space-y-1.5" style={{ borderTop: '1px dashed var(--border-strong)' }}>
            <div className="flex justify-between">
              <span className="text-2">Pembayaran</span>
              <span className="font-600 text-1">{PAY_LABEL[paymentMethod]}</span>
            </div>
            {paymentMethod === 'cash' && (
              <>
                <div className="flex justify-between">
                  <span className="text-2">Diterima</span>
                  <span className="num font-600 text-1 tabular-nums">{formatRp(amountTendered)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-2">Kembalian</span>
                  <span className="num font-700 text-green tabular-nums">{formatRp(change)}</span>
                </div>
              </>
            )}
          </div>

          <p className="text-center text-[10px] text-3 pt-1">
            {itemCount} item · Terima kasih!
          </p>
        </div>

        <button
          onClick={onNewOrder}
          className="btn-primary w-full py-3.5 text-sm font-700 btn-press animate-pulse-glow anim-slide-down"
          style={{ animationDelay: '0.5s' }}
        >
          🛒 Order Baru
        </button>
      </div>
    </div>
  )
}
