import { useState, useMemo } from 'react'
import { EMPLOYEES as INITIAL_EMPLOYEES, SHIFTS, ROLE_LABELS, ROLE_COLORS, SHIFT_STATUS_LABELS, SHIFT_STATUS_COLORS, type Employee, type Shift } from '../data/employeeData'

/* ============================================================
   Helper: format currency
   ============================================================ */
const fmtCurrency = (n: number) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(n)

const AVATARS = ['👨‍💼', '👩‍💼', '👨‍🍳', '👩‍🍳', '👩‍💻', '👨‍🏫', '👩‍🏫', '🧑‍💼']

/* ============================================================
   Employee Form Modal (Add & Edit)
   ============================================================ */
function EmployeeFormModal({
  employee,
  onClose,
  onSave,
}: {
  employee?: Employee
  onClose: () => void
  onSave: (data: Omit<Employee, 'id'> & { id?: string }) => void
}) {
  const [form, setForm] = useState({
    name: employee?.name || '',
    role: employee?.role || 'kasir' as Employee['role'],
    phone: employee?.phone || '',
    email: employee?.email || '',
    salary: employee?.salary || 4_000_000,
    status: employee?.status || 'active' as Employee['status'],
    avatar: employee?.avatar || '👨‍💼',
  })

  const isEdit = !!employee

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave({
      ...form,
      joinDate: employee?.joinDate || new Date().toISOString().split('T')[0],
      ...(employee ? { id: employee.id } : {}),
    })
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm anim-fade">
      <div className="card w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-base font-700 text-1">{isEdit ? 'Edit Karyawan' : 'Tambah Karyawan Baru'}</h2>
              <p className="text-[11px] text-3 mt-0.5">{isEdit ? 'Perbarui data karyawan' : 'Isi data karyawan baru'}</p>
            </div>
            <button type="button" onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg btn-ghost text-2 hover:text-red flex-shrink-0">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          {/* Avatar Picker */}
          <div>
            <label className="text-[10px] font-600 text-3 uppercase tracking-wider mb-2 block">Avatar</label>
            <div className="flex gap-2 flex-wrap">
              {AVATARS.map(a => (
                <button
                  key={a}
                  type="button"
                  onClick={() => setForm({ ...form, avatar: a })}
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-xl transition-all border"
                  style={
                    form.avatar === a
                      ? { background: 'var(--green-dim)', borderColor: 'var(--green-border)' }
                      : { background: 'var(--surface-2)', borderColor: 'var(--border)' }
                  }
                >
                  {a}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2">
              <label className="text-[10px] font-600 text-3 uppercase tracking-wider mb-1.5 block">Nama Lengkap</label>
              <input
                type="text"
                required
                placeholder="Contoh: Ahmad Fauzan"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="input-base w-full px-3 py-2.5 text-sm"
              />
            </div>
            <div>
              <label className="text-[10px] font-600 text-3 uppercase tracking-wider mb-1.5 block">Role</label>
              <select
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value as Employee['role'] })}
                className="input-base w-full px-3 py-2.5 text-sm"
              >
                {Object.entries(ROLE_LABELS).map(([key, label]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-[10px] font-600 text-3 uppercase tracking-wider mb-1.5 block">Status</label>
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value as Employee['status'] })}
                className="input-base w-full px-3 py-2.5 text-sm"
              >
                <option value="active">Aktif</option>
                <option value="inactive">Non-aktif</option>
              </select>
            </div>
            <div>
              <label className="text-[10px] font-600 text-3 uppercase tracking-wider mb-1.5 block">Telepon</label>
              <input
                type="tel"
                required
                placeholder="+62 812-3456-7890"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="input-base w-full px-3 py-2.5 text-sm"
              />
            </div>
            <div>
              <label className="text-[10px] font-600 text-3 uppercase tracking-wider mb-1.5 block">Email</label>
              <input
                type="email"
                required
                placeholder="nama@cashiergo.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="input-base w-full px-3 py-2.5 text-sm"
              />
            </div>
            <div className="col-span-2">
              <label className="text-[10px] font-600 text-3 uppercase tracking-wider mb-1.5 block">Gaji Bulanan (Rp)</label>
              <input
                type="number"
                required
                min="0"
                value={form.salary}
                onChange={(e) => setForm({ ...form, salary: Number(e.target.value) })}
                className="input-base w-full px-3 py-2.5 text-sm num"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-outline flex-1 py-2.5 text-sm font-600">Batal</button>
            <button type="submit" className="btn-primary flex-1 py-2.5 text-sm font-700">
              {isEdit ? 'Simpan Perubahan' : 'Tambah Karyawan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

/* ============================================================
   Delete Confirmation Modal
   ============================================================ */
function DeleteConfirmModal({
  employee,
  onClose,
  onConfirm,
}: {
  employee: Employee
  onClose: () => void
  onConfirm: () => void
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm anim-fade">
      <div className="card w-full max-w-sm mx-4 p-6">
        <div className="flex flex-col items-center gap-3 mb-5">
          <div className="w-14 h-14 rounded-full flex items-center justify-center" style={{ background: 'var(--red-dim)' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--red)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
              <line x1="10" y1="11" x2="10" y2="17" />
              <line x1="14" y1="11" x2="14" y2="17" />
            </svg>
          </div>
          <div className="text-center">
            <h2 className="text-base font-700 text-1">Hapus Karyawan?</h2>
            <p className="text-[11px] text-3 mt-1">
              <span className="font-600 text-1">{employee.name}</span> akan dihapus permanen.
              <br />Tindakan ini tidak dapat dibatalkan.
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          <button onClick={onClose} className="btn-outline flex-1 py-2.5 text-sm font-600">Batal</button>
          <button onClick={onConfirm} className="flex-1 py-2.5 text-sm font-700 rounded-lg transition-colors" style={{ background: 'var(--red)', color: '#fff' }}>
            Ya, Hapus
          </button>
        </div>
      </div>
    </div>
  )
}

/* ============================================================
   Employee Table Row
   ============================================================ */
function EmployeeRow({
  employee,
  shifts,
  onEdit,
  onDelete,
}: {
  employee: Employee
  shifts: Shift[]
  onEdit: (emp: Employee) => void
  onDelete: (emp: Employee) => void
}) {
  const employeeShifts = shifts.filter(s => s.employeeId === employee.id)
  const completedShifts = employeeShifts.filter(s => s.status === 'completed')

  return (
    <tr className="group transition-colors hover:bg-white/[0.02]" style={{ borderBottom: '1px solid var(--border)' }}>
      <td className="px-5 py-3.5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl" style={{ background: 'var(--surface-2)' }}>
            {employee.avatar}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-600 text-1 truncate">{employee.name}</p>
            <p className="text-[10px] text-3 mt-0.5">{employee.id} · {employee.email}</p>
          </div>
        </div>
      </td>
      <td className="px-5 py-3.5">
        <span className="badge" style={{ background: ROLE_COLORS[employee.role] + '18', color: ROLE_COLORS[employee.role] }}>
          {ROLE_LABELS[employee.role]}
        </span>
      </td>
      <td className="px-5 py-3.5">
        <span className="num text-xs text-2">{employee.phone}</span>
      </td>
      <td className="px-5 py-3.5">
        <span className="num text-sm font-600 text-1 tabular-nums">{fmtCurrency(employee.salary)}</span>
      </td>
      <td className="px-5 py-3.5">
        <span className="num text-sm font-600 tabular-nums" style={{ color: 'var(--green)' }}>{completedShifts.length}</span>
      </td>
      <td className="px-5 py-3.5">
        <span className="badge" style={{ background: employee.status === 'active' ? 'var(--green-dim)' : 'var(--surface-2)', color: employee.status === 'active' ? 'var(--green)' : 'var(--text-3)' }}>
          {employee.status === 'active' ? 'Aktif' : 'Non-aktif'}
        </span>
      </td>
      <td className="px-5 py-3.5 text-right">
        <div className="flex items-center justify-end gap-1">
          <button onClick={() => onEdit(employee)} className="w-8 h-8 flex items-center justify-center rounded-lg btn-ghost text-2 hover:text-blue transition-colors" title="Edit">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
          </button>
          <button onClick={() => onDelete(employee)} className="w-8 h-8 flex items-center justify-center rounded-lg btn-ghost text-2 hover:text-red transition-colors" title="Hapus">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
            </svg>
          </button>
        </div>
      </td>
    </tr>
  )
}

/* ============================================================
   Shift Schedule Row
   ============================================================ */
function ShiftRow({ shift, employees }: { shift: Shift; employees: Employee[] }) {
  const employee = employees.find(e => e.id === shift.employeeId)
  const statusColor = SHIFT_STATUS_COLORS[shift.status]

  return (
    <tr className="group transition-colors hover:bg-white/[0.02]" style={{ borderBottom: '1px solid var(--border)' }}>
      <td className="px-5 py-3.5">
        <span className="num text-[11px] font-600 text-2">{shift.id}</span>
      </td>
      <td className="px-5 py-3.5">
        <div className="flex items-center gap-2">
          <span className="text-lg">{employee?.avatar}</span>
          <span className="text-sm font-500 text-1">{employee?.name}</span>
        </div>
      </td>
      <td className="px-5 py-3.5">
        <span className="num text-xs text-2">{shift.date}</span>
      </td>
      <td className="px-5 py-3.5">
        <span className="num text-xs font-500 text-1">{shift.startTime} - {shift.endTime}</span>
      </td>
      <td className="px-5 py-3.5">
        <span className="badge" style={{ background: statusColor + '18', color: statusColor }}>
          {SHIFT_STATUS_LABELS[shift.status]}
        </span>
      </td>
      <td className="px-5 py-3.5">
        <span className="num text-sm font-600 text-1 tabular-nums">{fmtCurrency(shift.sales)}</span>
      </td>
      <td className="px-5 py-3.5">
        <span className="num text-sm font-600 text-1 tabular-nums">{fmtCurrency(shift.cashOpen)}</span>
      </td>
      <td className="px-5 py-3.5">
        {shift.cashClose !== null ? (
          <span className="num text-sm font-600 text-1 tabular-nums">{fmtCurrency(shift.cashClose)}</span>
        ) : (
          <span className="text-[11px] text-3">-</span>
        )}
      </td>
    </tr>
  )
}

/* ============================================================
   Main Employment Page
   ============================================================ */
export default function Employment() {
  const [employees, setEmployees] = useState<Employee[]>(INITIAL_EMPLOYEES)
  const [activeTab, setActiveTab] = useState<'employees' | 'shifts'>('employees')
  const [searchQuery, setSearchQuery] = useState('')

  // Modal states
  const [showAddModal, setShowAddModal] = useState(false)
  const [editEmployee, setEditEmployee] = useState<Employee | null>(null)
  const [deleteEmployee, setDeleteEmployee] = useState<Employee | null>(null)

  const filteredEmployees = useMemo(() => {
    return employees.filter(e =>
      !searchQuery || e.name.toLowerCase().includes(searchQuery.toLowerCase()) || e.role.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [employees, searchQuery])

  const filteredShifts = useMemo(() => {
    return SHIFTS.filter(s =>
      !searchQuery || s.date.includes(searchQuery) || s.status.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [searchQuery])

  const stats = useMemo(() => {
    const activeEmployees = employees.filter(e => e.status === 'active').length
    const todayShifts = SHIFTS.filter(s => s.date === '2026-07-30')
    const activeShifts = todayShifts.filter(s => s.status === 'active').length
    const totalPayroll = employees.filter(e => e.status === 'active').reduce((s, e) => s + e.salary, 0)
    return { activeEmployees, todayShifts: todayShifts.length, activeShifts, totalPayroll }
  }, [employees])

  // CRUD handlers
  const handleAddEmployee = (data: Omit<Employee, 'id'>) => {
    const newId = `E${String(employees.length + 1).padStart(3, '0')}`
    setEmployees(prev => [...prev, { ...data, id: newId }])
  }

  const handleEditEmployee = (data: Omit<Employee, 'id'> & { id?: string }) => {
    if (!data.id) return
    setEmployees(prev => prev.map(e => e.id === data.id ? { ...e, ...data } as Employee : e))
  }

  const handleDeleteEmployee = () => {
    if (!deleteEmployee) return
    setEmployees(prev => prev.filter(e => e.id !== deleteEmployee.id))
    setDeleteEmployee(null)
  }

  return (
    <div className="space-y-5 max-w-7xl mx-auto anim-fade">
      {/* Header */}
      <div className="flex flex-col xs:flex-row xs:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-700 text-1 tracking-tight">Employment</h1>
          <p className="text-sm text-3 mt-0.5">Kelola karyawan dan jadwal shift</p>
        </div>
        <button onClick={() => setShowAddModal(true)} className="btn-primary px-4 py-2.5 text-sm font-600 flex items-center gap-2 flex-shrink-0">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Tambah Karyawan
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: 'Karyawan Aktif', value: String(stats.activeEmployees), icon: '👥', color: 'var(--green)' },
          { label: 'Shift Hari Ini', value: String(stats.todayShifts), icon: '📅', color: 'var(--blue)' },
          { label: 'Shift Aktif', value: String(stats.activeShifts), icon: '⚡', color: 'var(--green)' },
          { label: 'Total Payroll', value: fmtCurrency(stats.totalPayroll), icon: '💰', color: 'var(--amber)' },
        ].map((s) => (
          <div key={s.label} className="card p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg" style={{ background: s.color + '18' }}>
                {s.icon}
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-500 text-3 uppercase tracking-wider truncate">{s.label}</p>
                <p className="num text-lg font-700 text-1 leading-tight">{s.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        {[
          { id: 'employees' as const, label: 'Karyawan', count: employees.length },
          { id: 'shifts' as const, label: 'Jadwal Shift', count: SHIFTS.length },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className="px-5 py-2.5 rounded-lg text-sm font-600 transition-all duration-150"
            style={
              activeTab === tab.id
                ? { background: 'var(--green)', color: '#fff' }
                : { background: 'var(--surface-2)', color: 'var(--text-2)' }
            }
          >
            {tab.label}
            <span className="ml-1.5 text-[10px] opacity-70">({tab.count})</span>
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-3 pointer-events-none">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </span>
        <input
          type="text"
          placeholder={activeTab === 'employees' ? 'Cari karyawan...' : 'Cari shift...'}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="input-base w-full pl-9 pr-4 py-2.5 text-sm"
        />
      </div>

      {/* Content */}
      {activeTab === 'employees' ? (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)' }}>
                  {['Karyawan', 'Role', 'Telepon', 'Gaji', 'Shift', 'Status', 'Aksi'].map((h) => (
                    <th key={h} className="text-left px-5 py-3.5 text-[10px] font-600 text-3 uppercase tracking-wider last:text-right">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredEmployees.map((employee) => (
                  <EmployeeRow
                    key={employee.id}
                    employee={employee}
                    shifts={SHIFTS}
                    onEdit={setEditEmployee}
                    onDelete={setDeleteEmployee}
                  />
                ))}
                {filteredEmployees.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-5 py-12 text-center">
                      <p className="text-sm text-3">Tidak ada karyawan ditemukan</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="px-5 py-3 flex items-center justify-between" style={{ borderTop: '1px solid var(--border)' }}>
            <p className="text-[11px] text-3">Menampilkan {filteredEmployees.length} dari {employees.length} karyawan</p>
          </div>
        </div>
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)' }}>
                  {['ID', 'Karyawan', 'Tanggal', 'Jam', 'Status', 'Penjualan', 'Modal', 'Tutup'].map((h) => (
                    <th key={h} className="text-left px-5 py-3.5 text-[10px] font-600 text-3 uppercase tracking-wider">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredShifts.map((shift) => (
                  <ShiftRow key={shift.id} shift={shift} employees={employees} />
                ))}
                {filteredShifts.length === 0 && (
                  <tr>
                    <td colSpan={8} className="px-5 py-12 text-center">
                      <p className="text-sm text-3">Tidak ada shift ditemukan</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="px-5 py-3 flex items-center justify-between" style={{ borderTop: '1px solid var(--border)' }}>
            <p className="text-[11px] text-3">Menampilkan {filteredShifts.length} dari {SHIFTS.length} shift</p>
          </div>
        </div>
      )}

      {/* Modals */}
      {showAddModal && (
        <EmployeeFormModal onClose={() => setShowAddModal(false)} onSave={handleAddEmployee} />
      )}
      {editEmployee && (
        <EmployeeFormModal employee={editEmployee} onClose={() => setEditEmployee(null)} onSave={handleEditEmployee} />
      )}
      {deleteEmployee && (
        <DeleteConfirmModal employee={deleteEmployee} onClose={() => setDeleteEmployee(null)} onConfirm={handleDeleteEmployee} />
      )}
    </div>
  )
}
