import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { Navigate, RouterProvider, createHashRouter } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';

const router = createHashRouter([
  {
    path: '/login',
    element: <LoginPage />
  },
  {
    path: '/',
    element: <HomePage />
  },
  {
    path: '*',
    element: <Navigate to="/login" />
  }
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
