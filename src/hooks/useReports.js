import { useCallback, useEffect, useState } from 'react'
import { fetchReports } from '../services/reportService'

export const useReports = () => {
  const [laporan, setLaporan] = useState([])
  const [refresh, setRefresh] = useState(0)

  const refreshReports = useCallback(() => {
    setRefresh((prev) => prev + 1)
  }, [])

  useEffect(() => {
    const ambilData = async () => {
      try {
        const data = await fetchReports()
        setLaporan(data)
      } catch (error) {
        console.error('Gagal ambil data:', error)
      }
    }

    ambilData()
  }, [refresh])

  return { laporan, refreshReports }
}
