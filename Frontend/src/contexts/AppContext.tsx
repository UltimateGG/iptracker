import React, { useContext, useMemo } from 'react';
import { Application } from '../utils/types';
import { useQuery } from 'react-query';
import { getMyApps } from '../utils/api';

export interface AppContextProps {
  applications: Application[] | null;
}

export const AppContext = React.createContext<AppContextProps | undefined>(undefined);

export const AppProvider = ({ children }: { children?: React.ReactNode }) => {
  const [applications, setApplications] = React.useState<Application[] | null>(null);

  useQuery('applications', async () => {
    const res = await getMyApps();

    setApplications(res);
  });

  const context: AppContextProps = useMemo(() => ({ applications }), [applications]);

  return <AppContext.Provider value={context}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) throw new Error('AppContext must be used under an AppProvider component');

  return context;
};
