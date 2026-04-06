import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getUserBookings } from '../../api/bookings';
import { getWishlist } from '../../api/wishlist';
import { searchHostels } from '../../api/hostels';

export default function StudentDashboard() {
  const [upcomingBookings, setUpcomingBookings] = useState([]);
  const [recentWishlist, setRecentWishlist] = useState([]);
  const [recommendedHostels, setRecommendedHostels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const bookingsRes = await getUserBookings();
      const allBookings = bookingsRes.data.data || [];
      const upcoming = allBookings.filter(b => 
        (b.status === 'confirmed' || b.status === 'pending') && 
        new Date(b.check_in_date) > new Date()
      );
      setUpcomingBookings(upcoming.slice(0, 5));

      const wishlistRes = await getWishlist();
      const wishlistItems = wishlistRes.data.data || [];
      setRecentWishlist(wishlistItems.slice(0, 5));

      const hostelsRes = await searchHostels({ sort_by: 'rating', limit: 6 });
      setRecommendedHostels(hostelsRes.data.data || []);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString();
  };

  if (loading) {
    return <div className="container mx-auto p-6 text-center">Loading dashboard...</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Welcome to Your Dashboard</h1>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Upcoming Bookings */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Upcoming Bookings</h2>
            <Link to="/my-bookings" className="text-blue-600 text-sm hover:underline">View All</Link>
          </div>
          {upcomingBookings.length === 0 ? (
            <p className="text-gray-500">No upcoming bookings.</p>
          ) : (
            <div className="space-y-4">
              {upcomingBookings.map(booking => (
                <div key={booking.booking_id} className="border-b pb-3 last:border-0">
                  <Link to={`/hostels/${booking.hostel_id}`} className="hover:text-blue-600">
                    <p className="font-semibold">{booking.hostel_name}</p>
                    <p className="text-sm text-gray-600">{booking.room_type}</p>
                    <p className="text-xs text-gray-500">{formatDate(booking.check_in_date)} - {formatDate(booking.check_out_date)}</p>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Wishlist Additions */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Recent Wishlist</h2>
            <Link to="/wishlist" className="text-blue-600 text-sm hover:underline">View All</Link>
          </div>
          {recentWishlist.length === 0 ? (
            <p className="text-gray-500">Your wishlist is empty.</p>
          ) : (
            <div className="space-y-4">
              {recentWishlist.map(item => (
                <div key={item.wishlist_id} className="border-b pb-3 last:border-0">
                  <Link to={`/hostels/${item.hostel_id}`} className="hover:text-blue-600">
                    <p className="font-semibold">{item.hostel_name}</p>
                    <p className="text-sm text-gray-600">{item.area_name}, {item.city_name}</p>
                    <p className="text-xs text-gray-500">Added: {new Date(item.added_date).toLocaleDateString()}</p>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recommended Hostels */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Recommended for You</h2>
            <Link to="/search" className="text-blue-600 text-sm hover:underline">See All</Link>
          </div>
          <div className="space-y-4">
            {recommendedHostels.slice(0, 5).map(hostel => (
              <div key={hostel.hostel_id} className="border-b pb-3 last:border-0">
                <Link to={`/hostels/${hostel.hostel_id}`} className="hover:text-blue-600">
                  <p className="font-semibold">{hostel.hostel_name}</p>
                  <p className="text-sm text-gray-600">{hostel.area_name}, {hostel.city_name}</p>
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-sm text-yellow-600">★ {hostel.rating}</span>
                    <span className="text-sm font-semibold text-blue-600">PKR {hostel.min_rent}+</span>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}