import { useState, useCallback, useMemo, useEffect, useRef } from 'react'
import ProductGrid from '../components/pos/ProductGrid'
import CartPanel, { type DiscountType } from '../components/pos/CartPanel'
import PaymentModal, { type PaymentResult } from '../components/pos/PaymentModal'
import CheckoutSuccess from '../components/pos/CheckoutSuccess'
import { TAX_RATE, type CartItem, type Product } from '../components/pos/productData'

export default function POS() {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [discountType, setDiscountType] = useState<DiscountType>('none')
  const [discountValue, setDiscountValue] = useState('')
  const [showPayment, setShowPayment] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [showMobileCart, setShowMobileCart] = useState(false)
  const [lastPayment, setLastPayment] = useState<{
    orderId: string
    paymentMethod: PaymentResult['paymentMethod']
    amountTendered: number
    change: number
    subtotal: number
    discountAmount: number
    taxAmount: number
    total: number
  } | null>(null)

  // BroadcastChannel for Customer Display sync
  const channelRef = useRef<BroadcastChannel | null>(null)
  useEffect(() => {
    try {
      channelRef.current = new BroadcastChannel('cashiergo-pos-sync')
    } catch { /* broadcast not supported */ }
    return () => { channelRef.current?.close() }
  }, [])

  const broadcastCartUpdate = useCallback((items: CartItem[], total: number, itemCount: number) => {
    channelRef.current?.postMessage({ type: 'cart-update', payload: { items, total, itemCount } })
  }, [])

  const broadcastCartClear = useCallback(() => {
    channelRef.current?.postMessage({ type: 'cart-clear' })
  }, [])

  const broadcastOrderSuccess = useCallback(() => {
    channelRef.current?.postMessage({ type: 'order-success' })
  }, [])

  const subtotal = useMemo(
    () => cartItems.reduce((s, i) => s + i.product.price * i.quantity, 0),
    [cartItems],
  )
  const discountAmount = useMemo(() => {
    const val = parseFloat(discountValue) || 0
    if (discountType === 'percentage') return subtotal * Math.min(val, 100) / 100
    if (discountType === 'fixed') return Math.min(val, subtotal)
    return 0
  }, [discountType, discountValue, subtotal])
  const taxAmount = (subtotal - discountAmount) * TAX_RATE
  const total = subtotal - discountAmount + taxAmount
  const itemCount = cartItems.reduce((s, i) => s + i.quantity, 0)

  const handleAddToCart = useCallback((product: Product) => {
    setCartItems((prev) => {
      const existing = prev.find((i) => i.product.id === product.id)
      const updated = existing
        ? prev.map((i) => i.product.id === product.id ? { ...i, quantity: i.quantity + 1 } : i)
        : [...prev, { product, quantity: 1 }]
      const total = updated.reduce((s, i) => s + i.product.price * i.quantity, 0)
      const itemCount = updated.reduce((s, i) => s + i.quantity, 0)
      broadcastCartUpdate(updated, total, itemCount)
      return updated
    })
  }, [broadcastCartUpdate])

  const handleUpdateQuantity = useCallback((productId: string, delta: number) => {
    setCartItems((prev) => {
      const updated = prev.map((i) => i.product.id === productId ? { ...i, quantity: Math.max(0, i.quantity + delta) } : i).filter((i) => i.quantity > 0)
      const total = updated.reduce((s, i) => s + i.product.price * i.quantity, 0)
      const itemCount = updated.reduce((s, i) => s + i.quantity, 0)
      broadcastCartUpdate(updated, total, itemCount)
      return updated
    })
  }, [broadcastCartUpdate])

  const handleRemoveItem = useCallback((productId: string) => {
    setCartItems((prev) => {
      const updated = prev.filter((i) => i.product.id !== productId)
      const total = updated.reduce((s, i) => s + i.product.price * i.quantity, 0)
      const itemCount = updated.reduce((s, i) => s + i.quantity, 0)
      broadcastCartUpdate(updated, total, itemCount)
      return updated
    })
  }, [broadcastCartUpdate])

  const handleClearCart = useCallback(() => {
    setCartItems([])
    setDiscountType('none')
    setDiscountValue('')
    broadcastCartClear()
  }, [broadcastCartClear])

  const handlePaymentConfirm = useCallback(
    (result: PaymentResult) => {
      setLastPayment({ orderId: result.orderId, paymentMethod: result.paymentMethod, amountTendered: result.amountTendered, change: result.change, subtotal, discountAmount, taxAmount, total })
      setShowPayment(false)
      setShowSuccess(true)
      broadcastOrderSuccess()
    },
    [subtotal, discountAmount, taxAmount, total, broadcastOrderSuccess],
  )

  const handleNewOrder = useCallback(() => {
    setCartItems([])
    setDiscountType('none')
    setDiscountValue('')
    setShowSuccess(false)
    setShowMobileCart(false)
    setLastPayment(null)
    broadcastCartClear()
  }, [broadcastCartClear])

  return (
    <div className="flex gap-4 h-[calc(100vh-var(--header-h)-3rem)]">
      {/* Product Grid - main area */}
      <div className="flex-1 min-w-0 flex flex-col anim-fade">
        <ProductGrid onAddToCart={handleAddToCart} />
      </div>

      {/* Cart Panel - desktop */}
      <div className="hidden lg:flex w-80 xl:w-96 flex-shrink-0 flex-col">
        <CartPanel
          items={cartItems}
          discountType={discountType}
          discountValue={discountValue}
          onDiscountTypeChange={setDiscountType}
          onDiscountValueChange={setDiscountValue}
          onUpdateQuantity={handleUpdateQuantity}
          onRemoveItem={handleRemoveItem}
          onCheckout={() => { if (cartItems.length > 0) setShowPayment(true) }}
          onClearCart={handleClearCart}
        />
      </div>

      {/* Mobile cart toggle button */}
      <button
        onClick={() => setShowMobileCart(true)}
        className="lg:hidden fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full btn-primary flex items-center justify-center shadow-lg btn-press animate-cart-bounce"
        style={{ boxShadow: '0 8px 30px rgba(22, 163, 74, 0.4)' }}
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
          <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
        </svg>
        {itemCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red text-white text-[10px] font-700 flex items-center justify-center anim-pop">
            {itemCount}
          </span>
        )}
      </button>

      {/* Mobile cart drawer overlay */}
      {showMobileCart && (
        <div className="lg:hidden fixed inset-0 z-50 anim-fade">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowMobileCart(false)}
          />
          {/* Drawer */}
          <div className="absolute right-0 top-0 bottom-0 w-80 max-w-[85vw] anim-slide-right">
            <CartPanel
              items={cartItems}
              discountType={discountType}
              discountValue={discountValue}
              onDiscountTypeChange={setDiscountType}
              onDiscountValueChange={setDiscountValue}
              onUpdateQuantity={handleUpdateQuantity}
              onRemoveItem={handleRemoveItem}
              onCheckout={() => {
                setShowMobileCart(false)
                if (cartItems.length > 0) setShowPayment(true)
              }}
              onClearCart={handleClearCart}
            />
          </div>
        </div>
      )}

      {showPayment && (
        <PaymentModal
          total={total}
          items={cartItems}
          onConfirm={handlePaymentConfirm}
          onCancel={() => setShowPayment(false)}
        />
      )}
      {showSuccess && lastPayment && (
        <CheckoutSuccess
          orderId={lastPayment.orderId}
          items={cartItems}
          subtotal={lastPayment.subtotal}
          discountAmount={lastPayment.discountAmount}
          taxAmount={lastPayment.taxAmount}
          total={lastPayment.total}
          paymentMethod={lastPayment.paymentMethod}
          amountTendered={lastPayment.amountTendered}
          change={lastPayment.change}
          onNewOrder={handleNewOrder}
        />
      )}
    </div>
  )
}
