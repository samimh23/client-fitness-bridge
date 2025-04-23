
import { Navigate, useLocation } from 'react-router-dom';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'coach' | 'client';
}

export default function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const location = useLocation();
  const { user, session, role } = useAuth();
  
  console.log('ProtectedRoute check - User:', user?.id);
  console.log('ProtectedRoute check - Role:', role);
  console.log('ProtectedRoute check - Required role:', requiredRole);
  
  // Not authenticated - redirect to login
  if (!session || !user) {
    toast.error('Please log in to access this page');
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // No role yet - loading state or first login
  if (requiredRole && role === null) {
    console.log('Role is null, but authentication is successful. Waiting for role data...');
    // Could add a loading state here if needed
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  // Role check
  if (requiredRole && role !== requiredRole) {
    console.log(`Role mismatch: User has ${role}, but ${requiredRole} is required`);
    toast.error(`This area is only accessible to ${requiredRole}s`);
    return <Navigate to={role === 'client' ? '/client-app' : '/dashboard'} replace />;
  }

  // Authenticated and proper role - render children
  return <>{children}</>;
}
