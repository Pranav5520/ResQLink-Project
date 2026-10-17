import { useState, useEffect } from 'react';
import api from '../../services/api';
import { toast } from 'react-toastify';
import { FaUserFriends } from 'react-icons/fa';

export default function VolunteerManagement() {
  const [volunteers, setVolunteers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ availability: '', skill: '' });

  useEffect(() => { fetchVolunteers(); }, [filters]);

  const fetchVolunteers = async () => {
    try {
      const params = new URLSearchParams({ limit: 50 });
      if (filters.availability) params.set('availability', filters.availability);
      if (filters.skill) params.set('skill', filters.skill);
      const { data } = await api.get(`/api/volunteers?${params}`);
      setVolunteers(data.volunteers || []);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  return (
    <div>
      <h2 style={{ marginBottom: 20 }}><FaUserFriends /> Volunteer Management</h2>

      <div className="filter-bar">
        <select className="form-control" value={filters.availability} onChange={e => setFilters({ ...filters, availability: e.target.value })}>
          <option value="">All Status</option>
          <option value="Available">Available</option>
          <option value="Assigned">Assigned</option>
          <option value="Busy">Busy</option>
          <option value="Offline">Offline</option>
        </select>
        <select className="form-control" value={filters.skill} onChange={e => setFilters({ ...filters, skill: e.target.value })}>
          <option value="">All Skills</option>
          {['First Aid', 'Medical Support', 'Rescue', 'Food Distribution', 'Transportation', 'Communication', 'Shelter Management', 'Technical Support', 'General Volunteer'].map(s => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="loading"><div className="spinner"></div>Loading...</div>
      ) : volunteers.length === 0 ? (
        <div className="card"><div className="empty-state"><div className="empty-icon">👥</div><h4>No volunteers found</h4></div></div>
      ) : (
        <div className="card">
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Skills</th>
                  <th>Location</th>
                  <th>Status</th>
                  <th>Completed</th>
                  <th>Hours</th>
                </tr>
              </thead>
              <tbody>
                {volunteers.map(v => (
                  <tr key={v._id}>
                    <td style={{ fontWeight: 500 }}>{v.user?.name || '—'}</td>
                    <td style={{ fontSize: '0.85rem' }}>{v.user?.email || '—'}</td>
                    <td style={{ fontSize: '0.85rem' }}>{v.user?.phone || '—'}</td>
                    <td>
                      <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                        {v.skills?.map(s => <span key={s} className="badge badge-secondary" style={{ fontSize: '0.7rem' }}>{s}</span>)}
                      </div>
                    </td>
                    <td style={{ fontSize: '0.85rem' }}>{v.location || '—'}</td>
                    <td>
                      <span className={`badge badge-${v.availability === 'Available' ? 'success' : v.availability === 'Assigned' ? 'info' : v.availability === 'Busy' ? 'warning' : 'secondary'}`}>
                        {v.availability}
                      </span>
                    </td>
                    <td>{v.completedAssignments}</td>
                    <td>{v.totalHours}h</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
