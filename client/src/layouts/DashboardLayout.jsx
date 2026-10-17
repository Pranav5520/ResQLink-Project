import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  FaHome, FaExclamationTriangle, FaHandHoldingHeart, FaUserFriends,
  FaCampground, FaBox, FaBullhorn, FaChartBar, FaMapMarkedAlt,
  FaUser, FaSignOutAlt, FaBars, FaTasks, FaTruck, FaTimes,
  FaBell, FaListAlt, FaMap
} from 'react-icons/fa';

const navConfig = {
  citizen: [
    { to: '/citizen', icon: <FaHome />, label: 'Dashboard', end: true },
    { to: '/citizen/report-emergency', icon: <FaExclamationTriangle />, label: 'Report Emergency' },
    { to: '/citizen/request-help', icon: <FaHandHoldingHeart />, label: 'Request Help' },
    { to: '/citizen/my-requests', icon: <FaListAlt />, label: 'My Requests' },
    { to: '/citizen/nearby-camps', icon: <FaCampground />, label: 'Nearby Camps' },
    { to: '/citizen/announcements', icon: <FaBullhorn />, label: 'Announcements' },
    { divider: true },
    { to: '/citizen/profile', icon: <FaUser />, label: 'Profile' },
  ],
  volunteer: [
    { to: '/volunteer', icon: <FaHome />, label: 'Dashboard', end: true },
    { to: '/volunteer/available-tasks', icon: <FaTasks />, label: 'Available Tasks' },
    { to: '/volunteer/my-assignments', icon: <FaBell />, label: 'My Assignments' },
    { to: '/volunteer/nearby-camps', icon: <FaCampground />, label: 'Nearby Camps' },
    { to: '/volunteer/announcements', icon: <FaBullhorn />, label: 'Announcements' },
    { divider: true },
    { to: '/volunteer/profile', icon: <FaUser />, label: 'Profile' },
  ],
  admin: [
    { to: '/admin', icon: <FaHome />, label: 'Dashboard', end: true },
    { to: '/admin/gis-map', icon: <FaMapMarkedAlt />, label: 'GIS Map' },
    { label: 'MANAGEMENT', divider: true },
    { to: '/admin/emergencies', icon: <FaExclamationTriangle />, label: 'Emergencies' },
    { to: '/admin/requests', icon: <FaHandHoldingHeart />, label: 'Citizen Requests' },
    { to: '/admin/volunteers', icon: <FaUserFriends />, label: 'Volunteers' },
    { to: '/admin/camps', icon: <FaCampground />, label: 'Relief Camps' },
    { label: 'RESOURCES', divider: true },
    { to: '/admin/resources', icon: <FaBox />, label: 'Inventory' },
    { to: '/admin/distributions', icon: <FaTruck />, label: 'Distribution' },
    { label: 'COMMUNICATION', divider: true },
    { to: '/admin/announcements', icon: <FaBullhorn />, label: 'Announcements' },
    { label: 'INSIGHTS', divider: true },
    { to: '/admin/analytics', icon: <FaChartBar />, label: 'Analytics' },
    { divider: true },
    { to: '/admin/profile', icon: <FaUser />, label: 'Profile' },
  ]
};

const roleLabels = { citizen: 'Citizen Portal', volunteer: 'Volunteer Portal', admin: 'Command Center' };

export default function DashboardLayout({ role }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navItems = navConfig[role] || [];

  return (
    <div className="app-layout">
      {/* Mobile menu toggle */}
      <div style={{ position: 'fixed', top: 16, left: 16, zIndex: 200 }}>
        <button className="menu-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>
          {sidebarOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <h2>🚑 ResQLink</h2>
          <p>{roleLabels[role]}</p>
        </div>
        <nav className="sidebar-nav">
          {navItems.map((item, i) =>
            item.divider ? (
              item.label ? (
                <div key={i} className="nav-label">{item.label}</div>
              ) : (
                <div key={i} className="nav-divider" />
              )
            ) : (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                onClick={() => setSidebarOpen(false)}
              >
                {item.icon}
                <span>{item.label}</span>
              </NavLink>
            )
          )}
          <div className="nav-divider" />
          <a onClick={handleLogout} style={{ cursor: 'pointer' }}>
            <FaSignOutAlt />
            <span>Logout</span>
          </a>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <header className="header">
          <div className="header-left" style={{ paddingLeft: 48 }}>
            <div>
              <strong>Welcome, {user?.name}</strong>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                {user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1)} • {user?.email}
              </div>
            </div>
          </div>
          <div className="header-right">
            <span className={`badge badge-${role === 'admin' ? 'danger' : role === 'volunteer' ? 'success' : 'info'}`}>
              {role === 'admin' ? '🔴 Authority' : role === 'volunteer' ? '🟢 Volunteer' : '🔵 Citizen'}
            </span>
          </div>
        </header>
        <div className="page-content">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
