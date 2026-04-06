import axios from './axios';

export const login = (email, password) => axios.post('/auth/login', { email, password });
export const register = (userData) => axios.post('/auth/register', userData);
export const verifyToken = () => axios.get('/auth/verify');