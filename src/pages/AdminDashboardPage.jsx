import { useMemo, useState } from 'react'
import GlobalLightbox from '../components/GlobalLightbox'
import Header from '../components/Header'
import HistoryReportTable from '../components/admin/HistoryReportTable'
import PendingMap from '../components/admin/PendingMap'
import ReportGroupTable from '../components/admin/ReportGroupTable'
import Sidebar from '../components/admin/Sidebar'
import StatsGrid from '../components/admin/StatsGrid'
import { useReportClusters } from '../hooks/useReportClusters'
import { useReports } from '../hooks/useReports'
import { updateClusterStatus } from '../services/clusterService'
import { updateReportStatus } from '../services/reportService'

export default function AdminDashboardPage() {
  const { clusters, refreshClusters } = useReportClusters({ admin: true })
  const { laporan: laporanHistory } = useReports({ admin: true, archived: true })
  const [expandedRows, setExpandedRows] = useState([])
  const [fullscreenImage, setFullscreenImage] = useState(null)
  const [activeView, setActiveView] = useState('overview')

  const pendingGroups = useMemo(
    () => clusters
      .filter((cluster) => cluster.status === 'pending')
      .sort((first, second) => second.supporting_source_count - first.supporting_source_count),
    [clusters],
  )
  const stats = useMemo(() => ({
    totalGroups: clusters.length,
    totalReports: clusters.reduce((total, cluster) => total + cluster.reports.length, 0),
    approved: clusters.reduce(
      (total, cluster) => total + cluster.reports.filter((report) => report.status === 'verified').length,
      0,
    ),
    pending: clusters.reduce(
      (total, cluster) => total + cluster.reports.filter((report) => report.status === 'pending').length,
      0,
    ),
  }), [clusters])

  const toggleExpand = (id) => {
    setExpandedRows((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
  }

  const handleSelectGroup = (group) => {
    setExpandedRows((prev) => (prev.includes(group.id) ? prev : [...prev, group.id]))
  }

  const handleApproveGrup = async (clusterId) => {
    try {
      await updateClusterStatus(clusterId, 'verified')
      refreshClusters()
      alert('Satu grup laporan berhasil diverifikasi publik!')
    } catch (error) {
      console.error('Grup gagal di-approve:', error)
    }
  }

  const handleRejectGrup = async (clusterId) => {
    try {
      await updateClusterStatus(clusterId, 'rejected')
      refreshClusters()
      alert('Satu grup laporan ditolak.')
    } catch (error) {
      console.error('Grup gagal ditolak:', error)
    }
  }

  const handleRejectReport = async (report) => {
    const shouldReject = window.confirm(
      `Tolak laporan dari ${report.pelapor || 'pelapor ini'}? Pelapor akan menerima notifikasi.`,
    )

    if (!shouldReject) return

    try {
      await updateReportStatus(report.id, 'rejected')
      refreshClusters()
      alert('Laporan berhasil ditolak dan notifikasi telah diproses.')
    } catch (error) {
      console.error('Laporan gagal ditolak:', error)
      alert('Gagal menolak laporan.')
    }
  }

  return (
    <div className="app-shell">
      <Header showPublicMapButton />

      <section className="dashboard-layout">
        <Sidebar activeView={activeView} onChangeView={setActiveView} />

        <main className="dashboard-main">
          {activeView === 'overview' ? (
            <>
              <StatsGrid stats={stats} />
              <PendingMap groups={pendingGroups} onSelectGroup={handleSelectGroup} />
              <ReportGroupTable
                groups={pendingGroups}
                expandedRows={expandedRows}
                onToggleExpand={toggleExpand}
                onApproveGroup={handleApproveGrup}
                onRejectGroup={handleRejectGrup}
                onRejectReport={handleRejectReport}
                onImageClick={setFullscreenImage}
              />
            </>
          ) : (
            <HistoryReportTable reports={laporanHistory} onImageClick={setFullscreenImage} />
          )}
        </main>
      </section>

      <GlobalLightbox imageUrl={fullscreenImage} onClose={() => setFullscreenImage(null)} />
    </div>
  )
}
