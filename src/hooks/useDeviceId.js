import { useState } from 'react'

export const useDeviceId = () => {
  const [deviceId] = useState(() => {
    let existingId = localStorage.getItem('petaaksi_device_id')

    if (!existingId) {
      existingId = `dev_${Math.random().toString(36).substr(2, 9)}`
      localStorage.setItem('petaaksi_device_id', existingId)
    }

    return existingId
  })

  return deviceId
}
