import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { FaExclamationTriangle, FaHandHoldingHeart, FaUserShield, FaCampground, FaUsers, FaBullhorn } from 'react-icons/fa';

export default function LandingPage() {
  const [stats, setStats] = useState(null);
  const [announcements, setAnnouncements] = useState([]);
  const [camps, setCamps] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [annRes, campRes] = await Promise.all([
          api.get('/api/announcements/public'),
          api.get('/api/camps?limit=6')
        ]);
        setAnnouncements(annRes.data.announcements || annRes.data);
        setCamps(campRes.data.camps || campRes.data);
      } catch (err) { console.log(err); }
    };
    fetchData();
  }, []);

  return (
    <div>
      {/* Navbar */}
      <div className="landing-hero">
        <nav className="navbar">
          <div className="navbar-brand">🚑 ResQLink</div>
          <div className="navbar-links">
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </div>
        </nav>

        <h1>Emergency Response. Connected.</h1>
        <h1 style={{ color: '#f39c12' }}>Coordinated. Faster.</h1>
        <p style={{ marginTop: 20 }}>
          A unified platform connecting citizens, volunteers and authorities during floods,
          cyclones and other disasters. When every second matters.
        </p>
        <div className="hero-buttons">
          <Link to="/register" className="btn btn-light btn-lg">
            <FaExclamationTriangle /> Report Emergency
          </Link>
          <Link to="/register" className="btn btn-outline-light btn-lg">
            <FaUserShield /> Volunteer Now
          </Link>
          <Link to="/login" className="btn btn-outline-light btn-lg">
            🔐 Authority Login
          </Link>
        </div>
      </div>

      {/* How it works */}
      <section className="landing-section">
        <h2>How ResQLink Works</h2>
        <p className="section-subtitle">Connecting those who need help with those who can help</p>
        <div className="grid-3" style={{ marginTop: 30 }}>
          {[
            { icon: <FaExclamationTriangle size={40} />, title: 'Report', desc: 'Citizens report emergencies and request assistance with location details', color: '#e74c3c' },
            { icon: <FaHandHoldingHeart size={40} />, title: 'Coordinate', desc: 'Authorities review, prioritize and assign volunteers to handle emergencies', color: '#f39c12' },
            { icon: <FaUserShield size={40} />, title: 'Resolve', desc: 'Volunteers execute rescue, relief and recovery operations on the ground', color: '#27ae60' },
          ].map((step, i) => (
            <div key={i} className="card" style={{ textAlign: 'center', padding: 30 }}>
              <div style={{ color: step.color, marginBottom: 16 }}>{step.icon}</div>
              <h3 style={{ marginBottom: 8 }}>Step {i + 1}: {step.title}</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Emergency Announcements */}
      {announcements.length > 0 && (
        <section className="landing-section" style={{ background: '#f8f9fa', padding: '40px 20px', maxWidth: '100%' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <h2><FaBullhorn /> Emergency Announcements</h2>
            <p className="section-subtitle">Stay informed about active emergencies</p>
            <div style={{ marginTop: 24 }}>
              {announcements.slice(0, 3).map((ann) => (
                <div key={ann._id} className={`announcement-banner ${ann.priority === 'Emergency' ? '' : ann.priority === 'Warning' ? 'warning' : 'info'}`}>
                  <FaExclamationTriangle />
                  <div>
                    <strong>{ann.title}</strong>
                    <p style={{ margin: 0, fontSize: '0.85rem', opacity: 0.9 }}>{ann.message}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Active Relief Camps */}
      {camps.length > 0 && (
        <section className="landing-section">
          <h2><FaCampground /> Active Relief Camps</h2>
          <p className="section-subtitle">Find shelter and relief near you</p>
          <div className="grid-3" style={{ marginTop: 24 }}>
            {camps.slice(0, 6).map((camp) => (
              <div key={camp._id} className="card">
                <h4>{camp.name}</h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: '4px 0' }}>
                  📍 {camp.district}, {camp.state}
                </p>
                <div style={{ margin: '12px 0' }}>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    Occupancy: {camp.currentOccupancy} / {camp.maxCapacity}
                  </div>
                  <div className="progress-bar" style={{ marginTop: 4 }}>
                    <div
                      className={`progress-fill ${(camp.currentOccupancy / camp.maxCapacity) > 0.85 ? 'red' : (camp.currentOccupancy / camp.maxCapacity) > 0.6 ? 'yellow' : 'green'}`}
                      style={{ width: `${(camp.currentOccupancy / camp.maxCapacity) * 100}%` }}
                    />
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {camp.foodAvailable && <span className="badge badge-success">Food</span>}
                  {camp.waterAvailable && <span className="badge badge-info">Water</span>}
                  {camp.medicalSupport && <span className="badge badge-danger">Medical</span>}
                  <span className="badge badge-secondary">{camp.status}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Footer */}
      <footer style={{ background: 'var(--bg-dark)', color: 'white', padding: '40px 20px', textAlign: 'center' }}>
        <h3 style={{ color: 'var(--info-light)' }}>🚑 ResQLink</h3>
        <p style={{ opacity: 0.7, marginTop: 8 }}>Connecting Citizens, Volunteers and Authorities When Every Second Matters</p>
        <div style={{ margin: '20px 0' }}>
          <strong>Emergency Helplines:</strong>
          <p style={{ opacity: 0.8, marginTop: 4 }}>
            National Emergency: 112 | NDRF: 011-24363260 | Ambulance: 108 | Police: 100
          </p>
        </div>
        <p style={{ opacity: 0.5, fontSize: '0.8rem', marginTop: 20 }}>© 2024 ResQLink. Built for disaster response.</p>
      </footer>
    </div>
  );
}
