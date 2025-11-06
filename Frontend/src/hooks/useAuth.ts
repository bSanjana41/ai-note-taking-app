'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';

interface User {
  id: string;
  name: string;
  email: string;
  isActive: boolean;
}

interface AuthState {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
}

export function useAuth() {
  const router = useRouter();
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    loading: true,
    isAuthenticated: false,
  });

  const verifyToken = async () => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      setAuthState({
        user: null,
        loading: false,
        isAuthenticated: false,
      });
      return false;
    }

    try {
      const response = await api.get('/auth/verify');
      if (response.data.valid) {
        setAuthState({
          user: response.data.user,
          loading: false,
          isAuthenticated: true,
        });
        // Update localStorage with fresh user data
        localStorage.setItem('user', JSON.stringify(response.data.user));
        return true;
      } else {
        // Token invalid
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setAuthState({
          user: null,
          loading: false,
          isAuthenticated: false,
        });
        return false;
      }
    } catch (error: any) {
      // Token verification failed
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setAuthState({
        user: null,
        loading: false,
        isAuthenticated: false,
      });
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setAuthState({
      user: null,
      loading: false,
      isAuthenticated: false,
    });
    router.push('/login');
  };

  useEffect(() => {
    verifyToken();
  }, []);

  return {
    ...authState,
    verifyToken,
    logout,
  };
}

