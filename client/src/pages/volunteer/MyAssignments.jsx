import { useState, useEffect } from 'react';
import api from '../../services/api';
import { toast } from 'react-toastify';
import { FaBell, FaCheckCircle, FaClock, FaTimes, FaTasks } from 'react-icons/fa';

export default function MyAssignments() {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [assignment, setAssignment] = useState(null);

  useEffect(() => {
    fetchAssignments();
  }, []);

  const fetchAssignments = async () => {
    try {
      const { data } = await api.get('/api/assignments');
      setAssignments(data.assignments || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/api/assignments/${id}`, { status });
      toast.success(`Task marked as ${status}`);
      fetchAssignments();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update');
    }
  };

  const details = assignment?.request;

  const filtered =
    filter === 'all' ? assignments : assignments.filter(a => a.status === filter);

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Loading your assignments...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="mb-0">My Assignments</h1>
          <p className="text-muted">Track and update the status of your current tasks</p>
        </div>
        <button className="btn btn-outline" onClick={() => setFilter('all')}>
          <FaBell /> View All
        </button>
      </div>

      <div className="card mb-3">
        <div className="card-body d-flex align-items-center gap-2 flex-wrap">
          {['all', 'Assigned', 'In Progress', 'Completed'].map(f => (
            <button
              key={f}
              className={`btn btn-sm ${filter === f ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => setFilter(f)}
            >
              {f === 'all' ? 'All' : f}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <div className="empty-icon">📋</div>
            <h3>No assignments yet</h3>
            <p>Check available tasks to get started.</p>
            <a href="/volunteer/available-tasks" className="btn btn-primary mt-2">
              <FaTasks /> Find Available Tasks
            </a>
          </div>
        </div>
      ) : (
        <div className="card">
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Status</th>
                  <th>Task</th>
                  <th>Request Type</th>
                  <th>Priority</th>
                  <th>Location</th>
                  <th>People</th>
                  <th>Assigned Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(assignment => (
                  <tr key={assignment._id}>
                    <td>
                      <span className={`badge bg-${assignment.status === 'Completed' ? 'success' : assignment.status === 'In Progress' ? 'warning' : assignment.status === 'Assigned' ? 'info' : 'secondary'}`}>
                        {assignment.status}
                      </span>
                    </td>
                    <td style={{ maxWidth: 220 }}>
                      <div className="truncate">{assignment.taskDescription}</div>
                    </td>
                    <td>
                      <span className="badge bg-info">{assignment.request?.requestType || 'N/A'}</span>
                    </td>
                    <td>
                      <span className={`badge bg-${assignment.priority === 'Critical' ? 'critical' : assignment.priority === 'High' ? 'danger' : 'warning'}`}>
                        {assignment.priority}
                      </span>
                    </td>
                    <td className="text-sm">{assignment.request?.location || '—'}</td>
                    <td className="text-sm">{assignment.request?.peopleCount || '—'}</td>
                    <td className="text-sm">{new Date(assignment.assignedDate).toLocaleDateString()}</td>
                    <td>
                      <div className="d-flex gap-2 flex-wrap">
                        {assignment.status !== 'Completed' && (
                          <button
                            className={`btn btn-sm ${assignment.status === 'Assigned' ? 'btn-warning' : 'btn-success'}`}
                            onClick={() => {
                              const next =
                                assignment.status === 'Assigned' ? 'In Progress' : 'Completed';
                              updateStatus(assignment._id, next);
                            }}
                          >
                            {assignment.status === 'Assigned' ? '▶ Start' : '✓ Done'}
                          </button>
                        )}
                        <a href="/volunteer/available-tasks" className="btn btn-sm btn-outline">
                          <FaTimes /> Close
                        </a>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Assignment Details Modal */}
      {assignment && (
        <div className="modal-overlay" onClick={() => setAssignment(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{assignment.request?.requestType || 'Assignment Details'}</h3>
              <button onClick={() => setAssignment(null)} className="btn btn-sm btn-outline">
                <FaTimes />
              </button>
            </div>
            <div className="modal-body">
              <div className="d-flex align-items-center gap-3 mb-3">
                <div style={{ fontSize: '1.4rem' }}>
                  {assignment.status === 'Completed' ? <FaCheckCircle /> : <FaClock />}
                </div>
                <div>
                  <strong className="mb-0">{assignment.taskDescription}</strong>
                  <p className="text-secondary mb-0 small">{assignment.request?.description || ''}</p>
                </div>
              </div>

              <div className="d-flex align-items-center gap-2 mb-3">
                <span className="badge bg-warning">{assignment.priority}</span>
                <span className="badge bg-info">{assignment.status}</span>
                <span className="badge bg-secondary">📍 {assignment.request?.location || '—'}</span>
                <span className="badge bg-secondary">👥 {assignment.request?.peopleCount || '—'}</span>
              </div>

              {details && (
                <div className="card mb-3">
                  <div className="card-body">
                    <h5 className="mb-2 small"><FaBell /> Request Details</h5>
                    <div className="mb-1 text-secondary"><strong>Type:</strong> {details.requestType}</div>
                    <div className="mb-1 text-secondary"><strong>Location:</strong> {details.location}</div>
                    <div className="mb-1 text-secondary"><strong>People:</strong> {details.peopleCount}</div>
                    <div className="mb-0 text-secondary"><strong>Priority:</strong> {details.priority}</div>
                  </div>
                </div>
              )}

              <div className="d-flex gap-2">
                {assignment.status !== 'Completed' && (
                  <button
                    className={`btn btn-sm ${assignment.status === 'Assigned' ? 'btn-warning' : 'btn-success'}`}
                    onClick={() => {
                      const next =
                        assignment.status === 'Assigned' ? 'In Progress' : 'Completed';
                      updateStatus(assignment._id, next);
                    }}
                  >
                    {assignment.status === 'Assigned' ? '▶ Start' : '✓ Mark Done'}
                  </button>
                )}
                <button className="btn btn-outline" onClick={() => setAssignment(null)}>
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
