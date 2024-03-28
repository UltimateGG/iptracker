import React, { useContext, useEffect, useMemo, useState } from 'react';
import { User } from '../utils/types';
import { useLocation, useNavigate } from 'react-router-dom';
import { clearToken, getToken, getUser, setUnauthorizedHook, parseToken } from '../utils/api';
import { useQuery } from 'react-query';

export interface AuthContextProps {
  user: User | null;
  logout: () => void;
}

const USER_CACHE_KEY = 'cbuser';

// While we are logging in show a dummy saved user
const getCachedUser = () => {
  try {
    const user = localStorage.getItem(USER_CACHE_KEY);
    if (!user) return null;

    return JSON.parse(user) as User;
  } catch (e) {
    return null;
  }
};

export const AuthContext = React.createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: { children?: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(getCachedUser());

  const nav = useNavigate();
  const location = useLocation();

  // Redirect to login if not logged in
  useEffect(() => {
    if (!user && location.pathname !== '/login') nav('/login');
  }, [user, location, nav]);

  const loadUser = async () => {
    try {
      const token = getToken();
      if (!token) throw new Error('No token found');

      const data = parseToken(token);
      const me = await getUser(data.id);

      setUser(me);
      localStorage.setItem(USER_CACHE_KEY, JSON.stringify(me));
    } catch (e) {
      console.error('Error loading logged in user', e);

      setUser(null);
      localStorage.removeItem(USER_CACHE_KEY);
      clearToken();
      nav('/login');
    }
  };

  setUnauthorizedHook(() => logout());

  // Use react query to debounce
  useQuery('user', loadUser, { retry: false });

  const logout = () => {
    setUser(null);
    localStorage.removeItem(USER_CACHE_KEY);
    clearToken();
    nav('/login');
  };

  const context: AuthContextProps = useMemo(() => ({ user, logout }), [user]);

  return <AuthContext.Provider value={context}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) throw new Error('AuthContext must be used under an AuthProvider component');

  return context;
};
