export default function ReportModal({
  show,
  lokasi,
  formInput,
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
          <button className="close-btn" onClick={onClose}>
            x
          </button>
        </div>

        <form className="report-form" onSubmit={onSubmit}>
          <div className="form-group">
            <label>Nama Pelapor</label>
            <input
              type="text"
              placeholder="Masukkan nama"
              value={formInput.pelapor}
              onChange={(event) => onChangeForm({ pelapor: event.target.value })}
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
            <input
              type="file"
              accept="image/*"
              onChange={(event) => onChangeForm({ foto: event.target.files[0] })}
              required
            />
          </div>

          <button type="submit" className="submit-btn">
            Kirim Laporan
          </button>
        </form>
      </div>
    </div>
  )
}
