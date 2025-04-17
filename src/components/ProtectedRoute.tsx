
import { Navigate } from 'react-router-dom';
import { authService } from '../services/auth';

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const user = authService.getUser();
  const token = localStorage.getItem('jwt');

  if (!user || !token) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};
