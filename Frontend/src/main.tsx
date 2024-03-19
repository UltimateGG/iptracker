import React from 'react';
import ReactDOM from 'react-dom/client';
import LoginPage from './pages/LoginPage.tsx';
import HomePage from './pages/HomePage.tsx';
import './index.css';
import { RouterProvider, createHashRouter } from 'react-router-dom';


const router = createHashRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/',
    element: <HomePage />,
  }
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);
