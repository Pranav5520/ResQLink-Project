import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', confirmPassword: '',
    phone: '', role: 'citizen', location: ''
  });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      return toast.error('Passwords do not match');
    }
    if (formData.password.length < 6) {
      return toast.error('Password must be at least 6 characters');
    }
    setLoading(true);
    try {
      const user = await register(formData);
      toast.success('Registration successful!');
      navigate(`/${user.role}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card" style={{ maxWidth: 500 }}>
        <h2>🚑 Join ResQLink</h2>
        <p className="auth-subtitle">Create your account</p>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name</label>
            <input type="text" className="form-control" name="name" value={formData.name} onChange={handleChange} placeholder="Enter your full name" required />
          </div>
          <div className="form-group">
            <label>Email Address</label>
            <input type="email" className="form-control" name="email" value={formData.email} onChange={handleChange} placeholder="Enter your email" required />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Password</label>
              <input type="password" className="form-control" name="password" value={formData.password} onChange={handleChange} placeholder="Min 6 characters" required />
            </div>
            <div className="form-group">
              <label>Confirm Password</label>
              <input type="password" className="form-control" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} placeholder="Confirm password" required />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Phone Number</label>
              <input type="tel" className="form-control" name="phone" value={formData.phone} onChange={handleChange} placeholder="Enter phone" />
            </div>
            <div className="form-group">
              <label>Role</label>
              <select className="form-control" name="role" value={formData.role} onChange={handleChange}>
                <option value="citizen">Citizen</option>
                <option value="volunteer">Volunteer</option>
              </select>
            </div>
          </div>
          <div className="form-group">
            <label>Location / City</label>
            <input type="text" className="form-control" name="location" value={formData.location} onChange={handleChange} placeholder="e.g. Patna, Bihar" />
          </div>
          <button type="submit" className="btn btn-primary btn-block btn-lg" disabled={loading}>
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>
        <p className="auth-footer">
          Already have an account? <Link to="/login">Sign In</Link>
        </p>
      </div>
    </div>
  );
}
