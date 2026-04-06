import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { createHostel, updateHostel, getMyHostels } from '../../api/owner';
import { getCities } from '../../api/locations';

export default function HostelForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ hostel_name: '', contact_number: '', address: '', city_id: '', gender_preference: 'co-ed' });
  const [cities, setCities] = useState([]);
  useEffect(() => {
    getCities().then(res => setCities(res.data.data));
    if (id) {
      getMyHostels().then(res => {
        const hostel = res.data.data.find(h => h.hostel_id == id);
        if (hostel) setForm(hostel);
      });
    }
  }, [id]);
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (id) await updateHostel(id, form);
    else await createHostel(form);
    navigate('/owner/hostels');
  };
  return (
    <div className="max-w-lg mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">{id ? 'Edit Hostel' : 'Add Hostel'}</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="text" placeholder="Hostel Name" value={form.hostel_name} onChange={e => setForm({...form, hostel_name: e.target.value})} required className="w-full p-2 border rounded" />
        <input type="text" placeholder="Contact Number" value={form.contact_number} onChange={e => setForm({...form, contact_number: e.target.value})} required className="w-full p-2 border rounded" />
        <textarea placeholder="Address" value={form.address} onChange={e => setForm({...form, address: e.target.value})} required className="w-full p-2 border rounded" />
        <select value={form.city_id} onChange={e => setForm({...form, city_id: e.target.value})} required className="w-full p-2 border rounded">
          <option value="">Select City</option>
          {cities.map(c => <option key={c.city_id} value={c.city_id}>{c.city_name}</option>)}
        </select>
        <select value={form.gender_preference} onChange={e => setForm({...form, gender_preference: e.target.value})} className="w-full p-2 border rounded">
          <option value="male">Male Only</option>
          <option value="female">Female Only</option>
          <option value="co-ed">Co-ed</option>
        </select>
        <button type="submit" className="bg-blue-600 text-white p-2 rounded">Save</button>
      </form>
    </div>
  );
}