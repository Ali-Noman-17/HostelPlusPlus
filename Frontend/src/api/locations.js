import axios from './axios';

export const getCities = () => axios.get('/cities');
export const getAreasByCity = (cityId) => axios.get(`/cities/${cityId}/areas`);