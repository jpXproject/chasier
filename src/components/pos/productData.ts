export interface Product {
  id: string
  name: string
  category: string
  price: number
  unit: string
  image: string
  stock: number
}

export interface CartItem {
  product: Product
  quantity: number
}

export type PaymentMethod = 'cash' | 'qris' | 'debit' | 'credit'

export const CATEGORIES = [
  { id: 'all', label: 'Semua' },
  { id: 'coffee', label: 'Coffee' },
  { id: 'non-coffee', label: 'Non-Coffee' },
  { id: 'food', label: 'Makanan' },
  { id: 'merch', label: 'Merch' },
]

export const PRODUCTS: Product[] = [
  { id: 'P001', name: 'Espresso', category: 'coffee', price: 25000, unit: 'cup', image: '☕', stock: 200 },
  { id: 'P002', name: 'Americano', category: 'coffee', price: 30000, unit: 'cup', image: '☕', stock: 200 },
  { id: 'P003', name: 'Caffe Latte', category: 'coffee', price: 38000, unit: 'cup', image: '☕', stock: 180 },
  { id: 'P004', name: 'Cappuccino', category: 'coffee', price: 35000, unit: 'cup', image: '☕', stock: 150 },
  { id: 'P005', name: 'Caramel Macchiato', category: 'coffee', price: 45000, unit: 'cup', image: '☕', stock: 120 },
  { id: 'P006', name: 'Mocha', category: 'coffee', price: 42000, unit: 'cup', image: '☕', stock: 130 },
  { id: 'P007', name: 'Cold Brew', category: 'coffee', price: 35000, unit: 'cup', image: '🧊', stock: 90 },
  { id: 'P008', name: 'Affogato', category: 'coffee', price: 40000, unit: 'cup', image: '🍨', stock: 60 },
  { id: 'P009', name: 'Matcha Latte', category: 'non-coffee', price: 40000, unit: 'cup', image: '🍵', stock: 100 },
  { id: 'P010', name: 'Chocolate', category: 'non-coffee', price: 35000, unit: 'cup', image: '🍫', stock: 140 },
  { id: 'P011', name: 'Strawberry Smoothie', category: 'non-coffee', price: 45000, unit: 'cup', image: '🥤', stock: 80 },
  { id: 'P012', name: 'Mango Smoothie', category: 'non-coffee', price: 45000, unit: 'cup', image: '🥭', stock: 75 },
  { id: 'P013', name: 'Lemon Tea', category: 'non-coffee', price: 20000, unit: 'cup', image: '🍋', stock: 200 },
  { id: 'P014', name: 'Mineral Water', category: 'non-coffee', price: 8000, unit: 'btl', image: '💧', stock: 300 },
  { id: 'P015', name: 'Croissant', category: 'food', price: 22000, unit: 'pcs', image: '🥐', stock: 30 },
  { id: 'P016', name: 'Blueberry Muffin', category: 'food', price: 18000, unit: 'pcs', image: '🧁', stock: 25 },
  { id: 'P017', name: 'Banana Bread', category: 'food', price: 20000, unit: 'slice', image: '🍌', stock: 20 },
  { id: 'P018', name: 'Sandwich', category: 'food', price: 28000, unit: 'pcs', image: '🥪', stock: 15 },
  { id: 'P019', name: 'Caesar Salad', category: 'food', price: 35000, unit: 'bowl', image: '🥗', stock: 18 },
  { id: 'P020', name: 'Pasta Carbonara', category: 'food', price: 42000, unit: 'bowl', image: '🍝', stock: 12 },
  { id: 'P021', name: 'Tote Bag', category: 'merch', price: 55000, unit: 'pcs', image: '👜', stock: 40 },
  { id: 'P022', name: 'Tumbler 500ml', category: 'merch', price: 85000, unit: 'pcs', image: '🫗', stock: 25 },
  { id: 'P023', name: 'Coffee Beans 250g', category: 'merch', price: 95000, unit: 'bag', image: '🫘', stock: 35 },
  { id: 'P024', name: 'Mug', category: 'merch', price: 45000, unit: 'pcs', image: '🍶', stock: 50 },
]

let trxCounter = 100
export function generateTrxId(): string {
  trxCounter++
  const d = new Date()
  const dd = String(d.getDate()).padStart(2, '0')
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  return `TRX-${dd}${mm}-${String(trxCounter).padStart(4, '0')}`
}

export function formatRp(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export const TAX_RATE = 0.11
