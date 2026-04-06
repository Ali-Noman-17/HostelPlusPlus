import React, { useEffect, useState } from 'react';
import { getAllBookings, updateBookingStatus, deleteBooking } from '../../api/admin';
import { getHostels } from '../../api/hostels';

export default function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [hostels, setHostels] = useState([]);
  const [filters, setFilters] = useState({
    status: '',
    hostel_id: '',
    user_id: '',
    start_date: '',
    end_date: ''
  });
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [statusAction, setStatusAction] = useState('');
  const [cancellationReason, setCancellationReason] = useState('');

  const fetchHostels = async () => {
    try {
      const res = await getHostels();
      setHostels(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const params = { page, limit: 20 };
      if (filters.status) params.status = filters.status;
      if (filters.hostel_id) params.hostel_id = filters.hostel_id;
      if (filters.user_id) params.user_id = filters.user_id;
      if (filters.start_date) params.start_date = filters.start_date;
      if (filters.end_date) params.end_date = filters.end_date;
      
      const res = await getAllBookings(params);
      setBookings(res.data.data);
      setTotalPages(res.data.pagination?.pages || 1);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHostels();
  }, []);

  useEffect(() => {
    fetchBookings();
  }, [page, filters]);

  const handleFilterChange = (key, value) => {
    setFilters({ ...filters, [key]: value });
    setPage(1);
  };

  const clearFilters = () => {
    setFilters({
      status: '',
      hostel_id: '',
      user_id: '',
      start_date: '',
      end_date: ''
    });
    setPage(1);
  };

  const handleStatusChange = async () => {
    if (!selectedBooking) return;
    try {
      await updateBookingStatus(selectedBooking.booking_id, statusAction, cancellationReason);
      setShowStatusModal(false);
      setSelectedBooking(null);
      setCancellationReason('');
      fetchBookings();
    } catch (err) {
      console.error(err);
      alert('Failed to update booking status');
    }
  };

  const handleDelete = async (booking) => {
    if (window.confirm(`Delete booking ${booking.booking_reference}? This action cannot be undone.`)) {
      try {
        await deleteBooking(booking.booking_id);
        fetchBookings();
      } catch (err) {
        console.error(err);
        alert('Failed to delete booking');
      }
    }
  };

  const openStatusModal = (booking, action) => {
    setSelectedBooking(booking);
    setStatusAction(action);
    setCancellationReason('');
    setShowStatusModal(true);
  };

  const getStatusBadge = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
      completed: 'bg-blue-100 text-blue-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getPaymentBadge = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      partial: 'bg-blue-100 text-blue-800',
      completed: 'bg-green-100 text-green-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const formatDate = (date) => {
    if (!date) return '-';
    return new Date(date).toLocaleDateString();
  };

  const statusOptions = [
    { value: '', label: 'All Status' },
    { value: 'pending', label: 'Pending' },
    { value: 'confirmed', label: 'Confirmed' },
    { value: 'cancelled', label: 'Cancelled' },
    { value: 'completed', label: 'Completed' }
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Manage Bookings</h1>

      {/* Filters */}
      <div className="bg-white p-4 rounded shadow mb-6">
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
          <select
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            className="border p-2 rounded"
          >
            {statusOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
          </select>

          <select
            value={filters.hostel_id}
            onChange={(e) => handleFilterChange('hostel_id', e.target.value)}
            className="border p-2 rounded"
          >
            <option value="">All Hostels</option>
            {hostels.map(h => <option key={h.hostel_id} value={h.hostel_id}>{h.hostel_name}</option>)}
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
            placeholder="Check-in From"
            value={filters.start_date}
            onChange={(e) => handleFilterChange('start_date', e.target.value)}
            className="border p-2 rounded"
          />

          <input
            type="date"
            placeholder="Check-out To"
            value={filters.end_date}
            onChange={(e) => handleFilterChange('end_date', e.target.value)}
            className="border p-2 rounded"
          />

          <button onClick={clearFilters} className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">
            Clear
          </button>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="bg-white rounded shadow overflow-hidden">
        <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
          <table className="min-w-full">
            <thead className="sticky top-0 bg-gray-100">
              <tr>
                <th className="p-3 text-left">ID</th>
                <th className="p-3 text-left">Reference</th>
                <th className="p-3 text-left">Guest</th>
                <th className="p-3 text-left">Hostel</th>
                <th className="p-3 text-left">Room</th>
                <th className="p-3 text-left">Dates</th>
                <th className="p-3 text-left">Amount</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Payment</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="10" className="p-6 text-center">Loading...</td></tr>
              ) : bookings.length === 0 ? (
                <tr><td colSpan="10" className="p-6 text-center">No bookings found</td></tr>
              ) : (
                bookings.map(booking => (
                  <tr key={booking.booking_id} className="border-b hover:bg-gray-50">
                    <td className="p-3">{booking.booking_id}</td>
                    <td className="p-3 font-mono text-sm">{booking.booking_reference}</td>
                    <td className="p-3">
                      <div className="font-medium">{booking.guest_name}</div>
                      <div className="text-xs text-gray-500">{booking.guest_email}</div>
                    </td>
                    <td className="p-3">{booking.hostel_name}</td>
                    <td className="p-3">{booking.room_type} - {booking.room_number}</td>
                    <td className="p-3 text-sm">
                      {formatDate(booking.check_in_date)}<br />to<br />{formatDate(booking.check_out_date)}
                    </td>
                    <td className="p-3">
                      PKR {booking.total_amount.toLocaleString()}
                    </td>
                    <td className="p-3">
                      <span className={`px-2 py-1 rounded text-xs ${getStatusBadge(booking.status)}`}>
                        {booking.status}
                      </span>
                    </td>
                    <td className="p-3">
                      <span className={`px-2 py-1 rounded text-xs ${getPaymentBadge(booking.payment_status)}`}>
                        {booking.payment_status}
                      </span>
                    </td>
                    <td className="p-3">
                      <div className="flex gap-1 flex-wrap">
                        {booking.status === 'pending' && (
                          <button
                            onClick={() => openStatusModal(booking, 'confirmed')}
                            className="bg-green-600 text-white px-2 py-1 rounded text-xs hover:bg-green-700"
                          >
                            Confirm
                          </button>
                        )}
                        {(booking.status === 'pending' || booking.status === 'confirmed') && (
                          <button
                            onClick={() => openStatusModal(booking, 'cancelled')}
                            className="bg-red-600 text-white px-2 py-1 rounded text-xs hover:bg-red-700"
                          >
                            Cancel
                          </button>
                        )}
                        {booking.status === 'confirmed' && (
                          <button
                            onClick={() => openStatusModal(booking, 'completed')}
                            className="bg-blue-600 text-white px-2 py-1 rounded text-xs hover:bg-blue-700"
                          >
                            Complete
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(booking)}
                          className="bg-gray-600 text-white px-2 py-1 rounded text-xs hover:bg-gray-700"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
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

      {/* Status Change Modal */}
      {showStatusModal && selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">
              {statusAction === 'confirmed' && 'Confirm Booking'}
              {statusAction === 'cancelled' && 'Cancel Booking'}
              {statusAction === 'completed' && 'Mark as Completed'}
            </h2>
            <p className="mb-4">
              Booking: {selectedBooking.booking_reference}<br />
              Guest: {selectedBooking.guest_name}<br />
              Hostel: {selectedBooking.hostel_name}
            </p>
            {statusAction === 'cancelled' && (
              <textarea
                placeholder="Cancellation reason (optional)"
                value={cancellationReason}
                onChange={(e) => setCancellationReason(e.target.value)}
                className="w-full border p-2 rounded mb-4"
                rows="3"
              />
            )}
            <div className="flex gap-2">
              <button
                onClick={handleStatusChange}
                className={`flex-1 py-2 rounded text-white ${
                  statusAction === 'confirmed' ? 'bg-green-600 hover:bg-green-700' :
                  statusAction === 'cancelled' ? 'bg-red-600 hover:bg-red-700' :
                  'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                Confirm {statusAction}
              </button>
              <button
                onClick={() => setShowStatusModal(false)}
                className="px-4 py-2 border rounded hover:bg-gray-100"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}