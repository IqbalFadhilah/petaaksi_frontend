import { Map } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import logoWeb from '../assets/logo-web-petaaksi.png' 

export default function Header({ showPublicMapButton = false }) {
  const navigate = useNavigate()

  return (
    <header className="header">
      <div className="brand-wrapper">
        {/* 🚀 Cukup panggil gambar logonya langsung, tanpa div text atau span lagi */}
        <img 
          src={logoWeb} 
          alt="PetaAksi Logo" 
          onClick={() => navigate('/peta')} 
          style={{ 
            height: '40px', // Sedikit dinaikkan ke 40px biar lebih kelihatan tegas
            objectFit: 'contain', 
            cursor: 'pointer'
          }} 
        />
      </div>

      {showPublicMapButton && (
        <div className="view-toggle">
          <button onClick={() => navigate('/peta')}>
            <Map size={16} /> Kembali ke Peta Publik
          </button>
        </div>
      )}
    </header>
  )
}
