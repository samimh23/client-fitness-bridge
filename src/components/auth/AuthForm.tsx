import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import LoginForm from './LoginForm';
import SignupForm from './SignupForm';
import ForgotPasswordDialog from './ForgotPasswordDialog';
import type { AuthFormState } from './types';

const AUTO_LOGOUT_TIME = 30; // 30 minutes in minutes

export default function AuthForm() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('login');
  const [isLoading, setIsLoading] = useState(false);
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);
  const [inactivityTimer, setInactivityTimer] = useState<NodeJS.Timeout | null>(null);
  const [lastActivity, setLastActivity] = useState(Date.now());

  const [formState, setFormState] = useState<AuthFormState>({
    email: '',
    password: '',
    role: 'coach',
    rememberMe: false,
  });

  const updateFormState = (field: keyof AuthFormState, value: any) => {
    setFormState(prev => ({
      ...prev,
      [field]: value
    }));
    
    setLastActivity(Date.now());
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    if (formState.email === 'coach@example.com' && formState.password === 'password') {
      toast.success('Login successful!');
      navigate('/dashboard');
    } else if (formState.email === 'client@example.com' && formState.password === 'password') {
      toast.success('Login successful!');
      navigate('/client-app');
    } else {
      toast.error('Invalid credentials. Try coach@example.com or client@example.com with password "password"');
    }
    setIsLoading(false);
  };

  const handleSignupSubmit = async (e: React.FormEvent, name: string) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast.success('Account created successfully! Please log in.');
    setActiveTab('login');
    setIsLoading(false);
  };

  useEffect(() => {
    const setupInactivityTimer = () => {
      if (inactivityTimer) {
        clearTimeout(inactivityTimer);
      }
      
      const timer = setTimeout(() => {
        const localUserJson = localStorage.getItem('user');
        const sessionUserJson = sessionStorage.getItem('user');
        
        if (localUserJson || sessionUserJson) {
          const inactiveTimeMs = Date.now() - lastActivity;
          const inactiveTimeMinutes = inactiveTimeMs / (1000 * 60);
          
          if (inactiveTimeMinutes >= AUTO_LOGOUT_TIME) {
            localStorage.removeItem('user');
            sessionStorage.removeItem('user');
            
            toast.info(`You've been logged out due to inactivity.`);
            
            if (window.location.pathname !== '/login') {
              window.location.href = '/login';
            }
          }
        }
        
        setupInactivityTimer();
      }, 60000);
      
      setInactivityTimer(timer);
    };
    
    setupInactivityTimer();
    
    const handleActivity = () => {
      setLastActivity(Date.now());
    };
    
    window.addEventListener('mousemove', handleActivity);
    window.addEventListener('keydown', handleActivity);
    window.addEventListener('click', handleActivity);
    
    return () => {
      if (inactivityTimer) {
        clearTimeout(inactivityTimer);
      }
      window.removeEventListener('mousemove', handleActivity);
      window.removeEventListener('keydown', handleActivity);
      window.removeEventListener('click', handleActivity);
    };
  }, [inactivityTimer, lastActivity]);

  return (
    <div className="w-full max-w-md mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">CoachPro</h1>
        <p className="text-gray-500">Your coaching business platform</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 w-full">
          <TabsTrigger value="login">Login</TabsTrigger>
          <TabsTrigger value="signup">Sign Up</TabsTrigger>
        </TabsList>

        <TabsContent value="login" className="space-y-4 pt-4">
          <LoginForm 
            formState={formState}
            updateFormState={updateFormState}
            isLoading={isLoading}
            onForgotPasswordClick={() => setForgotPasswordOpen(true)}
            onSubmit={handleLoginSubmit}
          />
        </TabsContent>

        <TabsContent value="signup" className="space-y-4 pt-4">
          <SignupForm 
            formState={formState}
            updateFormState={updateFormState}
            isLoading={isLoading}
            onSubmit={handleSignupSubmit}
          />
        </TabsContent>
      </Tabs>

      <ForgotPasswordDialog 
        open={forgotPasswordOpen} 
        onOpenChange={setForgotPasswordOpen} 
      />
    </div>
  );
}