// AuthContext.js
import React, { createContext, useState, useEffect, useContext } from 'react';
import authService from './services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    const authStatus = await authService.isAuthenticated();
    console.log('Auth status:', authStatus);
    setIsAuthenticated(authStatus);
    setIsLoading(false);
  };

  const login = async (email, password) => {
    const result = await authService.login(email, password);
    if (result.success) {
      setIsAuthenticated(true);
    }
    return result;
  };

  const logout = async () => {
    const result = await authService.logout();
    if (result.success) {
      setIsAuthenticated(false);
    }
    return result;
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);