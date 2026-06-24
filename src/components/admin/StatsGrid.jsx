import { AlertTriangle, CheckCircle2, Layers3, Users } from 'lucide-react'

export default function StatsGrid({ stats }) {
  return (
    <div className="stats-grid">
      <div className="stat-card">
        <Layers3 size={20} />
        <div>
          <h3>{stats.totalGroups}</h3>
          <span>Kluster Insiden</span>
        </div>
      </div>
      <div className="stat-card">
        <Users size={20} />
        <div>
          <h3>{stats.totalReports}</h3>
          <span>Total Lap. Warga</span>
        </div>
      </div>
      <div className="stat-card">
        <CheckCircle2 size={20} />
        <div>
          <h3>{stats.approved}</h3>
          <span>Laporan Aktif</span>
        </div>
      </div>
      <div className="stat-card">
        <AlertTriangle size={20} />
        <div>
          <h3>{stats.pending}</h3>
          <span>Butuh Validasi</span>
        </div>
      </div>
    </div>
  )
}
