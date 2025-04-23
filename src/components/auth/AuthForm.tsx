
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import LoginForm from './LoginForm';
import SignupForm from './SignupForm';
import ForgotPasswordDialog from './ForgotPasswordDialog';
import { UserRole, AuthFormState } from './types';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext'; 

const AUTO_LOGOUT_TIME = 5;

export default function AuthForm() {
  const navigate = useNavigate();
  const { session, user, role } = useAuth();
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
    name: '', 
  });

  // Handle auto redirect when already authenticated
  useEffect(() => {
    if (session && user && role) {
      console.log('User already authenticated, redirecting based on role:', role);
      if (role === 'coach') {
        navigate('/dashboard');
      } else if (role === 'client') {
        navigate('/client-app');
      }
    }
  }, [session, user, role, navigate]);

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
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formState.email,
        password: formState.password
      });

      if (error) {
        throw error;
      }

      // Fetch user role
      const { data: roleData, error: roleError } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', data.user?.id)
        .single();

      if (roleError) {
        console.warn('Error fetching role, using metadata fallback:', roleError);
      }

      const userRole = roleData?.role || data.user?.user_metadata?.role || formState.role;
      
      const userData = {
        email: data.user?.email || '',
        role: userRole,
        isAuthenticated: true,
        lastActive: new Date().toISOString(),
      };
      
      if (formState.rememberMe) {
        localStorage.setItem('user', JSON.stringify(userData));
      } else {
        sessionStorage.setItem('user', JSON.stringify(userData));
        localStorage.removeItem('user');
      }
      
      toast.success('Logged in successfully!');
      
      if (userRole === 'coach') {
        navigate('/dashboard');
      } else {
        navigate('/client-app');
      }
    } catch (error: any) {
      toast.error(error.message || 'Authentication failed. Please try again.');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // First, create the user account
      const { data, error } = await supabase.auth.signUp({
        email: formState.email,
        password: formState.password,
        options: {
          data: {
            full_name: formState.name || '',
            role: formState.role
          }
        }
      });

      if (error) {
        throw error;
      }
      
      console.log('Signup successful, now inserting role data');
      
      // Sign in the user immediately after signup so they have the auth token for the next operation
      if (data.user) {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: formState.email,
          password: formState.password
        });
        
        if (signInError) {
          console.error('Auto sign-in after signup failed:', signInError);
        } else {
          console.log('Auto sign-in after signup successful');
          
          // Now we can insert the role since the user is authenticated
          const { error: roleError } = await supabase
            .from('user_roles')
            .insert({ 
              user_id: data.user.id, 
              role: formState.role 
            });

          if (roleError) {
            console.error("Role insertion error:", roleError);
            // Continue with signup even if role insertion fails
            // The role will be assigned from metadata as fallback
          } else {
            console.log('Role inserted successfully:', formState.role);
            
            // Redirect based on role
            if (formState.role === 'coach') {
              navigate('/dashboard');
              return;
            } else {
              navigate('/client-app');
              return;
            }
          }
        }
      }
      
      toast.success('Account created successfully! Please check your email to verify.');
      
      // Only reset if we haven't already redirected
      setActiveTab('login');
      setFormState(prev => ({
        ...prev,
        password: ''
      }));
    } catch (error: any) {
      toast.error(error.message || 'Account creation failed. Please try again.');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
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
