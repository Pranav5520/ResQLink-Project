import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';

export default function MyRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

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

  if (loading) return <div className="loading"><div className="spinner"></div>Loading requests...</div>;

  return (
    <div>
      <h2 style={{ marginBottom: 20 }}>📋 My Requests</h2>

      {requests.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <div className="empty-icon">📋</div>
            <h4>No requests yet</h4>
            <p>When you submit help requests, they will appear here</p>
            <Link to="/citizen/request-help" className="btn btn-primary" style={{ marginTop: 12 }}>Request Help</Link>
          </div>
        </div>
      ) : (
        <div className="card">
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Type</th>
                  <th>Description</th>
                  <th>People</th>
                  <th>Priority</th>
                  <th>Status</th>
                  <th>Volunteer</th>
                  <th>Created</th>
                  <th>Details</th>
                </tr>
              </thead>
              <tbody>
                {requests.map(req => (
                  <tr key={req._id}>
                    <td><span className="badge badge-info">{req.requestType}</span></td>
                    <td style={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{req.description}</td>
                    <td>{req.peopleCount}</td>
                    <td><span className={`badge badge-${req.priority === 'Critical' ? 'critical' : req.priority === 'Urgent' ? 'warning' : 'secondary'}`}>{req.priority}</span></td>
                    <td><span className={`badge badge-${req.status === 'Completed' ? 'success' : req.status === 'In Progress' || req.status === 'Assigned' ? 'warning' : req.status === 'Rejected' ? 'danger' : 'info'}`}>{req.status}</span></td>
                    <td style={{ fontSize: '0.85rem' }}>{req.assignedVolunteer?.name || '—'}</td>
                    <td style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{new Date(req.createdAt).toLocaleDateString()}</td>
                    <td><Link to={`/citizen/my-requests/${req._id}`} className="btn btn-sm btn-outline">View</Link></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
