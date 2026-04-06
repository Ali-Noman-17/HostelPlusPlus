import { useEffect, useState } from 'react';
import axios from '../../api/axios';
import { 
  createCity, updateCity, deleteCity,
  createArea, updateArea, deleteArea,
  createAmenity, updateAmenity, deleteAmenity,
  createInstitution, updateInstitution, deleteInstitution, getInstitutions
} from '../../api/admin';

export default function PlatformManagement() {
  const [activeTab, setActiveTab] = useState('cities');
  const [cities, setCities] = useState([]);
  const [areas, setAreas] = useState([]);
  const [amenities, setAmenities] = useState([]);
  const [institutions, setInstitutions] = useState([]);
  const [selectedCityId, setSelectedCityId] = useState('');
  const [loading, setLoading] = useState(false);
  
  const [cityForm, setCityForm] = useState({ city_name: '', state: '', country: 'Pakistan' });
  const [areaForm, setAreaForm] = useState({ area_name: '', city_id: '', pincode: '' });
  const [amenityForm, setAmenityForm] = useState({ amenity_name: '', category: 'basic', icon_name: '' });
  const [institutionForm, setInstitutionForm] = useState({
    institution_name: '',
    institution_type: 'other',
    address: '',
    city_id: '',
    area_id: '',
    latitude: '',
    longitude: ''
  });
  const [editingId, setEditingId] = useState(null);
  const [editingType, setEditingType] = useState(null);

  const fetchCities = async () => {
    try {
      const res = await axios.get('/cities');
      setCities(res.data.data);
    } catch (err) { console.error(err); }
  };

  const fetchAreas = async () => {
    try {
      const res = await axios.get('/areas');
      setAreas(res.data.data);
    } catch (err) { console.error(err); }
  };

  const fetchAmenities = async () => {
    try {
      const res = await axios.get('/amenities');
      const amenitiesList = [];
      Object.keys(res.data.data).forEach(category => {
        res.data.data[category].forEach(item => {
          amenitiesList.push({ ...item, category });
        });
      });
      setAmenities(amenitiesList);
    } catch (err) { console.error(err); }
  };

  const fetchInstitutions = async () => {
    try {
      const res = await getInstitutions();
      setInstitutions(res.data.data);
    } catch (err) { console.error(err); }
  };

  useEffect(() => {
    fetchCities();
    fetchAreas();
    fetchAmenities();
    fetchInstitutions();
  }, []);

  const createCityHandler = async () => {
    if (!cityForm.city_name) return;
    setLoading(true);
    try {
      await createCity(cityForm);
      setCityForm({ city_name: '', state: '', country: 'Pakistan' });
      fetchCities();
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const updateCityHandler = async () => {
    if (!editingId) return;
    setLoading(true);
    try {
      await updateCity(editingId, cityForm);
      setEditingId(null);
      setEditingType(null);
      setCityForm({ city_name: '', state: '', country: 'Pakistan' });
      fetchCities();
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const deleteCityHandler = async (id) => {
    if (!window.confirm('Delete this city? Areas in this city will also be deleted.')) return;
    try {
      await deleteCity(id);
      fetchCities();
      fetchAreas();
    } catch (err) { console.error(err); }
  };

  const createAreaHandler = async () => {
    if (!areaForm.area_name || !areaForm.city_id) return;
    setLoading(true);
    try {
      await createArea(areaForm);
      setAreaForm({ area_name: '', city_id: '', pincode: '' });
      setSelectedCityId('');
      fetchAreas();
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const updateAreaHandler = async () => {
    if (!editingId) return;
    setLoading(true);
    try {
      await updateArea(editingId, areaForm);
      setEditingId(null);
      setEditingType(null);
      setAreaForm({ area_name: '', city_id: '', pincode: '' });
      setSelectedCityId('');
      fetchAreas();
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const deleteAreaHandler = async (id) => {
    if (!window.confirm('Delete this area?')) return;
    try {
      await deleteArea(id);
      fetchAreas();
    } catch (err) { console.error(err); }
  };

  const createAmenityHandler = async () => {
    if (!amenityForm.amenity_name) return;
    setLoading(true);
    try {
      await createAmenity(amenityForm);
      setAmenityForm({ amenity_name: '', category: 'basic', icon_name: '' });
      fetchAmenities();
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const updateAmenityHandler = async () => {
    if (!editingId) return;
    setLoading(true);
    try {
      await updateAmenity(editingId, amenityForm);
      setEditingId(null);
      setEditingType(null);
      setAmenityForm({ amenity_name: '', category: 'basic', icon_name: '' });
      fetchAmenities();
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const deleteAmenityHandler = async (id) => {
    if (!window.confirm('Delete this amenity? It will be removed from all hostels.')) return;
    try {
      await deleteAmenity(id);
      fetchAmenities();
    } catch (err) { console.error(err); }
  };

  const createInstitutionHandler = async () => {
    if (!institutionForm.institution_name || !institutionForm.city_id) return;
    setLoading(true);
    try {
      await createInstitution(institutionForm);
      setInstitutionForm({
        institution_name: '',
        institution_type: 'other',
        address: '',
        city_id: '',
        area_id: '',
        latitude: '',
        longitude: ''
      });
      fetchInstitutions();
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const updateInstitutionHandler = async () => {
    if (!editingId) return;
    setLoading(true);
    try {
      await updateInstitution(editingId, institutionForm);
      setEditingId(null);
      setEditingType(null);
      setInstitutionForm({
        institution_name: '',
        institution_type: 'other',
        address: '',
        city_id: '',
        area_id: '',
        latitude: '',
        longitude: ''
      });
      fetchInstitutions();
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const deleteInstitutionHandler = async (id) => {
    if (!window.confirm('Delete this institution?')) return;
    try {
      await deleteInstitution(id);
      fetchInstitutions();
    } catch (err) { console.error(err); }
  };

  const startEdit = (item, type) => {
    setEditingId(item.id || item.city_id || item.area_id || item.amenity_id || item.institution_id);
    setEditingType(type);
    if (type === 'city') {
      setCityForm({ city_name: item.city_name, state: item.state || '', country: item.country });
    } else if (type === 'area') {
      setAreaForm({ area_name: item.area_name, city_id: item.city_id, pincode: item.pincode || '' });
      setSelectedCityId(item.city_id);
    } else if (type === 'amenity') {
      setAmenityForm({ amenity_name: item.name, category: item.category, icon_name: item.icon || '' });
    } else if (type === 'institution') {
      setInstitutionForm({
        institution_name: item.institution_name,
        institution_type: item.institution_type,
        address: item.address || '',
        city_id: item.city_id,
        area_id: item.area_id || '',
        latitude: item.latitude || '',
        longitude: item.longitude || ''
      });
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingType(null);
    setCityForm({ city_name: '', state: '', country: 'Pakistan' });
    setAreaForm({ area_name: '', city_id: '', pincode: '' });
    setAmenityForm({ amenity_name: '', category: 'basic', icon_name: '' });
    setInstitutionForm({
      institution_name: '',
      institution_type: 'other',
      address: '',
      city_id: '',
      area_id: '',
      latitude: '',
      longitude: ''
    });
    setSelectedCityId('');
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Platform Management</h1>
      
      <div className="flex border-b mb-6 overflow-x-auto">
        <button onClick={() => setActiveTab('cities')} className={`px-4 py-2 ${activeTab === 'cities' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600'}`}>Cities</button>
        <button onClick={() => setActiveTab('areas')} className={`px-4 py-2 ${activeTab === 'areas' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600'}`}>Areas</button>
        <button onClick={() => setActiveTab('amenities')} className={`px-4 py-2 ${activeTab === 'amenities' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600'}`}>Amenities</button>
        <button onClick={() => setActiveTab('institutions')} className={`px-4 py-2 ${activeTab === 'institutions' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600'}`}>Institutions</button>
      </div>

      {activeTab === 'cities' && (
        <div>
          <div className="bg-white p-4 rounded shadow mb-6">
            <h2 className="text-lg font-semibold mb-4">{editingId && editingType === 'city' ? 'Edit City' : 'Add New City'}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input type="text" placeholder="City Name" value={cityForm.city_name} onChange={(e) => setCityForm({...cityForm, city_name: e.target.value})} className="border p-2 rounded" />
              <input type="text" placeholder="State/Province" value={cityForm.state} onChange={(e) => setCityForm({...cityForm, state: e.target.value})} className="border p-2 rounded" />
              <input type="text" placeholder="Country" value={cityForm.country} onChange={(e) => setCityForm({...cityForm, country: e.target.value})} className="border p-2 rounded" />
            </div>
            <div className="mt-4 flex gap-2">
              {editingId && editingType === 'city' ? (
                <>
                  <button onClick={updateCityHandler} disabled={loading} className="bg-green-600 text-white px-4 py-2 rounded">Update</button>
                  <button onClick={cancelEdit} className="bg-gray-400 text-white px-4 py-2 rounded">Cancel</button>
                </>
              ) : (
                <button onClick={createCityHandler} disabled={loading} className="bg-blue-600 text-white px-4 py-2 rounded">Add City</button>
              )}
            </div>
          </div>
          <div className="bg-white rounded shadow overflow-hidden">
            <table className="min-w-full">
              <thead className="bg-gray-100">
                <tr><th className="p-3 text-left">ID</th><th className="p-3 text-left">City Name</th><th className="p-3 text-left">State</th><th className="p-3 text-left">Country</th><th className="p-3 text-left">Actions</th></tr>
              </thead>
              <tbody>
                {cities.map(city => (
                  <tr key={city.city_id} className="border-b">
                    <td className="p-3">{city.city_id}</td>
                    <td className="p-3">{city.city_name}</td>
                    <td className="p-3">{city.state || '-'}</td>
                    <td className="p-3">{city.country}</td>
                    <td className="p-3">
                      <button onClick={() => startEdit(city, 'city')} className="text-blue-600 mr-2">Edit</button>
                      <button onClick={() => deleteCityHandler(city.city_id)} className="text-red-600">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'areas' && (
        <div>
          <div className="bg-white p-4 rounded shadow mb-6">
            <h2 className="text-lg font-semibold mb-4">{editingId && editingType === 'area' ? 'Edit Area' : 'Add New Area'}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <select value={areaForm.city_id} onChange={(e) => setAreaForm({...areaForm, city_id: e.target.value})} className="border p-2 rounded">
                <option value="">Select City</option>
                {cities.map(city => <option key={city.city_id} value={city.city_id}>{city.city_name}</option>)}
              </select>
              <input type="text" placeholder="Area Name" value={areaForm.area_name} onChange={(e) => setAreaForm({...areaForm, area_name: e.target.value})} className="border p-2 rounded" />
              <input type="text" placeholder="Pincode" value={areaForm.pincode} onChange={(e) => setAreaForm({...areaForm, pincode: e.target.value})} className="border p-2 rounded" />
            </div>
            <div className="mt-4 flex gap-2">
              {editingId && editingType === 'area' ? (
                <>
                  <button onClick={updateAreaHandler} disabled={loading} className="bg-green-600 text-white px-4 py-2 rounded">Update</button>
                  <button onClick={cancelEdit} className="bg-gray-400 text-white px-4 py-2 rounded">Cancel</button>
                </>
              ) : (
                <button onClick={createAreaHandler} disabled={loading} className="bg-blue-600 text-white px-4 py-2 rounded">Add Area</button>
              )}
            </div>
          </div>
          <div className="bg-white rounded shadow overflow-hidden">
            <table className="min-w-full">
              <thead className="bg-gray-100">
                <tr><th className="p-3 text-left">ID</th><th className="p-3 text-left">Area Name</th><th className="p-3 text-left">City</th><th className="p-3 text-left">Pincode</th><th className="p-3 text-left">Actions</th></tr>
              </thead>
              <tbody>
                {areas.map(area => {
                  const city = cities.find(c => c.city_id === area.city_id);
                  return (
                    <tr key={area.area_id} className="border-b">
                      <td className="p-3">{area.area_id}</td>
                      <td className="p-3">{area.area_name}</td>
                      <td className="p-3">{city?.city_name || '-'}</td>
                      <td className="p-3">{area.pincode || '-'}</td>
                      <td className="p-3">
                        <button onClick={() => startEdit(area, 'area')} className="text-blue-600 mr-2">Edit</button>
                        <button onClick={() => deleteAreaHandler(area.area_id)} className="text-red-600">Delete</button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'amenities' && (
        <div>
          <div className="bg-white p-4 rounded shadow mb-6">
            <h2 className="text-lg font-semibold mb-4">{editingId && editingType === 'amenity' ? 'Edit Amenity' : 'Add New Amenity'}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input type="text" placeholder="Amenity Name" value={amenityForm.amenity_name} onChange={(e) => setAmenityForm({...amenityForm, amenity_name: e.target.value})} className="border p-2 rounded" />
              <select value={amenityForm.category} onChange={(e) => setAmenityForm({...amenityForm, category: e.target.value})} className="border p-2 rounded">
                <option value="basic">Basic</option><option value="food">Food</option><option value="furniture">Furniture</option>
                <option value="electronics">Electronics</option><option value="safety">Safety</option><option value="other">Other</option>
              </select>
              <input type="text" placeholder="Icon Name" value={amenityForm.icon_name} onChange={(e) => setAmenityForm({...amenityForm, icon_name: e.target.value})} className="border p-2 rounded" />
            </div>
            <div className="mt-4 flex gap-2">
              {editingId && editingType === 'amenity' ? (
                <>
                  <button onClick={updateAmenityHandler} disabled={loading} className="bg-green-600 text-white px-4 py-2 rounded">Update</button>
                  <button onClick={cancelEdit} className="bg-gray-400 text-white px-4 py-2 rounded">Cancel</button>
                </>
              ) : (
                <button onClick={createAmenityHandler} disabled={loading} className="bg-blue-600 text-white px-4 py-2 rounded">Add Amenity</button>
              )}
            </div>
          </div>
          <div className="bg-white rounded shadow overflow-hidden">
            <table className="min-w-full">
              <thead className="bg-gray-100">
                <tr><th className="p-3 text-left">ID</th><th className="p-3 text-left">Amenity Name</th><th className="p-3 text-left">Category</th><th className="p-3 text-left">Icon</th><th className="p-3 text-left">Actions</th></tr>
              </thead>
              <tbody>
                {amenities.map(amenity => (
                  <tr key={amenity.id} className="border-b">
                    <td className="p-3">{amenity.id}</td>
                    <td className="p-3">{amenity.name}</td>
                    <td className="p-3">{amenity.category}</td>
                    <td className="p-3">{amenity.icon || '-'}</td>
                    <td className="p-3">
                      <button onClick={() => startEdit(amenity, 'amenity')} className="text-blue-600 mr-2">Edit</button>
                      <button onClick={() => deleteAmenityHandler(amenity.id)} className="text-red-600">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'institutions' && (
        <div>
          <div className="bg-white p-4 rounded shadow mb-6">
            <h2 className="text-lg font-semibold mb-4">{editingId && editingType === 'institution' ? 'Edit Institution' : 'Add New Institution'}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input type="text" placeholder="Institution Name *" value={institutionForm.institution_name} onChange={(e) => setInstitutionForm({...institutionForm, institution_name: e.target.value})} className="border p-2 rounded" />
              <select value={institutionForm.institution_type} onChange={(e) => setInstitutionForm({...institutionForm, institution_type: e.target.value})} className="border p-2 rounded">
                <option value="university">University</option>
                <option value="college">College</option>
                <option value="workplace">Workplace</option>
                <option value="other">Other</option>
              </select>
              <input type="text" placeholder="Address" value={institutionForm.address} onChange={(e) => setInstitutionForm({...institutionForm, address: e.target.value})} className="border p-2 rounded" />
              <select value={institutionForm.city_id} onChange={(e) => setInstitutionForm({...institutionForm, city_id: e.target.value, area_id: ''})} className="border p-2 rounded">
                <option value="">Select City *</option>
                {cities.map(city => <option key={city.city_id} value={city.city_id}>{city.city_name}</option>)}
              </select>
              <select value={institutionForm.area_id} onChange={(e) => setInstitutionForm({...institutionForm, area_id: e.target.value})} className="border p-2 rounded" disabled={!institutionForm.city_id}>
                <option value="">Select Area (Optional)</option>
                {areas.filter(a => a.city_id == institutionForm.city_id).map(area => <option key={area.area_id} value={area.area_id}>{area.area_name}</option>)}
              </select>
              <input type="text" placeholder="Latitude (Optional)" value={institutionForm.latitude} onChange={(e) => setInstitutionForm({...institutionForm, latitude: e.target.value})} className="border p-2 rounded" />
              <input type="text" placeholder="Longitude (Optional)" value={institutionForm.longitude} onChange={(e) => setInstitutionForm({...institutionForm, longitude: e.target.value})} className="border p-2 rounded" />
            </div>
            <div className="mt-4 flex gap-2">
              {editingId && editingType === 'institution' ? (
                <>
                  <button onClick={updateInstitutionHandler} disabled={loading} className="bg-green-600 text-white px-4 py-2 rounded">Update</button>
                  <button onClick={cancelEdit} className="bg-gray-400 text-white px-4 py-2 rounded">Cancel</button>
                </>
              ) : (
                <button onClick={createInstitutionHandler} disabled={loading} className="bg-blue-600 text-white px-4 py-2 rounded">Add Institution</button>
              )}
            </div>
          </div>

          <div className="bg-white rounded shadow overflow-hidden">
            <table className="min-w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-3 text-left">ID</th>
                  <th className="p-3 text-left">Name</th>
                  <th className="p-3 text-left">Type</th>
                  <th className="p-3 text-left">City</th>
                  <th className="p-3 text-left">Area</th>
                  <th className="p-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {institutions.map(inst => {
                  const city = cities.find(c => c.city_id === inst.city_id);
                  const area = areas.find(a => a.area_id === inst.area_id);
                  return (
                    <tr key={inst.institution_id} className="border-b">
                      <td className="p-3">{inst.institution_id}</td>
                      <td className="p-3">{inst.institution_name}</td>
                      <td className="p-3">{inst.institution_type}</td>
                      <td className="p-3">{city?.city_name || '-'}</td>
                      <td className="p-3">{area?.area_name || '-'}</td>
                      <td className="p-3">
                        <button onClick={() => startEdit(inst, 'institution')} className="text-blue-600 mr-2">Edit</button>
                        <button onClick={() => deleteInstitutionHandler(inst.institution_id)} className="text-red-600">Delete</button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}