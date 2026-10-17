import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../services/api';

export default function RequestDetails() {
  const { id } = useParams();
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequest = async () => {
      try {
        const { data } = await api.get(`/api/requests/${id}`);
        setRequest(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchRequest();
  }, [id]);

  if (loading) return <div className="loading"><div className="spinner"></div>Loading...</div>;
  if (!request) return <div className="card"><div className="empty-state"><h4>Request not found</h4></div></div>;

  const statusSteps = ['Pending', 'Verified', 'Assigned', 'In Progress', 'Completed'];
  const currentStep = statusSteps.indexOf(request.status);

  return (
    <div style={{ maxWidth: 700 }}>
      <Link to="/citizen/my-requests" style={{ fontSize: '0.9rem', color: 'var(--primary-light)' }}>← Back to My Requests</Link>
      <h2 style={{ margin: '12px 0' }}>Request Details</h2>

      <div className="card" style={{ marginBottom: 20 }}>
        <div className="detail-header">
          <div>
            <span className="badge badge-info" style={{ fontSize: '0.9rem', marginBottom: 8 }}>{request.requestType}</span>
            <span className={`badge badge-${request.priority === 'Critical' ? 'critical' : request.priority === 'Urgent' ? 'warning' : 'secondary'}`} style={{ marginLeft: 8 }}>
              {request.priority}
            </span>
          </div>
          <span className={`badge badge-${request.status === 'Completed' ? 'success' : request.status === 'Rejected' ? 'danger' : 'info'}`} style={{ fontSize: '0.9rem' }}>
            {request.status}
          </span>
        </div>

        {/* Status Tracker */}
        <div style={{ margin: '20px 0', display: 'flex', alignItems: 'center', gap: 4 }}>
          {statusSteps.map((step, i) => (
            <div key={step} style={{ flex: 1, textAlign: 'center' }}>
              <div style={{
                width: 30, height: 30, borderRadius: '50%', margin: '0 auto',
                background: i <= currentStep ? 'var(--success)' : '#e0e0e0',
                color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '0.8rem', fontWeight: 600
              }}>
                {i <= currentStep ? '✓' : i + 1}
              </div>
              <div style={{ fontSize: '0.7rem', marginTop: 4, color: i <= currentStep ? 'var(--success)' : 'var(--text-secondary)' }}>{step}</div>
            </div>
          ))}
        </div>

        <div className="detail-field">
          <div className="field-label">Description</div>
          <div className="field-value">{request.description}</div>
        </div>
        <div className="detail-field">
          <div className="field-label">Location</div>
          <div className="field-value">{request.location}</div>
        </div>
        <div className="detail-field">
          <div className="field-label">People Count</div>
          <div className="field-value">{request.peopleCount}</div>
        </div>
        <div className="detail-field">
          <div className="field-label">Contact</div>
          <div className="field-value">{request.contactNumber}</div>
        </div>
        <div className="detail-field">
          <div className="field-label">Assigned Volunteer</div>
          <div className="field-value">{request.assignedVolunteer?.name || 'Not yet assigned'}</div>
        </div>
        <div className="detail-field">
          <div className="field-label">Created</div>
          <div className="field-value">{new Date(request.createdAt).toLocaleString()}</div>
        </div>
        <div className="detail-field">
          <div className="field-label">Last Updated</div>
          <div className="field-value">{new Date(request.updatedAt).toLocaleString()}</div>
        </div>
        {request.notes && (
          <div className="detail-field">
            <div className="field-label">Notes</div>
            <div className="field-value">{request.notes}</div>
          </div>
        )}
      </div>
    </div>
  );
}
