import { useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';

// Fix default marker icon issues
import 'leaflet/dist/leaflet.css';
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png',
});

function LocationMarker({ setNewVenue }) {
  const [position, setPosition] = useState(null);

  useMapEvents({
    click(e) {
      setPosition(e.latlng);
      setNewVenue((prev) => ({
        ...prev,
        locationCoordinates: `${e.latlng.lat},${e.latlng.lng}`,
      }));
    },
  });

  return position === null ? null : (
    <Marker position={position} />
  );
}

export default function VenueLocationMap({ setNewVenue }) {
  return (
    <div className="h-64 w-full rounded-xl overflow-hidden border border-red-200">
      <MapContainer center={[27.7172, 85.324]} zoom={13} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LocationMarker setNewVenue={setNewVenue} />
      </MapContainer>
    </div>
  );
}