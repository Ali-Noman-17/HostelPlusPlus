import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) return null;

  const isAdmin = user.user_type === 'admin';

  return (
    <nav className="bg-blue-600 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/dashboard" className="text-xl font-bold">HostelPlusPlus</Link>
        <div className="space-x-4">
          <Link to="/search">Search 🔎</Link>

          {!isAdmin && (<> <Link to="/my-bookings">My Bookings</Link> </>)}
          
          {user.user_type === 'student' && <Link to="/wishlist">Wishlist</Link>}
          {user.user_type === 'owner' && <Link to="/owner/hostels">Manage Hostels</Link>}
          {user.user_type === 'admin' && (
            <>
              <Link to="/admin/users">Users</Link>
              <Link to="/admin/bookings">Bookings</Link>
              <Link to="/admin/hostels">Hostels</Link>
              <Link to="/admin/verify-hostels">Verify Hostels</Link>
              <Link to="/admin/platform">Platform</Link>
              <Link to="/admin/audit-logs">Audit Logs</Link>
              <Link to="/admin/reports">Reports</Link>

            </>
          )}
          <span className="ml-4">Hello, {user.first_name}</span>
          <button onClick={handleLogout} className="bg-red-500 px-3 py-1 rounded">Logout</button>
        </div>
      </div>
    </nav>
  );
}