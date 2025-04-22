
export type UserRole = 'coach' | 'client' | 'admin';

export interface AuthFormState {
  email: string;
  password: string;
  role: UserRole;
  rememberMe: boolean;
  name?: string; // Added name property as optional
}

export interface LoginFormProps {
  formState: AuthFormState;
  updateFormState: (field: keyof AuthFormState, value: any) => void;
  isLoading: boolean;
  onForgotPasswordClick: () => void;
  onSubmit: (e: React.FormEvent) => void;
}

export interface SignupFormProps {
  formState: AuthFormState;
  updateFormState: (field: keyof AuthFormState, value: any) => void;
  isLoading: boolean;
  onSubmit: (e: React.FormEvent) => void;
}
