import { useEffect, useState } from 'react'
import {
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Clock3,
  MapPinned,
  ShieldCheck,
} from 'lucide-react'
import { getUploadUrl } from '../../services/reportService'
import { getValidityInfo } from '../../utils/reportHelper'

const formatCoordinates = (latitude, longitude) =>
  `Lat: ${Number(latitude).toFixed(5)} | Lng: ${Number(longitude).toFixed(5)}`

const getLocationName = (address) => {
  const area = address.suburb
  const city = address.city || address.town || address.county || address.city_district

  return [area, city].filter(Boolean).filter((value, index, values) => values.indexOf(value) === index).join(', ')
}

export default function ReportGroupCard({
  group,
  expanded,
  onToggleExpand,
  onApproveGroup,
  onRejectGroup,
  onRejectReport,
  onImageClick,
}) {
  const { latitude, longitude } = group
  const fallbackLocation = formatCoordinates(latitude, longitude)
  const [locationName, setLocationName] = useState(fallbackLocation)
  const validity = getValidityInfo(group.reports.length)

  useEffect(() => {
    const controller = new AbortController()

    setLocationName(fallbackLocation)

    const fetchLocationName = async () => {
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`,
          { signal: controller.signal },
        )

        if (!response.ok) throw new Error('Reverse geocoding gagal')

        const data = await response.json()
        const resolvedLocation = getLocationName(data.address || {})

        if (resolvedLocation) setLocationName(resolvedLocation)
      } catch (error) {
        if (error.name !== 'AbortError') {
          console.error('Gagal memuat nama lokasi:', error)
        }
      }
    }

    fetchLocationName()
    return () => controller.abort()
  }, [fallbackLocation, latitude, longitude])

  return (
    <div className="group-card">
      <div className="group-parent">
        <div className="group-main">
          <button className="expand-btn" onClick={() => onToggleExpand(group.id)}>
            {expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>
          <div>
            <h3>{group.title}</h3>
            <div className="meta-row">
              <span>
                <Clock3 size={14} /> {group.time}
              </span>
              <span>
                <MapPinned size={14} /> {locationName}
              </span>
            </div>
          </div>
        </div>

        <div className="group-badges">
          <span className="badge neutral">Konsensus: {group.reports.length} Pelapor</span>
          <span className={`badge validity-badge ${validity.badgeStyle}`}>
            {validity.status === 'high' ? <ShieldCheck size={14} /> : <AlertTriangle size={14} />}
            {validity.label}
          </span>
        </div>

        <div className="group-actions">
          <button className="approve-btn" onClick={() => onApproveGroup(group.reports)}>
            Approve
          </button>
          <button className="reject-btn" onClick={() => onRejectGroup(group.reports)}>
            Tolak
          </button>
        </div>
      </div>

      <div className={`child-container ${expanded ? 'expanded' : ''}`}>
        {group.reports.map((report) => (
          <div key={report.id} className="child-report">
            <div className="child-main-info">
              <img
                src={getUploadUrl(report.image_url)}
                alt="Bukti Lapangan"
                className="child-thumb"
                onClick={() => onImageClick(getUploadUrl(report.image_url))}
              />
              <div>
                <strong>Kontributor: {report.pelapor}</strong>
                {report.title && <p className="report-title">{report.title}</p>}
                <p>{report.description}</p>
                <small style={{ fontFamily: 'monospace', color: '#999' }}>
                  Lat: {report.latitude} | Lng: {report.longitude}
                </small>
              </div>
            </div>
            <div className="child-report-actions">
              <span className="child-status">Sub-Node Laporan</span>
              <button className="reject-report-btn" onClick={() => onRejectReport(report)}>
                Tolak Laporan
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
