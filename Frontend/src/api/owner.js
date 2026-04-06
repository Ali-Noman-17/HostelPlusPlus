import axios from './axios';

export const getOwnerDashboard = () => axios.get('/owner/dashboard');
export const getMyHostels = () => axios.get('/owner/hostels');
export const getHostelRooms = (hostelId) => axios.get(`/owner/hostels/${hostelId}/rooms`);
export const getHostelBookings = (hostelId) => axios.get(`/owner/hostels/${hostelId}/bookings`);
export const createHostel = (data) => axios.post('/owner/hostels', data);
export const updateHostel = (id, data) => axios.put(`/owner/hostels/${id}`, data);
export const deleteHostel = (id) => axios.delete(`/owner/hostels/${id}`);
export const addRoom = (hostelId, data) => axios.post(`/owner/hostels/${hostelId}/rooms`, data);
export const updateRoom = (roomId, data) => axios.put(`/owner/rooms/${roomId}`, data);
export const deleteRoom = (roomId) => axios.delete(`/owner/rooms/${roomId}`);