import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api } from '../utils/api';

const AppContext = createContext();

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [workshops, setWorkshops] = useState([]);
  const [selectedWorkshop, setSelectedWorkshop] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [view, setView] = useState('discover'); // discover, map, profile, earnings

  useEffect(() => {
    const token = localStorage.getItem('skillsync_token');
    if (token) {
      api.get('/auth/me')
        .then(setUser)
        .catch(() => localStorage.removeItem('skillsync_token'))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const fetchWorkshops = useCallback(async (filters = {}) => {
    const params = new URLSearchParams(filters).toString();
    const data = await api.get(`/workshops${params ? `?${params}` : ''}`);
    setWorkshops(data);
    return data;
  }, []);

  const login = async (email, password) => {
    const data = await api.post('/auth/login', { email, password });
    localStorage.setItem('skillsync_token', data.token);
    setUser(data);
    return data;
  };

  const register = async (name, email, password) => {
    const data = await api.post('/auth/register', { name, email, password });
    localStorage.setItem('skillsync_token', data.token);
    setUser(data);
    return data;
  };

  const logout = () => {
    localStorage.removeItem('skillsync_token');
    setUser(null);
    setView('discover');
  };

  const refreshUser = async () => {
    const data = await api.get('/auth/me');
    setUser(data);
  };

  const bookWorkshop = async (workshopId) => {
    const data = await api.post(`/workshops/${workshopId}/book`);
    setUser((prev) => ({ ...prev, creditBalance: data.creditBalance }));
    return data;
  };

  const createWorkshop = async (workshopData) => {
    const data = await api.post('/workshops', workshopData);
    setWorkshops((prev) => [data, ...prev]);
    return data;
  };

  const value = {
    user,
    loading,
    workshops,
    selectedWorkshop,
    showCreateModal,
    view,
    setUser,
    setWorkshops,
    setSelectedWorkshop,
    setShowCreateModal,
    setView,
    fetchWorkshops,
    login,
    register,
    logout,
    refreshUser,
    bookWorkshop,
    createWorkshop,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
