import { createContext, useContext, useState, useEffect } from 'react';
import { login as apiLogin, register as apiRegister, verifyToken } from '../api/auth';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const res = await verifyToken();
          setUser(res.data.data);
        } catch {
          localStorage.removeItem('token');
        }
      }
      setLoading(false);
    };
    initAuth();
  }, []);

  const login = async (email, password) => {
    const res = await apiLogin(email, password);
    localStorage.setItem('token', res.data.data.token);
    setUser(res.data.data.user);
    return res.data;
  };

  const register = async (userData) => {
    const res = await apiRegister(userData);
    localStorage.setItem('token', res.data.data.token);
    setUser(res.data.data.user);
    return res.data;
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};