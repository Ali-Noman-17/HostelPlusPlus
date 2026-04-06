import { useEffect, useState } from 'react';
import { getHostels } from '../../api/hostels';
import HostelCard from '../../components/HostelCard';

export default function HostelList() {
  const [hostels, setHostels] = useState([]);
  useEffect(() => {
    getHostels().then(res => setHostels(res.data.data));
  }, []);
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">All Hostels</h1>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {hostels.map(h => <HostelCard key={h.hostel_id} hostel={h} />)}
      </div>
    </div>
  );
}