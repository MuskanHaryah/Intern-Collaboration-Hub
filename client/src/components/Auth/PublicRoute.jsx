import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../../stores';

/**
 * Public Route component - redirects to dashboard if already authenticated
 * Used for login/register pages
 * Checks both Zustand state AND localStorage token to avoid redirect loops
 */
export default function PublicRoute({ children }) {
  const { isAuthenticated } = useAuthStore();

  // Only redirect if BOTH Zustand says authenticated AND token actually exists
  const hasToken = !!localStorage.getItem('token');

  if (isAuthenticated && hasToken) {
    return <Navigate to="/dashboard" replace />;
  }

  // If Zustand says authenticated but no token, clear stale state
  if (isAuthenticated && !hasToken) {
    useAuthStore.getState().logout();
  }

  return children;
}
