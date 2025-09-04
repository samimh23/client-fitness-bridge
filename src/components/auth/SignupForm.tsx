import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { UserPlus, Mail, User, AlertCircle } from 'lucide-react';
import PasswordInput from './PasswordInput';
import PasswordStrengthMeter from './PasswordStrengthMeter';
import SocialLoginButtons from './SocialLoginButtons';
import { SignupFormProps } from './types';

export default function SignupForm({
  formState,
  updateFormState,
  isLoading,
  onSubmit
}: SignupFormProps) {
  const [name, setName] = useState('');
  const [validationErrors, setValidationErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
  }>({});
  
  // Handle form validation
  const validateField = (field: string, value: string) => {
    if (field === 'name') {
      if (!value) {
        return 'Name is required';
      }
    } else if (field === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!value) {
        return 'Email is required';
      } else if (!emailRegex.test(value)) {
        return 'Please enter a valid email address';
      }
    } else if (field === 'password') {
      if (!value) {
        return 'Password is required';
      } else if (value.length < 8) {
        return 'Password must be at least 8 characters';
      }
    }
    return '';
  };

  const handleInputChange = (field: 'name' | 'email' | 'password', value: string) => {
    if (field === 'name') {
      setName(value);
    } else {
      updateFormState(field as any, value);
    }
    
    // Validate on change
    const error = validateField(field, value);
    setValidationErrors(prev => ({
      ...prev,
      [field]: error
    }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate all fields before submission
    const nameError = validateField('name', name);
    const emailError = validateField('email', formState.email);
    const passwordError = validateField('password', formState.password);
    
    setValidationErrors({
      name: nameError,
      email: emailError,
      password: passwordError
    });
    
    // If there are validation errors, don't submit
    if (nameError || emailError || passwordError) {
      return;
    }
    
    // Otherwise submit normally
    onSubmit(e, name);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Full Name</Label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <User className="h-4 w-4 text-gray-400" />
          </div>
          <Input 
            id="name" 
            type="text" 
            placeholder="John Doe" 
            value={name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            required
            className="pl-10"
          />
        </div>
        {validationErrors.name && (
          <p className="text-sm text-red-500 flex items-center mt-1">
            <AlertCircle className="h-3 w-3 mr-1" />
            {validationErrors.name}
          </p>
        )}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="signup-email">Email</Label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Mail className="h-4 w-4 text-gray-400" />
          </div>
          <Input 
            id="signup-email" 
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
        <Label htmlFor="signup-password">Password</Label>
        <PasswordInput 
          id="signup-password"
          value={formState.password}
          onChange={(value) => handleInputChange('password', value)}
        />
        <PasswordStrengthMeter password={formState.password} />
        {validationErrors.password && (
          <p className="text-sm text-red-500 flex items-center mt-1">
            <AlertCircle className="h-3 w-3 mr-1" />
            {validationErrors.password}
          </p>
        )}
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
              checked={formState.role === 'coach'}
              onChange={() => updateFormState('role', 'coach')}
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
              checked={formState.role === 'client'}
              onChange={() => updateFormState('role', 'client')}
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
            Creating account...
          </span>
        ) : (
          <span className="flex items-center justify-center">
            <UserPlus className="mr-2 h-4 w-4" />
            Sign Up
          </span>
        )}
      </Button>
      
      <SocialLoginButtons />
    </form>
  );
}
