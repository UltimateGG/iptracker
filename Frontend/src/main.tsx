import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { Navigate, HashRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import { CustomFlowbiteTheme, Flowbite } from 'flowbite-react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { AuthProvider } from './contexts/AuthContext';

// TODO need global custom primary color not per component
// I ran out of time
// check https://www.flowbite-react.com/docs/customize/theme
const customTheme: CustomFlowbiteTheme = {};

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false
    }
  }
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Flowbite theme={{ theme: customTheme }}>
      <QueryClientProvider client={queryClient}>
        <HashRouter>
          <AuthProvider>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />

              <Route path="*" element={<Navigate to="/login" />} />
            </Routes>
          </AuthProvider>
        </HashRouter>
      </QueryClientProvider>
    </Flowbite>
  </React.StrictMode>
);
