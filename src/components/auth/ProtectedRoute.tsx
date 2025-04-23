
import { Navigate, useLocation } from 'react-router-dom';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'coach' | 'client';
}

export default function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const location = useLocation();
  const { user, session, role, isLoading } = useAuth();
  
  console.log('ProtectedRoute check - User:', user?.id);
  console.log('ProtectedRoute check - Role:', role);
  console.log('ProtectedRoute check - Required role:', requiredRole);
  console.log('ProtectedRoute check - isLoading:', isLoading);
  
  // Loading state - show loading spinner
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
        <p className="text-gray-500">Loading your profile...</p>
      </div>
    );
  }
  
  // Not authenticated - redirect to login
  if (!session || !user) {
    toast.error('Please log in to access this page');
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // No role yet but authenticated
  if (requiredRole && role === null) {
    console.log('Role is null, but authentication is successful. This might indicate a role configuration issue.');
    toast.error('Your account role is not properly configured. Please contact support.');
    return <Navigate to="/login" state={{ from: location }} replace />;
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
