// Simple mock authentication service
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupCredentials {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: 'COACH' | 'CLIENT' | 'ADMIN';
}

export interface AuthUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'COACH' | 'CLIENT' | 'ADMIN';
  lastActive?: string;
}

export interface AuthResponse {
  user: AuthUser;
  accessToken: string;
}

// Mock users database
const mockUsers: AuthUser[] = [
  {
    id: '1',
    email: 'coach@example.com',
    firstName: 'John',
    lastName: 'Coach',  
    role: 'COACH'
  },
  {
    id: '2',
    email: 'client@example.com', 
    firstName: 'Jane',
    lastName: 'Client',
    role: 'CLIENT'
  },
  {
    id: '3',
    email: 'admin@example.com',
    firstName: 'Admin',
    lastName: 'User',
    role: 'ADMIN'
  }
];

export class AuthService {
  static async login(credentials: LoginCredentials): Promise<AuthResponse> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Find user by email
    const user = mockUsers.find(u => u.email === credentials.email);
    
    if (!user) {
      throw new Error('User not found');
    }
    
    // For demo purposes, accept any password except 'wrong'
    if (credentials.password === 'wrong') {
      throw new Error('Invalid password');
    }
    
    // Generate mock JWT token
    const token = `mock-jwt-token-${user.id}-${Date.now()}`;
    
    return {
      user: {
        ...user,
        lastActive: new Date().toISOString()
      },
      accessToken: token
    };
  }

  static async signup(credentials: SignupCredentials): Promise<void> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Check if user already exists
    const existingUser = mockUsers.find(u => u.email === credentials.email);
    if (existingUser) {
      throw new Error('User already exists');
    }
    
    // Add new user to mock database
    const newUser: AuthUser = {
      id: `user-${Date.now()}`,
      email: credentials.email,
      firstName: credentials.firstName,
      lastName: credentials.lastName,
      role: credentials.role
    };
    
    mockUsers.push(newUser);
  }

  static async validateToken(): Promise<boolean> {
    // For mock purposes, always return true if token exists
    const token = this.getToken();
    return !!token;
  }

  static saveToken(token: string, rememberMe = false): void {
    if (rememberMe) {
      localStorage.setItem('auth_token', token);
    } else {
      sessionStorage.setItem('auth_token', token);
    }
  }

  static getToken(): string | null {
    return localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
  }

  static saveUser(user: AuthUser, rememberMe = false): void {
    const userData = JSON.stringify(user);
    if (rememberMe) {
      localStorage.setItem('user', userData);
    } else {
      sessionStorage.setItem('user', userData);
    }
  }

  static getUser(): AuthUser | null {
    const userData = localStorage.getItem('user') || sessionStorage.getItem('user');
    return userData ? JSON.parse(userData) : null;
  }

  static logout(): void {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    sessionStorage.removeItem('auth_token');
    sessionStorage.removeItem('user');
  }

  static isTokenExpired(token: string): boolean {
    // For mock purposes, tokens never expire
    return false;
  }
}