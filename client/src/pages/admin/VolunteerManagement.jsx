import { useState, useEffect } from 'react';
import api from '../../services/api';
import { toast } from 'react-toastify';
import { FaSearch, FaFilter, FaCheckCircle, FaTimes, FaEdit, FaTrash, FaUserMd, FaMapMarkerAlt, FaBriefcase, FaCalendarAlt } from 'react-icons/fa';

const STATUSES = ['Active', 'Inactive', 'On Leave', 'Rejected', 'Pending'];
const USER_ROLES = ['admin', 'volunteer', 'citizen'];

export default function VolunteerManagement() {
  const [volunteers, setVolunteers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [filters, setFilters] = useState({ status: '', role: '', skills: '', search: '' });
  const [modal, setModal] = useState(null);

  useEffect(() => { fetchVolunteers(); }, [pagination.page, filters]);

  const fetchVolunteers = async () => {
    try {
      const params = new URLSearchParams({ page: pagination.page, limit: 15 });
      if (filters.status) params.set('status', filters.status);
      if (filters.role) params.set('role', filters.role);
      if (filters.skills) params.set('skills', filters.skills);
      if (filters.search) params.set('search', filters.search);
      const { data } = await api.get(`/api/volunteers?${params}`);
      setVolunteers(data.volunteers || []);
      setPagination({ page: data.page, pages: data.pages, total: data.total });
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const create = async () => {
    if (!modal) return;
    try {
      const { data } = await api.post('/api/volunteers', {
        user: modal.user,
        skills: [modal.skills],
        location: modal.location,
        availability: modal.availability,
        phone: modal.phone,
        experience: modal.experience
      });
      toast.success('Volunteer saved');
      setModal(null);
      fetchVolunteers();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Loading volunteers...</p>
      </div>
    );
  }

  const filtered = filters.status || filters.role || filters.skills || filters.search
    ? volunteers.filter(v => {
        const q = (filters.search || '').toLowerCase();
        return (!filters.status || v.status === filters.status)
          && (!filters.role || v.user?.role === filters.role)
          && (!filters.skills || v.skills?.includes(filters.skills))
          && (!q || v.user?.name?.toLowerCase().includes(q) || v.location?.toLowerCase().includes(q));
      })
    : volunteers;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="mb-0">Volunteer Coordination</h1>
          <p className="text-muted">Manage volunteers and their capabilities</p>
        </div>
        <button className="btn btn-primary" onClick={() => setModal({ user: '', skills: 'First Aid', location: '', availability: 'Full Time', phone: '', experience: '' })}><FaUserMd /> New Volunteer</button>
      </div>

      <div className="card mb-3">
        <div className="card-body d-flex align-items-center gap-2 flex-wrap">
          <div className="input-group" style={{ flex: 1 }}>
            <FaSearch />
            <input
              className="form-control"
              placeholder="Search volunteers..."
              value={filters.search}
              onChange={e => setFilters({ ...filters, search: e.target.value, page: 1 })}
            />
          </div>
          <select className="form-control" value={filters.status} onChange={e => setFilters({ ...filters, status: e.target.value, page: 1 })}>
            <option value="">All Statuses</option>
            {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <select className="form-control" value={filters.role} onChange={e => setFilters({ ...filters, role: e.target.value, page: 1 })}>
            <option value="">All Roles</option>
            {USER_ROLES.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <div className="empty-icon">👥</div>
            <h3>No volunteers found</h3>
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
                  <th>Status</th>
                  <th>Skills</th>
                  <th>Location</th>
                  <th>Availability</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(v => (
                  <tr key={v._id}>
                    <td className="fw-semibold">{v.user?.name || '—'}</td>
                    <td>
                      <span className={`badge bg-${v.status === 'Active' ? 'success' : v.status === 'Pending' ? 'warning' : v.status === 'Inactive' ? 'secondary' : 'danger'}`}>{v.status}</span>
                    </td>
                    <td className="text-sm">{v.skills?.join(', ') || '—'}</td>
                    <td className="text-sm">{v.location}</td>
                    <td className="text-sm"><span className="badge bg-secondary">{v.availability}</span></td>
                    <td>
                      <button className="btn btn-sm btn-outline"><FaEdit /> Edit</button>
                      <button className="btn btn-sm btn-outline text-danger" onClick={() => { if (window.confirm('Delete?')) { fetchVolunteers(); } }}><FaTrash /></button>
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
              <h3>New Volunteer</h3>
              <button onClick={() => setModal(null)} className="btn btn-sm btn-outline"><FaTimes /></button>
            </div>
            <div className="modal-body">
              <div className="form-group"><label>Name</label><input className="form-control" value={modal.user} onChange={e => setModal({ ...modal, user: e.target.value })} placeholder="Full name" /></div>
              <div className="form-group"><label>Skills</label><select className="form-control" value={modal.skills} onChange={e => setModal({ ...modal, skills: e.target.value })}><option>First Aid</option><option>Logistics</option><option>Translation</option><option>Driving</option><option>Search & Rescue</option><option>Cooking</option><option>Other</option></select></div>
              <div className="form-group"><label>Location</label><input className="form-control" value={modal.location} onChange={e => setModal({ ...modal, location: e.target.value })} placeholder="Village / district" /></div>
              <div className="form-group"><label>Availability</label><select className="form-control" value={modal.availability} onChange={e => setModal({ ...modal, availability: e.target.value })}><option>Full Time</option><option>Part Time</option><option>Weekend Only</option></select></div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-outline" onClick={() => setModal(null)}>Cancel</button>
              <button className="btn btn-success" onClick={create}>Save Volunteer</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
