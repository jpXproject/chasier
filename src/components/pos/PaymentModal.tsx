import { useState, useMemo, useEffect } from 'react'
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

  const handleConfirm = () => {
    setIsProcessing(true)
    setTimeout(() => {
      onConfirm({ orderId, paymentMethod, amountTendered, change })
      setIsProcessing(false)
    }, 700)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm anim-fade">
      <div className="card w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6 space-y-5">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-base font-700 text-1">Konfirmasi Pembayaran</h2>
              <p className="num text-[11px] text-3 mt-0.5">{itemCount} item · {orderId}</p>
            </div>
            <button
              onClick={onCancel}
              className="w-8 h-8 flex items-center justify-center rounded-lg btn-ghost text-2 hover:text-red flex-shrink-0 ml-2"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          {/* Order summary */}
          <div className="p-4 rounded-xl space-y-2" style={{ background: 'var(--surface-2)' }}>
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
          <div>
            <p className="text-[10px] font-600 text-3 uppercase tracking-wider mb-2">Metode Pembayaran</p>
            <div className="grid grid-cols-4 gap-2">
              {PAYMENT_OPTIONS.map((opt) => (
                <button
                  key={opt.method}
                  onClick={() => setPaymentMethod(opt.method)}
                  className="flex flex-col items-center gap-1.5 py-3 rounded-xl border text-xs font-600 transition-all duration-150"
                  style={
                    paymentMethod === opt.method
                      ? { background: 'var(--green-dim)', borderColor: 'var(--green-border)', color: 'var(--green)' }
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
            <div className="space-y-3">
              <p className="text-[10px] font-600 text-3 uppercase tracking-wider">Jumlah Diterima</p>
              <div
                className="flex items-center gap-3 px-4 py-3 rounded-xl"
                style={{ background: 'var(--surface-2)', border: '1px solid var(--border)' }}
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
                {QUICK_AMOUNTS.map((amt) => (
                  <button
                    key={amt}
                    onClick={() => setCustomAmount(String(amt))}
                    className="btn-outline px-3 py-1.5 text-[11px] font-600 num"
                  >
                    {amt >= 1_000_000 ? `${amt / 1_000_000}jt` : `${(amt / 1000).toFixed(0)}rb`}
                  </button>
                ))}
              </div>
              {amountTendered > 0 && (
                <div
                  className="flex justify-between items-center p-3 rounded-xl"
                  style={{
                    background: isCashShort ? 'var(--red-dim)' : 'var(--green-dim)',
                    border: `1px solid ${isCashShort ? 'var(--red-border)' : 'var(--green-border)'}`,
                  }}
                >
                  <span className="text-xs font-600" style={{ color: isCashShort ? 'var(--red)' : 'var(--green)' }}>
                    {isCashShort ? 'Kurang' : 'Kembalian'}
                  </span>
                  <span
                    className="num text-sm font-700 tabular-nums"
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
              className="p-3 rounded-xl text-center text-xs text-2"
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
          <div className="flex gap-3">
            <button onClick={onCancel} className="btn-outline flex-1 py-3 text-sm font-600">
              Batal
            </button>
            <button
              onClick={handleConfirm}
              disabled={!canConfirm || isProcessing}
              className="btn-primary flex-1 py-3 text-sm font-700 flex items-center justify-center gap-2"
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
