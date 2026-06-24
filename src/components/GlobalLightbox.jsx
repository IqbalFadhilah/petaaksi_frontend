import { X } from 'lucide-react'

export default function GlobalLightbox({ imageUrl, onClose }) {
  if (!imageUrl) return null

  return (
    <div className="fullscreen-image-overlay" onClick={onClose}>
      <button className="fullscreen-close-btn" onClick={onClose}>
        <X size={20} />
      </button>
      <img
        src={imageUrl}
        alt="Bukti Fullscreen"
        className="fullscreen-img"
        onClick={(event) => event.stopPropagation()}
      />
    </div>
  )
}
