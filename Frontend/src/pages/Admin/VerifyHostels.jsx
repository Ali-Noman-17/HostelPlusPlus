import { useEffect, useState } from 'react';
import { getPendingHostels, verifyHostel } from '../../api/admin';

export default function VerifyHostels() {
  const [hostels, setHostels] = useState([]);
  useEffect(() => {
    getPendingHostels().then(res => setHostels(res.data.data));
  }, []);
  const handleVerify = async (id) => {
    await verifyHostel(id);
    getPendingHostels().then(res => setHostels(res.data.data));
  };
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Pending Hostel Verifications</h1>
      <div className="grid gap-4">
        {hostels.map(h => (
          <div key={h.hostel_id} className="bg-white p-4 rounded shadow flex justify-between">
            <div><p className="font-semibold">{h.hostel_name}</p><p className="text-sm">{h.owner_name} – {h.city_name}</p></div>
            <button onClick={() => handleVerify(h.hostel_id)} className="bg-green-600 text-white px-3 py-1 rounded">Verify</button>
          </div>
        ))}
      </div>
    </div>
  );
}