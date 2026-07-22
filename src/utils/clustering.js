// 1. Fungsi Matematika Haversine untuk hitung jarak riil (satuan Meter)
import { getValidityInfo } from './reportHelper'

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

export const buildReportGroups = (laporan) => {
  const pendingReports = laporan.filter((item) => item.status === 'pending')
  const verifiedReports = laporan.filter((item) => item.status === 'verified')

  const makeClusters = (targetArray, isPending) => {
    const clusters = []

    targetArray.forEach((report) => {
      // Cari apakah ada klaster terdekat (selisih < 0.001 derajat / ~111m)
      const found = clusters.find((group) => {
        const latDiff = Math.abs(group.latitude - report.latitude)
        const lngDiff = Math.abs(group.longitude - report.longitude)
        return latDiff < 0.001 && lngDiff < 0.001
      })

      if (found) {
        found.reports.push(report)

        // 2. Hitung jarak riil dari titik pusat klaster ke laporan baru ini
        const dist = calculateHaversineDistance(
          found.latitude,
          found.longitude,
          report.latitude,
          report.longitude
        )

        // Perbarui radius klaster berdasarkan jarak terjauh (minimal 20m agar ekuivalen tampilan peta)
        found.maxDistance = Math.max(found.maxDistance || 20, dist)
        found.radius = `${found.maxDistance}m`
        return
      }

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
        
        // 3. Jika baru 1 laporan = 50m default, jika ada pendukung = dihitung riil (maxDistance)
        radius: report.nearby_count > 0 ? '20m' : '100m',
        maxDistance: 20, 
        latitude: report.latitude,
        longitude: report.longitude,
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
