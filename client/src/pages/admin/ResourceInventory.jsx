import { useState, useEffect } from 'react';
import api from '../../services/api';
import { toast } from 'react-toastify';
import { FaPlus, FaTimes, FaSearch, FaFilter, FaDownload, FaTrash, FaEdit } from 'react-icons/fa';

const TYPES = ['Food', 'Water', 'Medical Supplies', 'Clothing', 'Shelter', 'Electricity', 'Transportation', 'Other'];

export default function ResourceInventory() {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [filters, setFilters] = useState({ type: '', status: '', search: '' });
  const [modal, setModal] = useState(null);
  const [editable, setEditable] = useState(null);

  useEffect(() => { fetchResources(); }, [pagination.page, filters]);

  const fetchResources = async () => {
    try {
      const params = new URLSearchParams({ page: pagination.page, limit: 15 });
      if (filters.type) params.set('type', filters.type);
      if (filters.status) params.set('status', filters.status);
      if (filters.search) params.set('search', filters.search);
      const { data } = await api.get(`/api/resources?${params}`);
      setResources(data.resources || []);
      setPagination({ page: data.page, pages: data.pages, total: data.total });
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const create = async () => {
    if (!modal) return;
    try {
      await api.post('/api/resources', {
        name: modal.name,
        description: modal.description,
        type: modal.type,
        quantity: Number(modal.quantity),
        unit: modal.unit,
        location: modal.location,
        status: modal.status,
        lastVerified: new Date().toISOString()
      });
      toast.success('Resource added!');
      setModal(null);
      fetchResources();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
  };

  const remove = async (id) => {
    if (!window.confirm('Delete this resource?')) return;
    try {
      await api.delete(`/api/resources/${id}`);
      toast.success('Removed');
      fetchResources();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Loading resources...</p>
      </div>
    );
  }

  const filtered = filters.type || filters.status || filters.search
    ? resources.filter(r => {
        const q = (filters.search || '').toLowerCase();
        return (!filters.type || r.type === filters.type)
          && (!filters.status || r.status === filters.status)
          && (!q || r.name.toLowerCase().includes(q) || r.description?.toLowerCase().includes(q));
      })
    : resources;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="mb-0">Resource Inventory</h1>
          <p className="text-muted">Track and manage relief resources</p>
        </div>
        <button className="btn btn-primary" onClick={() => setModal({ name: '', description: '', type: 'Food', quantity: 1, unit: 'kg', location: '', status: 'Available', notes: '' })}>
          <FaPlus /> Add Resource
        </button>
      </div>

      <div className="card mb-3">
        <div className="card-body d-flex align-items-center gap-2 flex-wrap">
          <div className="input-group" style={{ flex: 1 }}>
            <FaSearch />
            <input
              className="form-control"
              placeholder="Search resources..."
              value={filters.search}
              onChange={e => setFilters({ ...filters, search: e.target.value, page: 1 })}
            />
          </div>
          <select className="form-control" value={filters.type} onChange={e => setFilters({ ...filters, type: e.target.value, page: 1 })}>
            <option value="">All Types</option>
            {TYPES.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
          <select className="form-control" value={filters.status} onChange={e => setFilters({ ...filters, status: e.target.value, page: 1 })}>
            <option value="">All Statuses</option>
            <option value="Available">Available</option>
            <option value="In Use">In Use</option>
            <option value="Depleted">Depleted</option>
          </select>
          <button className="btn btn-outline"><FaDownload /> Export</button>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <div className="empty-icon">📦</div>
            <h3>No resources found</h3>
            <p>No resources match your current filters.</p>
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
                  <th>Quantity</th>
                  <th>Location</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(r => (
                  <tr key={r._id}>
                    <td className="fw-semibold">{r.name}</td>
                    <td className="text-sm">{r.type}</td>
                    <td className="text-sm">{r.quantity} {r.unit}</td>
                    <td className="text-sm">{r.location}</td>
                    <td>
                      <span className={`badge bg-${r.status === 'Available' ? 'success' : r.status === 'In Use' ? 'info' : 'danger'}`}>{r.status}</span>
                    </td>
                    <td>
                      <button className="btn btn-sm btn-outline"><FaEdit /> Edit</button>
                      <button className="btn btn-sm btn-outline text-danger" onClick={() => remove(r._id)}><FaTrash /> Delete</button>
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
              <h3>Add Resource</h3>
              <button onClick={() => setModal(null)} className="btn btn-sm btn-outline"><FaTimes /></button>
            </div>
            <div className="modal-body">
              <div className="form-group"><label>Name</label><input className="form-control" value={modal.name} onChange={e => setModal({ ...modal, name: e.target.value })} placeholder="Resource name" /></div>
              <div className="form-group"><label>Description</label><textarea className="form-control" rows={2} value={modal.description} onChange={e => setModal({ ...modal, description: e.target.value })} placeholder="Short description" /></div>
              <div className="row">
                <div className="col-md-6"><div className="form-group"><label>Type</label><select className="form-control" value={modal.type} onChange={e => setModal({ ...modal, type: e.target.value })}>{TYPES.map(t => <option key={t} value={t}>{t}</option>)}</select></div></div>
                <div className="col-md-6"><div className="form-group"><label>Quantity</label><input className="form-control" type="number" value={modal.quantity} onChange={e => setModal({ ...modal, quantity: Number(e.target.value) })} /></div></div>
              </div>
              <div className="form-group"><label>Unit</label><input className="form-control" value={modal.unit} onChange={e => setModal({ ...modal, unit: e.target.value })} placeholder="e.g. kg, bottle, box" /></div>
              <div className="form-group"><label>Location</label><input className="form-control" value={modal.location} onChange={e => setModal({ ...modal, location: e.target.value })} placeholder="Where this is stored" /></div>
              <div className="form-group"><label>Status</label><select className="form-control" value={modal.status} onChange={e => setModal({ ...modal, status: e.target.value })}><option>Available</option><option>In Use</option><option>Depleted</option></select></div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-outline" onClick={() => setModal(null)}>Cancel</button>
              <button className="btn btn-success" onClick={create}>Add Resource</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
