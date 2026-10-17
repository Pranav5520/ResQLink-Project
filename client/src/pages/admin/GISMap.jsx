import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import api from '../../services/api';

// Custom marker icons
const createIcon = (color) => L.divIcon({
  className: 'custom-marker',
  html: `<div style="width:24px;height:24px;background:${color};border-radius:50%;border:3px solid white;box-shadow:0 2px 4px rgba(0,0,0,0.3)"></div>`,
  iconSize: [24, 24],
  iconAnchor: [12, 12],
});

const emergencyIcon = createIcon('#e74c3c');
const requestIcon = createIcon('#f39c12');
const campIcon = createIcon('#2ecc71');

export default function GISMap() {
  const [emergencies, setEmergencies] = useState([]);
  const [requests, setRequests] = useState([]);
  const [camps, setCamps] = useState([]);
  const [showEmergencies, setShowEmergencies] = useState(true);
  const [showRequests, setShowRequests] = useState(true);
  const [showCamps, setShowCamps] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [emgRes, reqRes, campRes] = await Promise.all([
          api.get('/api/emergencies?limit=100'),
          api.get('/api/requests?limit=100'),
          api.get('/api/camps?limit=100')
        ]);
        setEmergencies(emgRes.data.emergencies || []);
        setRequests(reqRes.data.requests || []);
        setCamps(campRes.data.camps || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div>
      <h2 style={{ marginBottom: 16 }}>🗺️ GIS Emergency Map</h2>

      {/* Legend */}
      <div style={{ display: 'flex', gap: 16, marginBottom: 16, flexWrap: 'wrap', alignItems: 'center' }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
          <input type="checkbox" checked={showEmergencies} onChange={e => setShowEmergencies(e.target.checked)} />
          <span style={{ width: 12, height: 12, background: '#e74c3c', borderRadius: '50%', display: 'inline-block' }} />
          Emergencies ({emergencies.length})
        </label>
        <label style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
          <input type="checkbox" checked={showRequests} onChange={e => setShowRequests(e.target.checked)} />
          <span style={{ width: 12, height: 12, background: '#f39c12', borderRadius: '50%', display: 'inline-block' }} />
          Requests ({requests.length})
        </label>
        <label style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
          <input type="checkbox" checked={showCamps} onChange={e => setShowCamps(e.target.checked)} />
          <span style={{ width: 12, height: 12, background: '#2ecc71', borderRadius: '50%', display: 'inline-block' }} />
          Relief Camps ({camps.length})
        </label>
      </div>

      <div className="map-container">
        <MapContainer center={[20.5937, 78.9629]} zoom={5} style={{ height: 'calc(100vh - 250px)', minHeight: 500 }}>
          <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org">OpenStreetMap</a>' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

          {showEmergencies && emergencies.map(emg => (
            emg.latitude && emg.longitude && (
              <Marker key={`emg-${emg._id}`} position={[emg.latitude, emg.longitude]} icon={emergencyIcon}>
                <Popup>
                  <div style={{ minWidth: 200 }}>
                    <h4 style={{ color: '#e74c3c', margin: '0 0 8px' }}>🚨 {emg.title}</h4>
                    <p><strong>Category:</strong> {emg.category}</p>
                    <p><strong>Severity:</strong> <span style={{ color: emg.severity === 'Critical' ? '#c0392b' : emg.severity === 'High' ? '#e74c3c' : '#f39c12' }}>{emg.severity}</span></p>
                    <p><strong>Status:</strong> {emg.status}</p>
                    <p><strong>People Affected:</strong> {emg.peopleAffected}</p>
                    <p><strong>Location:</strong> {emg.location}</p>
                    <p><strong>Date:</strong> {new Date(emg.createdAt).toLocaleDateString()}</p>
                  </div>
                </Popup>
              </Marker>
            )
          ))}

          {showRequests && requests.map(req => (
            req.latitude && req.longitude && (
              <Marker key={`req-${req._id}`} position={[req.latitude, req.longitude]} icon={requestIcon}>
                <Popup>
                  <div style={{ minWidth: 200 }}>
                    <h4 style={{ color: '#f39c12', margin: '0 0 8px' }}>🤲 {req.requestType}</h4>
                    <p><strong>Priority:</strong> {req.priority}</p>
                    <p><strong>Status:</strong> {req.status}</p>
                    <p><strong>People:</strong> {req.peopleCount}</p>
                    <p><strong>Location:</strong> {req.location}</p>
                    <p><strong>Date:</strong> {new Date(req.createdAt).toLocaleDateString()}</p>
                  </div>
                </Popup>
              </Marker>
            )
          ))}

          {showCamps && camps.map(camp => (
            <Marker key={`camp-${camp._id}`} position={[camp.latitude, camp.longitude]} icon={campIcon}>
              <Popup>
                <div style={{ minWidth: 200 }}>
                  <h4 style={{ color: '#2ecc71', margin: '0 0 8px' }}>🏕️ {camp.name}</h4>
                  <p><strong>Status:</strong> {camp.status}</p>
                  <p><strong>Occupancy:</strong> {camp.currentOccupancy}/{camp.maxCapacity}</p>
                  <p><strong>Contact:</strong> {camp.contactPerson} | {camp.phone}</p>
                  <p><strong>Location:</strong> {camp.address}, {camp.district}</p>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
}
