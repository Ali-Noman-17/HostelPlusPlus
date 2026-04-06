import { useEffect, useState } from 'react';
import axios from '../../api/axios';
import { adminCreateHostel, adminUpdateHostel, adminDeleteHostel } from '../../api/admin';

export default function AdminHostels() {
  const [hostels, setHostels] = useState([]);
  const [cities, setCities] = useState([]);
  const [areas, setAreas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingHostel, setEditingHostel] = useState(null);
  const [sortBy, setSortBy] = useState('hostel_name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [search, setSearch] = useState('');
  const [formData, setFormData] = useState({
    hostel_name: '',
    owner_name: '',
    contact_number: '',
    alternate_number: '',
    email: '',
    address: '',
    city_id: '',
    area_id: '',
    pincode: '',
    gender_preference: 'co-ed',
    description: ''
  });

  const fetchHostels = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/admin/hostels');
      setHostels(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCities = async () => {
    try {
      const res = await axios.get('/cities');
      setCities(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchAreas = async (cityId) => {
    if (!cityId) {
      setAreas([]);
      return;
    }
    try {
      const res = await axios.get(`/cities/${cityId}/areas`);
      setAreas(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchHostels();
    fetchCities();
  }, []);

  useEffect(() => {
    if (formData.city_id) {
      fetchAreas(formData.city_id);
    } else {
      setAreas([]);
    }
  }, [formData.city_id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingHostel) {
        await adminUpdateHostel(editingHostel.hostel_id, formData);
      } else {
        await adminCreateHostel(formData);
      }
      setShowModal(false);
      resetForm();
      fetchHostels();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || 'Failed to save hostel');
    }
  };

  const handleDelete = async (hostel) => {
    if (window.confirm(`Delete "${hostel.hostel_name}"? This will delete all rooms and bookings.`)) {
      await adminDeleteHostel(hostel.hostel_id);
      fetchHostels();
    }
  };

  const handleEdit = (hostel) => {
    setEditingHostel(hostel);
    setFormData({
      hostel_name: hostel.hostel_name,
      owner_name: hostel.owner_name || '',
      contact_number: hostel.contact_number,
      alternate_number: hostel.alternate_number || '',
      email: hostel.email || '',
      address: hostel.address,
      city_id: hostel.city_id,
      area_id: hostel.area_id || '',
      pincode: hostel.pincode || '',
      gender_preference: hostel.gender_preference,
      description: hostel.description || ''
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setEditingHostel(null);
    setFormData({
      hostel_name: '',
      owner_name: '',
      contact_number: '',
      alternate_number: '',
      email: '',
      address: '',
      city_id: '',
      area_id: '',
      pincode: '',
      gender_preference: 'co-ed',
      description: ''
    });
  };

  const sortedHostels = [...hostels]
    .filter(h => h.hostel_name.toLowerCase().includes(search.toLowerCase()) ||
               h.city_name?.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      let aVal = a[sortBy];
      let bVal = b[sortBy];
      if (sortBy === 'city_name') {
        aVal = a.city_name || '';
        bVal = b.city_name || '';
      }
      if (typeof aVal === 'string') aVal = aVal.toLowerCase();
      if (typeof bVal === 'string') bVal = bVal.toLowerCase();
      if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

  if (loading) return <div className="p-6">Loading hostels...</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Manage Hostels</h1>
        <button
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          + Create New Hostel
        </button>
      </div>

      {/* Search and Sort */}
      <div className="bg-white p-4 rounded shadow mb-4 flex gap-4">
        <input
          type="text"
          placeholder="Search by name or city..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 border p-2 rounded"
        />
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="border p-2 rounded">
          <option value="hostel_name">Sort by Name</option>
          <option value="city_name">Sort by City</option>
          <option value="is_verified">Sort by Verification</option>
        </select>
        <button onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')} className="border p-2 rounded">
          {sortOrder === 'asc' ? '↑ Asc' : '↓ Desc'}
        </button>
      </div>

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl my-8">
            <h2 className="text-xl font-bold mb-4">{editingHostel ? 'Edit Hostel' : 'Create New Hostel'}</h2>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <input type="text" placeholder="Hostel Name *" value={formData.hostel_name} onChange={(e) => setFormData({...formData, hostel_name: e.target.value})} className="border p-2 rounded" required />
                <input type="text" placeholder="Owner Name" value={formData.owner_name} onChange={(e) => setFormData({...formData, owner_name: e.target.value})} className="border p-2 rounded" />
                <input type="text" placeholder="Contact Number *" value={formData.contact_number} onChange={(e) => setFormData({...formData, contact_number: e.target.value})} className="border p-2 rounded" required />
                <input type="text" placeholder="Alternate Number" value={formData.alternate_number} onChange={(e) => setFormData({...formData, alternate_number: e.target.value})} className="border p-2 rounded" />
                <input type="email" placeholder="Email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="border p-2 rounded" />
                <select value={formData.gender_preference} onChange={(e) => setFormData({...formData, gender_preference: e.target.value})} className="border p-2 rounded">
                  <option value="co-ed">Co-ed</option>
                  <option value="male">Male Only</option>
                  <option value="female">Female Only</option>
                </select>
              </div>
              <input type="text" placeholder="Address *" value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} className="w-full border p-2 rounded" required />
              <div className="grid grid-cols-2 gap-3">
                <select value={formData.city_id} onChange={(e) => setFormData({...formData, city_id: e.target.value, area_id: ''})} className="border p-2 rounded" required>
                  <option value="">Select City</option>
                  {cities.map(c => <option key={c.city_id} value={c.city_id}>{c.city_name}</option>)}
                </select>
                <select value={formData.area_id} onChange={(e) => setFormData({...formData, area_id: e.target.value})} className="border p-2 rounded" disabled={!formData.city_id}>
                  <option value="">Select Area</option>
                  {areas.map(a => <option key={a.area_id} value={a.area_id}>{a.area_name}</option>)}
                </select>
                <input type="text" placeholder="Pincode" value={formData.pincode} onChange={(e) => setFormData({...formData, pincode: e.target.value})} className="border p-2 rounded" />
              </div>
              <textarea placeholder="Description" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} rows="3" className="w-full border p-2 rounded" />
              <div className="flex justify-end gap-2">
                <button type="button" onClick={() => { setShowModal(false); resetForm(); }} className="px-4 py-2 border rounded">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">{editingHostel ? 'Update' : 'Create'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Hostels Table */}
      <div className="overflow-x-auto max-h-[600px] overflow-y-auto border rounded">
        <table className="min-w-full bg-white">
          <thead className="sticky top-0 bg-gray-100">
            <tr>
              <th className="p-3 text-left">ID</th>
              <th className="p-3 text-left">Hostel Name</th>
              <th className="p-3 text-left">City</th>
              <th className="p-3 text-left">Contact</th>
              <th className="p-3 text-left">Verified</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedHostels.map(h => (
              <tr key={h.hostel_id} className="border-b hover:bg-gray-50">
                <td className="p-3">{h.hostel_id}</td>
                <td className="p-3 font-medium">{h.hostel_name}</td>
                <td className="p-3">{h.city_name}</td>
                <td className="p-3">{h.contact_number}</td>
                <td className="p-3">
                  <span className={`px-2 py-1 rounded text-xs ${h.is_verified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                    {h.is_verified ? 'Verified' : 'Pending'}
                  </span>
                </td>
                <td className="p-3">
                  <button onClick={() => handleEdit(h)} className="text-blue-600 mr-2">Edit</button>
                  <button onClick={() => handleDelete(h)} className="text-red-600">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}