import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { toast } from 'react-toastify';
import { FaExclamationTriangle } from 'react-icons/fa';
import LocationPicker from '../../components/LocationPicker';

const CATEGORIES = ['Flood', 'Cyclone', 'Earthquake', 'Fire', 'Landslide', 'Medical Emergency', 'Building Collapse', 'Road Accident', 'Other'];
const SEVERITIES = ['Low', 'Medium', 'High', 'Critical'];

export default function ReportEmergency() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: '', category: 'Flood', description: '', location: '',
    latitude: null, longitude: null, severity: 'Medium', peopleAffected: '',
    contactNumber: '', district: '', state: ''
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
      await api.post('/api/emergencies', {
        ...form,
        peopleAffected: parseInt(form.peopleAffected) || 0,
        latitude: parseFloat(form.latitude),
        longitude: parseFloat(form.longitude)
      });
      toast.success('Emergency reported successfully!');
      navigate('/citizen');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to report emergency');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 700 }}>
      <h2 style={{ marginBottom: 8 }}><FaExclamationTriangle /> Report Emergency</h2>
      <p style={{ color: 'var(--text-secondary)', marginBottom: 24 }}>
        Provide details about the emergency situation. Be as accurate as possible.
      </p>

      <div className="card">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Emergency Title *</label>
            <input type="text" className="form-control" name="title" value={form.title} onChange={handleChange}
              placeholder="Brief description of the emergency" required />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Category *</label>
              <select className="form-control" name="category" value={form.category} onChange={handleChange}>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Severity *</label>
              <select className="form-control" name="severity" value={form.severity} onChange={handleChange}>
                {SEVERITIES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Description *</label>
            <textarea className="form-control" name="description" value={form.description} onChange={handleChange}
              placeholder="Describe the emergency in detail..." rows={4} required />
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
              label="Emergency Location *"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>People Affected (estimated)</label>
              <input type="number" className="form-control" name="peopleAffected" value={form.peopleAffected} onChange={handleChange} placeholder="Number of people" min="0" />
            </div>
            <div className="form-group">
              <label>Contact Number</label>
              <input type="tel" className="form-control" name="contactNumber" value={form.contactNumber} onChange={handleChange} placeholder="Phone number" />
            </div>
          </div>

          <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
            <button type="submit" className="btn btn-danger btn-lg" disabled={loading}>
              {loading ? 'Submitting...' : '🚨 Report Emergency'}
            </button>
            <button type="button" className="btn btn-outline btn-lg" onClick={() => navigate(-1)}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}
