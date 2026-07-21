import { Camera, ImagePlus, RotateCcw, Trash2 } from 'lucide-react'
import { useEffect, useMemo, useRef } from 'react'

export default function PhotoUpload({ value, onChange, disabled = false }) {
  const cameraInputRef = useRef(null)
  const galleryInputRef = useRef(null)
  const previewUrl = useMemo(() => (value ? URL.createObjectURL(value) : null), [value])

  useEffect(() => () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl)
  }, [previewUrl])

  const selectPhoto = (event) => {
    const file = event.target.files?.[0]
    if (file) onChange(file)
    event.target.value = ''
  }

  const replacePhoto = () => galleryInputRef.current?.click()

  return (
    <div className="photo-upload">
      <input
        ref={cameraInputRef}
        className="photo-upload-input"
        type="file"
        accept="image/*"
        capture="environment"
        onChange={selectPhoto}
        disabled={disabled}
      />
      <input
        ref={galleryInputRef}
        className="photo-upload-input"
        type="file"
        accept="image/*"
        onChange={selectPhoto}
        disabled={disabled}
      />

      {!value ? (
        <div className="photo-upload-options">
          <button type="button" className="photo-option camera" onClick={() => cameraInputRef.current?.click()} disabled={disabled}>
            <Camera size={19} />
            <span>Ambil Foto Langsung<small>Buka kamera belakang</small></span>
          </button>
          <button type="button" className="photo-option gallery" onClick={() => galleryInputRef.current?.click()} disabled={disabled}>
            <ImagePlus size={19} />
            <span>Pilih dari Galeri<small>Pilih foto dari perangkat</small></span>
          </button>
        </div>
      ) : (
        <div className="photo-preview">
          {previewUrl && <img src={previewUrl} alt="Preview foto bukti laporan" />}
          <div className="photo-preview-actions">
            <button type="button" onClick={replacePhoto} disabled={disabled}><RotateCcw size={15} /> Ganti Foto</button>
            <button type="button" className="remove-photo-btn" onClick={() => onChange(null)} disabled={disabled}><Trash2 size={15} /> Hapus Foto</button>
          </div>
        </div>
      )}
    </div>
  )
}
