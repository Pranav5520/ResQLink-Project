import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { FaExclamationTriangle, FaHandHoldingHeart, FaListAlt, FaCampground, FaBullhorn, FaArrowRight, FaBell, FaCheck } from 'react-icons/fa';

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
      <div className="page-header">
        <div>
          <h1>Citizen Dashboard</h1>
          <p className="text-muted">Stay safe. Report fast. Get the right help, right now.</p>
        </div>
        <Link to="/citizen/report-emergency" className="btn btn-danger btn-lg">
          <FaExclamationTriangle /> Report Emergency
        </Link>
      </div>

      {/* Announcement banners */}
      {announcements.filter(a => a.priority === 'Emergency').map(ann => (
        <div key={ann._id} className="card alert alert-danger mb-3">
          <FaExclamationTriangle />
          <div>
            <strong>{ann.title}</strong>
            <p style={{ margin: '4px 0 0', fontSize: '0.9rem' }}>{ann.message}</p>
          </div>
        </div>
      ))}

      {/* KPI Cards */}
      <div className="flex-wrap" style={{ gap: '16px', marginBottom: '24px' }}>
        <div className="kpi-card info">
          <div className="kpi-icon"><FaListAlt /></div>
          <div>
            <div className="kpi-value">{stats.total}</div>
            <div className="kpi-label">My Total Requests</div>
          </div>
        </div>
        <div className="kpi-card warning">
          <div className="kpi-icon"><FaHandHoldingHeart /></div>
          <div>
            <div className="kpi-value">{stats.pending}</div>
            <div className="kpi-label">Pending</div>
          </div>
        </div>
        <div className="kpi-card">
          <div className="kpi-icon" style={{ background: 'rgba(214, 137, 16, 0.15)', color: 'var(--warning)' }}>⏳</div>
          <div>
            <div className="kpi-value">{stats.inProgress}</div>
            <div className="kpi-label">In Progress</div>
          </div>
        </div>
        <div className="kpi-card success">
          <div className="kpi-icon"><FaCheck /></div>
          <div>
            <div className="kpi-value">{stats.completed}</div>
            <div className="kpi-label">Completed</div>
          </div>
        </div>
      </div>

      {/* Announcements */}
      {announcements.length > 0 && (
        <div className="card mb-3">
          <div className="card-header">
            <h3><FaBullhorn /> Active Announcements</h3>
            <Link to="/citizen/announcements" className="btn btn-sm btn-outline">View All</Link>
          </div>
          {announcements.map(ann => (
            <div key={ann._id} className="p-3 border-bottom">
              <div className="d-flex align-items-center gap-2 mb-2">
                <span className={`badge bg-${ann.priority === 'Emergency' ? 'danger' : ann.priority === 'Warning' ? 'warning' : 'info'}`}>
                  {ann.priority}
                </span>
                <strong className="mb-0">{ann.title}</strong>
              </div>
              <p className="text-secondary mb-0" style={{ fontSize: '0.9rem' }}>{ann.message}</p>
            </div>
          ))}
        </div>
      )}

      {/* Recent Requests */}
      <div className="card mb-3">
        <div className="card-header">
          <h3>My Recent Requests</h3>
          <Link to="/citizen/my-requests" className="btn btn-sm btn-outline">View All</Link>
        </div>
        {requests.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📋</div>
            <h3>No requests yet</h3>
            <p>Submit your first help request or report an emergency to get started.</p>
            <Link to="/citizen/request-help" className="btn btn-primary mt-2">
              <FaHandHoldingHeart /> Request Help
            </Link>
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
                    <td><span className="badge bg-info">{req.requestType}</span></td>
                    <td style={{ maxWidth: 250, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{req.description}</td>
                    <td><span className={`badge bg-${req.priority === 'Critical' ? 'critical' : req.priority === 'Urgent' ? 'warning' : 'secondary'}`}>{req.priority}</span></td>
                    <td><span className={`badge bg-${req.status === 'Completed' ? 'success' : req.status === 'In Progress' ? 'warning' : req.status === 'Rejected' ? 'danger' : 'info'}`}>{req.status}</span></td>
                    <td className="text-sm">{new Date(req.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Quick actions */}
      <div className="flex-wrap" style={{ gap: '16px' }}>
        <Link to="/citizen/report-emergency" className="card">
          <div className="card-body d-flex align-items-center gap-3">
            <div className="flex-shrink-0" style={{ fontSize: '1.6rem' }}><FaExclamationTriangle /></div>
            <div className="flex-grow-1 min-width-0">
              <h5 className="mb-1">Report Emergency</h5>
              <p className="text-secondary mb-0 small">Report a disaster or emergency situation</p>
            </div>
            <FaArrowRight />
          </div>
        </Link>
        <Link to="/citizen/request-help" className="card">
          <div className="card-body d-flex align-items-center gap-3">
            <div className="flex-shrink-0" style={{ fontSize: '1.6rem' }}><FaHandHoldingHeart /></div>
            <div className="flex-grow-1 min-width-0">
              <h5 className="mb-1">Request Help</h5>
              <p className="text-secondary mb-0 small">Food, water, medicine, rescue, shelter</p>
            </div>
            <FaArrowRight />
          </div>
        </Link>
      </div>

      {/* Nearby camps quick link */}
      <div className="card">
        <Link to="/citizen/nearby-camps" className="card-body d-flex align-items-center gap-3">
          <div className="flex-shrink-0" style={{ fontSize: '1.6rem' }}><FaCampground /></div>
          <div className="flex-grow-1 min-width-0">
            <h5 className="mb-1">Find Nearby Relief Camps</h5>
            <p className="text-secondary mb-0 small">Find food, water, shelter, and medical support close to you</p>
          </div>
          <FaArrowRight />
        </Link>
      </div>
    </div>
  );
}
