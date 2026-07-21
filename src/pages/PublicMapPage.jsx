import { useMemo, useState } from 'react'
import { MapContainer, Marker, TileLayer } from 'react-leaflet'
import { Plus } from 'lucide-react'
import GlobalLightbox from '../components/GlobalLightbox'
import Header from '../components/Header'
import PublicBottomSheet from '../components/PublicBottomSheet'
import ReportModal from '../components/ReportModal'
import { defaultMapCenter, indonesiaBounds } from '../constants/map'
import { useDeviceId } from '../hooks/useDeviceId'
import { usePushNotification } from '../hooks/usePushNotification'
import { useReports } from '../hooks/useReports'
import { submitReport } from '../services/reportService'
import { buildReportGroups } from '../utils/clustering'
import { isLocationInIndonesia } from '../utils/geo'

export default function PublicMapPage() {
  const { laporan, refreshReports } = useReports()
  const deviceId = useDeviceId()
  const pushSubscription = usePushNotification()

  const [showForm, setShowForm] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [lokasi, setLokasi] = useState(null)
  const [formInput, setFormInput] = useState({
    pelapor: '',
    title: '',
    description: '',
    foto: null,
    isDeclarationAccepted: false,
  })
  const [selectedGroup, setSelectedGroup] = useState(null)
  const [fullscreenImage, setFullscreenImage] = useState(null)

  const groupsData = useMemo(() => buildReportGroups(laporan), [laporan])

  const updateFormInput = (nextValue) => {
    setFormInput((prev) => ({ ...prev, ...nextValue }))
  }

  const handleBukaForm = () => {
    // 🚨 HAPUS setShowForm(true) dari sini agar modal tidak curi start!
    setLokasi(null)

    if (!navigator.geolocation) {
      alert('Browser tidak mendukung geolokasi.')
      return
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const nextLokasi = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        }

        // Jika masuk kotak Indonesia DAN bukan di dalam teritori Singapura
        if (isLocationInIndonesia(nextLokasi)) {
          setLokasi(nextLokasi)
          setShowForm(true) // 🚀 BARU BOLEH BUKA MODAL DI SINI (Kondisi Aman & Valid)
          return
        }

        // 🛑 Jika terdeteksi di luar negeri (termasuk Singapura)
        alert(
          'Sistem mendeteksi lokasi di luar jangkauan. Aplikasi PetaAksi saat ini hanya menerima laporan dari wilayah Indonesia.',
        )
        // 🚨 setShowForm(false) di sini hapus saja karena modalnya emang belum dibuka
      },
      (error) => {
        console.error('Gagal mendapatkan lokasi:', error)
        alert('Gagal mengunci GPS. Pastikan izin lokasi aktif.')
      },
    )
  }

  const kirimLaporan = async (event) => {
    event.preventDefault()

    if (isSubmitting) return

    if (!lokasi) {
      alert('Mohon izinkan akses GPS!')
      return
    }

    const formData = new FormData()
    formData.append('pelapor', formInput.pelapor)
    formData.append('title', formInput.title)
    formData.append('description', formInput.description)
    formData.append('latitude', lokasi.lat)
    formData.append('longitude', lokasi.lng)
    formData.append('fotoKejadian', formInput.foto)
    formData.append('device_id', deviceId)

    if (pushSubscription) {
      formData.append('push_subscription', JSON.stringify(pushSubscription))
    }

    try {
      setIsSubmitting(true)
      await submitReport(formData)
      setShowForm(false)
      setFormInput({
        pelapor: '',
        title: '',
        description: '',
        foto: null,
        isDeclarationAccepted: false,
      })
      refreshReports()
      alert('Laporan Terkirim!')
    } catch (error) {
      console.error('Error Kirim:', error)
      alert('Gagal kirim.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="app-shell">
      <Header />

      <section className="public-view">
        <MapContainer
          center={defaultMapCenter}
          zoom={13}
          minZoom={5}
          maxBounds={indonesiaBounds}
          maxBoundsViscosity={1}
          style={{ height: '100%', width: '100%' }}
          zoomControl={false}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

          {groupsData.verified.map((group) => (
            <Marker
              key={group.id}
              position={[group.latitude, group.longitude]}
              eventHandlers={{
                click: () => setSelectedGroup(group),
              }}
            />
          ))}
        </MapContainer>

        <PublicBottomSheet
          selectedGroup={selectedGroup}
          onClose={() => setSelectedGroup(null)}
          onImageClick={setFullscreenImage}
        />

        <button className="fab" onClick={handleBukaForm}>
          <Plus size={20} /> Laporkan Kejadian
        </button>

        <ReportModal
          show={showForm}
          lokasi={lokasi}
          formInput={formInput}
          isSubmitting={isSubmitting}
          onClose={() => !isSubmitting && setShowForm(false)}
          onSubmit={kirimLaporan}
          onChangeForm={updateFormInput}
        />
      </section>

      <GlobalLightbox imageUrl={fullscreenImage} onClose={() => setFullscreenImage(null)} />
    </div>
  )
}
