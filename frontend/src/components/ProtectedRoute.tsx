import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

interface Props {
  role?: 'admin' | 'customer';
}

function ProtectedRoute({ role }: Props) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <p className="py-24 text-center text-gray-500">Loading...</p>;
  if (!user) return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  if (role && user.role !== role) return <Navigate to="/" replace />;

  return <Outlet />;
}

export default ProtectedRoute;