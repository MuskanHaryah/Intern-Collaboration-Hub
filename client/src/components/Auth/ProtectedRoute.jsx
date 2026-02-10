import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../stores';

/**
 * Protected Route component - redirects to login if not authenticated
 * Checks both Zustand state AND localStorage token to avoid stale state
 */
export default function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuthStore();
  const location = useLocation();

  // Double-check: Zustand might say authenticated but token could be gone
  const hasToken = !!localStorage.getItem('token');

  if (!isAuthenticated || !hasToken) {
    // Clear stale auth state if token is missing
    if (isAuthenticated && !hasToken) {
      useAuthStore.getState().logout();
    }
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}
