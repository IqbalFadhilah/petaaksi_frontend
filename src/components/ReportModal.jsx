export default function ReportModal({
  show,
  lokasi,
  formInput,
  isSubmitting,
  onClose,
  onSubmit,
  onChangeForm,
}) {
  return (
    <div className={`modal-overlay ${show ? 'show' : ''}`}>
      <div className="report-modal">
        <div className="modal-header">
          <div>
            <h2>Buat Laporan Baru</h2>
            <p>Koordinat GPS kamu akan divalidasi presisinya menggunakan formula spasial.</p>
          </div>
          <button type="button" className="close-btn" onClick={onClose} disabled={isSubmitting} aria-label="Tutup formulir">
            x
          </button>
        </div>

        <form className="report-form" onSubmit={onSubmit} aria-busy={isSubmitting}>
          <div className="form-group">
            <label>Nama Pelapor</label>
            <input
              type="text"
              placeholder="Masukkan nama"
              value={formInput.pelapor}
              onChange={(event) => onChangeForm({ pelapor: event.target.value })}
              disabled={isSubmitting}
              required
            />
          </div>

          <div className="form-group">
            <label>Judul Kejadian</label>
            <input
              type="text"
              placeholder="Contoh: Aksi unjuk rasa di depan gedung..."
              value={formInput.title}
              onChange={(event) => onChangeForm({ title: event.target.value })}
              disabled={isSubmitting}
              required
            />
          </div>

          <div className="form-group">
            <label>Deskripsi Kejadian</label>
            <textarea
              rows="3"
              placeholder="Ceritakan situasi demonstrasi di lokasi..."
              value={formInput.description}
              onChange={(event) => onChangeForm({ description: event.target.value })}
              disabled={isSubmitting}
              required
            />
          </div>

          <div className={`gps-status-box ${lokasi ? 'gps-success' : 'gps-loading'}`}>
            <span className="gps-icon">GPS</span>
            <small>
              {lokasi
                ? 'Lokasi GPS Berhasil Terkunci'
                : 'Sedang mengambil data satelit koordinat GPS...'}
            </small>
          </div>

          <div className="form-group">
            <label>Foto Bukti Kejadian</label>
            <PhotoUpload
              value={formInput.foto}
              onChange={(foto) => onChangeForm({ foto })}
              disabled={isSubmitting}
            />
          </div>

          <label className="report-declaration">
            <input
              type="checkbox"
              checked={formInput.isDeclarationAccepted}
              onChange={(event) =>
                onChangeForm({ isDeclarationAccepted: event.target.checked })
              }
              disabled={isSubmitting}
              required
            />
            <span>
              Saya menyatakan bahwa informasi yang saya laporkan adalah benar dan dapat
              dipertanggungjawabkan.
            </span>
          </label>

          <button type="submit" className="submit-btn" disabled={isSubmitting}>
            {isSubmitting && <span className="button-spinner" aria-hidden="true" />}
            {isSubmitting ? 'Mengirim laporan...' : 'Kirim Laporan'}
          </button>
        </form>
      </div>
    </div>
  )
}
import PhotoUpload from './PhotoUpload'
