import { useState, useCallback, useMemo } from 'react'
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

  const handleAddToCart = useCallback((product: Product) => {
    setCartItems((prev) => {
      const existing = prev.find((i) => i.product.id === product.id)
      if (existing) return prev.map((i) => i.product.id === product.id ? { ...i, quantity: i.quantity + 1 } : i)
      return [...prev, { product, quantity: 1 }]
    })
  }, [])

  const handleUpdateQuantity = useCallback((productId: string, delta: number) => {
    setCartItems((prev) =>
      prev.map((i) => i.product.id === productId ? { ...i, quantity: Math.max(0, i.quantity + delta) } : i).filter((i) => i.quantity > 0),
    )
  }, [])

  const handleRemoveItem = useCallback((productId: string) => {
    setCartItems((prev) => prev.filter((i) => i.product.id !== productId))
  }, [])

  const handleClearCart = useCallback(() => {
    setCartItems([])
    setDiscountType('none')
    setDiscountValue('')
  }, [])

  const handlePaymentConfirm = useCallback(
    (result: PaymentResult) => {
      setLastPayment({ orderId: result.orderId, paymentMethod: result.paymentMethod, amountTendered: result.amountTendered, change: result.change, subtotal, discountAmount, taxAmount, total })
      setShowPayment(false)
      setShowSuccess(true)
    },
    [subtotal, discountAmount, taxAmount, total],
  )

  const handleNewOrder = useCallback(() => {
    setCartItems([])
    setDiscountType('none')
    setDiscountValue('')
    setShowSuccess(false)
    setLastPayment(null)
  }, [])

  return (
    <div className="flex gap-4 h-[calc(100vh-var(--header-h)-3rem)]">
      <div className="flex-1 min-w-0 flex flex-col">
        <ProductGrid onAddToCart={handleAddToCart} />
      </div>
      <div className="w-80 xl:w-96 flex-shrink-0 flex flex-col">
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
