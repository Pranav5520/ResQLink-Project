import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../services/api';
import { toast } from 'react-toastify';

const STATUSES = ['Pending', 'Verified', 'Assigned', 'In Progress', 'Completed', 'Rejected'];

export default function AdminRequestDetails() {
  const { id } = useParams();
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    const fetchRequest = async () => {
      try {
        const { data } = await api.get(`/api/requests/${id}`);
        setRequest(data);
        setNotes(data.notes || '');
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetchRequest();
  }, [id]);

  const updateRequest = async (updates) => {
    try {
      const { data } = await api.put(`/api/requests/${id}`, { ...updates, notes });
      setRequest(data);
      toast.success('Updated successfully');
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
  };

  if (loading) return <div className="loading"><div className="spinner"></div>Loading...</div>;
  if (!request) return <div className="card"><div className="empty-state"><h4>Not found</h4></div></div>;

  return (
    <div style={{ maxWidth: 800 }}>
      <Link to="/admin/requests" style={{ fontSize: '0.9rem', color: 'var(--primary-light)' }}>← Back to Requests</Link>
      <h2 style={{ margin: '12px 0' }}>Request Details</h2>

      <div className="card" style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
          <div>
            <span className="badge badge-info" style={{ fontSize: '0.9rem' }}>{request.requestType}</span>
            <span className={`badge badge-${request.priority === 'Critical' ? 'critical' : request.priority === 'Urgent' ? 'warning' : 'secondary'}`} style={{ marginLeft: 8 }}>{request.priority}</span>
          </div>
          <span className={`badge badge-${request.status === 'Completed' ? 'success' : request.status === 'Rejected' ? 'danger' : 'info'}`} style={{ fontSize: '0.9rem' }}>{request.status}</span>
        </div>

        <div className="detail-field"><div className="field-label">Description</div><div className="field-value">{request.description}</div></div>
        <div className="detail-field"><div className="field-label">Location</div><div className="field-value">{request.location}</div></div>
        <div className="detail-field"><div className="field-label">People</div><div className="field-value">{request.peopleCount}</div></div>
        <div className="detail-field"><div className="field-label">Contact</div><div className="field-value">{request.contactNumber}</div></div>
        <div className="detail-field"><div className="field-label">Citizen</div><div className="field-value">{request.citizen?.name} ({request.citizen?.email})</div></div>
        <div className="detail-field"><div className="field-label">Volunteer</div><div className="field-value">{request.assignedVolunteer?.name || 'Not assigned'}</div></div>
        <div className="detail-field"><div className="field-label">Created</div><div className="field-value">{new Date(request.createdAt).toLocaleString()}</div></div>
      </div>

      {/* Actions */}
      <div className="card" style={{ marginBottom: 20 }}>
        <h4 style={{ marginBottom: 16 }}>Update Status</h4>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {STATUSES.map(s => (
            <button key={s} className={`btn btn-sm ${request.status === s ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => updateRequest({ status: s })} disabled={request.status === s}>
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Notes */}
      <div className="card">
        <h4 style={{ marginBottom: 12 }}>Admin Notes</h4>
        <textarea className="form-control" value={notes} onChange={e => setNotes(e.target.value)}
          placeholder="Add notes about this request..." rows={4} />
        <button className="btn btn-primary btn-sm" style={{ marginTop: 8 }} onClick={() => updateRequest({})}>Save Notes</button>
      </div>
    </div>
  );
}
