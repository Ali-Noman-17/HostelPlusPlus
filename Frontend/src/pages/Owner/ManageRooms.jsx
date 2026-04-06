import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getHostelRooms, deleteRoom } from '../../api/owner';

export default function ManageRooms() {
  const { id: hostelId } = useParams();
  const [rooms, setRooms] = useState([]);
  useEffect(() => {
    getHostelRooms(hostelId).then(res => setRooms(res.data.data));
  }, [hostelId]);
  const handleDelete = async (roomId) => {
    if (window.confirm('Delete room?')) {
      await deleteRoom(roomId);
      getHostelRooms(hostelId).then(res => setRooms(res.data.data));
    }
  };
  return (
    <div className="p-6">
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-bold">Manage Rooms</h1>
        <Link to={`/owner/hostels/${hostelId}/rooms/new`} className="bg-blue-600 text-white px-4 py-2 rounded">+ Add Room</Link>
      </div>
      <div className="grid gap-4">
        {rooms.map(r => (
          <div key={r.hostel_room_id} className="bg-white p-4 rounded shadow flex justify-between">
            <div>
              <p><strong>{r.room_type}</strong> {r.room_number && `- ${r.room_number}`}</p>
              <p>Rent: PKR {r.monthly_rent} | Beds: {r.available_beds}/{r.total_beds_in_room}</p>
            </div>
            <div>
              <Link to={`/owner/rooms/${r.hostel_room_id}/edit`} className="text-blue-600 mr-2">Edit</Link>
              <button onClick={() => handleDelete(r.hostel_room_id)} className="text-red-600">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}