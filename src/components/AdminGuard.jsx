import { useState, useEffect } from 'react'

export default function AdminGuard({ children }) {
  const [isAuth, setIsAuth] = useState(false)
  const [username, setUsername] = useState('') // Tambah state username
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false) // State loading biar tombol ada feedback

  // 🔄 PENTING: Cek token tiap kali halaman di-refresh
  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      setIsAuth(true) // Jika token ada, admin langsung lolos tanpa login ulang
    }
  }, [])

  const handleSubmit = async (event) => {
    event.preventDefault()
    setLoading(true)
    setError('')

    try {
      // 🌐 URL API Backend kamu (ganti ke localhost jika sedang tes offline)
      const response = await fetch('https://petaaksi-backend.vercel.app/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Login gagal!')
      }

      // 💾 Sukses! Simpan token JWT hasil dari backend ke localStorage
      localStorage.setItem('token', data.token)
      setIsAuth(true)
      setError('')
    } catch (err) {
      setError(err.message || 'Terjadi kesalahan sambungan ke server.')
    } finally {
      setLoading(false)
    }
  }

  if (!isAuth) {
    return (
      <div
        style={{
          height: '100vh',
          width: '100vw',
          backgroundColor: '#111827',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          color: '#e5e7eb',
          padding: '24px',
          boxSizing: 'border-box',
        }}
      >
        <form
          onSubmit={handleSubmit}
          style={{
            width: '100%',
            maxWidth: '360px',
            background: '#ffffff',
            color: '#111827',
            borderRadius: '14px',
            padding: '24px',
            boxShadow: '0 20px 45px rgba(0, 0, 0, 0.25)',
          }}
        >
          <h1 style={{ margin: '0 0 6px', fontSize: '1.2rem' }}>Login Admin PetaAksi</h1>
          <p style={{ margin: '0 0 18px', fontSize: '0.85rem', color: '#6b7280' }}>
            Masukkan akun kredensial untuk mengakses dashboard validasi spasial.
          </p>

          {/* --- INPUT USERNAME --- */}
          <label
            htmlFor="admin-username"
            style={{
              display: 'block',
              marginBottom: '6px',
              fontSize: '0.78rem',
              fontWeight: 700,
              color: '#374151',
            }}
          >
            Username
          </label>
          <input
            id="admin-username"
            type="text"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            disabled={loading}
            autoFocus
            style={{
              width: '100%',
              boxSizing: 'border-box',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              padding: '11px',
              fontSize: '0.9rem',
              marginBottom: '14px',
            }}
          />

          {/* --- INPUT PASSWORD --- */}
          <label
            htmlFor="admin-password"
            style={{
              display: 'block',
              marginBottom: '6px',
              fontSize: '0.78rem',
              fontWeight: 700,
              color: '#374151',
            }}
          >
            Password
          </label>
          <input
            id="admin-password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            disabled={loading}
            style={{
              width: '100%',
              boxSizing: 'border-box',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              padding: '11px',
              fontSize: '0.9rem',
              marginBottom: '10px',
            }}
          />

          {error && (
            <p style={{ margin: '0 0 12px', color: '#dc2626', fontSize: '0.8rem' }}>
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              border: 'none',
              borderRadius: '8px',
              padding: '12px',
              background: loading ? '#9a3412' : '#c2410c',
              color: '#ffffff',
              fontWeight: 700,
              cursor: loading ? 'not-allowed' : 'pointer',
            }}
          >
            {loading ? 'Memverifikasi...' : 'Masuk Dashboard'}
          </button>
        </form>
      </div>
    )
  }

  return children
}