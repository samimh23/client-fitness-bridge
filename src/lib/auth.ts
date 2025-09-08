import { AuthResponse, AuthUser, LoginCredentials, SignupCredentials } from '@/components/auth/types';

const API_BASE_URL = 'http://localhost:3001'; // Replace with your backend URL

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
      credentials: 'include', // ADD THIS - crucial for receiving cookies
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Login failed');
    }

    return response.json();
  }

  static async signup(credentials: SignupCredentials): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // ADD THIS - for consistency
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
        credentials: 'include', // ADD THIS - for sending cookies
      });
      return response.ok;
    } catch (error) {
      console.error('Token validation failed:', error);
      return false;
    }
  }

  // Add a method to refresh tokens using the cookie
  static async refreshToken(): Promise<string | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // This will send the refresh token cookie
      });

      if (!response.ok) {
        throw new Error('Token refresh failed');
      }

      const data = await response.json();
      return data.accessToken;
    } catch (error) {
      console.error('Token refresh failed:', error);
      return null;
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

  static saveUser(user: AuthUser, rememberMe: boolean = false): void {
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

  static getUser(): AuthUser | null {
    const localUserJson = localStorage.getItem('user');
    const sessionUserJson = sessionStorage.getItem('user');
    const userJson = localUserJson || sessionUserJson;

    if (!userJson) return null;

    try {
      return JSON.parse(userJson) as AuthUser;
    } catch (error) {
      console.error('Error parsing user data:', error);
      return null;
    }
  }

  static async logout(): Promise<void> {
    const token = this.getToken();
    
    try {
      const response = await fetch(`${API_BASE_URL}/auth/logout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        },
        credentials: 'include', // This is correct - sends the refresh token cookie
      });

      if (!response.ok) {
        throw new Error('Logout failed');
      }
    } catch (err) {
      console.error('Logout API call failed:', err);
    } finally {
      // Always clear storage
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
      sessionStorage.removeItem('auth_token');
      sessionStorage.removeItem('user');
    }
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

  // Helper method to check if user needs to refresh token
  static async ensureValidToken(): Promise<string | null> {
    const currentToken = this.getToken();
    
    if (!currentToken) {
      // Try to refresh using cookie
      return await this.refreshToken();
    }
    
    if (this.isTokenExpired(currentToken)) {
      // Token expired, try to refresh
      const newToken = await this.refreshToken();
      if (newToken) {
        this.saveToken(newToken, !!localStorage.getItem('auth_token'));
        return newToken;
      }
      return null;
    }
    
    return currentToken;
  }
}