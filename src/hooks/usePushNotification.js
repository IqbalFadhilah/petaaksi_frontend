import { useEffect, useState } from 'react'
import { urlBase64ToUint8Array } from '../utils/push'

const PUBLIC_VAPID_KEY =
  'BC00oEsfu29umm4YaTeVdg0SFax9LQj7bDfy34K4FAf-FXH0-t1EIDsMlm8XKIHY9YZS5aeEgMCBfq4jsE05djE'

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
