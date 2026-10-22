import { useState, useEffect } from 'react';
import api from '../../services/api';
import { toast } from 'react-toastify';
import { FaChartLine, FaUsers, FaHandHoldingHeart, FaMapMarkerAlt, FaCalendarAlt } from 'react-icons/fa';

export default function AnalyticsDashboard() {
  const [stats, setStats] = useState({});
  const [loadChart, setLoadChart] = useState(false);

  useEffect(() => { fetchAnalytics(); }, []);

  const fetchAnalytics = async () => {
    try {
      const { data } = await api.get('/api/analytics/overview');
      setStats(data);
    } catch (err) { console.error(err); }
  };

  if (!stats) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Loading analytics...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="mb-0">Analytics Dashboard</h1>
          <p className="text-muted">Platform overview and performance metrics</p>
        </div>
      </div>

      <div className="row">
        <div className="col-md-3">
          <div className="card stat-card text-white">
            <div className="card-body">
              <div className="stat-icon bg-primary"><FaUsers /></div>
              <div className="stat-value">{stats?.citizens || 0}</div>
              <div className="stat-label">Citizens</div>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card stat-card text-white">
            <div className="card-body">
              <div className="stat-icon bg-success"><FaHandHoldingHeart /></div>
              <div className="stat-value">{stats?.requests || 0}</div>
              <div className="stat-label">Total Requests</div>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card stat-card text-white">
            <div className="card-body">
              <div className="stat-icon bg-warning"><FaMapMarkerAlt /></div>
              <div className="stat-value">{stats?.emergencies || 0}</div>
              <div className="stat-label">Incidents</div>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card stat-card text-white">
            <div className="card-body">
              <div className="stat-icon bg-info"><FaCalendarAlt /></div>
              <div className="stat-value">{stats?.volunteers || 0}</div>
              <div className="stat-label">Volunteers</div>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-md-8">
          <div className="card">
            <div className="card-header">
              <FaChartLine /> Request Activity
            </div>
            <div className="card-body">
              <div className="chart-placeholder" style={{ height: 260 }}>
                <p className="text-secondary">Area chart rendered here.</p>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card">
            <div className="card-header">
              <FaMapMarkerAlt /> Top Locations
            </div>
            <div className="card-body">
              <div className="list-group list-group-flush">
                {stats?.topLocations?.map((l, i) => (
                  <div key={i} className="list-group-item d-flex justify-content-between">
                    <span>{l.name}</span>
                    <span className="small">{l.count} requests</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
