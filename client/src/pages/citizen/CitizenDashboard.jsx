import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { FaExclamationTriangle, FaHandHoldingHeart, FaListAlt, FaCampground, FaBullhorn, FaArrowRight } from 'react-icons/fa';

export default function CitizenDashboard() {
  const [requests, setRequests] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [stats, setStats] = useState({ total: 0, pending: 0, inProgress: 0, completed: 0 });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [reqRes, annRes] = await Promise.all([
          api.get('/api/requests?limit=5'),
          api.get('/api/announcements/public')
        ]);
        const reqs = reqRes.data.requests || [];
        setRequests(reqs);
        setAnnouncements((annRes.data.announcements || annRes.data).slice(0, 3));
        setStats({
          total: reqRes.data.total || reqs.length,
          pending: reqs.filter(r => r.status === 'Pending').length,
          inProgress: reqs.filter(r => r.status === 'In Progress' || r.status === 'Assigned').length,
          completed: reqs.filter(r => r.status === 'Completed').length,
        });
      } catch (err) { console.error(err); }
    };
    fetchData();
  }, []);

  return (
    <div>
      <h2 style={{ marginBottom: 20 }}>📊 My Dashboard</h2>

      {/* Announcement banners */}
      {announcements.filter(a => a.priority === 'Emergency').map(ann => (
        <div key={ann._id} className="announcement-banner">
          <FaExclamationTriangle />
          <div><strong>{ann.title}</strong><p style={{ margin: 0, fontSize: '0.85rem' }}>{ann.message}</p></div>
        </div>
      ))}

      {/* KPI Cards */}
      <div className="kpi-grid">
        <div className="kpi-card info">
          <div className="kpi-icon"><FaListAlt /></div>
          <div className="kpi-value">{stats.total}</div>
          <div className="kpi-label">My Total Requests</div>
        </div>
        <div className="kpi-card warning">
          <div className="kpi-icon"><FaHandHoldingHeart /></div>
          <div className="kpi-value">{stats.pending}</div>
          <div className="kpi-label">Pending</div>
        </div>
        <div className="kpi-card" style={{ borderLeftColor: '#f39c12' }}>
          <div className="kpi-icon">⏳</div>
          <div className="kpi-value">{stats.inProgress}</div>
          <div className="kpi-label">In Progress</div>
        </div>
        <div className="kpi-card success">
          <div className="kpi-icon">✅</div>
          <div className="kpi-value">{stats.completed}</div>
          <div className="kpi-label">Completed</div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid-2" style={{ marginBottom: 24 }}>
        <Link to="/citizen/report-emergency" className="card" style={{ display: 'flex', alignItems: 'center', gap: 16, cursor: 'pointer', transition: 'transform 0.2s' }}>
          <div style={{ fontSize: '2rem', color: 'var(--danger)' }}><FaExclamationTriangle /></div>
          <div>
            <h4>Report Emergency</h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Report a disaster or emergency situation</p>
          </div>
          <FaArrowRight style={{ marginLeft: 'auto', color: 'var(--text-secondary)' }} />
        </Link>
        <Link to="/citizen/request-help" className="card" style={{ display: 'flex', alignItems: 'center', gap: 16, cursor: 'pointer', transition: 'transform 0.2s' }}>
          <div style={{ fontSize: '2rem', color: 'var(--warning)' }}><FaHandHoldingHeart /></div>
          <div>
            <h4>Request Help</h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Request food, water, medicine, rescue, shelter</p>
          </div>
          <FaArrowRight style={{ marginLeft: 'auto', color: 'var(--text-secondary)' }} />
        </Link>
      </div>

      {/* Recent Requests */}
      <div className="card" style={{ marginBottom: 24 }}>
        <div className="card-header">
          <h3>My Recent Requests</h3>
          <Link to="/citizen/my-requests" className="btn btn-sm btn-outline">View All</Link>
        </div>
        {requests.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📋</div>
            <h4>No requests yet</h4>
            <p>Submit your first help request to get started</p>
          </div>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Type</th>
                  <th>Description</th>
                  <th>Priority</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {requests.map(req => (
                  <tr key={req._id}>
                    <td><span className="badge badge-info">{req.requestType}</span></td>
                    <td style={{ maxWidth: 250, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{req.description}</td>
                    <td><span className={`badge badge-${req.priority === 'Critical' ? 'critical' : req.priority === 'Urgent' ? 'warning' : 'secondary'}`}>{req.priority}</span></td>
                    <td><span className={`badge badge-${req.status === 'Completed' ? 'success' : req.status === 'In Progress' ? 'warning' : req.status === 'Rejected' ? 'danger' : 'info'}`}>{req.status}</span></td>
                    <td style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{new Date(req.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Active Announcements */}
      {announcements.length > 0 && (
        <div className="card">
          <div className="card-header">
            <h3><FaBullhorn /> Announcements</h3>
            <Link to="/citizen/announcements" className="btn btn-sm btn-outline">View All</Link>
          </div>
          {announcements.map(ann => (
            <div key={ann._id} style={{ padding: '12px 0', borderBottom: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span className={`badge badge-${ann.priority === 'Emergency' ? 'danger' : ann.priority === 'Warning' ? 'warning' : 'info'}`}>
                  {ann.priority}
                </span>
                <strong>{ann.title}</strong>
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: 4, marginLeft: 10 }}>
                {ann.message}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
