import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { toast } from 'react-toastify';
import { FaUser } from 'react-icons/fa';

export default function ProfilePage() {
  const { user, updateUser } = useAuth();
  const [form, setForm] = useState({
    name: user?.name || '', phone: user?.phone || '', location: user?.location || ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.put('/api/auth/profile', form);
      updateUser(data);
      toast.success('Profile updated!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 600 }}>
      <h2 style={{ marginBottom: 20 }}><FaUser /> My Profile</h2>

      <div className="card">
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', margin: '0 auto 12px' }}>
            {user?.name?.charAt(0)?.toUpperCase()}
          </div>
          <h3>{user?.name}</h3>
          <span className={`badge badge-${user?.role === 'admin' ? 'danger' : user?.role === 'volunteer' ? 'success' : 'info'}`}>
            {user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1)}
          </span>
          <p style={{ color: 'var(--text-secondary)', marginTop: 8 }}>{user?.email}</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name</label>
            <input type="text" className="form-control" name="name" value={form.name} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Phone</label>
            <input type="tel" className="form-control" name="phone" value={form.phone} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Location</label>
            <input type="text" className="form-control" name="location" value={form.location} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input type="email" className="form-control" value={user?.email} disabled style={{ background: '#f5f5f5' }} />
          </div>
          <div className="form-group">
            <label>Role</label>
            <input type="text" className="form-control" value={user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1)} disabled style={{ background: '#f5f5f5' }} />
          </div>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Saving...' : 'Update Profile'}
          </button>
        </form>
      </div>
    </div>
  );
}
