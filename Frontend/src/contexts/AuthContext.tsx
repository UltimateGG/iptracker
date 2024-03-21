import React, { useContext, useState } from 'react';
import { User } from '../utils/types';

export interface AuthContextProps {
  user: User | null;
}

export const AuthContext = React.createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: { children?: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null); // eslint-disable-line

  return <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) throw new Error('AuthContext must be used under an AuthProvider component');

  return context;
};
