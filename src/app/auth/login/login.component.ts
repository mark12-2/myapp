import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth-service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  loginError: string | null = null;
  
  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.loginForm = new FormGroup({
      'username': new FormControl('', [Validators.required]),
      'password': new FormControl('', [Validators.required])
    });
  }

  onSubmit() {
    if (!this.loginForm.valid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const username = this.loginForm.get('username')?.value?? '';
    const password = this.loginForm.get('password')?.value?? '';
    this.authService.loginUser(username, password).subscribe(
      response => {
        console.log('Login response:', response); 
        this.authService.storeToken(response.token);
        this.authService.initializeAuthState(); 
        this.router.navigate(['/post-list']); 
        this.loginError = null; 
      },
      error => {
        console.error('Login failed:', error); 
        this.loginError = 'Login failed. Please try again.';
      }
    );
  }
}