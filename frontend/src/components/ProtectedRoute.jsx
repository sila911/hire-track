import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../auth-context';

export default function ProtectedRoute({ children }) {
  const { authed, loading } = useAuth();
  const location = useLocation();

  if (loading) return null; // Should be handled by AuthProvider but just in case

  if (!authed) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}
