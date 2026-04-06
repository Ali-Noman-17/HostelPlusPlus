import { useEffect, useState } from 'react';
import { getReportSummary, exportBookingsReport, exportRevenueReport } from '../../api/admin';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
} from 'chart.js';
import { Bar, Line, Pie } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
);

export default function ReportsDashboard() {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('month');
  const [exportType, setExportType] = useState('users');
  const [exportFilters, setExportFilters] = useState({ start_date: '', end_date: '', role: '', status: '' });

  useEffect(() => {
    fetchSummary();
  }, [period]);

  const fetchSummary = async () => {
    setLoading(true);
    try {
      const res = await getReportSummary(period);
      setSummary(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    try {
      let response;
      const params = {};
      if (exportFilters.start_date) params.start_date = exportFilters.start_date;
      if (exportFilters.end_date) params.end_date = exportFilters.end_date;
      
      if (exportType === 'users') {
        if (exportFilters.role) params.role = exportFilters.role;
        response = await exportUsersReport(params);
      } else if (exportType === 'bookings') {
        if (exportFilters.status) params.status = exportFilters.status;
        response = await exportBookingsReport(params);
      } else {
        response = await exportRevenueReport(params);
      }
      
      const blob = new Blob([response.data], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${exportType}_report_${Date.now()}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
      
    } catch (err) {
      console.error('Export failed:', err);
      alert('Failed to generate report');
    }
  };

  if (loading) return <div className="p-6">Loading reports...</div>;
  if (!summary) return <div className="p-6">No data available</div>;

  const userChartData = {
    labels: summary.user_trend.map(item => item.date),
    datasets: [{
      label: 'New Users',
      data: summary.user_trend.map(item => item.count),
      backgroundColor: '#3B82F6',
      borderColor: '#2563EB',
      fill: false
    }]
  };

  const bookingChartData = {
    labels: summary.booking_trend.map(item => item.date),
    datasets: [
      {
        label: 'Bookings',
        data: summary.booking_trend.map(item => item.booking_count),
        backgroundColor: '#10B981',
        borderColor: '#059669',
        yAxisID: 'y',
      },
      {
        label: 'Revenue (PKR)',
        data: summary.booking_trend.map(item => item.revenue),
        backgroundColor: '#F59E0B',
        borderColor: '#D97706',
        yAxisID: 'y1',
      }
    ]
  };

  const statusChartData = {
    labels: summary.status_distribution.map(item => item.status),
    datasets: [{
      data: summary.status_distribution.map(item => item.count),
      backgroundColor: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444'],
    }]
  };

  const topHostelsData = {
    labels: summary.top_hostels.map(item => item.hostel_name),
    datasets: [{
      label: 'Total Bookings',
      data: summary.top_hostels.map(item => item.total_bookings),
      backgroundColor: '#8B5CF6',
    }]
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Analytics & Reports</h1>
      
      <div className="mb-6 flex gap-2">
        <button 
          onClick={() => setPeriod('week')}
          className={`px-4 py-2 rounded ${period === 'week' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
        >
          Last 7 Days
        </button>
        <button 
          onClick={() => setPeriod('month')}
          className={`px-4 py-2 rounded ${period === 'month' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
        >
          Last 30 Days
        </button>
        <button 
          onClick={() => setPeriod('year')}
          className={`px-4 py-2 rounded ${period === 'year' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
        >
          Last 12 Months
        </button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-4">User Growth</h2>
          <Line data={userChartData} options={{ responsive: true }} />
        </div>
        
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-4">Bookings & Revenue</h2>
          <Bar 
            data={bookingChartData} 
            options={{
              responsive: true,
              scales: {
                y: { title: { display: true, text: 'Number of Bookings' } },
                y1: { position: 'right', title: { display: true, text: 'Revenue (PKR)' } }
              }
            }} 
          />
        </div>
        
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-4">Booking Status</h2>
          <Pie data={statusChartData} options={{ responsive: true }} />
        </div>
        
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-4">Top Hostels</h2>
          <Bar data={topHostelsData} options={{ responsive: true, indexAxis: 'y' }} />
        </div>
      </div>
      
      <div className="bg-white p-6 rounded shadow">
        <h2 className="text-xl font-semibold mb-4">Export Reports</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-gray-700 mb-2">Report Type</label>
            <select 
              value={exportType}
              onChange={(e) => setExportType(e.target.value)}
              className="w-full border p-2 rounded"
            >
              <option value="bookings">Bookings Report</option>
              <option value="revenue">Revenue Report</option>
            </select>
          </div>
          
          {exportType === 'bookings' && (
            <div>
              <label className="block text-gray-700 mb-2">Filter by Status</label>
              <select 
                value={exportFilters.status}
                onChange={(e) => setExportFilters({...exportFilters, status: e.target.value})}
                className="w-full border p-2 rounded"
              >
                <option value="">All Status</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          )}
          
          <div className="flex gap-2">
            <div className="flex-1">
              <label className="block text-gray-700 mb-2">Start Date</label>
              <input 
                type="date" 
                value={exportFilters.start_date}
                onChange={(e) => setExportFilters({...exportFilters, start_date: e.target.value})}
                className="w-full border p-2 rounded"
              />
            </div>
            <div className="flex-1">
              <label className="block text-gray-700 mb-2">End Date</label>
              <input 
                type="date" 
                value={exportFilters.end_date}
                onChange={(e) => setExportFilters({...exportFilters, end_date: e.target.value})}
                className="w-full border p-2 rounded"
              />
            </div>
          </div>
        </div>
        
        <button 
          onClick={handleExport}
          className="mt-4 bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
        >
          Export to CSV
        </button>
      </div>
    </div>
  );
}