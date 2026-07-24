import L from 'leaflet'
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet'
import { defaultMapCenter, defaultMapZoom } from '../../constants/map'
import { getValidityInfo } from '../../utils/reportHelper'

const createClusterIcon = (cluster) => {
  const reportCount = cluster.reports.length
  const { label, markerColor } = getValidityInfo(reportCount)

  return L.divIcon({
    className: 'report-cluster-icon',
    html: `
      <div class="report-cluster-marker" style="--cluster-color: ${markerColor}" aria-label="${label}, ${reportCount} laporan">
        <span class="report-cluster-pulse"></span>
        <span class="report-cluster-count">${reportCount}</span>
      </div>
    `,
    iconSize: [44, 44],
    iconAnchor: [22, 22],
  })
}

export default function PendingMap({ groups = [], onSelectGroup }) {
  return (
    <div className="panel" style={{ marginBottom: '25px', padding: '15px' }}>
      <h2 style={{ fontSize: '1.1rem', marginBottom: '10px' }}>
        Peta Distribusi Node Spasial (Pending)
      </h2>
      <div style={{ height: '300px', borderRadius: '12px', overflow: 'hidden' }}>
        <MapContainer center={defaultMapCenter} zoom={defaultMapZoom} style={{ height: '100%' }}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {groups.map((cluster) => {
            const { label } = getValidityInfo(cluster.reports.length)

            return (
              <Marker
                key={cluster.id}
                position={[cluster.latitude, cluster.longitude]}
                icon={createClusterIcon(cluster)}
                title={`${label}: ${cluster.reports.length} laporan`}
                eventHandlers={{ click: () => onSelectGroup?.(cluster) }}
              >
                <Popup>
                  <strong>{cluster.reports.length} laporan</strong>
                  <br />
                  {label}
                </Popup>
              </Marker>
            )
          })}
        </MapContainer>
      </div>
    </div>
  )
}
