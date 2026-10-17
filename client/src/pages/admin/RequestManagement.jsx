import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { toast } from 'react-toastify';
import { FaHandHoldingHeart } from 'react-icons/fa';

const STATUSES = ['Pending', 'Verified', 'Assigned', 'In Progress', 'Completed', 'Rejected'];
const REQUEST_TYPES = ['Rescue', 'Food', 'Drinking Water', 'Medicine', 'Medical Assistance', 'Shelter', 'Clothing', 'Transportation', 'Electricity', 'Other'];
const PRIORITIES = ['Normal', 'Urgent', 'Critical'];

export default function RequestManagement() {
  const [requests, setRequests] = useState([]);
  const [volunteers, setVolunteers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [filters, setFilters] = useState({ requestType: '', priority: '', status: '', search: '' });
  const [assignModal, setAssignModal] = useState(null);
  const [selectedVolunteer, setSelectedVolunteer] = useState('');

  useEffect(() => { fetchRequests(); }, [pagination.page, filters]);

  useEffect(() => {
    const fetchVolunteers = async () => {
      try {
        const { data } = await api.get('/api/volunteers/available');
        setVolunteers(data);
      } catch (err) { console.error(err); }
    };
    fetchVolunteers();
  }, []);

  const fetchRequests = async () => {
    try {
      const params = new URLSearchParams({ page: pagination.page, limit: 15 });
      if (filters.requestType) params.set('requestType', filters.requestType);
      if (filters.priority) params.set('priority', filters.priority);
      if (filters.status) params.set('status', filters.status);
      if (filters.search) params.set('search', filters.search);
      const { data } = await api.get(`/api/requests?${params}`);
      setRequests(data.requests || []);
      setPagination({ page: data.page, pages: data.pages, total: data.total });
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/api/requests/${id}`, { status });
      toast.success('Status updated');
      fetchRequests();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
  };

  const handleAssign = async () => {
    if (!selectedVolunteer) return toast.error('Select a volunteer');
    try {
      await api.post('/api/assignments', {
        volunteerId: selectedVolunteer,
        requestId: assignModal._id,
        taskDescription: `Handle ${assignModal.requestType} request: ${assignModal.description}`,
        priority: assignModal.priority === 'Critical' ? 'Critical' : assignModal.priority === 'Urgent' ? 'High' : 'Medium'
      });
      toast.success('Volunteer assigned!');
      setAssignModal(null);
      setSelectedVolunteer('');
      fetchRequests();
    } catch (err) { toast.error(err.response?.data?.message || 'Assignment failed'); }
  };

  return (
    <div>
      <h2 style={{ marginBottom: 20 }}><FaHandHoldingHeart /> Citizen Requests</h2>

      <div className="filter-bar">
        <input type="text" placeholder="Search requests..." value={filters.search} onChange={e => { setFilters({ ...filters, search: e.target.value }); setPagination(p => ({ ...p, page: 1 })); }} />
        <select className="form-control" value={filters.requestType} onChange={e => { setFilters({ ...filters, requestType: e.target.value }); setPagination(p => ({ ...p, page: 1 })); }}>
          <option value="">All Types</option>
          {REQUEST_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
        <select className="form-control" value={filters.priority} onChange={e => { setFilters({ ...filters, priority: e.target.value }); setPagination(p => ({ ...p, page: 1 })); }}>
          <option value="">All Priorities</option>
          {PRIORITIES.map(p => <option key={p} value={p}>{p}</option>)}
        </select>
        <select className="form-control" value={filters.status} onChange={e => { setFilters({ ...filters, status: e.target.value }); setPagination(p => ({ ...p, page: 1 })); }}>
          <option value="">All Statuses</option>
          {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {loading ? (
        <div className="loading"><div className="spinner"></div>Loading...</div>
      ) : requests.length === 0 ? (
        <div className="card"><div className="empty-state"><div className="empty-icon">📋</div><h4>No requests found</h4></div></div>
      ) : (
        <div className="card">
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Type</th>
                  <th>People</th>
                  <th>Priority</th>
                  <th>Location</th>
                  <th>Citizen</th>
                  <th>Volunteer</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {requests.map(req => (
                  <tr key={req._id}>
                    <td><span className="badge badge-info">{req.requestType}</span></td>
                    <td>{req.peopleCount}</td>
                    <td><span className={`badge badge-${req.priority === 'Critical' ? 'critical' : req.priority === 'Urgent' ? 'warning' : 'secondary'}`}>{req.priority}</span></td>
                    <td style={{ fontSize: '0.85rem', maxWidth: 120, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{req.location}</td>
                    <td style={{ fontSize: '0.85rem' }}>{req.citizen?.name || '—'}</td>
                    <td style={{ fontSize: '0.85rem' }}>{req.assignedVolunteer?.name || '—'}</td>
                    <td><span className={`badge badge-${req.status === 'Completed' ? 'success' : req.status === 'Rejected' ? 'danger' : req.status === 'In Progress' ? 'warning' : 'info'}`}>{req.status}</span></td>
                    <td>
                      <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                        {req.status !== 'Completed' && req.status !== 'Rejected' && (
                          <select className="form-control" style={{ width: 110, padding: '3px 6px', fontSize: '0.75rem' }}
                            value={req.status} onChange={e => updateStatus(req._id, e.target.value)}>
                            {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                          </select>
                        )}
                        {(req.status === 'Pending' || req.status === 'Verified') && !req.assignedVolunteer && (
                          <button className="btn btn-sm btn-primary" onClick={() => setAssignModal(req)}>Assign</button>
                        )}
                        <Link to={`/admin/requests/${req._id}`} className="btn btn-sm btn-outline">View</Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {pagination.pages > 1 && (
            <div className="pagination">
              <button disabled={pagination.page <= 1} onClick={() => setPagination(p => ({ ...p, page: p.page - 1 }))}>← Prev</button>
              <span>Page {pagination.page} of {pagination.pages}</span>
              <button disabled={pagination.page >= pagination.pages} onClick={() => setPagination(p => ({ ...p, page: p.page + 1 }))}>Next →</button>
            </div>
          )}
        </div>
      )}

      {/* Assign Volunteer Modal */}
      {assignModal && (
        <div className="modal-overlay" onClick={() => setAssignModal(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Assign Volunteer</h3>
              <button onClick={() => setAssignModal(null)} style={{ background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer' }}>✕</button>
            </div>
            <div className="modal-body">
              <p style={{ marginBottom: 12 }}>
                <strong>Request:</strong> {assignModal.requestType} — {assignModal.description}
              </p>
              <p style={{ marginBottom: 16 }}><strong>People:</strong> {assignModal.peopleCount} | <strong>Priority:</strong> {assignModal.priority}</p>

              <div className="form-group">
                <label>Select Available Volunteer</label>
                <select className="form-control" value={selectedVolunteer} onChange={e => setSelectedVolunteer(e.target.value)}>
                  <option value="">-- Select Volunteer --</option>
                  {volunteers.map(v => (
                    <option key={v._id} value={v.user?._id || v.user}>
                      {v.user?.name || 'Volunteer'} — {v.skills?.join(', ')} — {v.location}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-outline" onClick={() => setAssignModal(null)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleAssign}>Assign Volunteer</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
