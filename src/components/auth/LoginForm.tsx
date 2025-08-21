import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { LogIn, Mail, AlertCircle } from 'lucide-react';
import PasswordInput from './PasswordInput';
import SocialLoginButtons from './SocialLoginButtons';
import { LoginFormProps } from './types';

export default function LoginForm({
  formState,
  updateFormState,
  isLoading,
  onForgotPasswordClick,
  onSubmit
}: LoginFormProps) {
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [lockoutTimer, setLockoutTimer] = useState<number | null>(null);
  const [validationErrors, setValidationErrors] = useState<{
    email?: string;
    password?: string;
  }>({});

  const validateField = (field: string, value: string) => {
    if (field === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!value) {
        return 'Email is required';
      } else if (!emailRegex.test(value)) {
        return 'Please enter a valid email address';
      }
    } else if (field === 'password') {
      if (!value) {
        return 'Password is required';
      } else if (value.length < 6) {
        return 'Password must be at least 6 characters';
      }
    }
    return '';
  };

  const handleInputChange = (field: 'email' | 'password', value: string) => {
    updateFormState(field, value);
    
    const error = validateField(field, value);
    setValidationErrors(prev => ({
      ...prev,
      [field]: error
    }));
  };

  const simulateFailedLogin = () => {
    const newFailedAttempts = failedAttempts + 1;
    setFailedAttempts(newFailedAttempts);
    
    if (newFailedAttempts >= 3) {
      setIsLocked(true);
      
      const timer = window.setTimeout(() => {
        setIsLocked(false);
        setFailedAttempts(0);
      }, 30000);
      
      setLockoutTimer(timer);
    }
  };

  useEffect(() => {
    return () => {
      if (lockoutTimer) {
        clearTimeout(lockoutTimer);
      }
    };
  }, [lockoutTimer]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const emailError = validateField('email', formState.email);
    const passwordError = validateField('password', formState.password);
    
    setValidationErrors({
      email: emailError,
      password: passwordError
    });
    
    if (emailError || passwordError) {
      return;
    }
    
    if (formState.password === 'wrong') {
      simulateFailedLogin();
      return;
    }
    
    onSubmit(e);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Mail className="h-4 w-4 text-gray-400" />
          </div>
          <Input 
            id="email"
            type="email" 
            placeholder="coach@example.com" 
            value={formState.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            required
            className="pl-10"
          />
        </div>
        {validationErrors.email && (
          <p className="text-sm text-red-500 flex items-center mt-1">
            <AlertCircle className="h-3 w-3 mr-1" />
            {validationErrors.email}
          </p>
        )}
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="password">Password</Label>
          <Button 
            type="button" 
            variant="link" 
            className="p-0 h-auto text-sm"
            onClick={onForgotPasswordClick}
          >
            Forgot password?
          </Button>
        </div>
        <PasswordInput 
          value={formState.password}
          onChange={(value) => handleInputChange('password', value)}
        />
        {validationErrors.password && (
          <p className="text-sm text-red-500 flex items-center mt-1">
            <AlertCircle className="h-3 w-3 mr-1" />
            {validationErrors.password}
          </p>
        )}
      </div>
      
      <div className="flex items-center space-x-2">
        <Checkbox 
          id="remember-me" 
          checked={formState.rememberMe} 
          onCheckedChange={(checked) => updateFormState('rememberMe', checked === true)}
        />
        <Label htmlFor="remember-me" className="cursor-pointer text-sm">
          Remember me
        </Label>
      </div>
      
      {isLocked && (
        <div className="p-3 rounded-md bg-red-50 border border-red-200 text-red-500 text-sm flex items-center">
          <AlertCircle className="h-4 w-4 mr-2" />
          Account temporarily locked due to too many failed attempts. Please try again later.
        </div>
      )}
      
      <Button 
        type="submit" 
        className="w-full" 
        disabled={isLoading || isLocked}
      >
        {isLoading ? (
          <span className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Logging in...
          </span>
        ) : (
          <span className="flex items-center justify-center">
            <LogIn className="mr-2 h-4 w-4" />
            Login
          </span>
        )}
      </Button>
      
      <SocialLoginButtons />
    </form>
  );
}
