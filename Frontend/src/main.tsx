import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { Navigate, RouterProvider, createHashRouter } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import { AuthProvider } from './contexts/AuthContext';
import { CustomFlowbiteTheme, Flowbite } from 'flowbite-react';

const router = createHashRouter([
  {
    path: '/',
    element: <HomePage />
  },
  {
    path: '/login',
    element: <LoginPage />
  },
  {
    path: '*', // Any unknown routes redirect to login
    element: <Navigate to="/login" />
  }
]);

// TODO need global custom primary color not per component
// I ran out of time
// check https://www.flowbite-react.com/docs/customize/theme
const customTheme: CustomFlowbiteTheme = {
  button: {
    color: {
      primary: 'bg-red-500 hover:bg-red-600'
    }
  }
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Flowbite theme={{ theme: customTheme }}>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </Flowbite>
  </React.StrictMode>
);
