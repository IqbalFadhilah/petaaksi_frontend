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

export const updateReportStatus = (reportId, status) => {
  return axios.put(`${API_URL}/reports/${reportId}`, { status })
}

export const submitReport = (formData) => {
  return axios.post(`${API_URL}/reports`, formData)
}