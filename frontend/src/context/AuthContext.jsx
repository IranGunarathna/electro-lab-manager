
import { createContext, useState, useEffect } from 'react';
import api from '../api/axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('userInfo');
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        setUser(parsed);
        if (parsed.token) {
          localStorage.setItem('token', parsed.token);
        }
      } catch (e) {
        console.warn('Error parsing storedUser:', e);
      }
    }
    setLoading(false);
  }, []);

  const login = async (uniEmail, password) => {
    const response = await api.post('/auth/login', { uniEmail, password });
    localStorage.setItem('userInfo', JSON.stringify(response.data));
    if (response.data?.token) {
      localStorage.setItem('token', response.data.token);
    }
    setUser(response.data);
    return response.data;
  };

  const logout = () => {
    localStorage.removeItem('userInfo');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};