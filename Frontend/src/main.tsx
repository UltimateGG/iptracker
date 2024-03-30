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
import { Flowbite } from 'flowbite-react';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false
    }
  }
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Flowbite>
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
