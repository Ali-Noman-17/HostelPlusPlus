import axios from './axios';

export const getDashboardStats = () => axios.get('/admin/dashboard');
export const getUsers = (page = 1, limit = 20) => { return axios.get(`/admin/users?page=${page}&limit=${limit}`);};
export const changeUserRole = (userId, role) => axios.put(`/admin/users/${userId}/role`, { role });
export const verifyUser = (userId) => axios.put(`/admin/users/${userId}/verify`);
export const deleteUser = (userId) => axios.delete(`/admin/users/${userId}`);
export const getPendingHostels = () => axios.get('/admin/hostels/pending');
export const verifyHostel = (hostelId) => axios.put(`/admin/hostels/${hostelId}/verify`);

export const exportBookingsReport = (params) => axios.get('/admin/reports/bookings', { params, responseType: 'blob' });
export const exportRevenueReport = (params) => axios.get('/admin/reports/revenue', { params, responseType: 'blob' });
export const getReportSummary = (period) => axios.get(`/admin/reports/summary?period=${period}`);
export const getAuditLogs = (params) => axios.get('/admin/audit-logs', { params });

export const adminCreateUser = (data) => axios.post('/admin/users', data);
export const adminCreateHostel = (data) => axios.post('/admin/hostels', data);
export const adminUpdateHostel = (id, data) => axios.put(`/admin/hostels/${id}`, data);
export const adminDeleteHostel = (id) => axios.delete(`/admin/hostels/${id}`);

export const createCity = (data) => axios.post('/admin/cities', data);
export const updateCity = (id, data) => axios.put(`/admin/cities/${id}`, data);
export const deleteCity = (id) => axios.delete(`/admin/cities/${id}`);

export const createArea = (data) => axios.post('/admin/areas', data);
export const updateArea = (id, data) => axios.put(`/admin/areas/${id}`, data);
export const deleteArea = (id) => axios.delete(`/admin/areas/${id}`);

export const createAmenity = (data) => axios.post('/admin/amenities', data);
export const updateAmenity = (id, data) => axios.put(`/admin/amenities/${id}`, data);
export const deleteAmenity = (id) => axios.delete(`/admin/amenities/${id}`);

export const getInstitutions = () => axios.get('/institutions');
export const createInstitution = (data) => axios.post('/admin/institutions', data);
export const updateInstitution = (id, data) => axios.put(`/admin/institutions/${id}`, data);
export const deleteInstitution = (id) => axios.delete(`/admin/institutions/${id}`);

export const getAllBookings = (params) => axios.get('/admin/bookings', { params });
export const updateBookingStatus = (id, status, cancellation_reason = null) => axios.put(`/admin/bookings/${id}/status`, { status, cancellation_reason });
export const deleteBooking = (id) => axios.delete(`/admin/bookings/${id}`);