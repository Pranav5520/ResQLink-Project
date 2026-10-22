import { useState, useEffect } from 'react';
import api from '../../services/api';
import { toast } from 'react-toastify';
import { FaTasks, FaCheckCircle, FaClock, FaExclamationTriangle } from 'react-icons/fa';

export default function AvailableTasks() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [volunteer, setVolunteer] = useState('');
  const [assignModal, setAssignModal] = useState(null);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const { data } = await api.get('/api/requests?limit=50');
      setRequests(data.requests || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const assignVolunteer = async () => {
    if (!volunteer) return toast.error('Select a volunteer to assign');
    if (!assignModal) return;
    try {
      await api.post('/api/assignments', {
        volunteerId: volunteer,
        requestId: assignModal._id,
        taskDescription: `Handle ${assignModal.requestType} request: ${assignModal.description}`,
        priority: assignModal.priority === 'Critical' ? 'Critical' : assignModal.priority === 'Urgent' ? 'High' : 'Medium'
      });
      toast.success('Volunteer assigned successfully!');
      setAssignModal(null);
      setVolunteer('');
      fetchRequests();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to assign volunteer');
    }
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Loading available tasks...</p>
      </div>
    );
  }

  const filtered = filter === 'All' ? requests : requests.filter(r => r.status === filter);

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="mb-0">Available Tasks</h1>
          <p className="text-muted">Find tasks that need your skills and make an impact</p>
        </div>
        <button className="btn btn-primary" onClick={() => setFilter('All')}>
          <FaTasks /> View All
        </button>
      </div>

      <div className="card mb-3">
        <div className="card-body d-flex align-items-center gap-2 flex-wrap">
          {['All', 'Pending', 'Verified'].map(f => (
            <button
              key={f}
              className={`btn btn-sm ${filter === f ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => setFilter(f)}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <div className="empty-icon">📋</div>
            <h3>No tasks available</h3>
            <p>Check back later for new emergency tasks.</p>
            <Link to="/volunteer/my-assignments" className="btn btn-outline mt-2">View My Assignments</Link>
          </div>
        </div>
      ) : (
        <div className="card">
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Task</th>
                  <th>Type</th>
                  <th>Priority</th>
                  <th>Status</th>
                  <th>Location</th>
                  <th>People</th>
                  <th>Posted</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(req => (
                  <tr key={req._id}>
                    <td style={{ maxWidth: 220 }}>
                      <div className="truncate">{req.description}</div>
                    </td>
                    <td><span className="badge bg-info">{req.requestType}</span></td>
                    <td>
                      <span className={`badge bg-${req.priority === 'Critical' ? 'critical' : req.priority === 'Urgent' ? 'warning' : 'secondary'}`}>
                        {req.priority}
                      </span>
                    </td>
                    <td>
                      <span className={`badge bg-${req.status === 'Verified' ? 'success' : req.status === 'In Progress' ? 'warning' : req.status === 'Assigned' ? 'info' : 'secondary'}`}>
                        {req.status}
                      </span>
                    </td>
                    <td className="text-sm">{req.location}</td>
                    <td className="text-sm">{req.peopleCount} people</td>
                    <td className="text-sm">{new Date(req.createdAt).toLocaleDateString()}</td>
                    <td>
                      <div className="d-flex gap-2 flex-wrap">
                        {req.status === 'Pending' && (
                          <>
                            <select
                              className="form-control form-control-sm"
                              value={volunteer}
                              onChange={e => setVolunteer(e.target.value)}
                              defaultValue=""
                            >
                              <option value="">Assign volunteer...</option>
                              <VolunteerOption />
                            </select>
                            <button
                              className="btn btn-sm btn-success"
                              onClick={() => setAssignModal(req)}
                            >
                              Assign
                            </button>
                          </>
                        )}
                        {req.status === 'Pending' && (
                          <>
                            <select
                              className="form-control form-control-sm"
                              value={volunteer}
                              onChange={e => setVolunteer(e.target.value)}
                              defaultValue=""
                            >
                              <option value="">Assign volunteer...</option>
                              <VolunteerOption />
                            </select>
                            <button
                              className="btn btn-sm btn-success"
                              onClick={() => setAssignModal(req)}
                            >
                              Assign
                            </button>
                          </>
                        )}
                        <Link to={`/volunteer/my-assignments`} className="btn btn-sm btn-outline">
                          View
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Assign Volunteer Modal */}
      {assignModal && (
        <div className="modal-overlay" onClick={() => setAssignModal(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Assign Volunteer to Task</h3>
              <button onClick={() => setAssignModal(null)} className="btn btn-sm btn-outline">
                <FaTimes />
              </button>
            </div>
            <div className="modal-body">
              <div className="d-flex align-items-center gap-3 mb-3">
                <div style={{ fontSize: '1.4rem' }}><FaExclamationTriangle /></div>
                <div>
                  <strong className="mb-0">{assignModal.requestType}</strong>
                  <p className="text-secondary mb-0 small">{assignModal.description}</p>
                </div>
              </div>
              <div className="d-flex align-items-center gap-2 mb-3">
                <span className="badge bg-warning">{assignModal.priority}</span>
                <span className="badge bg-info">{assignModal.status}</span>
                <span className="badge bg-secondary">📍 {assignModal.location}</span>
                <span className="badge bg-secondary">👥 {assignModal.peopleCount} people</span>
              </div>

              <div className="form-group">
                <label>Select Volunteer</label>
                <select
                  className="form-control"
                  value={volunteer}
                  onChange={e => setVolunteer(e.target.value)}
                >
                  <option value="">-- Select a volunteer --</option>
                  <VolunteerOption />
                </select>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-outline" onClick={() => setAssignModal(null)}>Cancel</button>
              <button className="btn btn-success" onClick={assignVolunteer}>
                <FaCheckCircle /> Assign Volunteer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function VolunteerOption() {
  const [volunteers, setVolunteers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await api.get('/api/volunteers/available');
        setVolunteers(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  if (loading) return <option disabled>Loading volunteers...</option>;
  if (volunteers.length === 0) return <option disabled>No volunteers available</option>;
  return volunteers.map(v => (
    <option key={v._id} value={v.user?._id || v.user}>
      {v.user?.name || 'Volunteer'} — {v.skills?.join(', ') || 'No skills'} — {v.location}
    </option>
  ));
}
