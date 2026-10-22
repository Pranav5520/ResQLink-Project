import { useState, useEffect } from 'react';
import api from '../../services/api';
import { toast } from 'react-toastify';
import { FaTimesCircle, FaCheckCircle, FaPlus, FaSearch, FaFilter, FaMapMarkerAlt, FaUserMd, FaPhone, FaInfoCircle } from 'react-icons/fa';

const TYPES = ['Fire', 'Flood', 'Earthquake', 'Medical', 'Accident', 'Crime', 'Industrial', 'Other'];
const STATUSES = ['Reported', 'Verified', 'Assigned', 'Resolved', 'Closed'];
const PRIORITIES = ['Normal', 'High', 'Critical'];

export default function EmergencyManagement() {
  const [emergencies, setEmergencies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [filters, setFilters] = useState({ type: '', status: '', priority: '', search: '' });
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', type: 'Fire', priority: 'High', location: '', latitude: 0, longitude: 0, peopleAffected: 0 });

  useEffect(() => { fetchEmergencies(); }, [pagination.page, filters]);

  const fetchEmergencies = async () => {
    try {
      const params = new URLSearchParams({ page: pagination.page, limit: 15 });
      if (filters.type) params.set('type', filters.type);
      if (filters.status) params.set('status', filters.status);
      if (filters.priority) params.set('priority', filters.priority);
      if (filters.search) params.set('search', filters.search);
      const { data } = await api.get(`/api/emergencies?${params}`);
      setEmergencies(data.emergencies || []);
      setPagination({ page: data.page, pages: data.pages, total: data.total });
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const create = async () => {
    try {
      await api.post('/api/emergencies', {
        title: form.title,
        description: form.description,
        type: form.type,
        priority: form.priority,
        location: form.location,
        latitude: form.latitude,
        longitude: form.longitude,
        peopleAffected: form.peopleAffected,
        status: 'Reported'
      });
      toast.success('Incident reported');
      setModal(false);
      setForm({ title: '', description: '', type: 'Fire', priority: 'High', location: '', latitude: 0, longitude: 0, peopleAffected: 0 });
      fetchEmergencies();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
  };

  const update = async (id, status) => {
    try {
      await api.put(`/api/emergencies/${id}`, { status });
      toast.success('Status updated');
      fetchEmergencies();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Loading incidents...</p>
      </div>
    );
  }

  const filtered = filters.type || filters.status || filters.priority || filters.search
    ? emergencies.filter(e => {
        const q = (filters.search || '').toLowerCase();
        return (!filters.type || e.type === filters.type)
          && (!filters.status || e.status === filters.status)
          && (!filters.priority || e.priority === filters.priority)
          && (!q || e.title.toLowerCase().includes(q) || e.location?.toLowerCase().includes(q));
      })
    : emergencies;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="mb-0">Incident Management</h1>
          <p className="text-muted">Manage and coordinate emergency response incidents</p>
        </div>
        <button className="btn btn-primary" onClick={() => setModal(true)}><FaPlus /> New Incident</button>
      </div>

      <div className="card mb-3">
        <div className="card-body d-flex align-items-center gap-2 flex-wrap">
          <div className="input-group" style={{ flex: 1 }}>
            <FaSearch />
            <input
              className="form-control"
              placeholder="Search incidents..."
              value={filters.search}
              onChange={e => setFilters({ ...filters, search: e.target.value, page: 1 })}
            />
          </div>
          <select className="form-control" value={filters.type} onChange={e => setFilters({ ...filters, type: e.target.value, page: 1 })}>
            <option value="">All Types</option>
            {TYPES.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
          <select className="form-control" value={filters.priority} onChange={e => setFilters({ ...filters, priority: e.target.value, page: 1 })}>
            <option value="">All Priorities</option>
            {PRIORITIES.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
          <select className="form-control" value={filters.status} onChange={e => setFilters({ ...filters, status: e.target.value, page: 1 })}>
            <option value="">All Statuses</option>
            {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <div className="empty-icon">🚨</div>
            <h3>No incidents recorded</h3>
            <p>Report or review incidents using the filters above.</p>
          </div>
        </div>
      ) : (
        <div className="card">
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Type</th>
                  <th>Title</th>
                  <th>Location</th>
                  <th>Priority</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(e => (
                  <tr key={e._id}>
                    <td><span className="badge bg-info">{e.type}</span></td>
                    <td className="fw-semibold">{e.title}</td>
                    <td className="text-sm">{e.location}</td>
                    <td>
                      <span className={`badge bg-${e.priority === 'Critical' ? 'critical' : e.priority === 'High' ? 'warning' : 'secondary'}`}>{e.priority}</span>
                    </td>
                    <td>
                      <select
                        className="form-control form-control-sm"
                        value={e.status}
                        onChange={e => update(e._id, e.target.value)}
                      >
                        {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </td>
                    <td>
                      <button className="btn btn-sm btn-outline"><FaInfoCircle /> Details</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {pagination.pages > 1 && (
            <div className="d-flex justify-content-between align-items-center mt-3 pt-3 border-top">
              <nav>
                <ul className="pagination">
                  <li><button className="btn btn-sm btn-outline" disabled={pagination.page <= 1} onClick={() => setPagination(p => ({ ...p, page: p.page - 1 }))}>← Prev</button></li>
                  <li><button className="btn btn-sm btn-outline">Page {pagination.page} of {pagination.pages} ({pagination.total} total)</button></li>
                  <li><button className="btn btn-sm btn-outline" disabled={pagination.page >= pagination.pages} onClick={() => setPagination(p => ({ ...p, page: p.page + 1 }))}>Next →</button></li>
                </ul>
              </nav>
            </div>
          )}
        </div>
      )}

      {modal && (
        <div className="modal-overlay" onClick={() => setModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>New Incident</h3>
              <button onClick={() => setModal(false)} className="btn btn-sm btn-outline"><FaTimes /></button>
            </div>
            <div className="modal-body">
              <div className="form-group"><label>Title</label><input className="form-control" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Incident title" /></div>
              <div className="form-group"><label>Description</label><textarea className="form-control" rows={3} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Describe the incident" /></div>
              <div className="row">
                <div className="col-md-6"><div className="form-group"><label>Type</label><select className="form-control" value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>{TYPES.map(t => <option key={t} value={t}>{t}</option>)}</select></div></div>
                <div className="col-md-6"><div className="form-group"><label>Priority</label><select className="form-control" value={form.priority} onChange={e => setForm({ ...form, priority: e.target.value })}><option>High</option><option>Critical</option><option>Normal</option></select></div></div>
              </div>
              <div className="form-group"><label>Location</label><input className="form-control" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} placeholder="Village / district" /></div>
              <div className="row">
                <div className="col-md-6"><div className="form-group"><label>People Affected</label><input className="form-control" type="number" value={form.peopleAffected} onChange={e => setForm({ ...form, peopleAffected: Number(e.target.value) })} /></div></div>
                <div className="col-md-6"><div className="form-group"><label>Coordinates</label><input className="form-control" value={form.latitude} onChange={e => setForm({ ...form, latitude: Number(e.target.value) })} placeholder="Latitude" /></div></div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-outline" onClick={() => setModal(false)}>Cancel</button>
              <button className="btn btn-success" onClick={create}>Report Incident</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
