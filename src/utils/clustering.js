export const buildReportGroups = (laporan) => {
  const pendingReports = laporan.filter((item) => item.status === 'pending')
  const verifiedReports = laporan.filter((item) => item.status === 'verified')

  const makeClusters = (targetArray, isPending) => {
    const clusters = []

    targetArray.forEach((report) => {
      const found = clusters.find((group) => {
        const latDiff = Math.abs(group.latitude - report.latitude)
        const lngDiff = Math.abs(group.longitude - report.longitude)
        return latDiff < 0.001 && lngDiff < 0.001
      })

      if (found) {
        found.reports.push(report)
        return
      }

      clusters.push({
        id: `group-${report.id}`,
        title: isPending
          ? `Indikasi Aksi Massa: ${report.description.substring(0, 30)}...`
          : 'Aksi Massa di Kawasan Terkait',
        location: 'Bandung, Jawa Barat',
        time: report.created_at
          ? `${new Date(report.created_at).toLocaleTimeString('id-ID', {
              hour: '2-digit',
              minute: '2-digit',
            })} WIB`
          : '09:14 WIB',
        radius: report.nearby_count > 0 ? `${Math.floor(Math.random() * 30) + 20}m` : '100m',
        latitude: report.latitude,
        longitude: report.longitude,
        status: report.nearby_count > 0 || targetArray.length > 1 ? 'high' : 'low',
        image_url: report.image_url,
        description: report.description,
        reports: [report],
      })
    })

    return clusters
  }

  return {
    pending: makeClusters(pendingReports, true),
    verified: makeClusters(verifiedReports, false),
  }
}

export const buildReportStats = (laporan, groupsData) => ({
  totalGroups: groupsData.pending.length,
  totalReports: laporan.length,
  approved: laporan.filter((report) => report.status === 'verified').length,
  pending: laporan.filter((report) => report.status === 'pending').length,
})
