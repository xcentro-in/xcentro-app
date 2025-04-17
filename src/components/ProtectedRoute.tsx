
import { Navigate, Outlet } from 'react-router-dom';
import { authService } from '../services/auth';

export function ProtectedRoute () {
  const user = authService.getUser();
  const token = localStorage.getItem('jwt');

  if (!user || !token) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};
