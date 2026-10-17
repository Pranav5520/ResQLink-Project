import { useState, useEffect } from 'react';
import api from '../../services/api';
import { toast } from 'react-toastify';
import { FaBell } from 'react-icons/fa';

export default function MyAssignments() {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

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

  const filtered = filter === 'all' ? assignments : assignments.filter(a => a.status === filter);

  if (loading) return <div className="loading"><div className="spinner"></div>Loading assignments...</div>;

  return (
    <div>
      <h2 style={{ marginBottom: 20 }}><FaBell /> My Assignments</h2>

      <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
        {['all', 'Assigned', 'In Progress', 'Completed'].map(f => (
          <button key={f} className={`btn btn-sm ${filter === f ? 'btn-primary' : 'btn-outline'}`} onClick={() => setFilter(f)}>
            {f === 'all' ? 'All' : f}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <div className="empty-icon">📋</div>
            <h4>No assignments</h4>
            <p>Check available tasks to get started</p>
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {filtered.map(assignment => (
            <div key={assignment._id} className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                <div>
                  <span className={`badge badge-${assignment.status === 'Completed' ? 'success' : assignment.status === 'In Progress' ? 'warning' : 'info'}`}>
                    {assignment.status}
                  </span>
                  <span className={`badge badge-${assignment.priority === 'Critical' ? 'critical' : assignment.priority === 'High' ? 'danger' : 'secondary'}`} style={{ marginLeft: 8 }}>
                    {assignment.priority}
                  </span>
                </div>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  Assigned: {new Date(assignment.assignedDate).toLocaleDateString()}
                </span>
              </div>

              <p style={{ marginBottom: 12 }}>{assignment.taskDescription}</p>

              {assignment.request && (
                <div style={{ padding: 12, background: 'var(--bg-primary)', borderRadius: 'var(--radius-sm)', marginBottom: 12, fontSize: '0.85rem' }}>
                  <strong>Request Details:</strong><br />
                  Type: {assignment.request.requestType} | Location: {assignment.request.location} | People: {assignment.request.peopleCount}
                </div>
              )}

              {assignment.status !== 'Completed' && (
                <div style={{ display: 'flex', gap: 8 }}>
                  {assignment.status === 'Assigned' && (
                    <button className="btn btn-warning btn-sm" onClick={() => updateStatus(assignment._id, 'In Progress')}>
                      ▶ Start Task
                    </button>
                  )}
                  {assignment.status === 'In Progress' && (
                    <button className="btn btn-success btn-sm" onClick={() => updateStatus(assignment._id, 'Completed')}>
                      ✓ Mark Completed
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
