import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getHostelById } from '../../api/hostels';
import { useAuth } from '../../contexts/AuthContext';
import { addToWishlist, removeFromWishlist, getWishlist } from '../../api/wishlist';

export default function HostelDetail() {
    const { id } = useParams();
  const { isAuthenticated } = useAuth();
  const [hostel, setHostel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);

  useEffect(() => {
    const fetchHostel = async () => {
      try {
        const res = await getHostelById(id);
        setHostel(res.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchHostel();
  }, [id]);

  useEffect(() => {
    if (isAuthenticated && hostel) {
      checkWishlistStatus();
    }
  }, [isAuthenticated, hostel]);

  const checkWishlistStatus = async () => {
    try {
      const res = await getWishlist();
      const wishlistIds = res.data.data.map(item => item.hostel_id);
      setIsInWishlist(wishlistIds.includes(hostel.hostel_id));
    } catch (err) {
      console.error(err);
    }
  };

  const handleWishlistToggle = async () => {
    if (!isAuthenticated) {
      alert('Please login to save hostels to wishlist');
      return;
    }

    setWishlistLoading(true);
    try {
      if (isInWishlist) {
        await removeFromWishlist(hostel.hostel_id);
        setIsInWishlist(false);
      } else {
        await addToWishlist(hostel.hostel_id);
        setIsInWishlist(true);
      }
    } catch (err) {
      console.error(err);
      alert('Failed to update wishlist');
    } finally {
      setWishlistLoading(false);
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;
  if (!hostel) return <div className="p-6">Hostel not found</div>;

  return (
    <div className="container mx-auto p-4">
      {/* Header with Wishlist Button */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold mb-2">{hostel.hostel_name}</h1>
            <div className="flex items-center gap-4 mb-4">
              <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-sm">
                ★ {hostel.rating} ({hostel.total_reviews} reviews)
              </span>
              <span className={`px-2 py-1 rounded text-sm ${hostel.is_verified ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                {hostel.is_verified ? 'Verified' : 'Pending Verification'}
              </span>
              <span className="text-gray-600">
                {hostel.gender_preference === 'co-ed' ? 'Co-ed' : hostel.gender_preference === 'male' ? 'Male Only' : 'Female Only'}
              </span>
            </div>
          </div>
          
          {/* Wishlist Button */}
          <button
            onClick={handleWishlistToggle}
            disabled={wishlistLoading}
            className={`p-3 rounded-full shadow-md transition ${
              isInWishlist 
                ? 'bg-red-500 text-white hover:bg-red-600' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill={isInWishlist ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>
        </div>
        <p className="text-gray-700">{hostel.description}</p>
      </div>
        
        <p className="text-gray-600 mb-2">{hostel.address}, {hostel.area_name}, {hostel.city_name}</p>

      {/* Contact Information Only (removed stats) */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
        <div className="space-y-2">
          <p>📞 {hostel.contact_number}</p>
          {hostel.alternate_number && <p>📞 {hostel.alternate_number} (Alternate)</p>}
          {hostel.email && <p>✉️ {hostel.email}</p>}
          <p className="text-sm text-gray-500">Owner: {hostel.owner_name || 'Not specified'}</p>
        </div>
      </div>

      {/* Closest Transport */}
      {hostel.transport && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Nearest Public Transport</h2>
          <div className="flex justify-between items-center">
            <div>
              <p className="font-medium">{hostel.transport.transport_type?.toUpperCase()} - {hostel.transport.route_name}</p>
              <p className="text-gray-600">Stop: {hostel.transport.stop_name}</p>
              <p className="text-gray-600">Distance: {hostel.transport.distance_to_stop_km} km</p>
            </div>
            <div className="text-right">
              {hostel.transport.frequency_minutes && (
                <p className="text-green-600">Every {hostel.transport.frequency_minutes} minutes</p>
              )}
              <p className="text-sm text-gray-500">
                {hostel.transport.first_ride} - {hostel.transport.last_ride}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Rooms Section - with conditional Book Now button */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Available Rooms</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {hostel.rooms?.map(room => (
            <div key={room.hostel_room_id} className="border rounded-lg p-4 hover:shadow-lg transition">
              <h3 className="font-bold text-lg">{room.room_type}</h3>
              {room.room_number && <p className="text-gray-500">Room {room.room_number}</p>}
              <p className="text-2xl font-bold text-blue-600 mt-2">PKR {room.monthly_rent}</p>
              <p className="text-gray-600">Security Deposit: PKR {room.security_deposit || 0}</p>
              <p className="text-sm text-gray-500">Beds: {room.available_beds}/{room.total_beds_in_room} available</p>
              
              {room.available_beds > 0 ? (
                <button 
                  onClick={() => setSelectedRoom(room)}
                  className="mt-3 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full"
                >
                  Book Now
                </button>
              ) : (
                <button 
                  disabled
                  className="mt-3 bg-gray-400 text-white px-4 py-2 rounded w-full cursor-not-allowed"
                >
                  Fully Booked
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Amenities */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Amenities</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {hostel.amenities?.map((amenity, idx) => (
            <div key={idx} className="flex items-center space-x-2">
              <span className={amenity.is_available ? 'text-green-600' : 'text-red-600'}>
                {amenity.is_available ? '✓' : '✗'}
              </span>
              <span>{amenity.amenity_name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Nearby Places */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Nearby Places</h2>
        <div className="grid md:grid-cols-2 gap-3">
          {hostel.nearby_places?.map((place, idx) => (
            <div key={idx} className="flex justify-between items-center border-b py-2">
              <div>
                <p className="font-medium">{place.place_name}</p>
                <p className="text-sm text-gray-500">{place.category_name}</p>
              </div>
              <div className="text-right">
                <p className="text-sm">{place.distance_km} km</p>
                {place.walking_distance && <p className="text-xs text-green-600">Walking distance</p>}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Reviews Section - Top 5 Most Recent */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Recent Reviews ({hostel.reviews?.length || 0})</h2>
        {hostel.reviews && hostel.reviews.length > 0 ? (
          <div className="space-y-4">
            {hostel.reviews.map(review => (
              <div key={review.review_id} className="border-b pb-4 last:border-0">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-semibold">{review.user_name}</p>
                    <div className="flex items-center gap-2">
                      <span className="text-yellow-500">★ {review.rating}</span>
                      <span className="text-xs text-gray-400">{review.review_date}</span>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">
                    {review.helpful_count > 0 && `${review.helpful_count} found helpful`}
                  </div>
                </div>
                <p className="text-gray-700">{review.comment}</p>
                <div className="flex gap-3 mt-2 text-xs text-gray-500">
                  {review.cleanliness_rating && <span>Cleanliness: {review.cleanliness_rating}★</span>}
                  {review.food_rating && <span>Food: {review.food_rating}★</span>}
                  {review.safety_rating && <span>Safety: {review.safety_rating}★</span>}
                  {review.location_rating && <span>Location: {review.location_rating}★</span>}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No reviews yet. Be the first to review!</p>
        )}
      </div>

      {/* Booking Modal */}
      {selectedRoom && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Book {selectedRoom.room_type}</h2>
            <p className="mb-2">Monthly Rent: PKR {selectedRoom.monthly_rent}</p>
            <p className="mb-4">Security Deposit: PKR {selectedRoom.security_deposit || 0}</p>
            <div className="flex gap-2">
              <button className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
                Proceed to Book
              </button>
              <button onClick={() => setSelectedRoom(null)} className="px-4 py-2 border rounded hover:bg-gray-100">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}