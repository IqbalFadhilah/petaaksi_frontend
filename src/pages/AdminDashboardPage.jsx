import { useMemo, useState } from 'react'
import GlobalLightbox from '../components/GlobalLightbox'
import Header from '../components/Header'
import HistoryReportTable from '../components/admin/HistoryReportTable'
import PendingMap from '../components/admin/PendingMap'
import ReportGroupTable from '../components/admin/ReportGroupTable'
import Sidebar from '../components/admin/Sidebar'
import StatsGrid from '../components/admin/StatsGrid'
import { useReports } from '../hooks/useReports'
import { updateReportStatus } from '../services/reportService'
import { buildReportGroups, buildReportStats } from '../utils/clustering'

export default function AdminDashboardPage() {
  const { laporan, refreshReports } = useReports({ admin: true })
  const { laporan: laporanHistory } = useReports({ admin: true, archived: true })
  const [expandedRows, setExpandedRows] = useState([])
  const [fullscreenImage, setFullscreenImage] = useState(null)
  const [activeView, setActiveView] = useState('overview')

  const groupsData = useMemo(() => buildReportGroups(laporan), [laporan])
  const stats = useMemo(() => buildReportStats(laporan, groupsData), [laporan, groupsData])

  const toggleExpand = (id) => {
    setExpandedRows((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
  }

  const handleSelectGroup = (group) => {
    setExpandedRows((prev) => (prev.includes(group.id) ? prev : [...prev, group.id]))
  }

  const handleApproveGrup = async (reportList) => {
    try {
      await Promise.all(reportList.map((item) => updateReportStatus(item.id, 'verified')))
      refreshReports()
      alert('Satu grup laporan berhasil diverifikasi publik!')
    } catch (error) {
      console.error('Grup gagal di-approve:', error)
    }
  }

  const handleRejectGrup = async (reportList) => {
    try {
      await Promise.all(reportList.map((item) => updateReportStatus(item.id, 'rejected')))
      refreshReports()
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
      refreshReports()
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
              <PendingMap groups={groupsData.pending} onSelectGroup={handleSelectGroup} />
              <ReportGroupTable
                groups={groupsData.pending}
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
