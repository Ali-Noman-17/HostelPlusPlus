import { useEffect, useState } from 'react';
import { getWishlist, removeFromWishlist } from '../../api/wishlist';
import { Link } from 'react-router-dom';

export default function Wishlist() {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    try {
      const res = await getWishlist();
      setWishlist(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (hostelId) => {
    try {
      await removeFromWishlist(hostelId);
      fetchWishlist();
    } catch (err) {
      console.error(err);
      alert('Failed to remove from wishlist');
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">My Wishlist</h1>
      
      {wishlist.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">Your wishlist is empty</p>
          <Link to="/search" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
            Browse Hostels
          </Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {wishlist.map(item => (
            <div key={item.wishlist_id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <Link to={`/hostels/${item.hostel_id}`}>
                <div className="p-4">
                  <h3 className="text-xl font-semibold mb-2">{item.hostel_name}</h3>
                  <p className="text-gray-600 text-sm">{item.address}</p>
                  <p className="text-gray-500 text-sm">{item.area_name}, {item.city_name}</p>
                  <div className="flex justify-between items-center mt-3">
                    <span className="text-yellow-500">★ {item.rating}</span>
                    <p className="font-bold text-blue-600">PKR {item.min_rent}+</p>
                  </div>
                  <p className="text-sm text-gray-500 mt-2">Added: {new Date(item.added_date).toLocaleDateString()}</p>
                </div>
              </Link>
              <div className="border-t p-3">
                <button
                  onClick={() => handleRemove(item.hostel_id)}
                  className="text-red-600 hover:text-red-800 text-sm"
                >
                  Remove from Wishlist
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}