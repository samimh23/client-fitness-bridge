
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthForm from '@/components/auth/AuthForm';

export default function Login() {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Check if already logged in from either localStorage or sessionStorage
    const localUserJson = localStorage.getItem('user');
    const sessionUserJson = sessionStorage.getItem('user');
    
    // Use localStorage data first, then fallback to sessionStorage
    const userJson = localUserJson || sessionUserJson;
    
    if (userJson) {
      try {
        const user = JSON.parse(userJson);
        if (user.isAuthenticated) {
          if (user.role === 'coach') {
            navigate('/dashboard');
          } else {
            navigate('/client-app');
          }
        }
      } catch (e) {
        // Invalid JSON, clear it
        localStorage.removeItem('user');
        sessionStorage.removeItem('user');
      }
    }
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-white p-4">
      <AuthForm />
    </div>
  );
}
