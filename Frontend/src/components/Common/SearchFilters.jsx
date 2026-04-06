import { useState, useEffect } from 'react';
import axios from '../../api/axios';

export default function SearchFilters({ filters, setFilters, cities, areas, onSearch }) {
  const [nearbyCategories, setNearbyCategories] = useState([]);
  const [transportTypes, setTransportTypes] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [nearbyMaxDistance, setNearbyMaxDistance] = useState(2);
  const [transportMaxDistance, setTransportMaxDistance] = useState(1);
  const [selectedTransportType, setSelectedTransportType] = useState('');

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get('/search/categories');
        setNearbyCategories(res.data.data);
      } catch (err) {
        console.error(err);
      }
    };
    const fetchTransportTypes = async () => {
      try {
        const res = await axios.get('/search/transport-types');
        setTransportTypes(res.data.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchCategories();
    fetchTransportTypes();
  }, []);

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const toggleCategory = (categoryId) => {
    let newSelected;
    if (selectedCategories.includes(categoryId)) {
      newSelected = selectedCategories.filter(id => id !== categoryId);
    } else {
      newSelected = [...selectedCategories, categoryId];
    }
    setSelectedCategories(newSelected);
    // Update filters with comma-separated category IDs
    setFilters({ ...filters, nearby_categories: newSelected.join(',') });
  };

  const handleNearbyDistanceChange = (e) => {
    const value = e.target.value;
    setNearbyMaxDistance(value);
    setFilters({ ...filters, nearby_max_distance: value });
  };

  const handleTransportDistanceChange = (e) => {
    const value = e.target.value;
    setTransportMaxDistance(value);
    setFilters({ ...filters, transport_max_distance: value });
  };

  const handleTransportTypeChange = (e) => {
    const value = e.target.value;
    setSelectedTransportType(value);
    setFilters({ ...filters, transport_type: value });
  };

  const clearAdvancedFilters = () => {
    setSelectedCategories([]);
    setSelectedTransportType('');
    setNearbyMaxDistance(2);
    setTransportMaxDistance(1);
    setFilters({
      ...filters,
      nearby_categories: '',
      nearby_max_distance: '',
      transport_type: '',
      transport_max_distance: ''
    });
  };

  return (
    <div className="bg-white p-4 rounded shadow mb-6">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <select name="city_id" value={filters.city_id || ''} onChange={handleChange} className="border p-2 rounded">
          <option value="">All Cities</option>
          {cities.map(c => <option key={c.city_id} value={c.city_id}>{c.city_name}</option>)}
        </select>
        
        <select name="area_id" value={filters.area_id || ''} onChange={handleChange} className="border p-2 rounded" disabled={!filters.city_id}>
          <option value="">All Areas</option>
          {areas.map(a => <option key={a.area_id} value={a.area_id}>{a.area_name}</option>)}
        </select>
        
        <input type="number" name="min_price" placeholder="Min Price" value={filters.min_price || ''} onChange={handleChange} className="border p-2 rounded" />
        <input type="number" name="max_price" placeholder="Max Price" value={filters.max_price || ''} onChange={handleChange} className="border p-2 rounded" />
        
        <select name="gender" value={filters.gender || ''} onChange={handleChange} className="border p-2 rounded">
          <option value="">Any Gender</option>
          <option value="male">Male Only</option>
          <option value="female">Female Only</option>
        </select>
        
        <button onClick={onSearch} className="bg-blue-600 text-white p-2 rounded">Search</button>
        <button onClick={() => setShowAdvanced(!showAdvanced)} className="bg-gray-200 text-gray-700 p-2 rounded">
          {showAdvanced ? 'Hide Advanced Filters' : 'Show Advanced Filters'}
        </button>
      </div>

      {/* Advanced Filters */}
      {showAdvanced && (
        <div className="mt-4 pt-4 border-t">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Nearby Categories Checklist */}
            <div>
              <h3 className="font-semibold mb-2">Nearby Places (Select multiple)</h3>
              <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto border rounded p-2">
                {nearbyCategories.map(cat => (
                  <label key={cat.category_id} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(cat.category_id)}
                      onChange={() => toggleCategory(cat.category_id)}
                      className="rounded"
                    />
                    <span className="text-sm">{cat.category_name}</span>
                  </label>
                ))}
              </div>
              <div className="mt-2">
                <label className="text-sm text-gray-600">Max Distance (km):</label>
                <input
                  type="range"
                  min="0.5"
                  max="5"
                  step="0.5"
                  value={nearbyMaxDistance}
                  onChange={handleNearbyDistanceChange}
                  className="w-full"
                />
                <span className="text-sm text-gray-500">{nearbyMaxDistance} km</span>
              </div>
            </div>

            {/* Transport Filter */}
            <div>
              <h3 className="font-semibold mb-2">Public Transport Nearby</h3>
              <select
                value={selectedTransportType}
                onChange={handleTransportTypeChange}
                className="w-full border p-2 rounded mb-2"
              >
                <option value="">Any Transport</option>
                {transportTypes.map(type => (
                  <option key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</option>
                ))}
              </select>
              <div className="mt-2">
                <label className="text-sm text-gray-600">Max Distance to Stop (km):</label>
                <input
                  type="range"
                  min="0.2"
                  max="3"
                  step="0.2"
                  value={transportMaxDistance}
                  onChange={handleTransportDistanceChange}
                  className="w-full"
                />
                <span className="text-sm text-gray-500">{transportMaxDistance} km</span>
              </div>
            </div>
          </div>
          <div className="mt-4">
            <button onClick={clearAdvancedFilters} className="text-sm text-gray-500 hover:text-gray-700">
              Clear Advanced Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
}