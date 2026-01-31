import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../stores';

/**
 * Protected Route component - redirects to login if not authenticated
 */
export default function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuthStore();
  const location = useLocation();

  if (!isAuthenticated) {
    // Redirect to login, but save the attempted URL
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}
