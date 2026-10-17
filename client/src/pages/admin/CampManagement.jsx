import { useState, useEffect } from 'react';
import api from '../../services/api';
import { toast } from 'react-toastify';
import { FaCampground, FaPlus } from 'react-icons/fa';

const FACILITIES = ['Food', 'Water', 'Beds', 'Toilets', 'Medical Support', 'Electricity', 'Women & Children Area', 'Accessibility Support'];

export default function CampManagement() {
  const [camps, setCamps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editCamp, setEditCamp] = useState(null);
  const [form, setForm] = useState({
    name: '', address: '', district: '', state: '', latitude: '', longitude: '',
    maxCapacity: 100, currentOccupancy: 0, contactPerson: '', phone: '',
    facilities: [], foodAvailable: false, waterAvailable: false, medicalSupport: false, status: 'Active'
  });

  useEffect(() => { fetchCamps(); }, []);

  const fetchCamps = async () => {
    try {
      const { data } = await api.get('/api/camps?limit=50');
      setCamps(data.camps || []);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
  };

  const toggleFacility = (f) => {
    setForm({ ...form, facilities: form.facilities.includes(f) ? form.facilities.filter(x => x !== f) : [...form.facilities, f] });
  };

  const openCreate = () => {
    setEditCamp(null);
    setForm({ name: '', address: '', district: '', state: '', latitude: '', longitude: '', maxCapacity: 100, currentOccupancy: 0, contactPerson: '', phone: '', facilities: [], foodAvailable: false, waterAvailable: false, medicalSupport: false, status: 'Active' });
    setShowModal(true);
  };

  const openEdit = (camp) => {
    setEditCamp(camp);
    setForm({ ...camp, latitude: String(camp.latitude), longitude: String(camp.longitude), maxCapacity: camp.maxCapacity, currentOccupancy: camp.currentOccupancy });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...form, latitude: parseFloat(form.latitude), longitude: parseFloat(form.longitude), maxCapacity: parseInt(form.maxCapacity), currentOccupancy: parseInt(form.currentOccupancy) };
      if (editCamp) {
        await api.put(`/api/camps/${editCamp._id}`, payload);
        toast.success('Camp updated');
      } else {
        await api.post('/api/camps', payload);
        toast.success('Camp created');
      }
      setShowModal(false);
      fetchCamps();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h2><FaCampground /> Relief Camp Management</h2>
        <button className="btn btn-primary" onClick={openCreate}><FaPlus /> Create Camp</button>
      </div>

      {loading ? (
        <div className="loading"><div className="spinner"></div>Loading...</div>
      ) : camps.length === 0 ? (
        <div className="card"><div className="empty-state"><div className="empty-icon">🏕️</div><h4>No camps yet</h4></div></div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: 16 }}>
          {camps.map(camp => (
            <div key={camp._id} className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <h4>{camp.name}</h4>
                <span className={`badge badge-${camp.status === 'Active' ? 'success' : camp.status === 'Nearly Full' ? 'warning' : camp.status === 'Full' ? 'danger' : 'secondary'}`}>{camp.status}</span>
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: '8px 0' }}>📍 {camp.address}, {camp.district}, {camp.state}</p>

              <div style={{ margin: '12px 0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: 4 }}>
                  <span>Occupancy: {camp.currentOccupancy} / {camp.maxCapacity}</span>
                  <span>{camp.maxCapacity - camp.currentOccupancy} available</span>
                </div>
                <div className="progress-bar">
                  <div className={`progress-fill ${(camp.currentOccupancy / camp.maxCapacity) > 0.85 ? 'red' : (camp.currentOccupancy / camp.maxCapacity) > 0.6 ? 'yellow' : 'green'}`}
                    style={{ width: `${(camp.currentOccupancy / camp.maxCapacity) * 100}%` }} />
                </div>
              </div>

              <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginBottom: 12 }}>
                {camp.facilities?.slice(0, 4).map(f => <span key={f} className="badge badge-secondary" style={{ fontSize: '0.7rem' }}>{f}</span>)}
              </div>

              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>👤 {camp.contactPerson} | 📞 {camp.phone}</p>

              <button className="btn btn-outline btn-sm" style={{ marginTop: 8 }} onClick={() => openEdit(camp)}>Edit Camp</button>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editCamp ? 'Edit Camp' : 'Create Relief Camp'}</h3>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer' }}>✕</button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleSubmit}>
                <div className="form-group"><label>Camp Name *</label><input className="form-control" name="name" value={form.name} onChange={handleChange} required /></div>
                <div className="form-group"><label>Address *</label><input className="form-control" name="address" value={form.address} onChange={handleChange} required /></div>
                <div className="form-row">
                  <div className="form-group"><label>District *</label><input className="form-control" name="district" value={form.district} onChange={handleChange} required /></div>
                  <div className="form-group"><label>State</label><input className="form-control" name="state" value={form.state} onChange={handleChange} /></div>
                </div>
                <div className="form-row">
                  <div className="form-group"><label>Latitude *</label><input type="number" step="any" className="form-control" name="latitude" value={form.latitude} onChange={handleChange} required /></div>
                  <div className="form-group"><label>Longitude *</label><input type="number" step="any" className="form-control" name="longitude" value={form.longitude} onChange={handleChange} required /></div>
                </div>
                <div className="form-row">
                  <div className="form-group"><label>Max Capacity *</label><input type="number" className="form-control" name="maxCapacity" value={form.maxCapacity} onChange={handleChange} min="1" required /></div>
                  <div className="form-group"><label>Current Occupancy</label><input type="number" className="form-control" name="currentOccupancy" value={form.currentOccupancy} onChange={handleChange} min="0" /></div>
                </div>
                <div className="form-row">
                  <div className="form-group"><label>Contact Person</label><input className="form-control" name="contactPerson" value={form.contactPerson} onChange={handleChange} /></div>
                  <div className="form-group"><label>Phone</label><input className="form-control" name="phone" value={form.phone} onChange={handleChange} /></div>
                </div>
                <div className="form-group">
                  <label>Facilities</label>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {FACILITIES.map(f => (
                      <label key={f} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.85rem', cursor: 'pointer' }}>
                        <input type="checkbox" checked={form.facilities.includes(f)} onChange={() => toggleFacility(f)} />
                        {f}
                      </label>
                    ))}
                  </div>
                </div>
                <div className="form-row">
                  <label><input type="checkbox" name="foodAvailable" checked={form.foodAvailable} onChange={handleChange} /> Food Available</label>
                  <label><input type="checkbox" name="waterAvailable" checked={form.waterAvailable} onChange={handleChange} /> Water Available</label>
                  <label><input type="checkbox" name="medicalSupport" checked={form.medicalSupport} onChange={handleChange} /> Medical Support</label>
                </div>
                <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
                  <button type="submit" className="btn btn-primary">{editCamp ? 'Update' : 'Create'}</button>
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
