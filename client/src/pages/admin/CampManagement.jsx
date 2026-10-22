import { useState, useEffect } from 'react';
import api from '../../services/api';
import { toast } from 'react-toastify';
import { FaHandHoldingHeart, FaTimes, FaCheckCircle, FaEye, FaEdit, FaFilter, FaUserMd, FaMapMarkerAlt, FaBriefcase } from 'react-icons/fa';

const STATUSES = ['Scheduled', 'Approved', 'On Hold', 'Ongoing', 'Completed'];
const PRIORITIES = ['Normal', 'High', 'Critical'];

export default function CampManagement() {
  const [camps, setCamps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [filters, setFilters] = useState({ type: '', status: '', search: '' });
  const [modal, setModal] = useState(null);

  useEffect(() => { fetchCamps(); }, [pagination.page, filters]);

  const fetchCamps = async () => {
    try {
      const params = new URLSearchParams({ page: pagination.page, limit: 15 });
      if (filters.type) params.set('type', filters.type);
      if (filters.status) params.set('status', filters.status);
      if (filters.search) params.set('search', filters.search);
      const { data } = await api.get(`/api/camps?${params}`);
      setCamps(data.camps || []);
      setPagination({ page: data.page, pages: data.pages, total: data.total });
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const create = async () => {
    if (!modal) return;
    try {
      await api.post('/api/camps', {
        name: modal.name,
        location: modal.location,
        address: modal.address,
        capacity: Number(modal.capacity),
        facilities: [modal.facilities],
        status: modal.status,
        notes: modal.notes
      });
      toast.success('Camp created!');
      setModal(null);
      fetchCamps();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Loading camps...</p>
      </div>
    );
  }

  const filtered = filters.type || filters.status || filters.search
    ? camps.filter(c => {
        const q = (filters.search || '').toLowerCase();
        return (!filters.type || c.type === filters.type)
          && (!filters.status || c.status === filters.status)
          && (!q || c.name.toLowerCase().includes(q) || c.location.toLowerCase().includes(q));
      })
    : camps;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="mb-0">Relief Camps</h1>
          <p className="text-muted">Manage shelter and relief camp inventory</p>
        </div>
        <button className="btn btn-primary" onClick={() => setModal({ name: '', location: '', address: '', capacity: 100, facilities: 'Shelter', status: 'Active', notes: '' })}>
          <FaPlus /> New Camp
        </button>
      </div>

      <div className="card mb-3">
        <div className="card-body d-flex align-items-center gap-2 flex-wrap">
          <input
            type="text"
            className="form-control"
            placeholder="Search camps..."
            value={filters.search}
            onChange={e => setFilters({ ...filters, search: e.target.value, page: 1 })}
          />
          <select className="form-control" value={filters.type} onChange={e => setFilters({ ...filters, type: e.target.value, page: 1 })}>
            <option value="">All Types</option>
            <option value="Shelter">Shelter</option>
            <option value="Medical">Medical</option>
            <option value="Food">Food</option>
            <option value="Other">Other</option>
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
            <div className="empty-icon">🏕️</div>
            <h3>No camps found</h3>
            <p>Use the filters to narrow down your search.</p>
          </div>
        </div>
      ) : (
        <div className="card">
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Type</th>
                  <th>Location</th>
                  <th>Capacity</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(camp => (
                  <tr key={camp._id}>
                    <td className="fw-semibold">{camp.name}</td>
                    <td className="text-sm">{camp.type}</td>
                    <td className="text-sm">{camp.location}</td>
                    <td className="text-sm">{camp.capacity}</td>
                    <td>
                      <select
                        className="form-control form-control-sm"
                        value={camp.status}
                        onChange={e => {
                          api.put(`/api/camps/${camp._id}`, { status: e.target.value }).catch(() => {});
                          fetchCamps();
                        }}
                      >
                        {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </td>
                    <td>
                      <button className="btn btn-sm btn-outline"><FaEye /> View</button>
                      <button className="btn btn-sm btn-outline"><FaEdit /> Edit</button>
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
        <div className="modal-overlay" onClick={() => setModal(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>New Relief Camp</h3>
              <button onClick={() => setModal(null)} className="btn btn-sm btn-outline"><FaTimes /></button>
            </div>
            <div className="modal-body">
              <div className="form-group"><label>Name</label><input className="form-control" value={modal.name} onChange={e => setModal({ ...modal, name: e.target.value })} placeholder="Camp name" /></div>
              <div className="form-group"><label>Location</label><input className="form-control" value={modal.location} onChange={e => setModal({ ...modal, location: e.target.value })} placeholder="Village / district" /></div>
              <div className="form-group"><label>Address</label><input className="form-control" value={modal.address} onChange={e => setModal({ ...modal, address: e.target.value })} placeholder="Full address" /></div>
              <div className="row">
                <div className="col-md-6"><div className="form-group"><label>Capacity</label><input className="form-control" type="number" value={modal.capacity} onChange={e => setModal({ ...modal, capacity: Number(e.target.value) })} /></div></div>
                <div className="col-md-6"><div className="form-group"><label>Type</label><select className="form-control" value={modal.facilities} onChange={e => setModal({ ...modal, facilities: e.target.value })}><option>Shelter</option><option>Medical</option><option>Food</option><option>Other</option></select></div></div>
              </div>
              <div className="form-group"><label>Status</label><select className="form-control" value={modal.status} onChange={e => setModal({ ...modal, status: e.target.value })}><option>Active</option><option>Closed</option><option>Maintenance</option></select></div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-outline" onClick={() => setModal(null)}>Cancel</button>
              <button className="btn btn-success" onClick={create}>Create Camp</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
