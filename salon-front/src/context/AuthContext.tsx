import { createContext, useState, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import type { JwtPayload, UserContextData } from '../types/auth';
import { API_BASE } from '../services/api';

interface AuthContextType {
  user: UserContextData | null;
  isAuthenticated: boolean;
  login: (accessToken: string, refreshToken: string) => void;
  logout: () => void;
  isLoading: boolean;
}

export const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserContextData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const applyUserFromAccessToken = (accessToken: string) => {
      const decoded = jwtDecode<JwtPayload>(accessToken);
      setUser({
        email: decoded.sub,
        role: decoded.role,
        userId: decoded.userId,
        authorities: decoded.authorities || [],
      });
    };

    const clearAuth = () => {
      localStorage.removeItem('@Salon:token');
      localStorage.removeItem('@Salon:refreshToken');
      setUser(null);
    };

    const init = async () => {
      const token = localStorage.getItem('@Salon:token');
      if (!token) {
        setIsLoading(false);
        return;
      }

      let accessToken = token;

      try {
        const decoded = jwtDecode<JwtPayload>(accessToken);
        const nowSec = Date.now() / 1000;
        if (decoded.exp <= nowSec) {
          const refreshToken = localStorage.getItem('@Salon:refreshToken');
          if (!refreshToken) {
            clearAuth();
            setIsLoading(false);
            return;
          }
          try {
            const { data } = await axios.post<{ accessToken: string; refreshToken: string }>(
              `${API_BASE}/auth/refresh`,
              { refreshToken }
            );
            if (cancelled) return;
            localStorage.setItem('@Salon:token', data.accessToken);
            localStorage.setItem('@Salon:refreshToken', data.refreshToken);
            accessToken = data.accessToken;
          } catch {
            if (!cancelled) clearAuth();
            setIsLoading(false);
            return;
          }
        }

        if (!cancelled) applyUserFromAccessToken(accessToken);
      } catch {
        if (!cancelled) clearAuth();
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    void init();
    return () => {
      cancelled = true;
    };
  }, []);

  const login = useCallback((accessToken: string, refreshToken: string) => {
    localStorage.setItem('@Salon:token', accessToken);
    localStorage.setItem('@Salon:refreshToken', refreshToken);

    const decoded = jwtDecode<JwtPayload>(accessToken);
    
    setUser({
      email: decoded.sub,
      role: decoded.role,
      userId: decoded.userId,
      authorities: decoded.authorities || [],
    });
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('@Salon:token');
    localStorage.removeItem('@Salon:refreshToken');
    setUser(null);
    window.location.href = '/login';
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
