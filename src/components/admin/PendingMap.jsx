import L from 'leaflet'
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet'
import { defaultMapCenter } from '../../constants/map'

const clusterStyles = {
  high: { color: '#15803d', label: 'Validitas tinggi' },
  medium: { color: '#d97706', label: 'Validitas sedang' },
  low: { color: '#6b7280', label: 'Validitas rendah' },
}

const getClusterStyle = (cluster) => {
  if (cluster.reports.length >= 3 || cluster.status === 'high') return clusterStyles.high
  if (cluster.reports.length === 2) return clusterStyles.medium
  return clusterStyles.low
}

const createClusterIcon = (cluster) => {
  const { color, label } = getClusterStyle(cluster)
  const reportCount = cluster.reports.length

  return L.divIcon({
    className: 'report-cluster-icon',
    html: `
      <div class="report-cluster-marker" style="--cluster-color: ${color}" aria-label="${label}, ${reportCount} laporan">
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
        <MapContainer center={defaultMapCenter} zoom={11} style={{ height: '100%' }}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {groups.map((cluster) => {
            const { label } = getClusterStyle(cluster)

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
