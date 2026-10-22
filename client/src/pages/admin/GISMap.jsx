import { useState, useEffect } from 'react';
import api from '../../services/api';
import { toast } from 'react-toastify';
import { FaFilter, FaSearch, FaLayerGroup, FaTimes, FaMapMarkedAlt, FaExclamationTriangle, FaInfoCircle } from 'react-icons/fa';

const TYPES = ['Fire', 'Flood', 'Earthquake', 'Medical', 'Accident', 'Crime', 'Industrial', 'Other'];
const STATUSES = ['Reported', 'Verified', 'Assigned', 'Resolved', 'Closed'];
const PRIORITIES = ['Normal', 'High', 'Critical'];

export default function GISMap() {
  const [markers, setMarkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ type: '', status: '', priority: '', search: '' });
  const [selected, setSelected] = useState(null);
  const [showLayer, setShowLayer] = useState(true);

  useEffect(() => { fetchMarkers(); }, [filters]);

  const fetchMarkers = async () => {
    try {
      const params = new URLSearchParams();
      if (filters.type) params.set('type', filters.type);
      if (filters.status) params.set('status', filters.status);
      if (filters.priority) params.set('priority', filters.priority);
      if (filters.search) params.set('search', filters.search);
      const { data } = await api.get(`/api/emergencies?${params}`);
      const e = data.emergencies || [];
      setMarkers(e);
      if (e[0]) setSelected(e[0]);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Loading map...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="mb-0">GIS Incident Map</h1>
          <p className="text-muted">Interactive map of emergency incidents and relief sites</p>
        </div>
        <div className="d-flex gap-2">
          <button className="btn btn-outline" onClick={() => setShowLayer(!showLayer)}><FaLayerGroup /> Layers</button>
          <div className="input-group" style={{ width: 260 }}>
            <FaSearch />
            <input className="form-control" placeholder="Search map..." />
          </div>
        </div>
      </div>

      {!showLayer ? (
        <div className="card overflow-hidden" style={{ height: 'calc(100vh - 140px)', background: 'transparent' }}>
          <div className="p-3" style={{ background: '#f8f9fa' }}>
            <div className="d-flex gap-2 flex-wrap">
              <select className="form-control" value={filters.type} onChange={e => setFilters({ ...filters, type: e.target.value, page: 1 })}><option value="">All Types</option>{TYPES.map(t => <option key={t} value={t}>{t}</option>)}</select>
              <select className="form-control" value={filters.status} onChange={e => setFilters({ ...filters, status: e.target.value, page: 1 })}><option value="">All Statuses</option>{STATUSES.map(s => <option key={s} value={s}>{s}</option>)}</select>
              <select className="form-control" value={filters.priority} onChange={e => setFilters({ ...filters, priority: e.target.value, page: 1 })}><option value="">All Priorities</option>{PRIORITIES.map(p => <option key={p} value={p}>{p}</option>)}</select>
              <div className="input-group" style={{ width: 200 }}><FaSearch /><input className="form-control" placeholder="Search..." /></div>
              <button className="btn btn-outline" onClick={fetchMarkers}><FaSearch /> Refresh</button>
            </div>
          </div>
          <div className="map-container" style={{ height: 'calc(100vh - 200px)' }}>
            <div className="map-placeholder">
              <FaMapMarkedAlt style={{ fontSize: '3rem', opacity: 0.25 }} />
              <p className="text-muted mt-2">Interactive map rendered in the browser (Leaflet/Mapbox).</p>
              <button className="btn btn-outline" onClick={fetchMarkers}><FaInfoCircle /> Render map</button>
            </div>
          </div>
          <div className="card mt-3" style={{ height: '140px' }}>
            <div className="card-body">
              <div className="d-flex gap-2 flex-wrap">
                <select className="form-control" value={filters.type} onChange={e => setFilters({ ...filters, type: e.target.value, page: 1 })}><option value="">All Types</option>{TYPES.map(t => <option key={t} value={t}>{t}</option>)}</select>
                <select className="form-control" value={filters.status} onChange={e => setFilters({ ...filters, status: e.target.value, page: 1 })}><option value="">All Statuses</option>{STATUSES.map(s => <option key={s} value={s}>{s}</option>)}</select>
                <select className="form-control" value={filters.priority} onChange={e => setFilters({ ...filters, priority: e.target.value, page: 1 })}><option value="">All Priorities</option>{PRIORITIES.map(p => <option key={p} value={p}>{p}</option>)}</select>
                <div className="input-group" style={{ width: 200 }}><FaSearch /><input className="form-control" placeholder="Search..." onChange={e => setFilters({ ...filters, search: e.target.value, page: 1 })} /></div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="card">
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Location</th>
                    <th>Type</th>
                    <th>Priority</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {markers.map(m => (
                    <tr key={m._id} onClick={() => setSelected(m)} style={{ cursor: 'pointer' }}>
                      <td>{m.title}</td>
                      <td className="text-sm">{m.location}</td>
                      <td className="text-sm">{m.type}</td>
                      <td><span className={`badge bg-${m.priority === 'Critical' ? 'critical' : m.priority === 'High' ? 'warning' : 'secondary'}`}>{m.priority}</span></td>
                      <td>
                        <span className={`badge bg-${m.status === 'Resolved' ? 'success' : m.status === 'Closed' ? 'secondary' : m.status === 'Assigned' ? 'info' : m.status === 'Verified' ? 'warning' : 'danger'}`}>{m.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          {selected && (
            <div className="card" style={{ position: 'fixed', bottom: 16, right: 16, zIndex: 1000 }}>
              <div className="card-body">
                <h5 className="card-title">{selected.title}</h5>
                <p className="card-text text-secondary small">{selected.description}</p>
                <p className="card-text"><FaMapMarkerAlt /> {selected.location}</p>
                <span className={`badge bg-${selected.priority === 'Critical' ? 'critical' : selected.priority === 'High' ? 'warning' : 'secondary'}`}>{selected.priority}</span>
                <span className={`badge bg-${selected.status === 'Resolved' ? 'success' : selected.status === 'Closed' ? 'secondary' : selected.status === 'Assigned' ? 'info' : selected.status === 'Verified' ? 'warning' : 'danger'}`}>{selected.status}</span>
                <button className="btn btn-sm btn-outline" onClick={() => setSelected(null)}><FaTimes /></button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
