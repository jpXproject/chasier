import { useState } from 'react'
import { useTheme } from '../context/ThemeContext'

/* ============================================================
   Settings Section Component
   ============================================================ */
function SettingsSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="card p-5">
      <h3 className="text-sm font-600 text-1 mb-4">{title}</h3>
      {children}
    </div>
  )
}

/* ============================================================
   Toggle Switch Component
   ============================================================ */
function ToggleSwitch({
  enabled, onChange, label, description,
}: {
  enabled: boolean
  onChange: (v: boolean) => void
  label: string
  description?: string
}) {
  return (
    <div className="flex items-center justify-between py-2">
      <div className="min-w-0 flex-1 mr-3">
        <p className="text-sm font-500 text-1">{label}</p>
        {description && <p className="text-[11px] text-3 mt-0.5">{description}</p>}
      </div>
      <button
        onClick={() => onChange(!enabled)}
        className="relative w-11 h-6 rounded-full transition-colors duration-200 flex-shrink-0"
        style={{ background: enabled ? 'var(--green)' : 'var(--surface-3)' }}
      >
        <span
          className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full transition-transform duration-200"
          style={{
            background: '#fff',
            transform: enabled ? 'translateX(20px)' : 'translateX(0)',
            boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
          }}
        />
      </button>
    </div>
  )
}

/* ============================================================
   Settings Page
   ============================================================ */
export default function Settings() {
  const { isDark, toggleTheme } = useTheme()

  const [storeProfile, setStoreProfile] = useState({
    name: 'CashierGo Coffee',
    address: 'Jl. Sudirman No. 123, Jakarta',
    phone: '+62 812-3456-7890',
    email: 'info@cashiergo.com',
  })

  const [notifications, setNotifications] = useState({
    lowStock: true,
    dailyReport: true,
    newTransaction: false,
    systemUpdate: true,
  })

  const [receipt, setReceipt] = useState({
    showLogo: true,
    showTax: true,
    printAutomatically: false,
    paperSize: '58mm',
  })

  return (
    <div className="space-y-5 max-w-4xl mx-auto anim-fade">
      {/* Header */}
      <div>
        <h1 className="text-xl font-700 text-1 tracking-tight">Settings</h1>
        <p className="text-sm text-3 mt-0.5">Kelola profil toko dan pengaturan aplikasi</p>
      </div>

      {/* Store Profile */}
      <SettingsSection title="Profil Toko">
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-600 text-3 uppercase tracking-wider mb-1.5 block">Nama Toko</label>
              <input
                type="text"
                value={storeProfile.name}
                onChange={(e) => setStoreProfile({ ...storeProfile, name: e.target.value })}
                className="input-base w-full px-3 py-2.5 text-sm"
              />
            </div>
            <div>
              <label className="text-[10px] font-600 text-3 uppercase tracking-wider mb-1.5 block">Email</label>
              <input
                type="email"
                value={storeProfile.email}
                onChange={(e) => setStoreProfile({ ...storeProfile, email: e.target.value })}
                className="input-base w-full px-3 py-2.5 text-sm"
              />
            </div>
          </div>
          <div>
            <label className="text-[10px] font-600 text-3 uppercase tracking-wider mb-1.5 block">Alamat</label>
            <input
              type="text"
              value={storeProfile.address}
              onChange={(e) => setStoreProfile({ ...storeProfile, address: e.target.value })}
              className="input-base w-full px-3 py-2.5 text-sm"
            />
          </div>
          <div>
            <label className="text-[10px] font-600 text-3 uppercase tracking-wider mb-1.5 block">Telepon</label>
            <input
              type="tel"
              value={storeProfile.phone}
              onChange={(e) => setStoreProfile({ ...storeProfile, phone: e.target.value })}
              className="input-base w-full px-3 py-2.5 text-sm"
            />
          </div>
          <div className="pt-2">
            <button className="btn-primary px-5 py-2.5 text-sm font-600">Simpan Profil</button>
          </div>
        </div>
      </SettingsSection>

      {/* Appearance */}
      <SettingsSection title="Tampilan">
        <div className="space-y-1">
          <ToggleSwitch
            enabled={isDark}
            onChange={toggleTheme}
            label="Mode Gelap"
            description="Aktifkan tema gelap untuk tampilan yang lebih nyaman"
          />
          <div className="flex items-center justify-between py-3 mt-2" style={{ borderTop: '1px solid var(--border)' }}>
            <div className="min-w-0 flex-1 mr-3">
              <p className="text-sm font-500 text-1">Tema Aktif</p>
              <p className="text-[11px] text-3 mt-0.5">Pilih skema warna default</p>
            </div>
            <div className="flex items-center gap-2">
              {[
                { color: 'var(--green)', label: 'Hijau' },
                { color: 'var(--blue)', label: 'Biru' },
                { color: 'var(--amber)', label: 'Emas' },
              ].map((theme) => (
                <button
                  key={theme.label}
                  className="w-8 h-8 rounded-full border-2 transition-all"
                  style={{
                    background: theme.color,
                    borderColor: theme.color === 'var(--green)' ? 'var(--green-border)' : 'transparent',
                  }}
                  title={theme.label}
                />
              ))}
            </div>
          </div>
        </div>
      </SettingsSection>

      {/* Notifications */}
      <SettingsSection title="Notifikasi">
        <div className="space-y-1">
          <ToggleSwitch
            enabled={notifications.lowStock}
            onChange={(v) => setNotifications({ ...notifications, lowStock: v })}
            label="Stok Menipis"
            description="Notifikasi ketika stok produk mencapai batas minimum"
          />
          <ToggleSwitch
            enabled={notifications.dailyReport}
            onChange={(v) => setNotifications({ ...notifications, dailyReport: v })}
            label="Laporan Harian"
            description="Ringkasan penjualan dikirimkan setiap hari"
          />
          <ToggleSwitch
            enabled={notifications.newTransaction}
            onChange={(v) => setNotifications({ ...notifications, newTransaction: v })}
            label="Transaksi Baru"
            description="Notifikasi untuk setiap transaksi baru"
          />
          <ToggleSwitch
            enabled={notifications.systemUpdate}
            onChange={(v) => setNotifications({ ...notifications, systemUpdate: v })}
            label="Pembaruan Sistem"
            description="Pemberitahuan ketika ada pembaruan aplikasi"
          />
        </div>
      </SettingsSection>

      {/* Receipt Settings */}
      <SettingsSection title="Struk & Cetak">
        <div className="space-y-1">
          <ToggleSwitch
            enabled={receipt.showLogo}
            onChange={(v) => setReceipt({ ...receipt, showLogo: v })}
            label="Tampilkan Logo"
            description="Logo toko pada struk cetak"
          />
          <ToggleSwitch
            enabled={receipt.showTax}
            onChange={(v) => setReceipt({ ...receipt, showTax: v })}
            label="Tampilkan Pajak"
            description="Rincian pajak pada struk"
          />
          <ToggleSwitch
            enabled={receipt.printAutomatically}
            onChange={(v) => setReceipt({ ...receipt, printAutomatically: v })}
            label="Cetak Otomatis"
            description="Cetak struk setelah pembayaran berhasil"
          />
          <div className="flex items-center justify-between py-3" style={{ borderTop: '1px solid var(--border)' }}>
            <div className="min-w-0 flex-1 mr-3">
              <p className="text-sm font-500 text-1">Ukuran Kertas</p>
              <p className="text-[11px] text-3 mt-0.5">Pilih ukuran kertas printer</p>
            </div>
            <select
              value={receipt.paperSize}
              onChange={(e) => setReceipt({ ...receipt, paperSize: e.target.value })}
              className="input-base px-3 py-2 text-sm w-32"
            >
              <option value="58mm">58mm</option>
              <option value="80mm">80mm</option>
            </select>
          </div>
        </div>
      </SettingsSection>

      {/* About */}
      <SettingsSection title="Tentang Aplikasi">
        <div className="space-y-3">
          <div className="flex items-center gap-4 p-4 rounded-xl" style={{ background: 'var(--surface-2)' }}>
            <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: 'var(--green-dim)', color: 'var(--green)' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-700 text-1">CashierGo</p>
              <p className="text-[11px] text-3">POS & Business Management System</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-xl" style={{ background: 'var(--surface-2)' }}>
              <p className="text-3 mb-0.5">Versi</p>
              <p className="font-600 text-1 num">0.1.0</p>
            </div>
            <div className="p-3 rounded-xl" style={{ background: 'var(--surface-2)' }}>
              <p className="text-3 mb-0.5">Build</p>
              <p className="font-600 text-1 num">2026.07.30</p>
            </div>
          </div>
          <div className="pt-2">
            <button className="btn-outline w-full py-2.5 text-sm font-500">
              Periksa Pembaruan
            </button>
          </div>
        </div>
      </SettingsSection>
    </div>
  )
}
