import { useEffect, useState } from 'react'
import { urlBase64ToUint8Array } from '../utils/push'

const PUBLIC_VAPID_KEY =
  'BFDchpxElajVPvlg-NR1W1BK6PSrucQB0i7BkhDfYsHWKqoB4MQLGJoKs518nQnMHpQ3sM63DiG3SQRY1obh6tg'

export const usePushNotification = () => {
  const [pushSubscription, setPushSubscription] = useState(null)

  useEffect(() => {
    const setupPush = async () => {
      if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
        return
      }

      try {
        const register = await navigator.serviceWorker.register('/sw.js')
        let subscription = await register.pushManager.getSubscription()

        if (!subscription) {
          subscription = await register.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: urlBase64ToUint8Array(PUBLIC_VAPID_KEY),
          })
        }

        setPushSubscription(subscription)
      } catch (error) {
        console.error('Gagal setup Push Notification:', error)
      }
    }

    setupPush()
  }, [])

  return pushSubscription
}
