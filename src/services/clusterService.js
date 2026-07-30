import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL

export const fetchPublicClusters = async () => {
  const response = await axios.get(`${API_URL}/report-clusters`)
  return response.data
}

export const fetchAdminClusters = async () => {
  const token = localStorage.getItem('token')
  const response = await axios.get(`${API_URL}/admin/report-clusters`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  return response.data
}

export const updateClusterStatus = (clusterId, status) => {
  const token = localStorage.getItem('token')
  return axios.put(
    `${API_URL}/admin/report-clusters/${clusterId}/status`,
    { status },
    { headers: { Authorization: `Bearer ${token}` } },
  )
}

