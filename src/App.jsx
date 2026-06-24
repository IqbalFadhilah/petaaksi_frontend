import { BrowserRouter as Router, Navigate, Route, Routes } from 'react-router-dom'
import AdminGuard from './components/AdminGuard'
import AdminDashboardPage from './pages/AdminDashboardPage'
import PublicMapPage from './pages/PublicMapPage'
import './App.css'

function AppContent() {
  return (
    <Routes>
      <Route path="/" element={<PublicMapPage />} />
      <Route
        path="/admin"
        element={
          <AdminGuard>
            <AdminDashboardPage />
          </AdminGuard>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  )
}
