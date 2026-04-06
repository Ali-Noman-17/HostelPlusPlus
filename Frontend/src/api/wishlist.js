import axios from './axios';

export const getWishlist = () => axios.get('/users/wishlist');

export const addToWishlist = (hostelId, notes = null) => {
  return axios.post(`/users/wishlist/${hostelId}`, notes ? { notes } : {});
};

export const removeFromWishlist = (hostelId) => {
  return axios.delete(`/users/wishlist/${hostelId}`);
};