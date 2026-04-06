import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { createBooking } from '../../api/bookings';

export default function BookingForm() {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ check_in_date: '', check_out_date: '', special_requests: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await createBooking({ hostel_room_id: roomId, ...form });
      alert(`Booking confirmed! Reference: ${res.data.data.booking_reference}`);
      navigate('/my-bookings');
    } catch (err) {
      setError(err.response?.data?.error || 'Booking failed (possible date conflict)');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Confirm Booking</h1>
      {error && <div className="bg-red-100 text-red-700 p-2 rounded mb-4">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="date" required value={form.check_in_date} onChange={e => setForm({...form, check_in_date: e.target.value})} className="w-full p-2 border rounded" />
        <input type="date" required value={form.check_out_date} onChange={e => setForm({...form, check_out_date: e.target.value})} className="w-full p-2 border rounded" />
        <textarea placeholder="Special requests" value={form.special_requests} onChange={e => setForm({...form, special_requests: e.target.value})} className="w-full p-2 border rounded" />
        <button type="submit" disabled={loading} className="w-full bg-green-600 text-white p-2 rounded">{loading ? 'Processing...' : 'Confirm & Pay Advance'}</button>
      </form>
      <p className="text-sm text-gray-500 mt-4">Note: 20% advance payment required. The booking is atomic – if room becomes unavailable you will see an error.</p>
    </div>
  );
}