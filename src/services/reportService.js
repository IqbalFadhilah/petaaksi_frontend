import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'
const UPLOAD_URL = import.meta.env.VITE_UPLOAD_URL || 'http://localhost:3000/uploads'

export const getUploadUrl = (imageName) => {
  if (!imageName) return ''

  if (imageName.startsWith('http://') || imageName.startsWith('https://')) {
    return imageName
  }

  return `${UPLOAD_URL}/${imageName}`
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
