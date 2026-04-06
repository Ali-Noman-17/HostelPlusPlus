import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { getUserBookings } from '../../api/bookings';
import { getMyHostels, getHostelBookings } from '../../api/owner';

export default function MyBookings() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      if (user?.user_type === 'owner') {
        // For owners: get all bookings from their hostels
        const hostelsRes = await getMyHostels();
        const hostels = hostelsRes.data.data || [];
        
        let allBookings = [];
        for (const hostel of hostels) {
          try {
            const bookingsRes = await getHostelBookings(hostel.hostel_id);
            const hostelBookings = bookingsRes.data.data || [];
            // Add hostel name to each booking if not already present
            const bookingsWithHostel = hostelBookings.map(booking => ({
              ...booking,
              hostel_name: hostel.hostel_name
            }));
            allBookings.push(...bookingsWithHostel);
          } catch (err) {
            console.error(`Error fetching bookings for hostel ${hostel.hostel_id}:`, err);
          }
        }
        setBookings(allBookings);
      } else {
        // For regular users: get their own bookings
        const res = await getUserBookings();
        setBookings(res.data.data || []);
      }
    } catch (err) {
      console.error('Error fetching bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => new Date(date).toLocaleDateString();

  if (loading) return <div className="p-6 text-center">Loading bookings...</div>;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">
        {user?.user_type === 'owner' ? 'Hostel Bookings' : 'My Bookings'}
      </h1>
      
      {bookings.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No bookings found.</p>
          {user?.user_type !== 'owner' && (
            <Link to="/search" className="mt-4 inline-block bg-blue-600 text-white px-6 py-2 rounded">
              Browse Hostels
            </Link>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map(booking => (
            <div key={booking.booking_id} className="bg-white rounded-lg shadow-md p-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-semibold text-lg">{booking.hostel_name}</p>
                  <p className="text-gray-600">{booking.room_type} - Room {booking.room_number}</p>
                  <p className="text-sm text-gray-500">
                    {formatDate(booking.check_in_date)} to {formatDate(booking.check_out_date)}
                  </p>
                  {user?.user_type === 'owner' && booking.guest_name && (
                    <p className="text-sm text-gray-500 mt-1">Guest: {booking.guest_name}</p>
                  )}
                </div>
                <div className="text-right">
                  <p className="font-bold text-blue-600">PKR {booking.total_amount}</p>
                  <span className={`px-2 py-1 rounded text-xs ${
                    booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                    booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    booking.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {booking.status}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}