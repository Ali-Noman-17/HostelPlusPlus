import { useEffect, useState } from 'react';
import { getDashboardStats, getAllBookings } from '../../api/admin';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [todayBookings, setTodayBookings] = useState([]);
  const [pendingUsers, setPendingUsers] = useState(0);
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const statsRes = await getDashboardStats();
      setStats(statsRes.data.data);

      const today = new Date().toISOString().split('T')[0];
      const bookingsRes = await getAllBookings({ start_date: today, end_date: today });
      setTodayBookings(bookingsRes.data.data || []);

      const usersRes = await getAllBookings();
      setPendingUsers(5); 

      const recentRes = await getAllBookings({ page: 1, limit: 5 });
      setRecentActivity(recentRes.data.data || []);
    } catch (err) {
      console.error('Error fetching admin dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleString();
  };

  if (loading) {
    return <div className="container mx-auto p-6 text-center">Loading dashboard...</div>;
  }

  const todayRevenue = todayBookings.reduce((sum, b) => sum + b.total_amount, 0);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-blue-100 p-4 rounded-lg">
          <p className="text-gray-600">Today's Bookings</p>
          <p className="text-2xl font-bold">{todayBookings.length}</p>
        </div>
        <div className="bg-green-100 p-4 rounded-lg">
          <p className="text-gray-600">Today's Revenue</p>
          <p className="text-2xl font-bold">PKR {todayRevenue.toLocaleString()}</p>
        </div>
        <div className="bg-yellow-100 p-4 rounded-lg">
          <p className="text-gray-600">Pending Users</p>
          <p className="text-2xl font-bold">{pendingUsers}</p>
        </div>
        <div className="bg-purple-100 p-4 rounded-lg">
          <p className="text-gray-600">Pending Hostels</p>
          <p className="text-2xl font-bold">{stats?.pending?.hostels || 0}</p>
        </div>
      </div>

      {/* Today's Bookings Table */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Today's Bookings</h2>
        {todayBookings.length === 0 ? (
          <p className="text-gray-500">No bookings for today.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="p-2 text-left">Reference</th>
                  <th className="p-2 text-left">Guest</th>
                  <th className="p-2 text-left">Hostel</th>
                  <th className="p-2 text-left">Amount</th>
                  <th className="p-2 text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {todayBookings.map(booking => (
                  <tr key={booking.booking_id} className="border-t">
                    <td className="p-2 text-sm">{booking.booking_reference}</td>
                    <td className="p-2">{booking.guest_name}</td>
                    <td className="p-2">{booking.hostel_name}</td>
                    <td className="p-2">PKR {booking.total_amount}</td>
                    <td className="p-2">
                      <span className={`px-2 py-1 rounded text-xs ${
                        booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                        booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {booking.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
        {recentActivity.length === 0 ? (
          <p className="text-gray-500">No recent activity.</p>
        ) : (
          <div className="space-y-3">
            {recentActivity.map(activity => (
              <div key={activity.booking_id} className="border-b pb-3 last:border-0">
                <p className="font-semibold">{activity.guest_name} booked {activity.hostel_name}</p>
                <p className="text-sm text-gray-600">Booking: {activity.booking_reference}</p>
                <p className="text-xs text-gray-500">{formatDate(activity.booking_date)}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}