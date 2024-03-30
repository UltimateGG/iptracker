import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { Navigate, HashRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import { QueryClient, QueryClientProvider } from 'react-query';
import { AuthProvider } from './contexts/AuthContext';
import { AppProvider } from './contexts/AppContext';
import UsersPage from './pages/admin/UsersPage';
import AdminRoutes from './components/AdminRoutes';
import NavBar from './components/NavBar';
import { NotificationProvider } from './contexts/NotificationContext';
import { CustomFlowbiteTheme, Flowbite } from 'flowbite-react';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false
    }
  }
});

const theme: CustomFlowbiteTheme = {
  button: {
    color: {
      dark: 'border border-transparent bg-stone-950 text-white focus:ring-4 focus:ring-stone-300 enabled:hover:bg-stone-900 dark:border-stone-700 dark:bg-stone-800 dark:focus:ring-stone-800 dark:enabled:hover:bg-stone-750',
      light:
        'border border-gray-300 bg-white text-gray-900 focus:ring-4 focus:ring-gray-300 enabled:hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-600 dark:text-white dark:focus:ring-gray-700 dark:enabled:hover:border-gray-700 dark:enabled:hover:bg-gray-700'
    }
  }
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Flowbite theme={{ theme }}>
      {/* <DarkThemeToggle /> */}
      <QueryClientProvider client={queryClient}>
        <HashRouter>
          <AuthProvider>
            <NotificationProvider>
              <AppProvider>
                <Routes>
                  <Route path="/login" element={<LoginPage />} />

                  {/* Routes with navbar */}
                  <Route element={<NavBar />}>
                    <Route path="/" element={<HomePage />} />

                    {/* Admin only routes */}
                    <Route element={<AdminRoutes />}>
                      <Route path="/users" element={<UsersPage />} />
                    </Route>
                  </Route>

                  {/* Unknown routes redirect to login */}
                  <Route path="*" element={<Navigate to="/login" />} />
                </Routes>
              </AppProvider>
            </NotificationProvider>
          </AuthProvider>
        </HashRouter>
      </QueryClientProvider>
    </Flowbite>
  </React.StrictMode>
);
