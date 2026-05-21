import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import axios from 'axios';
import L from 'leaflet';

// Fix for default marker icon in leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png')
});

export default function BusTracker({ passId }) {
  const [location, setLocation] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const res = await axios.get(`/api/tracking/location/${passId}`);
        setLocation(res.data);
        setError('');
      } catch (e) {
        console.error('Tracking error', e);
        setError('Unable to fetch live bus location.');
      }
    };
    
    fetchLocation();
    const interval = setInterval(fetchLocation, 5000); // poll every 5s
    return () => clearInterval(interval);
  }, [passId]);

  if (error) return <div className="alert alert-error">{error}</div>;
  if (!location) return <div className="alert alert-info">Loading bus location...</div>;

  return (
    <div className="glass-container" style={{ height: '400px', marginTop: '24px', padding: '16px', overflow: 'hidden' }}>
      <h3 style={{ marginBottom: '16px' }}>📍 Real-time Bus Tracking</h3>
      <div style={{ height: '320px', borderRadius: '12px', overflow: 'hidden' }}>
        <MapContainer center={[location.lat, location.lng]} zoom={14} style={{ height: '100%', width: '100%' }}>
          <TileLayer
            attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={[location.lat, location.lng]}>
            <Popup>
              Bus is here! <br />
              Last updated: {new Date(location.updatedAt).toLocaleTimeString()}
            </Popup>
          </Marker>
        </MapContainer>
      </div>
    </div>
  );
}
