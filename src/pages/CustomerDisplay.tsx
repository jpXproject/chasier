import { useState, useEffect, useCallback, useMemo, useRef } from 'react'
import { PRODUCTS, CATEGORIES, formatRp, TAX_RATE, type Product, type CartItem } from '../components/pos/productData'

/* ───────── BroadcastChannel sync ───────── */
const CHANNEL_NAME = 'cashiergo-pos-sync'

interface SyncMessage {
  type: 'cart-update' | 'cart-clear' | 'order-success' | 'ping'
  payload?: {
    items: CartItem[]
    total: number
    itemCount: number
  }
}



/* ───────── Main Component ───────── */
export default function CustomerDisplay() {
  const [activeCategory, setActiveCategory] = useState('all')
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [lastAddedId, setLastAddedId] = useState<string | null>(null)
  const [showOrderSuccess, setShowOrderSuccess] = useState(false)
  const [currentTime, setCurrentTime] = useState(new Date())
  const orderPanelRef = useRef<HTMLDivElement>(null)
  const channelRef = useRef<BroadcastChannel | null>(null)

  // Live clock
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  // BroadcastChannel setup
  useEffect(() => {
    try {
      channelRef.current = new BroadcastChannel(CHANNEL_NAME)
      channelRef.current.onmessage = (e) => {
        const msg = e.data as SyncMessage
        if (msg.type === 'cart-update' && msg.payload) {
          setCartItems(msg.payload.items)
        } else if (msg.type === 'cart-clear') {
          setCartItems([])
        } else if (msg.type === 'order-success') {
          setShowOrderSuccess(true)
          setTimeout(() => {
            setShowOrderSuccess(false)
            setCartItems([])
          }, 4000)
        }
      }
    } catch { /* broadcast not supported */ }
    return () => { channelRef.current?.close() }
  }, [])

  // Auto-scroll order panel when items change
  useEffect(() => {
    if (orderPanelRef.current) {
      orderPanelRef.current.scrollTop = orderPanelRef.current.scrollHeight
    }
  }, [cartItems])

  // Highlight last added item
  const handleAddToCart = useCallback((product: Product) => {
    setCartItems((prev) => {
      const existing = prev.find((i) => i.product.id === product.id)
      const updated = existing
        ? prev.map((i) => i.product.id === product.id ? { ...i, quantity: i.quantity + 1 } : i)
        : [...prev, { product, quantity: 1 }]

      // Broadcast to POS admin
      const total = updated.reduce((s, i) => s + i.product.price * i.quantity, 0)
      const itemCount = updated.reduce((s, i) => s + i.quantity, 0)
      channelRef.current?.postMessage({ type: 'cart-update', payload: { items: updated, total, itemCount } })
      return updated
    })
    setLastAddedId(product.id)
    setTimeout(() => setLastAddedId(null), 800)
  }, [])

  // Computed values
  const filteredProducts = useMemo(
    () => activeCategory === 'all' ? PRODUCTS : PRODUCTS.filter((p) => p.category === activeCategory),
    [activeCategory],
  )

  const subtotal = useMemo(
    () => cartItems.reduce((s, i) => s + i.product.price * i.quantity, 0),
    [cartItems],
  )

  const taxAmount = subtotal * TAX_RATE
  const total = subtotal + taxAmount
  const itemCount = cartItems.reduce((s, i) => s + i.quantity, 0)

  const timeStr = currentTime.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
  const dateStr = currentTime.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })

  return (
    <div className="h-screen w-screen overflow-hidden flex flex-col" style={{ background: 'var(--bg)' }}>

      {/* ════════════ Order Success Overlay ════════════ */}
      {showOrderSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center anim-fade-scale" style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(12px)' }}>
          <div className="text-center anim-bounce">
            <div className="text-[80px] mb-4">🎉</div>
            <p className="text-white text-3xl font-700 mb-2">Pesanan Diterima!</p>
            <p className="text-white/60 text-lg">Terima kasih atas pesanan Anda</p>
          </div>
        </div>
      )}

      {/* ════════════ Header ════════════ */}
      <header
        className="flex items-center justify-between px-6 py-3 border-b"
        style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'var(--green-dim)' }}>
            <span className="text-xl">☕</span>
          </div>
          <div>
            <h1 className="text-lg font-700 text-1">CashierGo</h1>
            <p className="text-xs text-3">Customer Display</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm font-600 text-1 num">{timeStr}</p>
          <p className="text-xs text-3">{dateStr}</p>
        </div>
      </header>

      {/* ════════════ Main Content ════════════ */}
      <div className="flex-1 flex overflow-hidden">

        {/* ──── Product Menu (Left) ──── */}
        <div className="flex-1 flex flex-col overflow-hidden">

          {/* Category Tabs */}
          <div className="flex gap-2 px-5 py-3 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className="flex-shrink-0 px-4 py-2 rounded-xl text-sm font-600 transition-all duration-200 btn-press"
                style={
                  activeCategory === cat.id
                    ? { background: 'var(--green)', color: '#fff' }
                    : { background: 'var(--surface-2)', color: 'var(--text-2)', border: '1px solid var(--border)' }
                }
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Product Grid */}
          <div className="flex-1 overflow-y-auto px-5 pb-5">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
              {filteredProducts.map((product, idx) => (
                <button
                  key={product.id}
                  onClick={() => handleAddToCart(product)}
                  className="card card-lift ripple-container flex flex-col items-center gap-2 p-4 text-center btn-press animate-stagger"
                  style={{ animationDelay: `${Math.min(idx * 0.03, 0.3)}s` }}
                >
                  <div className="relative">
                    <span className="text-4xl block mb-1">{product.image}</span>
                    {lastAddedId === product.id && (
                      <div className="absolute inset-0 flex items-center justify-center anim-pop">
                        <span className="bg-green text-white text-[10px] font-700 px-2 py-0.5 rounded-full shadow-lg">✓</span>
                      </div>
                    )}
                  </div>
                  <p className="text-sm font-600 text-1 leading-tight">{product.name}</p>
                  <p className="text-xs font-700 num" style={{ color: 'var(--green)' }}>
                    {formatRp(product.price)}
                  </p>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ──── Order Sidebar (Right) ──── */}
        <div
          className="w-72 xl:w-80 flex flex-col border-l"
          style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}
        >
          {/* Order Header */}
          <div className="px-4 py-3 border-b" style={{ borderColor: 'var(--border)' }}>
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-700 text-1 flex items-center gap-2">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--green)' }}>
                  <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                </svg>
                Pesanan Anda
              </h2>
              {itemCount > 0 && (
                <span className="badge badge-green num">{itemCount} item</span>
              )}
            </div>
          </div>

          {/* Order Items */}
          <div ref={orderPanelRef} className="flex-1 overflow-y-auto px-4 py-3">
            {cartItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center py-10">
                <span className="text-4xl mb-3 opacity-40">🛒</span>
                <p className="text-sm text-3">Pilih produk dari menu</p>
              </div>
            ) : (
              <div className="space-y-2">
                {cartItems.map((item) => (
                  <div
                    key={item.product.id}
                    className="flex items-center gap-3 p-3 rounded-xl anim-slide"
                    style={{ background: 'var(--surface-2)' }}
                  >
                    <span className="text-2xl">{item.product.image}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-600 text-1 truncate">{item.product.name}</p>
                      <p className="text-xs text-3 num">{formatRp(item.product.price)} × {item.quantity}</p>
                    </div>
                    <p className="text-sm font-700 num text-1">
                      {formatRp(item.product.price * item.quantity)}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Order Summary */}
          {cartItems.length > 0 && (
            <div className="border-t px-4 py-3 space-y-2" style={{ borderColor: 'var(--border)' }}>
              <div className="flex justify-between text-xs text-3">
                <span>Subtotal</span>
                <span className="num">{formatRp(subtotal)}</span>
              </div>
              <div className="flex justify-between text-xs text-3">
                <span>PPN (11%)</span>
                <span className="num">{formatRp(taxAmount)}</span>
              </div>
              <div className="h-px" style={{ background: 'var(--border)' }} />
              <div className="flex justify-between items-center">
                <span className="text-sm font-700 text-1">Total</span>
                <span className="text-lg font-700 num" style={{ color: 'var(--green)' }}>
                  {formatRp(total)}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ════════════ Footer Bar ════════════ */}
      <footer
        className="flex items-center justify-between px-6 py-2 border-t text-xs text-3"
        style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}
      >
        <span>CashierGo POS System</span>
        <span className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: 'var(--green)' }} />
          Connected Display
        </span>
      </footer>
    </div>
  )
}
