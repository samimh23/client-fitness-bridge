
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthForm from '@/components/auth/AuthForm';
import { useAuth } from '@/contexts/AuthContext';

export default function Login() {
  const navigate = useNavigate();
  const { session, user, role, isLoading } = useAuth();
  
  // Only redirect if we have complete authentication data
  useEffect(() => {
    if (session && user && role) {
      console.log('User authenticated with role:', role, 'redirecting...');
      if (role === 'coach') {
        navigate('/dashboard');
      } else if (role === 'client') {
        navigate('/client-app');
      }
    }
  }, [session, user, role, navigate]);

  // Add logging to help debug
  console.log('Login page render - Auth state:', { 
    hasSession: !!session, 
    hasUser: !!user, 
    currentRole: role,
    isLoading
  });

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-white p-4">
      <AuthForm />
    </div>
  );
}
