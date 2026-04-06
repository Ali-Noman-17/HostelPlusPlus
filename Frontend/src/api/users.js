import axios from './axios';

export const getProfile = () => axios.get('/users/profile');
export const updateProfile = (data) => axios.put('/users/profile', data);
export const changePassword = (data) => axios.put('/users/change-password', data);
export const getWishlist = () => axios.get('/users/wishlist');
export const addToWishlist = (hostelId, notes) => axios.post(`/users/wishlist/${hostelId}`, { notes });
export const removeFromWishlist = (hostelId) => axios.delete(`/users/wishlist/${hostelId}`);