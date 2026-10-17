import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

// Layouts
import DashboardLayout from './layouts/DashboardLayout';

// Public Pages
import LandingPage from './pages/public/LandingPage';
import LoginPage from './pages/public/LoginPage';
import RegisterPage from './pages/public/RegisterPage';

// Citizen Pages
import CitizenDashboard from './pages/citizen/CitizenDashboard';
import ReportEmergency from './pages/citizen/ReportEmergency';
import RequestHelp from './pages/citizen/RequestHelp';
import MyRequests from './pages/citizen/MyRequests';
import RequestDetails from './pages/citizen/RequestDetails';
import NearbyCamps from './pages/citizen/NearbyCamps';
import AnnouncementsPage from './pages/citizen/AnnouncementsPage';

// Volunteer Pages
import VolunteerDashboard from './pages/volunteer/VolunteerDashboard';
import AvailableTasks from './pages/volunteer/AvailableTasks';
import MyAssignments from './pages/volunteer/MyAssignments';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import GISMap from './pages/admin/GISMap';
import EmergencyManagement from './pages/admin/EmergencyManagement';
import RequestManagement from './pages/admin/RequestManagement';
import AdminRequestDetails from './pages/admin/AdminRequestDetails';
import VolunteerManagement from './pages/admin/VolunteerManagement';
import CampManagement from './pages/admin/CampManagement';
import ResourceInventory from './pages/admin/ResourceInventory';
import ResourceDistribution from './pages/admin/ResourceDistribution';
import AnnouncementManagement from './pages/admin/AnnouncementManagement';
import AnalyticsDashboard from './pages/admin/AnalyticsDashboard';

// Profile
import ProfilePage from './pages/ProfilePage';

function ProtectedRoute({ children, roles }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="loading"><div className="spinner"></div>Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/" />;
  return children;
}

export default function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="loading" style={{ minHeight: '100vh' }}><div className="spinner"></div>Loading ResQLink...</div>;
  }

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={user ? <Navigate to={`/${user.role}`} /> : <LandingPage />} />
      <Route path="/login" element={user ? <Navigate to={`/${user.role}`} /> : <LoginPage />} />
      <Route path="/register" element={user ? <Navigate to={`/${user.role}`} /> : <RegisterPage />} />

      {/* Citizen Routes */}
      <Route path="/citizen" element={<ProtectedRoute roles={['citizen']}><DashboardLayout role="citizen" /></ProtectedRoute>}>
        <Route index element={<CitizenDashboard />} />
        <Route path="report-emergency" element={<ReportEmergency />} />
        <Route path="request-help" element={<RequestHelp />} />
        <Route path="my-requests" element={<MyRequests />} />
        <Route path="my-requests/:id" element={<RequestDetails />} />
        <Route path="nearby-camps" element={<NearbyCamps />} />
        <Route path="announcements" element={<AnnouncementsPage />} />
        <Route path="profile" element={<ProfilePage />} />
      </Route>

      {/* Volunteer Routes */}
      <Route path="/volunteer" element={<ProtectedRoute roles={['volunteer']}><DashboardLayout role="volunteer" /></ProtectedRoute>}>
        <Route index element={<VolunteerDashboard />} />
        <Route path="available-tasks" element={<AvailableTasks />} />
        <Route path="my-assignments" element={<MyAssignments />} />
        <Route path="nearby-camps" element={<NearbyCamps />} />
        <Route path="announcements" element={<AnnouncementsPage />} />
        <Route path="profile" element={<ProfilePage />} />
      </Route>

      {/* Admin Routes */}
      <Route path="/admin" element={<ProtectedRoute roles={['admin']}><DashboardLayout role="admin" /></ProtectedRoute>}>
        <Route index element={<AdminDashboard />} />
        <Route path="gis-map" element={<GISMap />} />
        <Route path="emergencies" element={<EmergencyManagement />} />
        <Route path="requests" element={<RequestManagement />} />
        <Route path="requests/:id" element={<AdminRequestDetails />} />
        <Route path="volunteers" element={<VolunteerManagement />} />
        <Route path="camps" element={<CampManagement />} />
        <Route path="resources" element={<ResourceInventory />} />
        <Route path="distributions" element={<ResourceDistribution />} />
        <Route path="announcements" element={<AnnouncementManagement />} />
        <Route path="analytics" element={<AnalyticsDashboard />} />
        <Route path="profile" element={<ProfilePage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}
