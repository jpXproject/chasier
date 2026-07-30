import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext'
import DashboardLayout from './layout/DashboardLayout'
import Dashboard from './pages/Dashboard'
import POS from './pages/POS'
import Inventory from './pages/Inventory'
import Purchasing from './pages/Purchasing'
import Employment from './pages/Employment'
import Expenses from './pages/Expenses'
import Reports from './pages/Reports'
import Settings from './pages/Settings'
import CustomerDisplay from './pages/CustomerDisplay'

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<DashboardLayout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/pos" element={<POS />} />
            <Route path="/inventory" element={<Inventory />} />
            <Route path="/purchasing" element={<Purchasing />} />
            <Route path="/employment" element={<Employment />} />
            <Route path="/expenses" element={<Expenses />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/settings" element={<Settings />} />
          </Route>
          {/* Standalone routes (no sidebar/header) */}
          <Route path="/display" element={<CustomerDisplay />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  )
}
