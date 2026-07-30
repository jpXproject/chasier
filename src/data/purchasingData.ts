export interface PurchaseOrder {
  id: string
  supplier: string
  date: string
  items: PurchaseItem[]
  total: number
  status: 'pending' | 'received' | 'cancelled'
  paymentStatus: 'unpaid' | 'partial' | 'paid'
  notes: string
}

export interface PurchaseItem {
  name: string
  quantity: number
  unit: string
  pricePerUnit: number
  total: number
}

export interface Expense {
  id: string
  category: ExpenseCategory
  description: string
  amount: number
  date: string
  paymentMethod: 'cash' | 'transfer' | 'card'
  receipt?: string
}

export type ExpenseCategory = 'operational' | 'utilities' | 'maintenance' | 'marketing' | 'other'

export interface ExpenseSummary {
  totalThisMonth: number
  totalLastMonth: number
  byCategory: { category: ExpenseCategory; amount: number; percentage: number }[]
}

export const EXPENSE_CATEGORIES: Record<ExpenseCategory, { label: string; icon: string; color: string }> = {
  operational: { label: 'Operasional', icon: '⚙️', color: 'var(--blue)' },
  utilities: { label: 'Utilitas', icon: '💡', color: 'var(--amber)' },
  maintenance: { label: 'Perawatan', icon: '🔧', color: 'var(--red)' },
  marketing: { label: 'Pemasaran', icon: '📢', color: 'var(--green)' },
  other: { label: 'Lain-lain', icon: '📦', color: 'var(--text-3)' },
}

export const PURCHASE_ORDERS: PurchaseOrder[] = [
  {
    id: 'PO-001',
    supplier: 'PT Kopi Nusantara',
    date: '2026-07-28',
    items: [
      { name: 'Arabica Coffee Beans', quantity: 10, unit: 'kg', pricePerUnit: 120_000, total: 1_200_000 },
      { name: 'Robusta Coffee Beans', quantity: 5, unit: 'kg', pricePerUnit: 80_000, total: 400_000 },
    ],
    total: 1_600_000,
    status: 'received',
    paymentStatus: 'paid',
    notes: 'Pengiriman tepat waktu',
  },
  {
    id: 'PO-002',
    supplier: 'Fresh Dairy Supply',
    date: '2026-07-29',
    items: [
      { name: 'Fresh Milk', quantity: 20, unit: 'L', pricePerUnit: 18_000, total: 360_000 },
      { name: 'Cream Cheese', quantity: 5, unit: 'kg', pricePerUnit: 85_000, total: 425_000 },
    ],
    total: 785_000,
    status: 'received',
    paymentStatus: 'paid',
    notes: '',
  },
  {
    id: 'PO-003',
    supplier: 'Sugar & Spice Co.',
    date: '2026-07-30',
    items: [
      { name: 'Vanilla Syrup', quantity: 10, unit: 'btl', pricePerUnit: 45_000, total: 450_000 },
      { name: 'Caramel Syrup', quantity: 8, unit: 'btl', pricePerUnit: 45_000, total: 360_000 },
      { name: 'Chocolate Powder', quantity: 5, unit: 'kg', pricePerUnit: 65_000, total: 325_000 },
    ],
    total: 1_135_000,
    status: 'pending',
    paymentStatus: 'unpaid',
    notes: 'Menunggu konfirmasi',
  },
  {
    id: 'PO-004',
    supplier: 'Packaging Pro',
    date: '2026-07-25',
    items: [
      { name: 'Paper Cup 8oz', quantity: 500, unit: 'pcs', pricePerUnit: 1_500, total: 750_000 },
      { name: 'Paper Cup 12oz', quantity: 300, unit: 'pcs', pricePerUnit: 2_000, total: 600_000 },
      { name: 'Takeaway Bag', quantity: 200, unit: 'pcs', pricePerUnit: 500, total: 100_000 },
    ],
    total: 1_450_000,
    status: 'received',
    paymentStatus: 'partial',
    notes: 'DP 50% sudah dibayar',
  },
]

export const EXPENSES: Expense[] = [
  { id: 'EX001', category: 'utilities', description: 'Listrik bulanan Juli', amount: 850_000, date: '2026-07-28', paymentMethod: 'transfer' },
  { id: 'EX002', category: 'utilities', description: 'Air PDAM bulanan Juli', amount: 320_000, date: '2026-07-28', paymentMethod: 'transfer' },
  { id: 'EX003', category: 'operational', description: 'Sabun & hand sanitizer', amount: 125_000, date: '2026-07-27', paymentMethod: 'cash' },
  { id: 'EX004', category: 'maintenance', description: 'Servis mesin espresso', amount: 1_500_000, date: '2026-07-25', paymentMethod: 'transfer' },
  { id: 'EX005', category: 'marketing', description: 'Ig ads campaign', amount: 500_000, date: '2026-07-24', paymentMethod: 'card' },
  { id: 'EX006', category: 'operational', description: 'Tisu & tissue box', amount: 85_000, date: '2026-07-23', paymentMethod: 'cash' },
  { id: 'EX007', category: 'other', description: 'Biaya kebersihan', amount: 200_000, date: '2026-07-22', paymentMethod: 'cash' },
  { id: 'EX008', category: 'maintenance', description: 'Ganti lampu LED', amount: 350_000, date: '2026-07-20', paymentMethod: 'cash' },
  { id: 'EX009', category: 'utilities', description: 'Internet bulanan', amount: 450_000, date: '2026-07-19', paymentMethod: 'transfer' },
  { id: 'EX010', category: 'marketing', description: 'Banner & spanduk', amount: 275_000, date: '2026-07-18', paymentMethod: 'cash' },
]

export const SUPPLIERS = [
  'PT Kopi Nusantara',
  'Fresh Dairy Supply',
  'Sugar & Spice Co.',
  'Packaging Pro',
  'Cup & Container Plus',
  '清洁用品 Supplies',
]

export function formatRp(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}
