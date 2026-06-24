import { useMemo, useState } from 'react'
import GlobalLightbox from '../components/GlobalLightbox'
import Header from '../components/Header'
import PendingMap from '../components/admin/PendingMap'
import ReportGroupTable from '../components/admin/ReportGroupTable'
import Sidebar from '../components/admin/Sidebar'
import StatsGrid from '../components/admin/StatsGrid'
import { useReports } from '../hooks/useReports'
import { updateReportStatus } from '../services/reportService'
import { buildReportGroups, buildReportStats } from '../utils/clustering'

export default function AdminDashboardPage() {
  const { laporan, refreshReports } = useReports()
  const [expandedRows, setExpandedRows] = useState([])
  const [fullscreenImage, setFullscreenImage] = useState(null)

  const groupsData = useMemo(() => buildReportGroups(laporan), [laporan])
  const stats = useMemo(() => buildReportStats(laporan, groupsData), [laporan, groupsData])

  const toggleExpand = (id) => {
    setExpandedRows((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
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

  return (
    <div className="app-shell">
      <Header showPublicMapButton />

      <section className="dashboard-layout">
        <Sidebar />

        <main className="dashboard-main">
          <StatsGrid stats={stats} />
          <PendingMap laporan={laporan} />
          <ReportGroupTable
            groups={groupsData.pending}
            expandedRows={expandedRows}
            onToggleExpand={toggleExpand}
            onApproveGroup={handleApproveGrup}
            onRejectGroup={handleRejectGrup}
            onImageClick={setFullscreenImage}
          />
        </main>
      </section>

      <GlobalLightbox imageUrl={fullscreenImage} onClose={() => setFullscreenImage(null)} />
    </div>
  )
}
