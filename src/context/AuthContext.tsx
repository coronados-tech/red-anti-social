import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';
import { getAuthToken, getCurrentUser, setAuthToken, setOnUnauthorized } from '../api';
import type { User } from '../types';

const STORAGE_KEY = 'antisocial-user';

interface AuthContextType {
  user: User | null;
  login: (user: User) => void;
  updateSessionUser: (user: User) => void;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    function clearSession() {
      setUser(null);
      setAuthToken(null);
      localStorage.removeItem(STORAGE_KEY);
    }

    setOnUnauthorized(clearSession);

    async function loadSession() {
      try {
        const token = getAuthToken();
        if (!token) return;

        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          try {
            setUser(JSON.parse(saved) as User);
          } catch {
            localStorage.removeItem(STORAGE_KEY);
          }
        }

        const fresh = await getCurrentUser();
        setUser(fresh);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(fresh));
      } catch {
        clearSession();
      } finally {
        setLoading(false);
      }
    }

    loadSession();

    return () => setOnUnauthorized(null);
  }, []);

  function login(userData: User) {
    setUser(userData);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
  }

  const updateSessionUser = useCallback((userData: User) => {
    setUser(userData);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
  }, []);

  function logout() {
    setUser(null);
    setAuthToken(null);
    localStorage.removeItem(STORAGE_KEY);
  }

  return (
    <AuthContext.Provider value={{ user, login, updateSessionUser, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  return context;
}
