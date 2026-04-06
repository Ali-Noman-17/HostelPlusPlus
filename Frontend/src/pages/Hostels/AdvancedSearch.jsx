import { useState, useEffect } from 'react';
import { searchHostels } from '../../api/hostels';
import { getCities, getAreasByCity } from '../../api/locations';
import SearchFilters from '../../components/Common/SearchFilters';
import HostelCard from '../../components/HostelCard';

export default function AdvancedSearch() {
  const [filters, setFilters] = useState({
    city_id: '',
    area_id: '',
    min_price: '',
    max_price: '',
    gender: '',
    nearby_categories: '',
    nearby_max_distance: '',
    transport_type: '',
    transport_max_distance: ''
  });
  const [results, setResults] = useState([]);
  const [cities, setCities] = useState([]);
  const [areas, setAreas] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getCities().then(res => setCities(res.data.data));
  }, []);

  useEffect(() => {
    if (filters.city_id) {
      getAreasByCity(filters.city_id).then(res => setAreas(res.data.data));
    } else {
      setAreas([]);
    }
  }, [filters.city_id]);

  const handleSearch = async () => {
    setLoading(true);
    try {
      // Remove empty filters
      const activeFilters = {};
      Object.keys(filters).forEach(key => {
        if (filters[key] !== '' && filters[key] !== null && filters[key] !== undefined) {
          activeFilters[key] = filters[key];
        }
      });
      const res = await searchHostels(activeFilters);
      setResults(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Advanced Search</h1>
      <SearchFilters 
        filters={filters} 
        setFilters={setFilters} 
        cities={cities} 
        areas={areas} 
        onSearch={handleSearch} 
      />
      {loading && <p>Loading...</p>}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
        {results.map(hostel => <HostelCard key={hostel.hostel_id} hostel={hostel} />)}
      </div>
      {!loading && results.length === 0 && (
        <p className="text-center text-gray-500 mt-8">No hostels found. Try adjusting your filters.</p>
      )}
    </div>
  );
}