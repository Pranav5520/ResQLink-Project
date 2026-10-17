import { useState, useEffect } from 'react';
import api from '../../services/api';
import { toast } from 'react-toastify';
import { FaTruck, FaPlus } from 'react-icons/fa';

export default function ResourceDistribution() {
  const [distributions, setDistributions] = useState([]);
  const [resources, setResources] = useState([]);
  const [camps, setCamps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ resourceId: '', quantityDistributed: 1, destination: '', reliefCamp: '', emergencyArea: '', notes: '' });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [distRes, resRes, campRes] = await Promise.all([
          api.get('/api/distributions?limit=50'),
          api.get('/api/resources?limit=100'),
          api.get('/api/camps?limit=100')
        ]);
        setDistributions(distRes.data.distributions || []);
        setResources(resRes.data.resources || []);
        setCamps(campRes.data.camps || []);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetchData();
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/api/distributions', {
        ...form,
        quantityDistributed: parseInt(form.quantityDistributed),
        reliefCamp: form.reliefCamp || undefined
      });
      toast.success('Distribution recorded!');
      setShowModal(false);
      // Refresh
      const { data } = await api.get('/api/distributions?limit=50');
      setDistributions(data.distributions || []);
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
  };

  const selectedResource = resources.find(r => r._id === form.resourceId);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h2><FaTruck /> Resource Distribution</h2>
        <button className="btn btn-primary" onClick={() => { setForm({ resourceId: '', quantityDistributed: 1, destination: '', reliefCamp: '', emergencyArea: '', notes: '' }); setShowModal(true); }}><FaPlus /> Record Distribution</button>
      </div>

      {loading ? (
        <div className="loading"><div className="spinner"></div>Loading...</div>
      ) : distributions.length === 0 ? (
        <div className="card"><div className="empty-state"><div className="empty-icon">🚚</div><h4>No distributions yet</h4></div></div>
      ) : (
        <div className="card">
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Resource</th>
                  <th>Category</th>
                  <th>Quantity</th>
                  <th>Destination</th>
                  <th>Camp</th>
                  <th>Distributed By</th>
                  <th>Date</th>
                  <th>Notes</th>
                </tr>
              </thead>
              <tbody>
                {distributions.map(d => (
                  <tr key={d._id}>
                    <td style={{ fontWeight: 500 }}>{d.resource?.name || '—'}</td>
                    <td><span className="badge badge-info">{d.resource?.category || '—'}</span></td>
                    <td style={{ fontWeight: 600 }}>{d.quantityDistributed} {d.resource?.unit || ''}</td>
                    <td>{d.destination}</td>
                    <td style={{ fontSize: '0.85rem' }}>{d.reliefCamp?.name || '—'}</td>
                    <td style={{ fontSize: '0.85rem' }}>{d.distributedBy?.name || '—'}</td>
                    <td style={{ fontSize: '0.8rem' }}>{new Date(d.distributionDate).toLocaleDateString()}</td>
                    <td style={{ fontSize: '0.8rem', maxWidth: 150, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{d.notes || '—'}</td>
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
              <h3>Record Distribution</h3>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer' }}>✕</button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Resource *</label>
                  <select className="form-control" name="resourceId" value={form.resourceId} onChange={handleChange} required>
                    <option value="">Select Resource</option>
                    {resources.map(r => <option key={r._id} value={r._id}>{r.name} — {r.quantity} {r.unit} available ({r.status})</option>)}
                  </select>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Quantity *</label>
                    <input type="number" className="form-control" name="quantityDistributed" value={form.quantityDistributed} onChange={handleChange} min="1" max={selectedResource?.quantity || 9999} required />
                    {selectedResource && <small style={{ color: 'var(--text-secondary)' }}>Available: {selectedResource.quantity} {selectedResource.unit}</small>}
                  </div>
                  <div className="form-group">
                    <label>Destination *</label>
                    <input className="form-control" name="destination" value={form.destination} onChange={handleChange} placeholder="e.g. Patna Relief Camp" required />
                  </div>
                </div>
                <div className="form-group">
                  <label>Relief Camp (optional)</label>
                  <select className="form-control" name="reliefCamp" value={form.reliefCamp} onChange={handleChange}>
                    <option value="">None</option>
                    {camps.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>Emergency Area</label>
                  <input className="form-control" name="emergencyArea" value={form.emergencyArea} onChange={handleChange} placeholder="Area name if applicable" />
                </div>
                <div className="form-group">
                  <label>Notes</label>
                  <textarea className="form-control" name="notes" value={form.notes} onChange={handleChange} placeholder="Additional notes" rows={2} />
                </div>
                <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
                  <button type="submit" className="btn btn-primary">Record Distribution</button>
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
