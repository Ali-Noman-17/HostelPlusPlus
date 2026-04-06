import React, { useEffect, useState } from 'react';
import { getAuditLogs } from '../../api/admin';

export default function AuditLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({
    table_name: '',
    action: '',
    user_id: '',
    start_date: '',
    end_date: ''
  });
  const [expandedRow, setExpandedRow] = useState(null);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const params = { page, limit: 50 };
      if (filters.table_name) params.table_name = filters.table_name;
      if (filters.action) params.action = filters.action;
      if (filters.user_id) params.user_id = filters.user_id;
      if (filters.start_date) params.start_date = filters.start_date;
      if (filters.end_date) params.end_date = filters.end_date;
      
      const res = await getAuditLogs(params);
      setLogs(res.data.data);
      setTotalPages(res.data.pagination?.pages || 1);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [page, filters]);

  const handleFilterChange = (key, value) => {
    setFilters({ ...filters, [key]: value });
    setPage(1);
  };

  const clearFilters = () => {
    setFilters({
      table_name: '',
      action: '',
      user_id: '',
      start_date: '',
      end_date: ''
    });
    setPage(1);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleString();
  };

  const getActionBadge = (action) => {
    const colors = {
      INSERT: 'bg-green-100 text-green-800',
      UPDATE: 'bg-blue-100 text-blue-800',
      DELETE: 'bg-red-100 text-red-800',
      ERROR: 'bg-yellow-100 text-yellow-800'
    };
    return colors[action] || 'bg-gray-100 text-gray-800';
  };

  const tableNames = [
    { value: '', label: 'All Tables' },
    { value: 'users', label: 'Users' },
    { value: 'hostels', label: 'Hostels' },
    { value: 'bookings', label: 'Bookings' },
    { value: 'reviews', label: 'Reviews' },
    { value: 'wishlist', label: 'Wishlist' },
    { value: 'transaction_rollback', label: 'Rollback' }
  ];

  const actions = [
    { value: '', label: 'All Actions' },
    { value: 'INSERT', label: 'Create' },
    { value: 'UPDATE', label: 'Update' },
    { value: 'DELETE', label: 'Delete' },
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Audit Logs</h1>

      {/* Filters */}
      <div className="bg-white p-4 rounded shadow mb-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <select
            value={filters.table_name}
            onChange={(e) => handleFilterChange('table_name', e.target.value)}
            className="border p-2 rounded"
          >
            {tableNames.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
          </select>
          
          <select
            value={filters.action}
            onChange={(e) => handleFilterChange('action', e.target.value)}
            className="border p-2 rounded"
          >
            {actions.map(a => <option key={a.value} value={a.value}>{a.label}</option>)}
          </select>
          
          <input
            type="text"
            placeholder="User ID"
            value={filters.user_id}
            onChange={(e) => handleFilterChange('user_id', e.target.value)}
            className="border p-2 rounded"
          />
          
          <input
            type="date"
            placeholder="Start Date"
            value={filters.start_date}
            onChange={(e) => handleFilterChange('start_date', e.target.value)}
            className="border p-2 rounded"
          />
          
          <input
            type="date"
            placeholder="End Date"
            value={filters.end_date}
            onChange={(e) => handleFilterChange('end_date', e.target.value)}
            className="border p-2 rounded"
          />
        </div>
        <div className="mt-4">
          <button onClick={clearFilters} className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">
            Clear Filters
          </button>
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-white rounded shadow overflow-hidden">
        <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
          <table className="min-w-full">
            <thead className="sticky top-0 bg-gray-100">
              <tr>
                <th className="p-3 text-left">Time</th>
                <th className="p-3 text-left">Table</th>
                <th className="p-3 text-left">Action</th>
                <th className="p-3 text-left">Record ID</th>
                <th className="p-3 text-left">User</th>
                <th className="p-3 text-left">Details</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="6" className="p-6 text-center">Loading...</td></tr>
              ) : logs.length === 0 ? (
                <tr><td colSpan="6" className="p-6 text-center">No logs found</td></tr>
              ) : (
                logs.map(log => (
                  <>
                    <tr className="border-b hover:bg-gray-50 cursor-pointer" onClick={() => setExpandedRow(expandedRow === log.log_id ? null : log.log_id)}>
                      <td className="p-3 text-sm">{formatDate(log.changed_at)}</td>
                      <td className="p-3">
                        <span className="px-2 py-1 rounded text-xs bg-gray-100">{log.table_name}</span>
                      </td>
                      <td className="p-3">
                        <span className={`px-2 py-1 rounded text-xs ${getActionBadge(log.action)}`}>
                          {log.action}
                        </span>
                      </td>
                      <td className="p-3">{log.record_id}</td>
                      <td className="p-3">
                        <div className="text-sm font-medium">{log.changed_by_name || 'System'}</div>
                        <div className="text-xs text-gray-500">{log.changed_by_email}</div>
                      </td>
                      <td className="p-3">
                        <button className="text-blue-600 text-sm">
                          {expandedRow === log.log_id ? 'Hide Details' : 'Show Details'}
                        </button>
                      </td>
                    </tr>
                    {expandedRow === log.log_id && (
                      <tr className="bg-gray-50">
                        <td colSpan="6" className="p-4">
                          <div className="space-y-3">
                           {log.old_data && (
                              <div>
                                <h4 className="font-semibold text-sm mb-1">Before:</h4>
                                <pre className="bg-gray-800 text-green-400 p-3 rounded text-xs overflow-x-auto">
                                  {typeof log.old_data === 'string' ? log.old_data : JSON.stringify(log.old_data, null, 2)}
                                </pre>
                              </div>
                            )}
                           {log.new_data && (
                              <div>
                                <h4 className="font-semibold text-sm mb-1">After:</h4>
                                <pre className="bg-gray-800 text-green-400 p-3 rounded text-xs overflow-x-auto">
                                  {typeof log.new_data === 'string' ? log.new_data : JSON.stringify(log.new_data, null, 2)}
                                </pre>
                              </div>
                            )}
                            {!log.old_data && !log.new_data && (
                              <p className="text-gray-500 text-sm">No additional data available</p>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-4">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Previous
          </button>
          <span className="px-3 py-1">Page {page} of {totalPages}</span>
          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}