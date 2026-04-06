import axios from './axios';

export const createBooking = (data) => axios.post('/bookings', data);
export const getUserBookings = () => axios.get('/users/bookings');
export const cancelBooking = (id, reason) => axios.post(`/bookings/${id}/cancel`, { reason });