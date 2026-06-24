import {
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Clock3,
  MapPinned,
  ShieldCheck,
} from 'lucide-react'
import { getUploadUrl } from '../../services/reportService'

export default function ReportGroupTable({
  groups,
  expandedRows,
  onToggleExpand,
  onApproveGroup,
  onRejectGroup,
  onImageClick,
}) {
  return (
    <div className="panel">
      <div className="panel-header">
        <h2>Validasi Laporan Masuk</h2>
        <p>Sistem otomatis mengelompokkan laporan dalam radius kriteria formula Haversine.</p>
      </div>

      <div className="group-table">
        {groups.map((group) => {
          const expanded = expandedRows.includes(group.id)

          return (
            <div key={group.id} className="group-card">
              <div className="group-parent">
                <div className="group-main">
                  <button className="expand-btn" onClick={() => onToggleExpand(group.id)}>
                    {expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </button>
                  <div>
                    <h3>{group.title}</h3>
                    <div className="meta-row">
                      <span>
                        <Clock3 size={14} /> {group.time}
                      </span>
                      <span>
                        <MapPinned size={14} /> {group.location}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="group-badges">
                  <span className="badge neutral">Konsensus: {group.reports.length} Pelapor</span>
                  {group.reports.length > 1 ? (
                    <span className="badge green">
                      <ShieldCheck size={14} /> Validitas Tinggi
                    </span>
                  ) : (
                    <span className="badge yellow">
                      <AlertTriangle size={14} /> Kredibilitas Tunggal
                    </span>
                  )}
                </div>

                <div className="group-actions">
                  <button className="approve-btn" onClick={() => onApproveGroup(group.reports)}>
                    Approve
                  </button>
                  <button className="reject-btn" onClick={() => onRejectGroup(group.reports)}>
                    Tolak
                  </button>
                </div>
              </div>

              <div className={`child-container ${expanded ? 'expanded' : ''}`}>
                {group.reports.map((report) => (
                  <div key={report.id} className="child-report">
                    <div className="child-main-info">
                      <img
                        src={getUploadUrl(report.image_url)}
                        alt="Bukti Lapangan"
                        className="child-thumb"
                        onClick={() => onImageClick(getUploadUrl(report.image_url))}
                      />
                      <div>
                        <strong>Kontributor: {report.pelapor}</strong>
                        <p>{report.description}</p>
                        <small style={{ fontFamily: 'monospace', color: '#999' }}>
                          Lat: {report.latitude} | Lng: {report.longitude}
                        </small>
                      </div>
                    </div>
                    <span className="child-status">Sub-Node Laporan</span>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
