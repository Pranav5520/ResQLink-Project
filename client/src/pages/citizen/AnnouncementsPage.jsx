import { useState, useEffect } from 'react';
import api from '../../services/api';
import { FaBullhorn, FaExclamationTriangle } from 'react-icons/fa';

export default function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      const { data } = await api.get('/api/announcements?limit=50');
      setAnnouncements(data.announcements || data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filtered = filter === 'all' ? announcements : announcements.filter(a => a.priority === filter);

  if (loading) return <div className="loading"><div className="spinner"></div>Loading announcements...</div>;

  return (
    <div>
      <h2 style={{ marginBottom: 20 }}><FaBullhorn /> Emergency Announcements</h2>

      <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
        {['all', 'Emergency', 'Warning', 'Information'].map(f => (
          <button key={f} className={`btn btn-sm ${filter === f ? 'btn-primary' : 'btn-outline'}`} onClick={() => setFilter(f)}>
            {f === 'all' ? 'All' : f}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <div className="empty-icon">📢</div>
            <h4>No announcements</h4>
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {filtered.map(ann => (
            <div key={ann._id} className={`announcement-banner ${ann.priority === 'Emergency' ? '' : ann.priority === 'Warning' ? 'warning' : 'info'}`}>
              <FaExclamationTriangle style={{ flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <strong>{ann.title}</strong>
                  <span style={{ fontSize: '0.75rem', opacity: 0.8 }}>
                    {new Date(ann.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p style={{ margin: '4px 0 0', fontSize: '0.85rem', opacity: 0.9 }}>{ann.message}</p>
                {ann.targetArea && (
                  <p style={{ margin: '4px 0 0', fontSize: '0.8rem', opacity: 0.7 }}>📍 Target: {ann.targetArea}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
