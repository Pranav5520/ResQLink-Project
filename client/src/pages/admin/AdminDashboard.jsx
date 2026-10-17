import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { FaExclamationTriangle, FaHandHoldingHeart, FaUserFriends, FaCampground, FaBox, FaCheckCircle, FaBullhorn } from 'react-icons/fa';

const COLORS = ['#e74c3c', '#f39c12', '#3498db', '#2ecc71', '#9b59b6', '#1abc9c', '#e67e22', '#34495e'];

export default function AdminDashboard() {
  const [overview, setOverview] = useState(null);
  const [categoryData, setCategoryData] = useState([]);
  const [statusData, setStatusData] = useState([]);
  const [severityData, setSeverityData] = useState([]);
  const [volunteerData, setVolunteerData] = useState([]);
  const [requestsByType, setRequestsByType] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [overviewRes, catRes, statusRes, sevRes, volRes, typeRes] = await Promise.all([
          api.get('/api/analytics/overview'),
          api.get('/api/analytics/emergencies-by-category'),
          api.get('/api/analytics/requests-by-status'),
          api.get('/api/analytics/severity-distribution'),
          api.get('/api/analytics/volunteer-deployment'),
          api.get('/api/analytics/requests-by-type'),
        ]);
        setOverview(overviewRes.data);
        setCategoryData(catRes.data);
        setStatusData(statusRes.data);
        setSeverityData(sevRes.data);
        setVolunteerData(volRes.data);
        setRequestsByType(typeRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="loading"><div className="spinner"></div>Loading dashboard...</div>;
  if (!overview) return <div className="loading">Failed to load dashboard data</div>;

  const kpis = [
    { icon: <FaExclamationTriangle />, value: overview.activeEmergencies, label: 'Active Emergencies', color: 'danger' },
    { icon: <FaHandHoldingHeart />, value: overview.pendingRequests, label: 'Pending Requests', color: 'warning' },
    { icon: '🔴', value: overview.criticalRequests, label: 'Critical Requests', color: 'critical' },
    { icon: <FaUserFriends />, value: overview.availableVolunteers, label: 'Available Volunteers', color: 'success' },
    { icon: '🔵', value: overview.deployedVolunteers, label: 'Volunteers Deployed', color: 'info' },
    { icon: <FaCampground />, value: overview.activeCamps, label: 'Active Relief Camps', color: 'success' },
    { icon: '👥', value: overview.totalOccupied, label: 'People in Camps', color: 'info' },
    { icon: <FaBox />, value: overview.totalResources, label: 'Total Resources', color: '' },
    { icon: '⚠️', value: overview.lowStockResources, label: 'Low-Stock Items', color: 'warning' },
    { icon: <FaCheckCircle />, value: overview.completedTasks, label: 'Completed Tasks', color: 'success' },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h2>📊 Command Center Dashboard</h2>
        <Link to="/admin/analytics" className="btn btn-primary btn-sm">View Full Analytics →</Link>
      </div>

      {/* KPI Grid */}
      <div className="kpi-grid">
        {kpis.map((kpi, i) => (
          <div key={i} className={`kpi-card ${kpi.color}`}>
            <div className="kpi-icon">{kpi.icon}</div>
            <div className="kpi-value">{kpi.value}</div>
            <div className="kpi-label">{kpi.label}</div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid-2" style={{ marginBottom: 24 }}>
        {/* Emergencies by Category */}
        <div className="chart-container">
          <h3>Emergencies by Category</h3>
          {categoryData.length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={categoryData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="category" tick={{ fontSize: 11 }} angle={-20} textAnchor="end" height={60} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#3498db" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: 40 }}>No data</p>}
        </div>

        {/* Requests by Status */}
        <div className="chart-container">
          <h3>Requests by Status</h3>
          {statusData.length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie data={statusData} dataKey="count" nameKey="status" cx="50%" cy="50%" outerRadius={100} label={({ status, count }) => `${status}: ${count}`}>
                  {statusData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: 40 }}>No data</p>}
        </div>

        {/* Severity Distribution */}
        <div className="chart-container">
          <h3>Emergency Severity Distribution</h3>
          {severityData.length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie data={severityData} dataKey="count" nameKey="severity" cx="50%" cy="50%" outerRadius={100} label={({ severity, count }) => `${severity}: ${count}`}>
                  {severityData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: 40 }}>No data</p>}
        </div>

        {/* Volunteer Deployment */}
        <div className="chart-container">
          <h3>Volunteer Deployment</h3>
          {volunteerData.length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={volunteerData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="status" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  {volunteerData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: 40 }}>No data</p>}
        </div>
      </div>

      {/* Requests by Type */}
      <div className="chart-container" style={{ marginBottom: 24 }}>
        <h3>Requests by Type</h3>
        {requestsByType.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={requestsByType} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis type="category" dataKey="type" width={150} tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="count" fill="#2ecc71" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: 40 }}>No data</p>}
      </div>

      {/* Quick Links */}
      <div className="grid-3">
        {[
          { to: '/admin/emergencies', label: 'Manage Emergencies', icon: '🚨', color: 'var(--danger)' },
          { to: '/admin/requests', label: 'Manage Requests', icon: '📋', color: 'var(--warning)' },
          { to: '/admin/gis-map', label: 'GIS Map View', icon: '🗺️', color: 'var(--info)' },
        ].map((link, i) => (
          <Link key={i} to={link.to} className="card" style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer', borderLeft: `4px solid ${link.color}` }}>
            <span style={{ fontSize: '1.5rem' }}>{link.icon}</span>
            <strong>{link.label}</strong>
          </Link>
        ))}
      </div>
    </div>
  );
}
