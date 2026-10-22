import { useState, useEffect } from 'react';
import api from '../../services/api';
import { toast } from 'react-toastify';
import { FaHandHoldingHeart, FaCheckCircle, FaTimes, FaArrowLeft } from 'react-icons/fa';

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
    if (!assignModal) return;
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

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Loading requests...</p>
      </div>
    );
  }

  const filtered = filters.requestType || filters.priority || filters.status || filters.search
    ? requests
    : [];

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="mb-0">Citizen Requests</h1>
          <p className="text-muted">Review and manage assistance requests from citizens</p>
        </div>
        <button className="btn btn-primary" onClick={() => setAssignModal(null)}>
          <FaHandHoldingHeart /> New Request
        </button>
      </div>

      <div className="card mb-3">
        <div className="card-body d-flex align-items-center gap-2 flex-wrap">
          <input
            type="text"
            className="form-control"
            placeholder="Search requests..."
            value={filters.search}
            onChange={e => setFilters({ ...filters, search: e.target.value, page: 1 })}
          />
          <select className="form-control" value={filters.requestType} onChange={e => setFilters({ ...filters, requestType: e.target.value, page: 1 })}>
            <option value="">All Types</option>
            {REQUEST_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
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
            <div className="empty-icon">📋</div>
            <h3>No requests found</h3>
            <p>Use the filters to narrow down your search.</p>
          </div>
        </div>
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
                {filtered.map(req => (
                  <tr key={req._id}>
                    <td><span className="badge bg-info">{req.requestType}</span></td>
                    <td className="text-sm">{req.peopleCount}</td>
                    <td>
                      <span className={`badge bg-${req.priority === 'Critical' ? 'critical' : req.priority === 'Urgent' ? 'warning' : 'secondary'}`}>
                        {req.priority}
                      </span>
                    </td>
                    <td className="text-sm">{req.location}</td>
                    <td className="text-sm">{req.citizen?.name || '—'}</td>
                    <td className="text-sm">{req.assignedVolunteer?.name || '—'}</td>
                    <td>
                      <span className={`badge bg-${req.status === 'Completed' ? 'success' : req.status === 'Rejected' ? 'danger' : req.status === 'In Progress' ? 'warning' : req.status === 'Assigned' ? 'info' : req.status === 'Verified' ? 'primary' : 'secondary'}`}>
                        {req.status}
                      </span>
                    </td>
                    <td>
                      <div className="d-flex gap-2 flex-wrap">
                        {req.status !== 'Completed' && req.status !== 'Rejected' && (
                          <>
                            <select
                              className="form-control form-control-sm"
                              value={req.status}
                              onChange={e => updateStatus(req._id, e.target.value)}
                            >
                              {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                            {req.status === 'Pending' && (
                              <button className="btn btn-sm btn-success" onClick={() => setAssignModal(req)}>
                                Assign
                              </button>
                            )}
                          </>
                        )}
                        <a href={`/admin/requests/${req._id}`} className="btn btn-sm btn-outline"><FaTimes /> Close</a>
                      </div>
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
                  <li>
                    <button
                      className="btn btn-sm btn-outline"
                      disabled={pagination.page <= 1}
                      onClick={() => setPagination(p => ({ ...p, page: p.page - 1 }))}
                    >
                      ← Prev
                    </button>
                  </li>
                  <li>
                    <button className="btn btn-sm btn-outline">
                      Page {pagination.page} of {pagination.pages} ({pagination.total} total)
                    </button>
                  </li>
                  <li>
                    <button
                      className="btn btn-sm btn-outline"
                      disabled={pagination.page >= pagination.pages}
                      onClick={() => setPagination(p => ({ ...p, page: p.page + 1 }))}
                    >
                      Next →
                    </button>
                  </li>
                </ul>
              </nav>
            </div>
          )}
        </div>
      )}

      {/* Assign Volunteer Modal */}
      {assignModal && (
        <div className="modal-overlay" onClick={() => setAssignModal(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Assign Volunteer to Request</h3>
              <button onClick={() => setAssignModal(null)} className="btn btn-sm btn-outline"><FaTimes /></button>
            </div>
            <div className="modal-body">
              <div className="d-flex align-items-center gap-3 mb-3">
                <div style={{ fontSize: '1.4rem' }}><FaHandHoldingHeart /></div>
                <div>
                  <strong className="mb-0">{assignModal.requestType}</strong>
                  <p className="text-secondary mb-0 small">{assignModal.description}</p>
                </div>
              </div>
              <div className="d-flex align-items-center gap-2 mb-3">
                <span className={`badge bg-${assignModal.priority === 'Critical' ? 'critical' : assignModal.priority === 'Urgent' ? 'warning' : 'secondary'}`}>{assignModal.priority}</span>
                <span className="badge bg-info">{assignModal.status}</span>
                <span className="badge bg-secondary">📍 {assignModal.location}</span>
                <span className="badge bg-secondary">👥 {assignModal.peopleCount} people</span>
              </div>

              <div className="form-group">
                <label>Select Available Volunteer</label>
                <select
                  className="form-control"
                  value={selectedVolunteer}
                  onChange={e => setSelectedVolunteer(e.target.value)}
                >
                  <option value="">-- Select Volunteer --</option>
                  {volunteers.map(v => (
                    <option key={v._id} value={v.user?._id || v.user}>
                      {v.user?.name || 'Volunteer'} — {v.skills?.join(', ') || 'No skills'} — {v.location}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-outline" onClick={() => setAssignModal(null)}>Cancel</button>
              <button className="btn btn-success" onClick={handleAssign}>Assign Volunteer</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
