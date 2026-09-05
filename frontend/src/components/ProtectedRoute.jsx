import { Navigate } from 'react-router-dom';
import { useAuth } from '../auth-context';

export default function ProtectedRoute({ children }) {
  const { authed, loading } = useAuth();

  if (loading) return null; // Should be handled by AuthProvider but just in case

  if (!authed) {
    return <Navigate to="/" replace />;
  }

  return children;
}
