import { useState, useEffect } from 'react';
import api from '../../services/api';
import { toast } from 'react-toastify';
import { FaExclamationTriangle } from 'react-icons/fa';

const STATUSES = ['Reported', 'Verified', 'In Progress', 'Resolved', 'Rejected'];
const SEVERITIES = ['Low', 'Medium', 'High', 'Critical'];
const CATEGORIES = ['Flood', 'Cyclone', 'Earthquake', 'Fire', 'Landslide', 'Medical Emergency', 'Building Collapse', 'Road Accident', 'Other'];

export default function EmergencyManagement() {
  const [emergencies, setEmergencies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [filters, setFilters] = useState({ category: '', severity: '', status: '', search: '' });

  useEffect(() => { fetchEmergencies(); }, [pagination.page, filters]);

  const fetchEmergencies = async () => {
    try {
      const params = new URLSearchParams({ page: pagination.page, limit: 15 });
      if (filters.category) params.set('category', filters.category);
      if (filters.severity) params.set('severity', filters.severity);
      if (filters.status) params.set('status', filters.status);
      if (filters.search) params.set('search', filters.search);
      const { data } = await api.get(`/api/emergencies?${params}`);
      setEmergencies(data.emergencies || []);
      setPagination({ page: data.page, pages: data.pages, total: data.total });
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/api/emergencies/${id}`, { status });
      toast.success('Status updated');
      fetchEmergencies();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
  };

  return (
    <div>
      <h2 style={{ marginBottom: 20 }}><FaExclamationTriangle /> Emergency Management</h2>

      {/* Filters */}
      <div className="filter-bar">
        <input type="text" placeholder="Search emergencies..." value={filters.search} onChange={e => { setFilters({ ...filters, search: e.target.value }); setPagination(p => ({ ...p, page: 1 })); }} />
        <select className="form-control" value={filters.category} onChange={e => { setFilters({ ...filters, category: e.target.value }); setPagination(p => ({ ...p, page: 1 })); }}>
          <option value="">All Categories</option>
          {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <select className="form-control" value={filters.severity} onChange={e => { setFilters({ ...filters, severity: e.target.value }); setPagination(p => ({ ...p, page: 1 })); }}>
          <option value="">All Severities</option>
          {SEVERITIES.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <select className="form-control" value={filters.status} onChange={e => { setFilters({ ...filters, status: e.target.value }); setPagination(p => ({ ...p, page: 1 })); }}>
          <option value="">All Statuses</option>
          {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {loading ? (
        <div className="loading"><div className="spinner"></div>Loading...</div>
      ) : emergencies.length === 0 ? (
        <div className="card"><div className="empty-state"><div className="empty-icon">📋</div><h4>No emergencies found</h4></div></div>
      ) : (
        <div className="card">
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Severity</th>
                  <th>People</th>
                  <th>Location</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {emergencies.map(emg => (
                  <tr key={emg._id}>
                    <td style={{ fontWeight: 500 }}>{emg.title}</td>
                    <td><span className="badge badge-info">{emg.category}</span></td>
                    <td><span className={`badge badge-${emg.severity === 'Critical' ? 'critical' : emg.severity === 'High' ? 'danger' : emg.severity === 'Medium' ? 'warning' : 'secondary'}`}>{emg.severity}</span></td>
                    <td>{emg.peopleAffected}</td>
                    <td style={{ fontSize: '0.85rem', maxWidth: 150, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{emg.location}</td>
                    <td><span className={`badge badge-${emg.status === 'Resolved' ? 'success' : emg.status === 'Rejected' ? 'danger' : emg.status === 'In Progress' ? 'warning' : 'info'}`}>{emg.status}</span></td>
                    <td style={{ fontSize: '0.8rem' }}>{new Date(emg.createdAt).toLocaleDateString()}</td>
                    <td>
                      <select className="form-control" style={{ width: 130, padding: '4px 8px', fontSize: '0.8rem' }}
                        value={emg.status} onChange={e => updateStatus(emg._id, e.target.value)}>
                        {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="pagination">
              <button disabled={pagination.page <= 1} onClick={() => setPagination(p => ({ ...p, page: p.page - 1 }))}>← Prev</button>
              <span>Page {pagination.page} of {pagination.pages} ({pagination.total} total)</span>
              <button disabled={pagination.page >= pagination.pages} onClick={() => setPagination(p => ({ ...p, page: p.page + 1 }))}>Next →</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
