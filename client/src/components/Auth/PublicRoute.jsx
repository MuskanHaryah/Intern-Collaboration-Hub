import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../stores';

/**
 * Public Route component - redirects to dashboard if already authenticated
 * Used for login/register pages
 */
export default function PublicRoute({ children }) {
  const { isAuthenticated } = useAuthStore();

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
