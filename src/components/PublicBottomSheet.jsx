import { Clock3, X } from 'lucide-react'
import { getUploadUrl } from '../services/reportService'

export default function PublicBottomSheet({ selectedGroup, onClose, onImageClick }) {
  if (!selectedGroup) return null

  const firstReport = selectedGroup.reports[0]

  return (
    <div className="tactical-bottom-sheet">
      <button className="sheet-close-btn" onClick={onClose}>
        <X size={18} />
      </button>

      <div className="sheet-tag">DEMONSTRASI</div>
      <h2 className="sheet-title">
        {firstReport?.title || firstReport?.description.substring(0, 45) || 'Aksi Massa Lapangan'}
      </h2>

      <div className="sheet-badge-row">
        <span className="sheet-badge-success">
          <span className="dot-circle">OK</span> Terverifikasi Spasial (Validitas Tinggi)
        </span>
      </div>

      {firstReport?.image_url && (
        <div className="sheet-image-container">
          <img
            src={getUploadUrl(firstReport.image_url)}
            alt="Bukti Lapangan"
            className="sheet-img"
            onClick={() => onImageClick(getUploadUrl(firstReport.image_url))}
          />
        </div>
      )}

      <p className="sheet-description">
        {firstReport?.description ||
          'Kumpulan massa terdeteksi mengadakan aksi penyampaian pendapat di titik lokasi koordinat.'}
      </p>

      <div className="sheet-metrics-grid">
        <div className="metric-box">
          <span className="metric-label">Sumber</span>
          <div className="metric-value">
            {selectedGroup.reports.length} <span className="metric-sub">warga</span>
          </div>
        </div>
        <div className="metric-box">
          <span className="metric-label">Radius</span>
          <div className="metric-value">{selectedGroup.radius}</div>
        </div>
      </div>

      <div className="sheet-consensus-box">
        <strong>Didukung oleh {selectedGroup.reports.length - 1} laporan warga lainnya</strong> di
        radius {selectedGroup.radius}. Sistem spasial memvalidasi semua titik berada dalam klaster
        yang sama.
      </div>

      {selectedGroup.reports.length > 1 && (
        <div className="sheet-child-reports-section">
          <h4 className="child-reports-title">Detail Laporan Pendukung</h4>
          <div className="child-reports-list">
            {selectedGroup.reports.slice(1).map((child, index) => (
              <div key={`child-node-${index}`} className="child-report-item">
                <div className="child-avatar">
                  {child.pelapor ? child.pelapor.charAt(0).toUpperCase() : 'A'}
                </div>
                <div className="child-content">
                  <span className="child-name">{child.pelapor || 'Anonim'}</span>
                  {child.title && <span className="child-title">{child.title}</span>}
                  <p className="child-desc">{child.description}</p>
                </div>

                {child.image_url && (
                  <img
                    src={getUploadUrl(child.image_url)}
                    alt="Bukti Laporan"
                    className="child-report-thumb"
                    onClick={() => onImageClick(getUploadUrl(child.image_url))}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="sheet-footer-time">
        <Clock3 size={12} /> Laporan pertama: {selectedGroup.time}
      </div>
    </div>
  )
}
