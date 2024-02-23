import React from 'react';
import ReactDOM from 'react-dom/client';
import HomePage from './pages/HomePage.tsx';
import './index.css';
import { RouterProvider, createHashRouter } from 'react-router-dom';


const router = createHashRouter([
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
