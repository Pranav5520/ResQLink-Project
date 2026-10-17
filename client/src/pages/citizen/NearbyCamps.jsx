import { useState, useEffect } from 'react';
import api from '../../services/api';
import { FaCampground } from 'react-icons/fa';

export default function NearbyCamps() {
  const [camps, setCamps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCamps = async () => {
      try {
        const { data } = await api.get('/api/camps?limit=20');
        setCamps(data.camps || data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCamps();
  }, []);

  if (loading) return <div className="loading"><div className="spinner"></div>Loading camps...</div>;

  return (
    <div>
      <h2 style={{ marginBottom: 20 }}><FaCampground /> Nearby Relief Camps</h2>

      {camps.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <div className="empty-icon">🏕️</div>
            <h4>No active camps found</h4>
            <p>Check back later for relief camp information</p>
          </div>
        </div>
      ) : (
        <div className="grid-2">
          {camps.map(camp => (
            <div key={camp._id} className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <h4>{camp.name}</h4>
                <span className={`badge badge-${camp.status === 'Active' ? 'success' : camp.status === 'Nearly Full' ? 'warning' : camp.status === 'Full' ? 'danger' : 'secondary'}`}>
                  {camp.status}
                </span>
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: '8px 0' }}>
                📍 {camp.address}, {camp.district}, {camp.state}
              </p>

              {/* Capacity bar */}
              <div style={{ margin: '12px 0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: 4 }}>
                  <span>Occupancy: {camp.currentOccupancy} / {camp.maxCapacity}</span>
                  <span>{camp.maxCapacity - camp.currentOccupancy} available</span>
                </div>
                <div className="progress-bar">
                  <div
                    className={`progress-fill ${(camp.currentOccupancy / camp.maxCapacity) > 0.85 ? 'red' : (camp.currentOccupancy / camp.maxCapacity) > 0.6 ? 'yellow' : 'green'}`}
                    style={{ width: `${(camp.currentOccupancy / camp.maxCapacity) * 100}%` }}
                  />
                </div>
              </div>

              {/* Facilities */}
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 8 }}>
                {camp.facilities?.map(f => (
                  <span key={f} className="badge badge-secondary" style={{ fontSize: '0.7rem' }}>{f}</span>
                ))}
              </div>

              {/* Contact */}
              <div style={{ marginTop: 12, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                👤 {camp.contactPerson} | 📞 {camp.phone}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
