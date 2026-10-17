import { useState, useEffect } from 'react';
import api from '../../services/api';
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, LineChart, Line
} from 'recharts';
import { FaChartBar, FaFilter } from 'react-icons/fa';

const COLORS = ['#e74c3c', '#f39c12', '#3498db', '#2ecc71', '#9b59b6', '#1abc9c', '#e67e22', '#34495e', '#d35400', '#c0392b'];

export default function AnalyticsDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ startDate: '', endDate: '', category: '', severity: '', status: '', requestType: '' });

  useEffect(() => { fetchAnalytics(); }, [filters]);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([k, v]) => { if (v) params.set(k, v); });
      const { data: result } = await api.get(`/api/analytics/advanced?${params}`);
      setData(result);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  if (loading) return <div className="loading"><div className="spinner"></div>Loading analytics...</div>;
  if (!data) return <div className="loading">Failed to load</div>;

  return (
    <div>
      <h2 style={{ marginBottom: 20 }}><FaChartBar /> Analytics Dashboard</h2>

      {/* Filters */}
      <div className="card" style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
          <FaFilter /> <strong>Filters</strong>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
          <div className="form-group" style={{ margin: 0 }}>
            <label style={{ fontSize: '0.8rem' }}>Start Date</label>
            <input type="date" className="form-control" value={filters.startDate} onChange={e => setFilters({ ...filters, startDate: e.target.value })} />
          </div>
          <div className="form-group" style={{ margin: 0 }}>
            <label style={{ fontSize: '0.8rem' }}>End Date</label>
            <input type="date" className="form-control" value={filters.endDate} onChange={e => setFilters({ ...filters, endDate: e.target.value })} />
          </div>
          <div className="form-group" style={{ margin: 0 }}>
            <label style={{ fontSize: '0.8rem' }}>Emergency Category</label>
            <select className="form-control" value={filters.category} onChange={e => setFilters({ ...filters, category: e.target.value })}>
              <option value="">All</option>
              {['Flood', 'Cyclone', 'Earthquake', 'Fire', 'Landslide', 'Medical Emergency', 'Building Collapse', 'Road Accident', 'Other'].map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="form-group" style={{ margin: 0 }}>
            <label style={{ fontSize: '0.8rem' }}>Severity</label>
            <select className="form-control" value={filters.severity} onChange={e => setFilters({ ...filters, severity: e.target.value })}>
              <option value="">All</option>
              {['Low', 'Medium', 'High', 'Critical'].map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div className="form-group" style={{ margin: 0 }}>
            <label style={{ fontSize: '0.8rem' }}>Request Type</label>
            <select className="form-control" value={filters.requestType} onChange={e => setFilters({ ...filters, requestType: e.target.value })}>
              <option value="">All</option>
              {['Rescue', 'Food', 'Drinking Water', 'Medicine', 'Medical Assistance', 'Shelter', 'Clothing', 'Transportation', 'Electricity', 'Other'].map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div className="form-group" style={{ margin: 0 }}>
            <label style={{ fontSize: '0.8rem' }}>Status</label>
            <select className="form-control" value={filters.status} onChange={e => setFilters({ ...filters, status: e.target.value })}>
              <option value="">All</option>
              {['Pending', 'Verified', 'Assigned', 'In Progress', 'Completed', 'Rejected'].map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <button className="btn btn-outline btn-sm" style={{ alignSelf: 'flex-end' }} onClick={() => setFilters({ startDate: '', endDate: '', category: '', severity: '', status: '', requestType: '' })}>
            Clear Filters
          </button>
        </div>
      </div>

      {/* KPI Summary */}
      <div className="kpi-grid" style={{ marginBottom: 24 }}>
        <div className="kpi-card info">
          <div className="kpi-icon">⏱️</div>
          <div className="kpi-value">{data.averageCompletionTime}h</div>
          <div className="kpi-label">Avg. Completion Time</div>
        </div>
        <div className="kpi-card success">
          <div className="kpi-icon">👥</div>
          <div className="kpi-value">{data.citizensAssisted}</div>
          <div className="kpi-label">Citizens Assisted</div>
        </div>
        <div className="kpi-card" style={{ borderLeftColor: '#8e44ad' }}>
          <div className="kpi-icon">📈</div>
          <div className="kpi-value">{data.completionRate}%</div>
          <div className="kpi-label">Response Completion Rate</div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid-2" style={{ marginBottom: 24 }}>
        {/* Most Common Emergencies */}
        <div className="chart-container">
          <h3>Most Common Emergency Types</h3>
          {data.commonEmergency.length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={data.commonEmergency}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="_id" tick={{ fontSize: 11 }} angle={-20} textAnchor="end" height={60} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#e74c3c" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : <p style={{ textAlign: 'center', padding: 40, color: 'var(--text-secondary)' }}>No data for selected filters</p>}
        </div>

        {/* Most Requested Relief */}
        <div className="chart-container">
          <h3>Most Requested Relief Types</h3>
          {data.commonRequests.length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={data.commonRequests}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="_id" tick={{ fontSize: 11 }} angle={-20} textAnchor="end" height={60} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#f39c12" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : <p style={{ textAlign: 'center', padding: 40, color: 'var(--text-secondary)' }}>No data</p>}
        </div>

        {/* Top Emergency Areas */}
        <div className="chart-container">
          <h3>Areas with Most Emergencies</h3>
          {data.topAreas.length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={data.topAreas.filter(a => a._id)} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis type="category" dataKey="_id" width={120} tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="count" fill="#3498db" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : <p style={{ textAlign: 'center', padding: 40, color: 'var(--text-secondary)' }}>No data</p>}
        </div>

        {/* Relief Camp Occupancy */}
        <div className="chart-container">
          <h3>Relief Camp Status</h3>
          {data.campStats.length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie data={data.campStats} dataKey="count" nameKey="_id" cx="50%" cy="50%" outerRadius={100} label={({ _id, count }) => `${_id}: ${count}`}>
                  {data.campStats.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : <p style={{ textAlign: 'center', padding: 40, color: 'var(--text-secondary)' }}>No data</p>}
        </div>

        {/* Resource Availability */}
        <div className="chart-container">
          <h3>Resource Stock Status</h3>
          {data.resourceConsumption.length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie data={data.resourceConsumption} dataKey="count" nameKey="_id" cx="50%" cy="50%" outerRadius={100} label={({ _id, count }) => `${_id}: ${count}`}>
                  {data.resourceConsumption.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : <p style={{ textAlign: 'center', padding: 40, color: 'var(--text-secondary)' }}>No data</p>}
        </div>

        {/* Requests Over Time */}
        <div className="chart-container">
          <h3>Emergency Requests Over Time</h3>
          {data.requestsTimeline.length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={data.requestsTimeline}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="count" stroke="#8e44ad" strokeWidth={2} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          ) : <p style={{ textAlign: 'center', padding: 40, color: 'var(--text-secondary)' }}>No data for selected filters</p>}
        </div>
      </div>
    </div>
  );
}
