import { Component, OnInit } from '@angular/core';
import { AuthService } from './auth/auth-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title: string = 'meanproject';

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.authService.getAuthenticatedSub().subscribe(isAuthenticated => {
      if (isAuthenticated) {
        this.router.navigate(['/post-list']);
      } else {
        this.router.navigate(['/login']);
      }
    });
    this.authService.authenticateFromLocalStorage();
  }
}