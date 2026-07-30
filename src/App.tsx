import { BrowserRouter, Routes, Route } from 'react-router-dom'
import DashboardLayout from './layout/DashboardLayout'
import Dashboard from './pages/Dashboard'
import POS from './pages/POS'
import DesignSystem from './pages/DesignSystem'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Dashboard (with sidebar layout) */}
        <Route element={<DashboardLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/pos" element={<POS />} />
          <Route path="/inventory" element={<div className="p-12 text-center text-secondary"><p className="text-lg font-bold">Inventory Module</p><p className="text-sm mt-2">Coming soon...</p></div>} />
          <Route path="/shift" element={<div className="p-12 text-center text-secondary"><p className="text-lg font-bold">Shift Management</p><p className="text-sm mt-2">Coming soon...</p></div>} />
          <Route path="/reports" element={<div className="p-12 text-center text-secondary"><p className="text-lg font-bold">Reports</p><p className="text-sm mt-2">Coming soon...</p></div>} />
          <Route path="/settings" element={<div className="p-12 text-center text-secondary"><p className="text-lg font-bold">Settings</p><p className="text-sm mt-2">Coming soon...</p></div>} />
        </Route>

        {/* Standalone pages (no sidebar) */}
        <Route path="/design-system" element={<DesignSystem />} />
      </Routes>
    </BrowserRouter>
  )
}
