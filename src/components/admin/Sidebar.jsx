import { Database, LayoutDashboard, LogOut, MapPinned, ShieldCheck } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function Sidebar() {
  const navigate = useNavigate()

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <MapPinned size={18} /> <span>Menu Validasi</span>
      </div>
      <nav className="sidebar-nav">
        <button className="nav-item active">
          <LayoutDashboard size={18} /> Overview
        </button>
        <button className="nav-item">
          <ShieldCheck size={18} /> Validasi Spasial
        </button>
        <button className="nav-item">
          <Database size={18} /> Database SQLite
        </button>
        <button
          className="nav-item"
          onClick={() => navigate('/')}
          style={{ marginTop: 'auto', color: '#f87171' }}
        >
          <LogOut size={18} /> Keluar / Public Map
        </button>
      </nav>
    </aside>
  )
}
