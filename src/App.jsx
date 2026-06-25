import { BrowserRouter as Router, Navigate, Route, Routes } from 'react-router-dom'
import AdminGuard from './components/AdminGuard'
import AdminDashboardPage from './pages/AdminDashboardPage'
import PublicMapPage from './pages/PublicMapPage'
import './App.css'
import L from 'leaflet';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// Hapus konfigurasi url default bawaan Leaflet yang rusak
delete L.Icon.Default.prototype._getIconUrl;

// Satukan kembali menggunakan file yang sudah di-import oleh Vite
L.Icon.Default.mergeOptions({
    iconUrl: markerIcon,
    iconRetinaUrl: markerIcon2x,
    shadowUrl: markerShadow,
});

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
