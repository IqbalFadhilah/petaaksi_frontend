import { CircleMarker, MapContainer, Popup, TileLayer } from 'react-leaflet'
import { defaultMapCenter } from '../../constants/map'

export default function PendingMap({ laporan }) {
  return (
    <div className="panel" style={{ marginBottom: '25px', padding: '15px' }}>
      <h2 style={{ fontSize: '1.1rem', marginBottom: '10px' }}>
        Peta Distribusi Node Spasial (Pending)
      </h2>
      <div style={{ height: '300px', borderRadius: '12px', overflow: 'hidden' }}>
        <MapContainer center={defaultMapCenter} zoom={11} style={{ height: '100%' }}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {laporan
            .filter((item) => item.status === 'pending')
            .map((item) => (
              <CircleMarker
                key={`adm-node-${item.id}`}
                center={[item.latitude, item.longitude]}
                radius={12}
                pathOptions={{
                  color: item.nearby_count > 0 ? '#2e7d32' : '#ffa000',
                  fillColor: item.nearby_count > 0 ? '#4caf50' : '#ffc107',
                  fillOpacity: 0.6,
                }}
              >
                <Popup>
                  <strong>{item.pelapor}</strong>: {item.description}
                </Popup>
              </CircleMarker>
            ))}
        </MapContainer>
      </div>
    </div>
  )
}
