import { useCallback, useEffect, useState } from 'react'
import { fetchAdminClusters, fetchPublicClusters } from '../services/clusterService'

const formatClusterTime = (startedAt) => {
  if (!startedAt) return '-'

  return `${new Date(startedAt).toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
  })} WIB`
}

const normalizeCluster = (cluster) => ({
  ...cluster,
  title:
    cluster.main_report?.title ||
    cluster.main_report?.description?.substring(0, 45) ||
    'Aksi Massa di Kawasan Terkait',
  time: formatClusterTime(cluster.started_at),
  radius: `${cluster.radius_meters}m`,
  reports: cluster.reports || [],
})

export const useReportClusters = ({ admin = false } = {}) => {
  const [clusters, setClusters] = useState([])
  const [refresh, setRefresh] = useState(0)

  const refreshClusters = useCallback(() => {
    setRefresh((previous) => previous + 1)
  }, [])

  useEffect(() => {
    const loadClusters = async () => {
      try {
        const data = admin ? await fetchAdminClusters() : await fetchPublicClusters()
        setClusters(data.map(normalizeCluster))
      } catch (error) {
        console.error('Gagal mengambil data cluster:', error)
      }
    }

    loadClusters()
  }, [admin, refresh])

  return { clusters, refreshClusters }
}

