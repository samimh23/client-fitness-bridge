
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { UserPlus } from 'lucide-react';
import { toast } from 'sonner';
import { UserRole } from './types';

interface SignupFormProps {
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
  role: UserRole;
  setRole: (role: UserRole) => void;
  isLoading: boolean;
}

export default function SignupForm({
  email,
  setEmail,
  password,
  setPassword,
  role,
  setRole,
  isLoading,
}: SignupFormProps) {
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // In a real app, this would call an authentication API
      // For this demo, we'll simulate authentication
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Store user info in sessionStorage
      const userData = {
        email,
        role,
        isAuthenticated: true
      };
      
      sessionStorage.setItem('user', JSON.stringify(userData));
      
      // Show success toast
      toast.success('Signed up successfully!');
      
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
        <Label htmlFor="signup-email">Email</Label>
        <Input 
          id="signup-email"
          type="email" 
          placeholder="coach@example.com" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="signup-password">Password</Label>
        <Input 
          id="signup-password"
          type="password" 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="role">I am a:</Label>
        <div className="flex gap-4">
          <div className="flex items-center space-x-2">
            <input 
              type="radio" 
              id="signup-coach-role" 
              name="role" 
              value="coach"
              checked={role === 'coach'}
              onChange={() => setRole('coach')}
              className="h-4 w-4 text-primary"
            />
            <Label htmlFor="signup-coach-role" className="cursor-pointer">Coach</Label>
          </div>
          <div className="flex items-center space-x-2">
            <input 
              type="radio" 
              id="signup-client-role" 
              name="role" 
              value="client"
              checked={role === 'client'}
              onChange={() => setRole('client')}
              className="h-4 w-4 text-primary"
            />
            <Label htmlFor="signup-client-role" className="cursor-pointer">Client</Label>
          </div>
        </div>
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
            Signing up...
          </span>
        ) : (
          <span className="flex items-center justify-center">
            <UserPlus className="mr-2 h-4 w-4" />
            Sign Up
          </span>
        )}
      </Button>
    </form>
  );
}
