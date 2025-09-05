
import { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthService } from '@/lib/auth';
import { toast } from 'sonner';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const location = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAuthentication = async () => {
      const token = AuthService.getToken();
      const user = AuthService.getUser();
      
      if (!token || !user) {
        setIsAuthenticated(false);
        return;
      }
      
      // Check if token is expired
      if (AuthService.isTokenExpired(token)) {
        AuthService.logout();
        setIsAuthenticated(false);
        return;
      }
      
      // Validate token with backend
      const isValid = await AuthService.validateToken();
      if (!isValid) {
        AuthService.logout();
        setIsAuthenticated(false);
        return;
      }
      
      // Check inactivity (24 hours)
      if (user.lastActive) {
        const lastActive = new Date(user.lastActive);
        const now = new Date();
        const hoursSinceLastActive = (now.getTime() - lastActive.getTime()) / (1000 * 60 * 60);
        
        if (hoursSinceLastActive > 24) {
          AuthService.logout();
          setIsAuthenticated(false);
          return;
        }
      }
      
      setIsAuthenticated(true);
    };
    
    checkAuthentication();
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

  // Authenticated - render children
  return <>{children}</>;
}
