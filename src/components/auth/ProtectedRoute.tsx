
import { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { toast } from 'sonner';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const location = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    // Check if user is authenticated in either localStorage or sessionStorage
    const localUserJson = localStorage.getItem('user');
    const sessionUserJson = sessionStorage.getItem('user');
    
    // Use localStorage data first, then fallback to sessionStorage
    const userJson = localUserJson || sessionUserJson;
    
    if (userJson) {
      try {
        const user = JSON.parse(userJson);
        setIsAuthenticated(user.isAuthenticated);
      } catch (e) {
        setIsAuthenticated(false);
        localStorage.removeItem('user');
        sessionStorage.removeItem('user');
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

  // Authenticated - render children
  return <>{children}</>;
}
