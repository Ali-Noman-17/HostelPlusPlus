import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getOwnerDashboard, getHostelBookings } from '../../api/owner';
import { getMyHostels } from '../../api/owner';

export default function OwnerDashboard() {
  const [stats, setStats] = useState(null);
  const [todayCheckins, setTodayCheckins] = useState([]);
  const [newBookings, setNewBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const statsRes = await getOwnerDashboard();
      setStats(statsRes.data.data);

      const hostelsRes = await getMyHostels();
      const hostels = hostelsRes.data.data || [];

      let allCheckins = [];
      let allNewBookings = [];

      for (const hostel of hostels) {
        const bookingsRes = await getHostelBookings(hostel.hostel_id);
        const bookings = bookingsRes.data.data || [];
        
        const today = new Date().toISOString().split('T')[0];
        const checkins = bookings.filter(b => b.check_in_date === today && b.status === 'confirmed');
        allCheckins.push(...checkins);
        
        const lastWeek = new Date();
        lastWeek.setDate(lastWeek.getDate() - 7);
        const newOnes = bookings.filter(b => new Date(b.booking_date) > lastWeek);
        allNewBookings.push(...newOnes);
      }

      setTodayCheckins(allCheckins.slice(0, 10));
      setNewBookings(allNewBookings.slice(0, 10));
    } catch (err) {
      console.error('Error fetching owner dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="container mx-auto p-6 text-center">Loading dashboard...</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Owner Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-blue-100 p-4 rounded-lg">
          <p className="text-gray-600">Total Hostels</p>
          <p className="text-2xl font-bold">{stats?.hostels?.total || 0}</p>
        </div>
        <div className="bg-green-100 p-4 rounded-lg">
          <p className="text-gray-600">Total Rooms</p>
          <p className="text-2xl font-bold">{stats?.rooms?.total || 0}</p>
        </div>
        <div className="bg-yellow-100 p-4 rounded-lg">
          <p className="text-gray-600">Occupancy Rate</p>
          <p className="text-2xl font-bold">
            {stats?.rooms?.total > 0 
              ? Math.round(((stats.rooms.total - (stats.rooms.available || 0)) / stats.rooms.total) * 100) 
              : 0}%
          </p>
        </div>
        <div className="bg-purple-100 p-4 rounded-lg">
          <p className="text-gray-600">Monthly Revenue</p>
          <p className="text-2xl font-bold">PKR {stats?.revenue?.total?.toLocaleString() || 0}</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Today's Check-ins */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Today's Check-ins</h2>
          {todayCheckins.length === 0 ? (
            <p className="text-gray-500">No check-ins scheduled for today.</p>
          ) : (
            <div className="space-y-3">
              {todayCheckins.map(booking => (
                <div key={booking.booking_id} className="border-b pb-2">
                  <p className="font-semibold">{booking.guest_name}</p>
                  <p className="text-sm text-gray-600">{booking.hostel_name} - {booking.room_type}</p>
                  <p className="text-xs text-gray-500">Booking: {booking.booking_reference}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* New Bookings (Last 7 Days) */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">New Bookings (Last 7 Days)</h2>
          {newBookings.length === 0 ? (
            <p className="text-gray-500">No new bookings in the last 7 days.</p>
          ) : (
            <div className="space-y-3">
              {newBookings.map(booking => (
                <div key={booking.booking_id} className="border-b pb-2">
                  <p className="font-semibold">{booking.guest_name}</p>
                  <p className="text-sm text-gray-600">{booking.hostel_name} - {booking.room_type}</p>
                  <p className="text-xs text-gray-500">
                    {booking.check_in_date} to {booking.check_out_date} | PKR {booking.total_amount}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}