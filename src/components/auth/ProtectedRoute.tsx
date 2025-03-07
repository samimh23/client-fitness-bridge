
import { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { toast } from 'sonner';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'coach' | 'client';
}

export default function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const location = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    // Check if user is authenticated
    const userJson = localStorage.getItem('user');
    
    if (userJson) {
      try {
        const user = JSON.parse(userJson);
        setIsAuthenticated(user.isAuthenticated);
        setUserRole(user.role);
      } catch (e) {
        setIsAuthenticated(false);
        localStorage.removeItem('user');
      }
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  // Show loading state while checking authentication
  if (isAuthenticated === null) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  // Not authenticated - redirect to login
  if (!isAuthenticated) {
    toast.error('Please log in to access this page');
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Role check
  if (requiredRole && userRole !== requiredRole) {
    toast.error(`This area is only accessible to ${requiredRole}s`);
    return <Navigate to={userRole === 'client' ? '/client-app' : '/dashboard'} replace />;
  }

  // Authenticated and proper role - render children
  return <>{children}</>;
}
