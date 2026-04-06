import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { addRoom, updateRoom, getHostelRooms } from '../../api/owner';

export default function RoomForm() {
  const { hostelId, id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ room_type_id: 2, total_beds_in_room: 2, monthly_rent: 8000, security_deposit: 4000, room_number: '', floor_number: 1 });
  useEffect(() => {
    if (id) {
      getHostelRooms(hostelId).then(res => {
        const room = res.data.data.find(r => r.hostel_room_id == id);
        if (room) setForm(room);
      });
    }
  }, [id, hostelId]);
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (id) await updateRoom(id, form);
    else await addRoom(hostelId, form);
    navigate(`/owner/hostels/${hostelId}/rooms`);
  };
  return (
    <div className="max-w-lg mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">{id ? 'Edit Room' : 'Add Room'}</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <select value={form.room_type_id} onChange={e => setForm({...form, room_type_id: e.target.value})} className="w-full p-2 border rounded">
          <option value="1">Single</option><option value="2">Double</option><option value="3">Triple</option><option value="4">Dormitory</option>
        </select>
        <input type="number" placeholder="Total beds" value={form.total_beds_in_room} onChange={e => setForm({...form, total_beds_in_room: parseInt(e.target.value)})} required className="w-full p-2 border rounded" />
        <input type="number" placeholder="Monthly rent" value={form.monthly_rent} onChange={e => setForm({...form, monthly_rent: parseFloat(e.target.value)})} required className="w-full p-2 border rounded" />
        <input type="number" placeholder="Security deposit" value={form.security_deposit} onChange={e => setForm({...form, security_deposit: parseFloat(e.target.value)})} className="w-full p-2 border rounded" />
        <input type="text" placeholder="Room number (optional)" value={form.room_number} onChange={e => setForm({...form, room_number: e.target.value})} className="w-full p-2 border rounded" />
        <input type="number" placeholder="Floor" value={form.floor_number} onChange={e => setForm({...form, floor_number: parseInt(e.target.value)})} className="w-full p-2 border rounded" />
        <button type="submit" className="bg-blue-600 text-white p-2 rounded">Save</button>
      </form>
    </div>
  );
}