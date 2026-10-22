import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  FaHome, FaExclamationTriangle, FaHandHoldingHeart, FaUserFriends,
  FaCampground, FaBox, FaBullhorn, FaChartBar, FaMapMarkedAlt,
  FaUser, FaSignOutAlt, FaBars, FaTasks, FaTimes, FaBell, FaListAlt
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
    { to: '/admin/distributions', icon: <FaTasks />, label: 'Distribution' },
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
      {/* Mobile menu toggle — always visible on small screens */}
      <div className="menu-toggle">
        <button
          className="btn btn-outline btn-sm"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-label={sidebarOpen ? 'Close menu' : 'Open menu'}
        >
          {sidebarOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <h2>
            <FaExclamationTriangle />
            <span className="d-md-none">ResQLink</span>
          </h2>
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
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-label-text">{item.label}</span>
              </NavLink>
            )
          )}
        </nav>
        <div className="sidebar-footer">
          <div className="sidebar-user">
            <div className="sidebar-avatar">
              {user?.name?.charAt(0) || 'U'}
            </div>
            <div className="sidebar-user-text">
              <div className="sidebar-user-name">{user?.name || 'User'}</div>
              <div className="sidebar-user-role">{roleLabels[role]}</div>
            </div>
          </div>
          <button className="btn btn-outline btn-sm w-100" onClick={handleLogout}>
            <FaSignOutAlt />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <header className="header">
          <div className="header-left">
            <div className="header-brand">
              <span className="header-title">ResQLink</span>
              <span className="header-sub">Emergency Response &amp; Relief Coordination</span>
            </div>
            <div>
              <strong className="welcome">Welcome, {user?.name}</strong>
              <div className="user-meta">
                {user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1)} • {user?.email}
              </div>
            </div>
          </div>
          <div className="header-right">
            <span className={`badge bg-${role === 'admin' ? 'danger' : role === 'volunteer' ? 'success' : 'info'}`}>
              {role === 'admin' ? 'Authority' : role === 'volunteer' ? 'Volunteer' : 'Citizen'}
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
