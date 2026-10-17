import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { FaTasks, FaCheckCircle, FaClock, FaBullhorn } from 'react-icons/fa';

export default function VolunteerDashboard() {
  const [stats, setStats] = useState({ assigned: 0, inProgress: 0, completed: 0 });
  const [assignments, setAssignments] = useState([]);
  const [announcements, setAnnouncements] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, assignRes, annRes] = await Promise.all([
          api.get('/api/assignments/stats'),
          api.get('/api/assignments?limit=5'),
          api.get('/api/announcements/public')
        ]);
        setStats(statsRes.data);
        setAssignments(assignRes.data.assignments || []);
        setAnnouncements((annRes.data.announcements || annRes.data).slice(0, 3));
      } catch (err) { console.error(err); }
    };
    fetchData();
  }, []);

  return (
    <div>
      <h2 style={{ marginBottom: 20 }}>📊 Volunteer Dashboard</h2>

      {/* Announcements */}
      {announcements.filter(a => a.priority === 'Emergency').map(ann => (
        <div key={ann._id} className="announcement-banner">
          <FaBullhorn />
          <div><strong>{ann.title}</strong><p style={{ margin: 0, fontSize: '0.85rem' }}>{ann.message}</p></div>
        </div>
      ))}

      {/* KPI Cards */}
      <div className="kpi-grid">
        <div className="kpi-card info">
          <div className="kpi-icon"><FaTasks /></div>
          <div className="kpi-value">{stats.assigned}</div>
          <div className="kpi-label">Assigned Tasks</div>
        </div>
        <div className="kpi-card warning">
          <div className="kpi-icon"><FaClock /></div>
          <div className="kpi-value">{stats.inProgress}</div>
          <div className="kpi-label">In Progress</div>
        </div>
        <div className="kpi-card success">
          <div className="kpi-icon"><FaCheckCircle /></div>
          <div className="kpi-value">{stats.completed}</div>
          <div className="kpi-label">Completed</div>
        </div>
        <div className="kpi-card" style={{ borderLeftColor: '#8e44ad' }}>
          <div className="kpi-icon">📊</div>
          <div className="kpi-value">{stats.total}</div>
          <div className="kpi-label">Total Assignments</div>
        </div>
      </div>

      {/* Quick links */}
      <div className="grid-2" style={{ marginBottom: 24 }}>
        <Link to="/volunteer/available-tasks" className="card" style={{ display: 'flex', alignItems: 'center', gap: 16, cursor: 'pointer' }}>
          <div style={{ fontSize: '2rem', color: 'var(--info)' }}>📋</div>
          <div>
            <h4>View Available Tasks</h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Find tasks that need your skills</p>
          </div>
        </Link>
        <Link to="/volunteer/my-assignments" className="card" style={{ display: 'flex', alignItems: 'center', gap: 16, cursor: 'pointer' }}>
          <div style={{ fontSize: '2rem', color: 'var(--warning)' }}>⚡</div>
          <div>
            <h4>My Assignments</h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Manage your current tasks</p>
          </div>
        </Link>
      </div>

      {/* Current Assignments */}
      <div className="card">
        <div className="card-header">
          <h3>Current Assignments</h3>
          <Link to="/volunteer/my-assignments" className="btn btn-sm btn-outline">View All</Link>
        </div>
        {assignments.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📋</div>
            <h4>No assignments yet</h4>
            <p>Check available tasks to find work</p>
          </div>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Task</th>
                  <th>Request Type</th>
                  <th>Priority</th>
                  <th>Status</th>
                  <th>Assigned Date</th>
                </tr>
              </thead>
              <tbody>
                {assignments.map(a => (
                  <tr key={a._id}>
                    <td style={{ maxWidth: 250 }}>{a.taskDescription}</td>
                    <td><span className="badge badge-info">{a.request?.requestType || 'N/A'}</span></td>
                    <td><span className={`badge badge-${a.priority === 'Critical' ? 'critical' : a.priority === 'High' ? 'danger' : 'warning'}`}>{a.priority}</span></td>
                    <td><span className={`badge badge-${a.status === 'Completed' ? 'success' : a.status === 'In Progress' ? 'warning' : 'info'}`}>{a.status}</span></td>
                    <td style={{ fontSize: '0.8rem' }}>{new Date(a.assignedDate).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
