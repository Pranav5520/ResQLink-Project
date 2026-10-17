import { useState, useEffect } from 'react';
import api from '../../services/api';
import { toast } from 'react-toastify';
import { FaBullhorn, FaPlus } from 'react-icons/fa';

const CATEGORIES = ['Flood', 'Cyclone', 'Earthquake', 'Fire', 'Landslide', 'Medical Emergency', 'Building Collapse', 'Road Accident', 'General', 'Other'];
const PRIORITIES = ['Information', 'Warning', 'Emergency'];

export default function AnnouncementManagement() {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ title: '', message: '', category: 'General', targetArea: '', priority: 'Information', isActive: true });

  useEffect(() => { fetchAnnouncements(); }, []);

  const fetchAnnouncements = async () => {
    try {
      const { data } = await api.get('/api/announcements?limit=50');
      setAnnouncements(data.announcements || data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/api/announcements', form);
      toast.success('Announcement published!');
      setShowModal(false);
      fetchAnnouncements();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
  };

  const toggleActive = async (id, isActive) => {
    try {
      await api.put(`/api/announcements/${id}`, { isActive: !isActive });
      toast.success('Updated');
      fetchAnnouncements();
    } catch (err) { toast.error('Failed'); }
  };

  const deleteAnnouncement = async (id) => {
    if (!confirm('Delete this announcement?')) return;
    try { await api.delete(`/api/announcements/${id}`); toast.success('Deleted'); fetchAnnouncements(); }
    catch (err) { toast.error('Failed'); }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h2><FaBullhorn /> Announcement Management</h2>
        <button className="btn btn-primary" onClick={() => { setForm({ title: '', message: '', category: 'General', targetArea: '', priority: 'Information', isActive: true }); setShowModal(true); }}><FaPlus /> New Announcement</button>
      </div>

      {loading ? (
        <div className="loading"><div className="spinner"></div>Loading...</div>
      ) : announcements.length === 0 ? (
        <div className="card"><div className="empty-state"><div className="empty-icon">📢</div><h4>No announcements</h4></div></div>
      ) : (
        <div className="card">
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Priority</th>
                  <th>Category</th>
                  <th>Area</th>
                  <th>Active</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {announcements.map(ann => (
                  <tr key={ann._id}>
                    <td style={{ fontWeight: 500 }}>{ann.title}</td>
                    <td><span className={`badge badge-${ann.priority === 'Emergency' ? 'danger' : ann.priority === 'Warning' ? 'warning' : 'info'}`}>{ann.priority}</span></td>
                    <td><span className="badge badge-secondary">{ann.category}</span></td>
                    <td style={{ fontSize: '0.85rem' }}>{ann.targetArea || '—'}</td>
                    <td>
                      <button className={`btn btn-sm ${ann.isActive ? 'btn-success' : 'btn-outline'}`} onClick={() => toggleActive(ann._id, ann.isActive)}>
                        {ann.isActive ? 'Active' : 'Inactive'}
                      </button>
                    </td>
                    <td style={{ fontSize: '0.8rem' }}>{new Date(ann.createdAt).toLocaleDateString()}</td>
                    <td>
                      <button className="btn btn-sm btn-danger" onClick={() => deleteAnnouncement(ann._id)}>Del</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>New Announcement</h3>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer' }}>✕</button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleSubmit}>
                <div className="form-group"><label>Title *</label><input className="form-control" name="title" value={form.title} onChange={handleChange} required /></div>
                <div className="form-group"><label>Message *</label><textarea className="form-control" name="message" value={form.message} onChange={handleChange} rows={4} required /></div>
                <div className="form-row">
                  <div className="form-group"><label>Priority *</label><select className="form-control" name="priority" value={form.priority} onChange={handleChange}>{PRIORITIES.map(p => <option key={p} value={p}>{p}</option>)}</select></div>
                  <div className="form-group"><label>Category</label><select className="form-control" name="category" value={form.category} onChange={handleChange}>{CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}</select></div>
                </div>
                <div className="form-group"><label>Target Area</label><input className="form-control" name="targetArea" value={form.targetArea} onChange={handleChange} placeholder="e.g. Patna, Bihar" /></div>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                  <input type="checkbox" name="isActive" checked={form.isActive} onChange={handleChange} /> Publish immediately
                </label>
                <div style={{ display: 'flex', gap: 12 }}>
                  <button type="submit" className="btn btn-primary">Publish</button>
                  <button type="button" className="btn btn-outline" onClick={() => setShowModal(false)}>Cancel</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
