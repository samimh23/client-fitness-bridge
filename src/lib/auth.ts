const API_BASE_URL = 'http://localhost:3000/api'; // Replace with your backend URL

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupCredentials {
  name: string;
  email: string;
  password: string;
  role: 'coach' | 'client' | 'admin';
}

export interface AuthResponse {
  access_token: string;
  user: {
    id: string;
    email: string;
    name: string;
    role: 'coach' | 'client' | 'admin';
  };
}

export class AuthService {
  private static getAuthHeaders() {
    const token = this.getToken();
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    };
  }

  static async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Login failed');
    }

    return response.json();
  }

  static async signup(credentials: SignupCredentials): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Signup failed');
    }

    return response.json();
  }

  static async validateToken(): Promise<boolean> {
    const token = this.getToken();
    if (!token) return false;

    try {
      const response = await fetch(`${API_BASE_URL}/auth/profile`, {
        headers: this.getAuthHeaders(),
      });
      
      return response.ok;
    } catch (error) {
      console.error('Token validation failed:', error);
      return false;
    }
  }

  static saveToken(token: string, rememberMe: boolean = false): void {
    if (rememberMe) {
      localStorage.setItem('auth_token', token);
      sessionStorage.removeItem('auth_token');
    } else {
      sessionStorage.setItem('auth_token', token);
      localStorage.removeItem('auth_token');
    }
  }

  static getToken(): string | null {
    return localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
  }

  static saveUser(user: any, rememberMe: boolean = false): void {
    const userData = {
      ...user,
      isAuthenticated: true,
      lastActive: new Date().toISOString(),
    };

    if (rememberMe) {
      localStorage.setItem('user', JSON.stringify(userData));
      sessionStorage.removeItem('user');
    } else {
      sessionStorage.setItem('user', JSON.stringify(userData));
      localStorage.removeItem('user');
    }
  }

  static getUser(): any | null {
    const localUserJson = localStorage.getItem('user');
    const sessionUserJson = sessionStorage.getItem('user');
    const userJson = localUserJson || sessionUserJson;
    
    if (!userJson) return null;
    
    try {
      return JSON.parse(userJson);
    } catch (error) {
      console.error('Error parsing user data:', error);
      return null;
    }
  }

  static logout(): void {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    sessionStorage.removeItem('auth_token');
    sessionStorage.removeItem('user');
  }

  static isTokenExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Date.now() / 1000;
      return payload.exp < currentTime;
    } catch (error) {
      return true;
    }
  }
}