import { useState, useEffect } from 'react';
import api from '../../services/api';
import { toast } from 'react-toastify';
import { FaPlus, FaTimes, FaTimesCircle, FaCheckCircle, FaEdit, FaEye, FaTrash, FaUpload } from 'react-icons/fa';

const TYPES = ['Emergency', 'Safety', 'Resource', 'Volunteer Opportunity', 'General'];

export default function AnnouncementManagement() {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ title: '', message: '', type: 'General', status: 'Draft', file: null });

  useEffect(() => { fetchAnnouncements(); }, []);

  const fetchAnnouncements = async () => {
    try {
      const { data } = await api.get('/api/announcements');
      setAnnouncements(data.announcements || []);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const create = async () => {
    try {
      await api.post('/api/announcements', {
        title: form.title,
        content: form.message,
        type: form.type,
        status: form.status,
        file: form.file
      });
      toast.success('Announcement published');
      setModal(false);
      setForm({ title: '', message: '', type: 'General', status: 'Draft', file: null });
      fetchAnnouncements();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
  };

  const remove = async (id) => {
    if (!window.confirm('Delete this announcement?')) return;
    try {
      await api.delete(`/api/announcements/${id}`);
      toast.success('Removed');
      fetchAnnouncements();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Loading announcements...</p>
      </div>
    );
  }

  const draft = announcements.filter(a => a.status === 'Draft');
  const published = announcements.filter(a => a.status === 'Published');

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="mb-0">Announcements</h1>
          <p className="text-muted">Create and manage public announcements</p>
        </div>
        <button className="btn btn-primary" onClick={() => setModal(true)}><FaPlus /> New Announcement</button>
      </div>

      <div className="row">
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h3 className="mb-0 text-primary">Draft ({draft.length})</h3>
              <div className="list-group mt-2">
                {draft.map(a => (
                  <div className="list-group-item" key={a._id}>
                    <div className="d-flex w-100 justify-content-between">
                      <h6 className="mb-1">{a.title}</h6>
                      <span className="badge bg-secondary">Draft</span>
                    </div>
                    <p className="mb-1 small text-truncate">{a.content.substring(0, 80)}...</p>
                    <div className="d-flex gap-1">
                      <button className="btn btn-sm btn-outline"><FaEdit /></button>
                      <button className="btn btn-sm btn-outline text-danger" onClick={() => remove(a._id)}><FaTrash /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h3 className="mb-0 text-success">Published ({published.length})</h3>
              <div className="list-group mt-2">
                {published.map(a => (
                  <div className="list-group-item" key={a._id}>
                    <div className="d-flex w-100 justify-content-between">
                      <h6 className="mb-1">{a.title}</h6>
                      <span className="badge bg-success">Published</span>
                    </div>
                    <p className="mb-1 small text-truncate">{a.content.substring(0, 80)}...</p>
                    <div className="d-flex gap-1">
                      <button className="btn btn-sm btn-outline"><FaEye /></button>
                      <button className="btn btn-sm btn-outline text-danger" onClick={() => remove(a._id)}><FaTrash /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {modal && (
        <div className="modal-overlay" onClick={() => setModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>New Announcement</h3>
              <button onClick={() => setModal(false)} className="btn btn-sm btn-outline"><FaTimes /></button>
            </div>
            <div className="modal-body">
              <div className="form-group"><label>Title</label><input className="form-control" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Announcement title" /></div>
              <div className="form-group"><label>Message</label><textarea className="form-control" rows={5} value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} placeholder="Write your announcement..." /></div>
              <div className="row">
                <div className="col-md-6"><div className="form-group"><label>Category</label><select className="form-control" value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>{TYPES.map(t => <option key={t} value={t}>{t}</option>)}</select></div></div>
                <div className="col-md-6"><div className="form-group"><label>Status</label><select className="form-control" value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}><option>Draft</option><option>Published</option></select></div></div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-outline" onClick={() => setModal(false)}>Cancel</button>
              <button className="btn btn-success" onClick={create}>Publish</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
