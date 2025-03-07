
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { LogIn } from 'lucide-react';
import { toast } from 'sonner';
import { UserRole } from './types';

interface LoginFormProps {
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
  role: UserRole;
  setRole: (role: UserRole) => void;
  rememberMe: boolean;
  setRememberMe: (rememberMe: boolean) => void;
  isLoading: boolean;
  onForgotPasswordClick: () => void;
}

export default function LoginForm({
  email,
  setEmail,
  password,
  setPassword,
  role,
  setRole,
  rememberMe,
  setRememberMe,
  isLoading,
  onForgotPasswordClick,
}: LoginFormProps) {
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // In a real app, this would call an authentication API
      // For this demo, we'll simulate authentication
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Store user info in localStorage or sessionStorage based on rememberMe
      const userData = {
        email,
        role,
        isAuthenticated: true
      };
      
      if (rememberMe) {
        localStorage.setItem('user', JSON.stringify(userData));
      } else {
        sessionStorage.setItem('user', JSON.stringify(userData));
        // Clear any existing localStorage to prevent conflicts
        localStorage.removeItem('user');
      }
      
      // Show success toast
      toast.success('Logged in successfully!');
      
      // Redirect based on role
      if (role === 'coach') {
        navigate('/dashboard');
      } else {
        navigate('/client-app');
      }
    } catch (error) {
      toast.error('Authentication failed. Please try again.');
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input 
          id="email"
          type="email" 
          placeholder="coach@example.com" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input 
          id="password"
          type="password" 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <div className="text-right">
          <Button 
            type="button" 
            variant="link" 
            className="p-0 h-auto text-sm"
            onClick={onForgotPasswordClick}
          >
            Forgot password?
          </Button>
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="role">I am a:</Label>
        <div className="flex gap-4">
          <div className="flex items-center space-x-2">
            <input 
              type="radio" 
              id="coach-role" 
              name="role" 
              value="coach"
              checked={role === 'coach'}
              onChange={() => setRole('coach')}
              className="h-4 w-4 text-primary"
            />
            <Label htmlFor="coach-role" className="cursor-pointer">Coach</Label>
          </div>
          <div className="flex items-center space-x-2">
            <input 
              type="radio" 
              id="client-role" 
              name="role" 
              value="client"
              checked={role === 'client'}
              onChange={() => setRole('client')}
              className="h-4 w-4 text-primary"
            />
            <Label htmlFor="client-role" className="cursor-pointer">Client</Label>
          </div>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox 
          id="remember-me" 
          checked={rememberMe} 
          onCheckedChange={(checked) => setRememberMe(checked === true)}
        />
        <Label htmlFor="remember-me" className="cursor-pointer text-sm">
          Remember me
        </Label>
      </div>
      <Button 
        type="submit" 
        className="w-full" 
        disabled={isLoading}
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
    </form>
  );
}
