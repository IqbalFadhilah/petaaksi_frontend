import { Map, MapPinned } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function Header({ showPublicMapButton = false }) {
  const navigate = useNavigate()

  return (
    <header className="header">
      <div className="brand-wrapper">
        <div className="app-logo">
          <MapPinned size={18} />
        </div>
        <div className="brand-text">
          <h1>PetaAksi</h1>
          <span>Spatially-Validated Crowdsourcing Platform</span>
        </div>
      </div>

      {showPublicMapButton && (
        <div className="view-toggle">
          <button onClick={() => navigate('/')}>
            <Map size={16} /> Kembali ke Peta Publik
          </button>
        </div>
      )}
    </header>
  )
}
