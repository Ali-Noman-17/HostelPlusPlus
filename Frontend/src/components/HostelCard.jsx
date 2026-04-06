import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { addToWishlist, removeFromWishlist, getWishlist } from '../api/wishlist';

export default function HostelCard({ hostel }) {
  const { user } = useAuth();
  const isAuthenticated = !!user;
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      checkWishlistStatus();
    }
  }, [isAuthenticated, hostel.hostel_id]);

  const checkWishlistStatus = async () => {
    try {
      const res = await getWishlist();
      const wishlistIds = res.data.data.map(item => item.hostel_id);
      setIsInWishlist(wishlistIds.includes(hostel.hostel_id));
    } catch (err) {
      console.error(err);
    }
  };

  const handleWishlistToggle = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isAuthenticated) {
      alert('Please login to save hostels to wishlist');
      return;
    }

    setLoading(true);
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
      setLoading(false);
    }
  };

  return (
    <Link to={`/hostels/${hostel.hostel_id}`} className="block">
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition relative">
        {/* Wishlist Button */}
        <button
          onClick={handleWishlistToggle}
          disabled={loading}
          className={`absolute top-2 right-2 z-10 p-2 rounded-full bg-white shadow-md hover:shadow-lg transition ${
            isInWishlist ? 'text-red-500' : 'text-gray-400 hover:text-red-500'
          }`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill={isInWishlist ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>

        <div className="p-4">
          <h3 className="text-xl font-semibold mb-2">{hostel.hostel_name}</h3>
          <p className="text-gray-600 text-sm mb-2">{hostel.address}</p>
          <div className="flex justify-between items-center mt-2">
            <div>
              <span className="text-yellow-500">★ {hostel.rating}</span>
              <span className="text-gray-400 text-sm ml-1">({hostel.total_reviews})</span>
            </div>
            <p className="text-lg font-bold text-blue-600">PKR {hostel.min_rent}+</p>
          </div>
          <div className="mt-2 text-sm text-gray-500">
            {hostel.available_rooms > 0 ? (
              <span className="text-green-600">{hostel.available_rooms} rooms available</span>
            ) : (
              <span className="text-red-600">No rooms available</span>
            )}
          </div>
          {hostel.amenities_preview && (
            <div className="mt-2 text-xs text-gray-400">
              {hostel.amenities_preview}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}