import { useState } from 'react'

export default function AdminGuard({ children }) {
  const [isAuth, setIsAuth] = useState(false)
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (event) => {
    event.preventDefault()

    if (password === 'admin123') {
      setIsAuth(true)
      setError('')
      return
    }

    setError('Password salah. Coba lagi.')
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
          <h1 style={{ margin: '0 0 6px', fontSize: '1.2rem' }}>Login Admin</h1>
          <p style={{ margin: '0 0 18px', fontSize: '0.85rem', color: '#6b7280' }}>
            Masukkan password untuk membuka dashboard validasi.
          </p>

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
            autoFocus
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
            style={{
              width: '100%',
              border: 'none',
              borderRadius: '8px',
              padding: '12px',
              background: '#c2410c',
              color: '#ffffff',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            Masuk Dashboard
          </button>
        </form>
      </div>
    )
  }

  return children
}
