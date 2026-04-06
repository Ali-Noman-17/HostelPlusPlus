import axios from './axios';

export const getHostels = () => axios.get('/hostels');
export const getHostelById = (id) => axios.get(`/hostels/${id}`);
export const searchHostels = (params) => axios.get('/search', { params });
export const checkAvailability = (hostelId, checkIn, checkOut) => axios.get(`/search/${hostelId}/availability`, { params: { check_in: checkIn, check_out: checkOut } });