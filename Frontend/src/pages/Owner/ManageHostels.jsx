import { useEffect, useState } from 'react';
import { getMyHostels, deleteHostel } from '../../api/owner';
import { Link } from 'react-router-dom';

export default function ManageHostels() {
  const [hostels, setHostels] = useState([]);
  useEffect(() => { loadHostels(); }, []);
  const loadHostels = async () => {
    const res = await getMyHostels();
    setHostels(res.data.data);
  };
  const handleDelete = async (id) => {
    if (window.confirm('Delete this hostel?')) {
      await deleteHostel(id);
      loadHostels();
    }
  };
  return (
    <div className="p-6">
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-bold">My Hostels</h1>
        <Link to="/owner/hostels/new" className="bg-blue-600 text-white px-4 py-2 rounded">+ Add Hostel</Link>
      </div>
      <div className="grid gap-4">
        {hostels.map(h => (
          <div key={h.hostel_id} className="bg-white p-4 rounded shadow flex justify-between items-center">
            <div>
              <h3 className="font-semibold">{h.hostel_name}</h3>
              <p className="text-sm text-gray-600">{h.city_name}, {h.area_name}</p>
              <span className={`text-xs px-2 py-1 rounded ${h.is_verified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                {h.is_verified ? 'Verified' : 'Pending'}
              </span>
            </div>
            <div className="space-x-2">
              <Link to={`/owner/hostels/${h.hostel_id}/edit`} className="text-blue-600">Edit</Link>
              <Link to={`/owner/hostels/${h.hostel_id}/rooms`} className="text-green-600">Rooms</Link>
              <button onClick={() => handleDelete(h.hostel_id)} className="text-red-600">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}