import { useState, useEffect } from 'react';
import api from '../../services/api';
import { toast } from 'react-toastify';
import { FaCheckCircle, FaTimes, FaArrowLeft, FaUserMd, FaMapMarkerAlt, FaCalendarAlt, FaUserClock, FaHandHoldingHeart, FaPhone } from 'react-icons/fa';

const STATUSES = ['Pending', 'Verified', 'Assigned', 'In Progress', 'Completed', 'Rejected'];

export default function AdminRequestDetails() {
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [volunteers, setVolunteers] = useState([]);
  const [assigning, setAssigning] = useState(false);

  useEffect(() => {
    const id = window.location.pathname.split('/').pop();
    fetchRequest(id);
    fetchVolunteers();
  }, []);

  const fetchRequest = async (id) => {
    try {
      const { data } = await api.get(`/api/requests/${id}`);
      setRequest(data.request);
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to load'); }
    finally { setLoading(false); }
  };

  const fetchVolunteers = async () => {
    try {
      const { data } = await api.get('/api/volunteers/available');
      setVolunteers(data);
    } catch (err) { console.error(err); }
  };

  const update = async (status) => {
    try {
      await api.put(`/api/requests/${request._id}`, { status });
      toast.success('Status updated');
      fetchRequest(request._id);
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
  };

  const assign = async (volunteerId) => {
    if (!volunteerId) return toast.error('Select a volunteer');
    try {
      await api.post('/api/assignments', {
        volunteerId,
        requestId: request._id,
        taskDescription: `Handle ${request.requestType} request: ${request.description}`
      });
      toast.success('Volunteer assigned');
      fetchRequest(request._id);
      setAssigning(false);
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
  };

  if (loading || !request) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Loading request details...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="page-header">
        <div className="d-flex gap-2">
          <button className="btn btn-outline"><FaArrowLeft /> Back</button>
        </div>
        <div>
          <h1 className="mb-0">Request Details</h1>
          <p className="text-muted">{request.requestType} — {request.status}</p>
        </div>
      </div>

      <div className="row">
        <div className="col-md-8">
          <div className="card">
            <div className="card-body">
              <h4 className="card-title">{request.title || request.requestType}</h4>
              <p className="text-muted small mb-3">{request.description}</p>

              <div className="row mb-3">
                <div className="col-md-6"><div className="d-flex align-items-center gap-2"><FaUserMd /><span className="text-muted">Citizen: <strong>{request.citizen?.name || '—'}</strong></span></div></div>
                <div className="col-md-6"><div className="d-flex align-items-center gap-2"><FaMapMarkerAlt /><span className="text-muted">{request.location}</span></div></div>
              </div>

              <div className="row mb-3">
                <div className="col-md-6"><div className="d-flex align-items-center gap-2"><FaUserClock /><span className="text-muted">Priority: <strong>{request.priority}</strong></span></div></div>
                <div className="col-md-6"><div className="d-flex align-items-center gap-2"><FaCalendarAlt /><span className="text-muted">Time: <strong>{request.createdAt?.substring(0, 16).replace('T', ' ')}</strong></span></div></div>
              </div>

              <div className="row mb-3">
                <div className="col-md-6"><div className="d-flex align-items-center gap-2"><FaHandHoldingHeart /><span className="text-muted">People affected: <strong>{request.peopleCount || 0}</strong></span></div></div>
                <div className="col-md-6"><div className="d-flex align-items-center gap-2"><FaPhone /><span className="text-muted">{request.contactNumber || '—'}</span></div></div>
              </div>

              {request.assignedVolunteer && (
                <div className="alert alert-info small">
                  <FaUserMd /> Assigned to <strong>{request.assignedVolunteer?.name}</strong>
                </div>
              )}

              <div className="d-flex gap-2 flex-wrap">
                {STATUSES.map(s => {
                  const active = s === request.status;
                  return (
                    <button
                      key={s}
                      className={`btn btn-sm ${active ? 'btn-primary' : 'btn-outline'}`}
                      disabled={active}
                      onClick={() => update(s)}
                    >
                      <FaCheckCircle /> {s}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Assign Volunteer</h5>
              <p className="card-text text-muted small">Volunteers available below.</p>
              <select className="form-control" onChange={e => setAssigning(e.target.value)}>
                <option value="">-- Select --</option>
                {volunteers.map(v => (
                  <option key={v._id} value={v.user?._id || v.user}>{v.user?.name} — {v.skills?.join(', ')}</option>
                ))}
              </select>
              <button className="btn btn-success mt-2" disabled={!assigning} onClick={() => assign(assigning)}>Assign</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
