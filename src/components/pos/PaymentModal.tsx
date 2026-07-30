import { useState, useMemo, useEffect, useCallback } from 'react'
import { formatRp, type CartItem, type PaymentMethod, generateTrxId } from './productData'
import { loadSnapScript, openSnapPayment, type SnapPaymentItem } from '../../lib/midtrans'

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

const PAYMENT_OPTIONS: { method: PaymentMethod; label: string; emoji: string; desc: string }[] = [
  { method: 'cash', label: 'Tunai', emoji: '💵', desc: 'Uang kas' },
  { method: 'qris', label: 'QRIS', emoji: '📲', desc: 'Scan barcode' },
  { method: 'debit', label: 'Debit', emoji: '💳', desc: 'Kartu debit' },
  { method: 'credit', label: 'Kredit', emoji: '💳', desc: 'Kartu kredit' },
]

const QUICK_AMOUNTS = [50_000, 100_000, 150_000, 200_000, 500_000]

export default function PaymentModal({ total, items, onConfirm, onCancel }: PaymentModalProps) {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash')
  const [customAmount, setCustomAmount] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [orderId] = useState(generateTrxId)

  useEffect(() => {
    if (paymentMethod !== 'cash') setCustomAmount('')
  }, [paymentMethod])

  const amountTendered = useMemo(() => {
    if (paymentMethod !== 'cash') return total
    const parsed = parseFloat(customAmount.replace(/\D/g, ''))
    return isNaN(parsed) ? 0 : parsed
  }, [paymentMethod, customAmount, total])

  const change = Math.max(0, amountTendered - total)
  const isCashShort = paymentMethod === 'cash' && amountTendered > 0 && amountTendered < total
  const canConfirm = paymentMethod !== 'cash' || amountTendered >= total
  const itemCount = items.reduce((s, i) => s + i.quantity, 0)

  const handleConfirm = useCallback(async () => {
    setIsProcessing(true)

    // Cash: simulate processing
    if (paymentMethod === 'cash') {
      setTimeout(() => {
        onConfirm({ orderId, paymentMethod, amountTendered, change })
        setIsProcessing(false)
      }, 700)
      return
    }

    // Non-cash: trigger Midtrans Snap
    try {
      const snapItems: SnapPaymentItem[] = items.map((item) => ({
        id: item.product.id,
        name: item.product.name,
        price: item.product.price,
        quantity: item.quantity,
      }))

      const result = await openSnapPayment({
        orderId,
        amount: total,
        items: snapItems,
      }, /* snapToken */ undefined)

      onConfirm({
        orderId: result.order_id || orderId,
        paymentMethod,
        amountTendered: total,
        change: 0,
      })
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Pembayaran gagal. Silakan coba lagi.'
      console.error('Midtrans payment error:', err)
      alert(message)
    } finally {
      setIsProcessing(false)
    }
  }, [paymentMethod, items, total, orderId, amountTendered, change, onConfirm])

  // Pre-load Midtrans Snap script on mount
  useEffect(() => {
    loadSnapScript().catch(() => {
      // Will fall back to demo mode if script can't load
    })
  }, [])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm anim-fade" onClick={onCancel}>
      <div className="card w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto anim-scale" onClick={(e) => e.stopPropagation()}>
        <div className="p-6 space-y-5">
          {/* Header */}
          <div className="flex items-start justify-between anim-slide-down">
            <div>
              <h2 className="text-base font-700 text-1">Konfirmasi Pembayaran</h2>
              <p className="num text-[11px] text-3 mt-0.5">{itemCount} item · {orderId}</p>
            </div>
            <button
              onClick={onCancel}
              className="w-8 h-8 flex items-center justify-center rounded-lg btn-ghost text-2 hover:text-red flex-shrink-0 ml-2 btn-press"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          {/* Order summary */}
          <div className="p-4 rounded-xl space-y-2 anim-slide-down" style={{ background: 'var(--surface-2)', animationDelay: '0.05s' }}>
            {items.map((item) => (
              <div key={item.product.id} className="flex justify-between text-xs">
                <span className="text-2 truncate mr-3">{item.quantity}× {item.product.name}</span>
                <span className="num font-600 text-1 tabular-nums flex-shrink-0">
                  {formatRp(item.product.price * item.quantity)}
                </span>
              </div>
            ))}
            <div className="flex justify-between pt-2" style={{ borderTop: '1px solid var(--border)' }}>
              <span className="text-sm font-700 text-1">Total</span>
              <span className="num text-xl font-700 text-green tabular-nums">{formatRp(total)}</span>
            </div>
          </div>

          {/* Payment method */}
          <div className="anim-slide-down" style={{ animationDelay: '0.1s' }}>
            <p className="text-[10px] font-600 text-3 uppercase tracking-wider mb-2">Metode Pembayaran</p>
            <div className="grid grid-cols-4 gap-2">
              {PAYMENT_OPTIONS.map((opt) => (
                <button
                  key={opt.method}
                  onClick={() => setPaymentMethod(opt.method)}
                  className="flex flex-col items-center gap-1.5 py-3 rounded-xl border text-xs font-600 transition-all duration-200 btn-press"
                  style={
                    paymentMethod === opt.method
                      ? { background: 'var(--green-dim)', borderColor: 'var(--green-border)', color: 'var(--green)', transform: 'scale(1.05)' }
                      : { background: 'var(--surface-2)', borderColor: 'var(--border)', color: 'var(--text-2)' }
                  }
                >
                  <span className="text-2xl">{opt.emoji}</span>
                  <span>{opt.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Cash section */}
          {paymentMethod === 'cash' && (
            <div className="space-y-3 anim-fade-scale">
              <p className="text-[10px] font-600 text-3 uppercase tracking-wider">Jumlah Diterima</p>
              <div
                className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200"
                style={{ background: 'var(--surface-2)', border: isCashShort ? '1px solid var(--red-border)' : '1px solid var(--border)' }}
              >
                <span className="text-sm text-2 font-500 flex-shrink-0">Rp</span>
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="0"
                  value={customAmount}
                  onChange={(e) => setCustomAmount(e.target.value.replace(/\D/g, ''))}
                  autoFocus
                  className="flex-1 bg-transparent text-2xl font-700 text-1 outline-none border-none num tabular-nums placeholder:text-3"
                />
              </div>
              <div className="flex flex-wrap gap-1.5">
                {QUICK_AMOUNTS.map((amt, idx) => (
                  <button
                    key={amt}
                    onClick={() => setCustomAmount(String(amt))}
                    className="btn-outline px-3 py-1.5 text-[11px] font-600 num btn-press animate-stagger"
                    style={{ animationDelay: `${idx * 0.03}s` }}
                  >
                    {amt >= 1_000_000 ? `${amt / 1_000_000}jt` : `${(amt / 1000).toFixed(0)}rb`}
                  </button>
                ))}
              </div>
              {amountTendered > 0 && (
                <div
                  className={`flex justify-between items-center p-3 rounded-xl anim-scale transition-all duration-200`}
                  style={{
                    background: isCashShort ? 'var(--red-dim)' : 'var(--green-dim)',
                    border: `1px solid ${isCashShort ? 'var(--red-border)' : 'var(--green-border)'}`,
                  }}
                >
                  <span className="text-xs font-600" style={{ color: isCashShort ? 'var(--red)' : 'var(--green)' }}>
                    {isCashShort ? 'Kurang' : 'Kembalian'}
                  </span>
                  <span
                    className={`num text-sm font-700 tabular-nums ${isCashShort ? 'anim-shake' : ''}`}
                    style={{ color: isCashShort ? 'var(--red)' : 'var(--green)' }}
                  >
                    {isCashShort ? formatRp(total - amountTendered) : formatRp(change)}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Non-cash note */}
          {paymentMethod !== 'cash' && (
            <div
              className="p-3 rounded-xl text-center text-xs text-2 anim-fade-scale"
              style={{ background: 'var(--surface-2)' }}
            >
              {paymentMethod === 'qris'
                ? 'Pelanggan akan scan kode QRIS untuk membayar'
                : paymentMethod === 'debit'
                ? 'Pelanggan akan tap/insert Kartu Debit'
                : 'Pelanggan akan tap/insert Kartu Kredit'}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 anim-slide-down" style={{ animationDelay: '0.15s' }}>
            <button onClick={onCancel} className="btn-outline flex-1 py-3 text-sm font-600 btn-press">
              Batal
            </button>
            <button
              onClick={handleConfirm}
              disabled={!canConfirm || isProcessing}
              className="btn-primary flex-1 py-3 text-sm font-700 flex items-center justify-center gap-2 btn-press"
            >
              {isProcessing ? (
                <>
                  <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                  </svg>
                  Memproses...
                </>
              ) : isCashShort ? (
                'Kurang'
              ) : (
                `Konfirmasi ${formatRp(total)}`
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
