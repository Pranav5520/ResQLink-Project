import { useState, useEffect } from 'react';
import api from '../../services/api';
import { toast } from 'react-toastify';
import { FaTasks } from 'react-icons/fa';

export default function AvailableTasks() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('Pending');

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const { data } = await api.get('/api/requests?limit=50');
      setRequests(data.requests || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filtered = filter === 'All' ? requests : requests.filter(r => r.status === filter);

  if (loading) return <div className="loading"><div className="spinner"></div>Loading tasks...</div>;

  return (
    <div>
      <h2 style={{ marginBottom: 20 }}><FaTasks /> Available Tasks</h2>

      <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
        {['All', 'Pending', 'Verified'].map(f => (
          <button key={f} className={`btn btn-sm ${filter === f ? 'btn-primary' : 'btn-outline'}`} onClick={() => setFilter(f)}>
            {f}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <div className="empty-icon">✅</div>
            <h4>No tasks available</h4>
            <p>Check back later for new tasks</p>
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {filtered.map(req => (
            <div key={req._id} className="card" style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 8 }}>
                  <span className="badge badge-info">{req.requestType}</span>
                  <span className={`badge badge-${req.priority === 'Critical' ? 'critical' : req.priority === 'Urgent' ? 'warning' : 'secondary'}`}>{req.priority}</span>
                  <span className={`badge badge-${req.status === 'Verified' ? 'primary' : 'secondary'}`}>{req.status}</span>
                </div>
                <p style={{ marginBottom: 8 }}>{req.description}</p>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  📍 {req.location} | 👥 {req.peopleCount} people | 📞 {req.contactNumber}
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: 4 }}>
                  Posted: {new Date(req.createdAt).toLocaleDateString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
