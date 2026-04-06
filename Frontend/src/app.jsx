import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/Layout/ProtectedRoute';
import Navbar from './components/Layout/Navbar';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import RoleBasedDashboard from './components/RoleBasedDashboard';
import HostelDetail from './pages/Hostels/HostelDetail';
import AdvancedSearch from './pages/Hostels/AdvancedSearch';
import MyBookings from './pages/Bookings/MyBookings';
import BookingForm from './pages/Bookings/BookingForm';
import Wishlist from './pages/Wishlist/Wishlist';
import ManageHostels from './pages/Owner/ManageHostels';
import HostelForm from './pages/Owner/HostelForm';
import ManageRooms from './pages/Owner/ManageRooms';
import RoomForm from './pages/Owner/RoomForm';
import ManageUsers from './pages/Admin/ManageUsers';
import ManageHostelsAdmin from './pages/Admin/ManageHostels';
import VerifyHostels from './pages/Admin/VerifyHostels';
import ReportsDashboard from './pages/Admin/ReportsDashboard';
import PlatformManagement from './pages/Admin/PlatformManagement';
import AuditLogs from './pages/Admin/AuditLogs';
import AdminBookings from './pages/Admin/AdminBookings';


function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Navbar />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<Navigate to="/dashboard" />} />
          
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <RoleBasedDashboard />
            </ProtectedRoute>
          } />
          
          <Route path="/search" element={<ProtectedRoute><AdvancedSearch /></ProtectedRoute>} />
          <Route path="/hostels/:id" element={<ProtectedRoute><HostelDetail /></ProtectedRoute>} />
          <Route path="/my-bookings" element={<ProtectedRoute><MyBookings /></ProtectedRoute>} />
          <Route path="/bookings/room/:roomId" element={<ProtectedRoute><BookingForm /></ProtectedRoute>} />
          <Route path="/wishlist" element={<ProtectedRoute><Wishlist /></ProtectedRoute>} />
          
          <Route path="/owner/hostels" element={<ProtectedRoute allowedRoles={['owner']}><ManageHostels /></ProtectedRoute>} />
          <Route path="/owner/hostels/new" element={<ProtectedRoute allowedRoles={['owner']}><HostelForm /></ProtectedRoute>} />
          <Route path="/owner/hostels/:id/edit" element={<ProtectedRoute allowedRoles={['owner']}><HostelForm /></ProtectedRoute>} />
          <Route path="/owner/hostels/:id/rooms" element={<ProtectedRoute allowedRoles={['owner']}><ManageRooms /></ProtectedRoute>} />
          <Route path="/owner/hostels/:hostelId/rooms/new" element={<ProtectedRoute allowedRoles={['owner']}><RoomForm /></ProtectedRoute>} />
          <Route path="/owner/rooms/:id/edit" element={<ProtectedRoute allowedRoles={['owner']}><RoomForm /></ProtectedRoute>} />
          
          <Route path="/admin/users" element={<ProtectedRoute allowedRoles={['admin']}><ManageUsers /></ProtectedRoute>} />
          <Route path="/admin/hostels" element={<ProtectedRoute allowedRoles={['admin']}><ManageHostelsAdmin /></ProtectedRoute>} />
          <Route path="/admin/verify-hostels" element={<ProtectedRoute allowedRoles={['admin']}><VerifyHostels /></ProtectedRoute>} />
          <Route path="/admin/reports" element={<ProtectedRoute allowedRoles={['admin']}><ReportsDashboard /></ProtectedRoute>} />
          <Route path="/admin/platform" element={<ProtectedRoute allowedRoles={['admin']}><PlatformManagement /></ProtectedRoute>} />
          <Route path="/admin/audit-logs" element={<ProtectedRoute allowedRoles={['admin']}><AuditLogs /></ProtectedRoute>} />
          <Route path="/admin/bookings" element={<ProtectedRoute allowedRoles={['admin']}><AdminBookings /></ProtectedRoute>} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;