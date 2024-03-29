import { useAuth } from '../contexts/AuthContext';
import { UserRole } from '../utils/types';
import { Navigate, Outlet } from 'react-router-dom';

const AdminRoutes = () => {
  const { user } = useAuth();

  return user?.role === UserRole.ADMIN ? <Outlet /> : <Navigate to="/" />;
};

export default AdminRoutes;
