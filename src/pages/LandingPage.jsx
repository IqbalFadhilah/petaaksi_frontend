import { ArrowRight, CheckCircle2, MapPinned, ShieldCheck, Siren } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import logoWeb from '../assets/logo-web-petaaksi.png'

const highlights = [
  {
    icon: <MapPinned size={22} />,
    title: 'Peta informasi langsung',
    text: 'Lihat kejadian yang telah diverifikasi pada peta interaktif.',
  },
  {
    icon: <ShieldCheck size={22} />,
    title: 'Laporan lebih terpercaya',
    text: 'Setiap laporan melewati proses peninjauan sebelum ditampilkan.',
  },
  {
    icon: <Siren size={22} />,
    title: 'Respons berbasis lokasi',
    text: 'Lokasi GPS membantu menggambarkan situasi secara lebih akurat.',
  },
]

export default function LandingPage() {
  const navigate = useNavigate()

  return (
    <main className="landing-page">
      <nav className="landing-nav">
        <img src={logoWeb} alt="PetaAksi" className="landing-logo" />
        <button className="landing-nav-link" onClick={() => navigate('/peta')}>
          Buka Peta <ArrowRight size={16} />
        </button>
      </nav>

      <section className="landing-hero">
        <div className="landing-copy">
          <p className="landing-eyebrow"><span /> Platform informasi publik</p>
          <h1>Kenali situasi, <em>ambil peran.</em></h1>
          <p className="landing-description">
            PetaAksi membantu masyarakat melaporkan dan memantau kejadian demonstrasi
            secara lebih cepat, terbuka, dan berbasis lokasi.
          </p>
          <div className="landing-actions">
            <button className="landing-primary-btn" onClick={() => navigate('/peta')}>
              Jelajahi Peta <ArrowRight size={18} />
            </button>
            <a className="landing-text-link" href="#tentang">Pelajari cara kerja</a>
          </div>
          <div className="landing-trust"><CheckCircle2 size={18} /> Laporan ditinjau sebelum dipublikasikan</div>
        </div>

        <div className="landing-visual" aria-hidden="true">
          <div className="map-grid" />
          <div className="map-ring ring-one" /><div className="map-ring ring-two" />
          <div className="map-pin"><MapPinned size={30} fill="currentColor" /></div>
          <div className="map-card card-top"><span className="card-dot" /> Kejadian terverifikasi</div>
          <div className="map-card card-bottom"><strong>Lokasi terkini</strong><small>Indonesia</small></div>
        </div>
      </section>

      <section className="landing-features" id="tentang">
        {highlights.map(({ icon, title, text }) => (
          <article className="landing-feature" key={title}>
            <div className="feature-icon">{icon}</div>
            <h2>{title}</h2>
            <p>{text}</p>
          </article>
        ))}
      </section>
    </main>
  )
}
