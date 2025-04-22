
import { Navigate, useLocation } from 'react-router-dom';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'coach' | 'client';
}

export default function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const location = useLocation();
  const { user, session } = useAuth();
  
  // Not authenticated - redirect to login
  if (!session || !user) {
    toast.error('Please log in to access this page');
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Role check - get role from metadata
  const userRole = user?.user_metadata?.role;
  if (requiredRole && userRole !== requiredRole) {
    toast.error(`This area is only accessible to ${requiredRole}s`);
    return <Navigate to={userRole === 'client' ? '/client-app' : '/dashboard'} replace />;
  }

  // Authenticated and proper role - render children
  return <>{children}</>;
}
