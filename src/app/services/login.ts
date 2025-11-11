import { Injectable } from '@angular/core';
import { User, AuthResponse } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly USERS_KEY = 'recipe_app_users';
  private readonly CURRENT_USER_KEY = 'current_user';

  constructor() {}

  // Register new user
  register(email: string, password: string, name: string): AuthResponse {
    // Validate inputs
    if (!email || !password || !name) {
      return { success: false, message: 'All fields are required' };
    }

    // Validate email format
    if (!this.isValidEmail(email)) {
      return { success: false, message: 'Please enter a valid email address' };
    }

    // Validate password length
    if (password.length < 6) {
      return { success: false, message: 'Password must be at least 6 characters long' };
    }

    const users = this.getUsers();
    
    // Check if user already exists
    if (users.find(user => user.email === email)) {
      return { success: false, message: 'User with this email already exists' };
    }

    // Create new user
    const newUser: User = {
      id: this.generateId(),
      email,
      name,
      createdAt: new Date().toISOString()
    };

    // Store user
    users.push(newUser);
    localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
    
    // Auto-login after registration
    this.setCurrentUser(newUser);

    return { 
      success: true, 
      message: 'Registration successful!',
      user: newUser
    };
  }

  // Login user
  login(email: string, password: string): AuthResponse {
    // Validate inputs
    if (!email || !password) {
      return { success: false, message: 'Email and password are required' };
    }

    const users = this.getUsers();
    const user = users.find(u => u.email === email);

    if (!user) {
      return { success: false, message: 'Invalid email or password' };
    }

   
    const demoPassword = 'password123'; 
    
    if (password !== demoPassword) {
      return { success: false, message: 'Invalid email or password' };
    }

    this.setCurrentUser(user);
    return { 
      success: true, 
      message: 'Login successful!',
      user 
    };
  }

  // Logout user
  logout(): void {
    localStorage.removeItem(this.CURRENT_USER_KEY);
  }

  // Get current user
  getCurrentUser(): User | null {
    const userStr = localStorage.getItem(this.CURRENT_USER_KEY);
    return userStr ? JSON.parse(userStr) : null;
  }

  // Check if user is logged in
  isLoggedIn(): boolean {
    return this.getCurrentUser() !== null;
  }

  // Private helper methods
  private getUsers(): User[] {
    const usersStr = localStorage.getItem(this.USERS_KEY);
    return usersStr ? JSON.parse(usersStr) : [];
  }

  private setCurrentUser(user: User): void {
    localStorage.setItem(this.CURRENT_USER_KEY, JSON.stringify(user));
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}