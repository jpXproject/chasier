export interface Employee {
  id: string
  name: string
  role: 'kasir' | 'barista' | 'admin' | 'manager'
  phone: string
  email: string
  joinDate: string
  salary: number
  status: 'active' | 'inactive'
  avatar: string
}

export interface Shift {
  id: string
  employeeId: string
  date: string
  startTime: string
  endTime: string
  status: 'scheduled' | 'active' | 'completed' | 'missed'
  cashOpen: number
  cashClose: number | null
  sales: number
}

export interface ShiftSummary {
  totalShifts: number
  activeShifts: number
  totalSales: number
  avgSalesPerShift: number
}

export const EMPLOYEES: Employee[] = [
  { id: 'E001', name: 'Ahmad Fauzan', role: 'kasir', phone: '+62 812-3456-7890', email: 'ahmad@cashiergo.com', joinDate: '2024-01-15', salary: 4_500_000, status: 'active', avatar: '👨‍💼' },
  { id: 'E002', name: 'Siti Nurhaliza', role: 'kasir', phone: '+62 813-4567-8901', email: 'siti@cashiergo.com', joinDate: '2024-02-20', salary: 4_500_000, status: 'active', avatar: '👩‍💼' },
  { id: 'E003', name: 'Budi Santoso', role: 'barista', phone: '+62 814-5678-9012', email: 'budi@cashiergo.com', joinDate: '2024-01-10', salary: 4_000_000, status: 'active', avatar: '👨‍🍳' },
  { id: 'E004', name: 'Rina Wati', role: 'barista', phone: '+62 815-6789-0123', email: 'rina@cashiergo.com', joinDate: '2024-03-05', salary: 4_000_000, status: 'active', avatar: '👩‍🍳' },
  { id: 'E005', name: 'Dewi Lestari', role: 'admin', phone: '+62 816-7890-1234', email: 'dewi@cashiergo.com', joinDate: '2023-12-01', salary: 5_000_000, status: 'active', avatar: '👩‍💻' },
  { id: 'E006', name: 'Andi Prasetyo', role: 'manager', phone: '+62 817-8901-2345', email: 'andi@cashiergo.com', joinDate: '2023-06-15', salary: 8_000_000, status: 'active', avatar: '👨‍💼' },
  { id: 'E007', name: 'Maya Putri', role: 'kasir', phone: '+62 818-9012-3456', email: 'maya@cashiergo.com', joinDate: '2024-04-10', salary: 4_500_000, status: 'inactive', avatar: '👩‍💼' },
]

export const SHIFTS: Shift[] = [
  { id: 'SH001', employeeId: 'E001', date: '2026-07-30', startTime: '07:00', endTime: '15:00', status: 'completed', cashOpen: 500_000, cashClose: 2_950_000, sales: 2_450_000 },
  { id: 'SH002', employeeId: 'E002', date: '2026-07-30', startTime: '15:00', endTime: '23:00', status: 'scheduled', cashOpen: 500_000, cashClose: null, sales: 0 },
  { id: 'SH003', employeeId: 'E003', date: '2026-07-29', startTime: '07:00', endTime: '15:00', status: 'completed', cashOpen: 500_000, cashClose: 3_100_000, sales: 2_600_000 },
  { id: 'SH004', employeeId: 'E004', date: '2026-07-29', startTime: '15:00', endTime: '23:00', status: 'completed', cashOpen: 500_000, cashClose: 2_800_000, sales: 2_300_000 },
  { id: 'SH005', employeeId: 'E001', date: '2026-07-28', startTime: '07:00', endTime: '15:00', status: 'completed', cashOpen: 500_000, cashClose: 2_750_000, sales: 2_250_000 },
  { id: 'SH006', employeeId: 'E002', date: '2026-07-28', startTime: '15:00', endTime: '23:00', status: 'completed', cashOpen: 500_000, cashClose: 3_200_000, sales: 2_700_000 },
]

export const ROLE_LABELS: Record<Employee['role'], string> = {
  kasir: 'Kasir',
  barista: 'Barista',
  admin: 'Admin',
  manager: 'Manager',
}

export const ROLE_COLORS: Record<Employee['role'], string> = {
  kasir: 'var(--green)',
  barista: 'var(--blue)',
  admin: 'var(--amber)',
  manager: 'var(--red)',
}

export const SHIFT_STATUS_LABELS: Record<Shift['status'], string> = {
  scheduled: 'Terjadwal',
  active: 'Aktif',
  completed: 'Selesai',
  missed: 'Terlewat',
}

export const SHIFT_STATUS_COLORS: Record<Shift['status'], string> = {
  scheduled: 'var(--blue)',
  active: 'var(--green)',
  completed: 'var(--text-3)',
  missed: 'var(--red)',
}
