export type UserRole = 'COACH' | 'CLIENT' | 'ADMIN';

export interface AuthFormState {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  rememberMe: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupCredentials {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: UserRole;
}

export interface AuthUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
    lastActive?: string; // <-- add this line

}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: AuthUser;
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