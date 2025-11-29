import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { 
  IonHeader, 
  IonToolbar, 
  IonTitle, 
  IonContent, 
  
  IonItem, 
  
  IonInput, 
  IonButton,
  IonIcon,
  
  IonSpinner
} from '@ionic/angular/standalone';
import { AuthService } from '../services/login';
// import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule,
    IonHeader, 
    IonToolbar, 
    IonTitle, 
    IonContent, 
 
    IonItem, 
     
    IonInput, 
    IonButton,
    IonIcon,
    IonSpinner
  ]
})
export class AuthPage implements OnInit {
  isLogin: boolean = true;
  email: string = '';
  password: string = '';
  name: string = '';
  isLoading: boolean = false;
  errorMessage: string = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    // Check if user is already logged in
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/home']);
    }
  }

  toggleMode() {
    this.isLogin = !this.isLogin;
    this.clearForm();
    this.errorMessage = '';
  }

  async submit() {
    if (!this.email || !this.password || (!this.isLogin && !this.name)) {
      this.errorMessage = 'Please fill in all fields';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    // Simulate API call delay
    setTimeout(() => {
      let result;
      
      if (this.isLogin) {
        result = this.authService.login(this.email, this.password);
      } else {
        result = this.authService.register(this.email, this.password, this.name);
      }

      this.isLoading = false;

      if (result.success) {
        this.router.navigate(['/home']);
      } else {
        this.errorMessage = result.message;
      }
    }, 1000);
  }

  private clearForm() {
    this.email = '';
    this.password = '';
    this.name = '';
    this.errorMessage = '';
  }

  get submitButtonText(): string {
    return this.isLoading ? 'Please wait...' : (this.isLogin ? 'Sign In' : 'Create Account');
  }

  get toggleModeText(): string {
    return this.isLogin ? "Don't have an account? Sign Up" : 'Already have an account? Sign In';
  }

  get title(): string {
    return this.isLogin ? 'Welcome Back' : 'Create Account';
  }

  get subtitle(): string {
    return this.isLogin ? 'Sign in to your account' : 'Join our recipe community';
  }

  // Add these methods to the AuthPage class
setFocus(event: any) {
  const item = event.target.closest('ion-item');
  item.classList.add('focused');
}

setBlur(event: any) {
  const item = event.target.closest('ion-item');
  item.classList.remove('focused');
}

}