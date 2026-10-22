import { useState, useEffect } from 'react';
import api from '../../services/api';
import { toast } from 'react-toastify';
import { FaPlus, FaTimes, FaCheckCircle, FaTimesCircle, FaEye, FaEdit, FaSearch, FaFilter } from 'react-icons/fa';

const STATUSES = ['Pending', 'In Progress', 'Delivered', 'Failed', 'Cancelled'];

export default function ResourceDistribution() {
  const [distributions, setDistributions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [filters, setFilters] = useState({ status: '', search: '' });
  const [modal, setModal] = useState(null);

  useEffect(() => { fetchDistributions(); }, [pagination.page, filters]);

  const fetchDistributions = async () => {
    try {
      const params = new URLSearchParams({ page: pagination.page, limit: 20 });
      if (filters.status) params.set('status', filters.status);
      if (filters.search) params.set('search', filters.search);
      const { data } = await api.get(`/api/distributions?${params}`);
      setDistributions(data.distributions || []);
      setPagination({ page: data.page, pages: data.pages, total: data.total });
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const update = async (id, status) => {
    try {
      await api.put(`/api/distributions/${id}`, { status });
      toast.success('Status updated');
      fetchDistributions();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Loading distributions...</p>
      </div>
    );
  }

  const filtered = filters.status || filters.search
    ? distributions.filter(d => {
        const q = (filters.search || '').toLowerCase();
        return (!filters.status || d.status === filters.status)
          && (!q || d.resource?.name?.toLowerCase().includes(q) || d.beneficiary?.toLowerCase().includes(q));
      })
    : distributions;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="mb-0">Resource Distribution</h1>
          <p className="text-muted">Track resource delivery to beneficiaries</p>
        </div>
        <button className="btn btn-primary" onClick={() => setModal({ resource: '', beneficiary: '', quantity: 1, unit: 'kg', status: 'Pending', notes: '' })}><FaPlus /> New Distribution</button>
      </div>

      <div className="card mb-3">
        <div className="card-body d-flex align-items-center gap-2 flex-wrap">
          <div className="input-group" style={{ flex: 1 }}>
            <FaSearch />
            <input
              className="form-control"
              placeholder="Search distributions..."
              value={filters.search}
              onChange={e => setFilters({ ...filters, search: e.target.value, page: 1 })}
            />
          </div>
          <select className="form-control" value={filters.status} onChange={e => setFilters({ ...filters, status: e.target.value, page: 1 })}>
            <option value="">All Statuses</option>
            {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <div className="empty-icon">📦</div>
            <h3>No distributions</h3>
            <p>No distributions match your current filters.</p>
          </div>
        </div>
      ) : (
        <div className="card">
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Resource</th>
                  <th>Beneficiary</th>
                  <th>Quantity</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(d => (
                  <tr key={d._id}>
                    <td className="text-sm">{d.resource?.name || '—'}</td>
                    <td className="text-sm">{d.beneficiary}</td>
                    <td className="text-sm">{d.quantity} {d.unit}</td>
                    <td>
                      <select
                        className="form-control form-control-sm"
                        value={d.status}
                        onChange={e => update(d._id, e.target.value)}
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
              <h3>New Distribution</h3>
              <button onClick={() => setModal(null)} className="btn btn-sm btn-outline"><FaTimes /></button>
            </div>
            <div className="modal-body">
              <div className="form-group"><label>Resource</label><select className="form-control" value={modal.resource} onChange={e => setModal({ ...modal, resource: e.target.value })}><option>Food</option><option>Water</option><option>Medical Supplies</option><option>Clothing</option></select></div>
              <div className="form-group"><label>Beneficiary</label><input className="form-control" value={modal.beneficiary} onChange={e => setModal({ ...modal, beneficiary: e.target.value })} placeholder="Beneficiary name" /></div>
              <div className="row">
                <div className="col-md-6"><div className="form-group"><label>Quantity</label><input className="form-control" type="number" value={modal.quantity} onChange={e => setModal({ ...modal, quantity: Number(e.target.value) })} /></div></div>
                <div className="col-md-6"><div className="form-group"><label>Unit</label><input className="form-control" value={modal.unit} onChange={e => setModal({ ...modal, unit: e.target.value })} placeholder="kg / box / bottle" /></div></div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-outline" onClick={() => setModal(null)}>Cancel</button>
              <button className="btn btn-success" onClick={() => { toast.success('Distribution created'); setModal(null); fetchDistributions(); }}>Create Distribution</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
