import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  registerForm = this.fb.group({
    username: ['', Validators.required],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });
  existingUsernames: string[] = ['mmmm', 'bbbb', 'nnnn']; 
  errorMessage: string = ''; 

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {}

  onSubmit() {
    const username = this.registerForm.get('username')?.value ?? '';
    const password = this.registerForm.get('password')?.value ?? '';

    if (this.existingUsernames.includes(username)) {
      // Username already exists, display an error message
      this.errorMessage = 'Username already exists. Please choose a different one.';
      return;
    }

    this.authService.signupUser(username, password).subscribe(
      response => {
          console.log('Registration successful');
          this.router.navigate(['/login']);
      },
      error => {
          console.error('Registration failed:', error);
          this.errorMessage = 'Registration failed. Please try again.';
      }
  );
  
  }

  onRegister(username: string, password: string) {
    this.authService.signupUser(username, password).subscribe(
      response => {
        console.log('Registration successful:', response);
      },
      error => {
        console.error('Registration failed:', error);
      }
    );
 }

}
