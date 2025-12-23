// src/context/AuthContext.tsx

import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, AuthContextType } from '../types';
import { authService } from '../lib/db';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  // Load user from AsyncStorage on app start
  useEffect(() => {
    bootstrapAsync();
  }, []);

  const bootstrapAsync = async () => {
    try {
      const userJSON = await AsyncStorage.getItem('user');
      if (userJSON) {
        const parsedUser = JSON.parse(userJSON);
        setUser(parsedUser);
        setIsLoggedIn(true);
      }
    } catch {
      // Ignore error
    } finally {
      setLoading(false);
    }
  };

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      const loggedInUser = await authService.login(username, password);
      if (loggedInUser) {
        setUser(loggedInUser);
        setIsLoggedIn(true);
        await AsyncStorage.setItem('user', JSON.stringify(loggedInUser));
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  const logout = async () => {
    try {
      setUser(null);
      setIsLoggedIn(false);
      await AsyncStorage.removeItem('user');
    } catch {
      // Ignore error
    }
  };

  const value: AuthContextType = {
    user,
    login,
    logout,
    isLoggedIn,
    isAdmin: user?.role === 'admin',
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
