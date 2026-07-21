import { History, LayoutDashboard, LogOut, MapPinned } from 'lucide-react'

export default function Sidebar({ activeView, onChangeView }) {
  
  // 🚪 Fungsi untuk Hapus Token JWT dan Kembali ke Peta Publik
  const handleLogout = () => {
    localStorage.removeItem('token') // Menghapus kartu akses login admin
    window.location.href = '/' // Pindah ke halaman utama (Public Map) & refresh total
  }

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <MapPinned size={18} /> <span>Menu Validasi</span>
      </div>
      <nav className="sidebar-nav">
        <button
          className={`nav-item ${activeView === 'overview' ? 'active' : ''}`}
          onClick={() => onChangeView('overview')}
        >
          <LayoutDashboard size={18} /> Overview
        </button>
        <button
          className={`nav-item ${activeView === 'history' ? 'active' : ''}`}
          onClick={() => onChangeView('history')}
        >
          <History size={18} /> History Laporan
        </button>
        
        <button
          className="nav-item"
          onClick={handleLogout} 
          style={{ marginTop: 'auto', color: '#f87171', cursor: 'pointer' }}
        >
          <LogOut size={18} /> Keluar
        </button>
      </nav>
    </aside>
  )
}
