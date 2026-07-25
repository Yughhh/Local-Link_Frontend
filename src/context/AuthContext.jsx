import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authAPI } from '../utils/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  // Load user from token on mount
  useEffect(() => {
    const loadUser = async () => {
      const savedToken = localStorage.getItem('token');
      const savedUser = localStorage.getItem('user');

      if (savedToken && savedUser) {
        try {
          setToken(savedToken);
          setUser(JSON.parse(savedUser));
          // Verify token with backend if server is running
          if (!savedToken.startsWith('mock_')) {
            const res = await authAPI.getMe();
            if (res.data?.user) {
              setUser(res.data.user);
              localStorage.setItem('user', JSON.stringify(res.data.user));
            }
          }
        } catch (error) {
          // If token verification fails with 401, clean up
          if (error.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            setToken(null);
            setUser(null);
          }
        }
      }
      setLoading(false);
    };

    loadUser();
  }, []);

  const login = useCallback(async (email, password) => {
    try {
      const res = await authAPI.login({ email, password });
      const { token: newToken, user: userData } = res.data;

      localStorage.setItem('token', newToken);
      localStorage.setItem('user', JSON.stringify(userData));
      setToken(newToken);
      setUser(userData);

      return res.data;
    } catch (err) {
      // If the request failed due to authentication (401), propagate the error
      if (err.response?.status === 401) {
        throw err;
      }
      // If there is no response (network error) perform local fallback login
      if (!err.response) {
        console.warn('Backend server offline or unreachable. Performing local authentication fallback...');
        const fallbackUser = {
          _id: 'user_' + Date.now(),
          name: email.split('@')[0] || 'Anshu Kumar',
          email,
          phone: '+91 98765 12345',
          role: email.includes('provider') ? 'provider' : 'user',
          city: 'Lucknow, UP',
          avatar: null,
          notifications: { emailAlerts: true, pushAlerts: true, smsAlerts: true },
        };
        const fallbackToken = 'mock_jwt_token_' + Date.now();

        localStorage.setItem('token', fallbackToken);
        localStorage.setItem('user', JSON.stringify(fallbackUser));
        setToken(fallbackToken);
        setUser(fallbackUser);

        return { success: true, token: fallbackToken, user: fallbackUser };
      }
      // For other server errors, rethrow
      throw err;
    }
  }, []);

  const register = useCallback(async (formData) => {
    try {
      const res = await authAPI.register(formData);
      const { token: newToken, user: userData } = res.data;

      localStorage.setItem('token', newToken);
      localStorage.setItem('user', JSON.stringify(userData));
      setToken(newToken);
      setUser(userData);

      return res.data;
    } catch (err) {
      // If server responded with an error, propagate it
      if (err.response) {
        throw err;
      }
      // If network error / backend offline, perform local registration fallback
      console.warn('Backend server offline. Registering user in local session...');
      const fallbackUser = {
        _id: 'user_' + Date.now(),
        name: formData.name,
        email: formData.email,
        phone: formData.phone || '+91 98765 43210',
        role: formData.role || 'user',
        city: 'Lucknow, UP',
        avatar: null,
        notifications: { emailAlerts: true, pushAlerts: true, smsAlerts: true },
      };
      const fallbackToken = 'mock_jwt_token_' + Date.now();

      localStorage.setItem('token', fallbackToken);
      localStorage.setItem('user', JSON.stringify(fallbackUser));
      setToken(fallbackToken);
      setUser(fallbackUser);

      return { success: true, token: fallbackToken, user: fallbackUser };
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  }, []);

  const updateUser = useCallback((updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  }, []);

  const value = {
    user,
    token,
    loading,
    isAuthenticated: !!token && !!user,
    login,
    register,
    logout,
    updateUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext;
