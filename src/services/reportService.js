import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL

export const getUploadUrl = (imageName) => {
  if (!imageName) return ''

  // Karena sudah pakai Cloudinary, database akan langsung menyimpan URL penuh (https://...)
  // Jadi fungsi ini tinggal langsung mengembalikan string URL tersebut
  return imageName
}

export const fetchReports = async () => {
  const response = await axios.get(`${API_URL}/reports`)
  return response.data
}

export const fetchAdminReports = async (archived = false) => {
  const token = localStorage.getItem('token')
  const path = archived ? '/admin/reports/history' : '/admin/reports'
  const response = await axios.get(`${API_URL}${path}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  return response.data
}

export const updateReportStatus = (reportId, status) => {
  // 🔑 Ambil token JWT yang tersimpan di memori browser
  const token = localStorage.getItem('token') 

  // 🛡️ Selipkan token ke dalam config headers Axios sebagai Bearer Token
  return axios.put(
    `${API_URL}/reports/${reportId}`, 
    { status },
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  )
}

export const submitReport = (formData) => {
  return axios.post(`${API_URL}/reports`, formData, { timeout: 30000 })
}
