import { useAuth } from '../contexts/AuthContext';
import StudentDashboard from '../pages/Dashboard/StudentDashboard';
import OwnerDashboard from '../pages/Dashboard/OwnerDashboard';
import AdminDashboard from '../pages/Dashboard/AdminDashboard';

const RoleBasedDashboard = () => {
  const { user } = useAuth();
  
  if (!user) return null;
  
  if (user.user_type === 'admin') return <AdminDashboard />;
  if (user.user_type === 'owner') return <OwnerDashboard />;
  return <StudentDashboard />;
};

export default RoleBasedDashboard;