import { useCallback, useEffect, useState } from 'react'
import { fetchAdminReports, fetchReports } from '../services/reportService'

export const useReports = ({ admin = false, archived = false } = {}) => {
  const [laporan, setLaporan] = useState([])
  const [refresh, setRefresh] = useState(0)

  const refreshReports = useCallback(() => {
    setRefresh((prev) => prev + 1)
  }, [])

  useEffect(() => {
    const ambilData = async () => {
      try {
        const data = admin ? await fetchAdminReports(archived) : await fetchReports()
        setLaporan(data)
      } catch (error) {
        console.error('Gagal ambil data:', error)
      }
    }

    ambilData()
  }, [refresh, admin, archived])

  return { laporan, refreshReports }
}
