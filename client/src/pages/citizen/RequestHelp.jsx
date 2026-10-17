import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { toast } from 'react-toastify';
import { FaHandHoldingHeart } from 'react-icons/fa';
import LocationPicker from '../../components/LocationPicker';

const REQUEST_TYPES = ['Rescue', 'Food', 'Drinking Water', 'Medicine', 'Medical Assistance', 'Shelter', 'Clothing', 'Transportation', 'Electricity', 'Other'];
const PRIORITIES = ['Normal', 'Urgent', 'Critical'];

export default function RequestHelp() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    requestType: 'Food', description: '', peopleCount: 1, priority: 'Normal',
    location: '', latitude: null, longitude: null, contactNumber: '', district: '', state: ''
  });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleLocationChange = (lat, lng, locAddress) => {
    setForm(prev => ({ ...prev, latitude: lat, longitude: lng, location: locAddress || prev.location }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.latitude == null || form.longitude == null) {
      return toast.error('Please select a location using search, current location, or the map');
    }
    setLoading(true);
    try {
      await api.post('/api/requests', {
        ...form,
        peopleCount: parseInt(form.peopleCount) || 1,
        latitude: parseFloat(form.latitude),
        longitude: parseFloat(form.longitude)
      });
      toast.success('Help request submitted!');
      navigate('/citizen/my-requests');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 700 }}>
      <h2 style={{ marginBottom: 8 }}><FaHandHoldingHeart /> Request Help</h2>
      <p style={{ color: 'var(--text-secondary)', marginBottom: 24 }}>
        Submit a request for assistance. Our volunteers and authorities will respond as quickly as possible.
      </p>

      <div className="card">
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>Request Type *</label>
              <select className="form-control" name="requestType" value={form.requestType} onChange={handleChange}>
                {REQUEST_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Priority *</label>
              <select className="form-control" name="priority" value={form.priority} onChange={handleChange}>
                {PRIORITIES.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Description *</label>
            <textarea className="form-control" name="description" value={form.description} onChange={handleChange}
              placeholder="Describe what you need..." rows={4} required />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>District</label>
              <input type="text" className="form-control" name="district" value={form.district} onChange={handleChange} placeholder="District" />
            </div>
            <div className="form-group">
              <label>State</label>
              <input type="text" className="form-control" name="state" value={form.state} onChange={handleChange} placeholder="State" />
            </div>
          </div>

          {/* Location Picker */}
          <div className="form-group">
            <LocationPicker
              latitude={form.latitude}
              longitude={form.longitude}
              address={form.location}
              onLocationChange={handleLocationChange}
              label="Your Location *"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Number of People *</label>
              <input type="number" className="form-control" name="peopleCount" value={form.peopleCount} onChange={handleChange} min="1" required />
            </div>
            <div className="form-group">
              <label>Contact Number *</label>
              <input type="tel" className="form-control" name="contactNumber" value={form.contactNumber} onChange={handleChange} placeholder="Phone number" required />
            </div>
          </div>

          <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
            <button type="submit" className="btn btn-warning btn-lg" disabled={loading}>
              {loading ? 'Submitting...' : '🤲 Submit Request'}
            </button>
            <button type="button" className="btn btn-outline btn-lg" onClick={() => navigate(-1)}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}
