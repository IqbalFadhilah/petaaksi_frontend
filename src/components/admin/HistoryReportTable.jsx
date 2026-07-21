import { CalendarDays, MapPinned } from 'lucide-react'
import { getUploadUrl } from '../../services/reportService'

const formatDate = (value) => {
  if (!value) return '-'

  return new Intl.DateTimeFormat('id-ID', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value))
}

export default function HistoryReportTable({ reports, onImageClick }) {
  return (
    <section className="history-panel panel">
      <div className="panel-header">
        <h2>History Laporan</h2>
        <p>Arsip audit laporan yang telah melewati masa tampil 24 jam. Data tidak dihapus.</p>
      </div>

      {reports.length === 0 ? (
        <div className="history-empty">Belum ada laporan yang masuk ke arsip.</div>
      ) : (
        <div className="history-list">
          {reports.map((report) => (
            <article className="history-report" key={report.id}>
              {report.image_url && (
                <img
                  src={getUploadUrl(report.image_url)}
                  alt={`Bukti ${report.title || 'laporan'}`}
                  className="history-thumb"
                  onClick={() => onImageClick(getUploadUrl(report.image_url))}
                />
              )}
              <div className="history-content">
                <div className="history-heading">
                  <h3>{report.title || 'Laporan tanpa judul'}</h3>
                  <span className={`history-status ${report.status}`}>{report.status}</span>
                </div>
                <p>{report.description}</p>
                <div className="history-meta">
                  <span><CalendarDays size={14} /> {formatDate(report.created_at)}</span>
                  <span><MapPinned size={14} /> {report.latitude}, {report.longitude}</span>
                  <span>Pelapor: {report.pelapor || 'Anonim'}</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  )
}
