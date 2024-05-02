import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth-service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm!: FormGroup;
  
   constructor (private authService: AuthService, private router: Router) {}
 
   ngOnInit(): void {
     this.loginForm = new FormGroup({
       'username': new FormControl('', [Validators.required]),
       'password': new FormControl('', [Validators.required])
     })
   }
 
   onSubmit(){
    console.log('onSubmit called');
    this.authService.loginUser(this.loginForm.value.username, this.loginForm.value.password)
    this.router.navigate(['/post-list']);
   }
}
