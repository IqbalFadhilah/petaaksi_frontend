import { getValidityInfo } from './reportHelper'

const CLUSTER_RADIUS_METERS = 100
const CLUSTER_TIME_WINDOW_MS = 3 * 60 * 60 * 1000

// Menghitung jarak antartitik dengan rumus Haversine (satuan meter).
const calculateHaversineDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371000 // Jari-jari bumi dalam meter
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLon = ((lon2 - lon1) * Math.PI) / 180
  
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2)

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return Math.round(R * c) // Mengembalikan jarak riil dalam Meter
}

const getReportTimestamp = (report) => {
  const timestamp = new Date(report.created_at).getTime()
  return Number.isFinite(timestamp) ? timestamp : null
}

const getClusterCenter = (reports) => ({
  latitude:
    reports.reduce((total, report) => total + Number(report.latitude), 0) /
    reports.length,
  longitude:
    reports.reduce((total, report) => total + Number(report.longitude), 0) /
    reports.length,
})

const getMaxDistanceFromCenter = (reports, center) =>
  Math.max(
    0,
    ...reports.map((report) =>
      calculateHaversineDistance(
        center.latitude,
        center.longitude,
        Number(report.latitude),
        Number(report.longitude)
      )
    )
  )

export const buildReportGroups = (laporan) => {
  const pendingReports = laporan.filter((item) => item.status === 'pending')
  const verifiedReports = laporan.filter((item) => item.status === 'verified')

  const makeClusters = (targetArray, isPending) => {
    const clusters = []

    targetArray.forEach((report) => {
      const reportTimestamp = getReportTimestamp(report)

      // Laporan masuk klaster hanya jika rentang waktunya maksimal 3 jam dan
      // jaraknya maksimal 100 meter dari setiap anggota klaster.
      const found = clusters.find((group) => {
        if (reportTimestamp === null || group.startTime === null || group.endTime === null) {
          return false
        }

        const startTime = Math.min(group.startTime, reportTimestamp)
        const endTime = Math.max(group.endTime, reportTimestamp)
        if (endTime - startTime > CLUSTER_TIME_WINDOW_MS) {
          return false
        }

        return group.reports.every(
          (member) =>
            calculateHaversineDistance(
              Number(member.latitude),
              Number(member.longitude),
              Number(report.latitude),
              Number(report.longitude)
            ) <= CLUSTER_RADIUS_METERS
        )
      })

      if (found) {
        found.reports.push(report)
        const center = getClusterCenter(found.reports)
        found.latitude = center.latitude
        found.longitude = center.longitude
        found.maxDistance = getMaxDistanceFromCenter(found.reports, center)
        found.startTime = Math.min(found.startTime, reportTimestamp)
        found.endTime = Math.max(found.endTime, reportTimestamp)
        return
      }

      const latitude = Number(report.latitude)
      const longitude = Number(report.longitude)

      clusters.push({
        id: `group-${report.id}`,
        title: isPending
          ? `Indikasi Aksi Massa: ${report.title || report.description.substring(0, 30)}${report.title ? '' : '...'}`
          : report.title || 'Aksi Massa di Kawasan Terkait',
        location:
          report.location_name ||
          report.address ||
          `Koordinat ${Number(report.latitude).toFixed(5)}, ${Number(report.longitude).toFixed(5)}`,
        time: report.created_at
          ? `${new Date(report.created_at).toLocaleTimeString('id-ID', {
              hour: '2-digit',
              minute: '2-digit',
            })} WIB`
          : '09:14 WIB',
        
        radius: `${CLUSTER_RADIUS_METERS}m`,
        maxDistance: 0,
        latitude,
        longitude,
        startTime: reportTimestamp,
        endTime: reportTimestamp,
        image_url: report.image_url,
        description: report.description,
        reports: [report],
      })
    })

    return clusters.map((cluster) => ({
      ...cluster,
      status: getValidityInfo(cluster.reports.length).status,
    }))
  }

  return {
    pending: makeClusters(pendingReports, true),
    verified: makeClusters(verifiedReports, false),
  }
}

export const buildReportStats = (laporan, groupsData) => ({
  totalGroups: groupsData.pending.length + groupsData.verified.length,
  totalReports: laporan.length,
  approved: laporan.filter((report) => report.status === 'verified').length,
  pending: laporan.filter((report) => report.status === 'pending').length,
})
