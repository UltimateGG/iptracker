import React, { useContext, useEffect, useMemo } from 'react';
import { APIError, Application, User, UserRole } from '../utils/types';
import { useQuery } from 'react-query';
import { getAllUsers, getMyApps } from '../utils/api';
import { useNotifications } from './NotificationContext';
import { useAuth } from './AuthContext';
import { queryClient } from '../main';

export interface AppContextProps {
  applications: Application[] | null;
  users: User[]; // Only available for admins
  loadingUsers: boolean;
}

export const AppContext = React.createContext<AppContextProps | undefined>(undefined);

export const AppProvider = ({ children }: { children?: React.ReactNode }) => {
  const [applications, setApplications] = React.useState<Application[] | null>(null);
  const [users, setUsers] = React.useState<User[]>([]);

  const { notifyError } = useNotifications();
  const { user } = useAuth();

  useQuery<Application[], APIError>('applications', getMyApps, {
    onSuccess: setApplications,
    onError: e => notifyError('Failed to load applications: ' + e.message)
  });

  const { isLoading, isRefetching } = useQuery<User[], APIError>(
    'users',
    async () => {
      if (user?.role !== UserRole.ADMIN) return [];

      return await getAllUsers();
    },
    { onSuccess: setUsers, onError: e => notifyError('Failed to load users: ' + e.message) }
  );

  useEffect(() => {
    if (user?.role === UserRole.ADMIN) {
      queryClient.invalidateQueries('users');
      return;
    }

    queryClient.cancelQueries('users');
    setUsers([]);
  }, [user]);

  const loadingUsers = isLoading || isRefetching;
  const context: AppContextProps = useMemo(() => ({ applications, users, loadingUsers }), [applications, users, loadingUsers]);

  return <AppContext.Provider value={context}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) throw new Error('AppContext must be used under an AppProvider component');

  return context;
};
