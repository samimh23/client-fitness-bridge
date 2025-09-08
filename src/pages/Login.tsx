  import { useEffect } from 'react';
  import { useNavigate } from 'react-router-dom';
  import { AuthService } from '@/lib/auth';
  import AuthForm from '@/components/auth/AuthForm';

  export default function Login() {
    const navigate = useNavigate();
    
    useEffect(() => {
      const checkExistingAuth = async () => {
        const token = AuthService.getToken();
        const user = AuthService.getUser();
        
        if (!token || !user) return;
        
        // Check if token is expired
        if (AuthService.isTokenExpired(token)) {
          AuthService.logout();
          return;
        }
        
        // Validate token with backend
        const isValid = await AuthService.validateToken();
        if (!isValid) {
          AuthService.logout();
          return;
        }
        
        // Check inactivity (24 hours)
        if (user.lastActive) {
          const lastActive = new Date(user.lastActive);
          const now = new Date();
          const hoursSinceLastActive = (now.getTime() - lastActive.getTime()) / (1000 * 60 * 60);
          
          if (hoursSinceLastActive > 24) {
            AuthService.logout();
            return;
          }
        }
        
        // Update lastActive and redirect
        const rememberMe = !!localStorage.getItem('auth_token');
        AuthService.saveUser({
          ...user,
          lastActive: new Date().toISOString()
        }, rememberMe);
        
        // Redirect based on role
        if (user.role === 'COACH') {
          navigate('/dashboard');
        } else {
          navigate('/client-app');
        }
      };
      
      checkExistingAuth();
    }, [navigate]);

    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-white p-4">
        <AuthForm />
      </div>
    );
  }
