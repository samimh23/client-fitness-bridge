
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthForm from '@/components/auth/AuthForm';
import { useAuth } from '@/contexts/AuthContext';

export default function Login() {
  const navigate = useNavigate();
  const { session, user } = useAuth();
  
  useEffect(() => {
    if (session && user) {
      const userRole = user.user_metadata?.role;
      if (userRole === 'coach') {
        navigate('/dashboard');
      } else {
        navigate('/client-app');
      }
    }
  }, [session, user, navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-white p-4">
      <AuthForm />
    </div>
  );
}
