import { useState, useCallback, useMemo } from 'react'
import ProductGrid from '../components/pos/ProductGrid'
import CartPanel, { type DiscountType } from '../components/pos/CartPanel'
import PaymentModal, { type PaymentResult } from '../components/pos/PaymentModal'
import CheckoutSuccess from '../components/pos/CheckoutSuccess'
import { TAX_RATE, type CartItem, type Product } from '../components/pos/productData'

export default function POS() {
  // --- State ---
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [discountType, setDiscountType] = useState<DiscountType>('none')
  const [discountValue, setDiscountValue] = useState('')
  const [showPayment, setShowPayment] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
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

  // --- Computed cart values (with discount) ---
  const subtotal = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0),
    [cartItems]
  )

  const discountAmount = useMemo(() => {
    if (discountType === 'none') return 0
    const val = parseFloat(discountValue) || 0
    if (discountType === 'percentage') return subtotal * Math.min(val, 100) / 100
    return Math.min(val, subtotal)
  }, [discountType, discountValue, subtotal])

  const taxableAmount = subtotal - discountAmount
  const taxAmount = taxableAmount * TAX_RATE
  const total = taxableAmount + taxAmount

  // --- Handlers ---
  const handleAddToCart = useCallback((product: Product) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id)
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      }
      return [...prev, { product, quantity: 1 }]
    })
  }, [])

  const handleUpdateQuantity = useCallback((productId: string, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((item) =>
          item.product.id === productId
            ? { ...item, quantity: Math.max(0, item.quantity + delta) }
            : item
        )
        .filter((item) => item.quantity > 0)
    )
  }, [])

  const handleRemoveItem = useCallback((productId: string) => {
    setCartItems((prev) => prev.filter((item) => item.product.id !== productId))
  }, [])

  const handleClearCart = useCallback(() => {
    setCartItems([])
    setDiscountType('none')
    setDiscountValue('')
  }, [])

  const handleCheckout = useCallback(() => {
    if (cartItems.length === 0) return
    setShowPayment(true)
  }, [cartItems])

  const handlePaymentConfirm = useCallback((result: PaymentResult) => {
    setLastPayment({
      orderId: result.orderId,
      paymentMethod: result.paymentMethod,
      amountTendered: result.amountTendered,
      change: result.change,
      subtotal,
      discountAmount,
      taxAmount,
      total,
    })
    setShowPayment(false)
    setShowSuccess(true)
  }, [subtotal, discountAmount, taxAmount, total])

  const handlePaymentCancel = useCallback(() => {
    setShowPayment(false)
  }, [])

  const handleNewOrder = useCallback(() => {
    setCartItems([])
    setDiscountType('none')
    setDiscountValue('')
    setShowSuccess(false)
    setLastPayment(null)
  }, [])

  return (
    <div className="flex gap-4 h-[calc(100vh-6rem)]">
      {/* Left: Product Grid */}
      <div className="flex-1 min-w-0 flex flex-col">
        <ProductGrid onAddToCart={handleAddToCart} />
      </div>

      {/* Right: Cart Panel */}
      <div className="w-96 flex-shrink-0 flex flex-col">
        <CartPanel
          items={cartItems}
          discountType={discountType}
          discountValue={discountValue}
          onDiscountTypeChange={setDiscountType}
          onDiscountValueChange={setDiscountValue}
          onUpdateQuantity={handleUpdateQuantity}
          onRemoveItem={handleRemoveItem}
          onCheckout={handleCheckout}
          onClearCart={handleClearCart}
        />
      </div>

      {/* Payment Modal */}
      {showPayment && (
        <PaymentModal
          total={total}
          items={cartItems}
          onConfirm={handlePaymentConfirm}
          onCancel={handlePaymentCancel}
        />
      )}

      {/* Success Receipt */}
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
