import { Component } from "@angular/core";
import { AuthService } from "../auth/auth-service";
import { Subscription } from "rxjs";

@Component({
    selector:'app-header',
    templateUrl:'./header.component.html',
    styleUrls: ['./header.component.css'],
})

export class HeaderComponent {

    private authenticationSub!: Subscription;
    userAuthenticated = false;
    loggedInUserName?: string;

    constructor(private authService: AuthService) {  }
    
    ngOnInit(): void {
      this.userAuthenticated = this.authService.getIsAuthenticated();
      this.authenticationSub = this.authService.getAuthenticatedSub().subscribe(status => {
        this.userAuthenticated = status;
        if (status) {
          this.loggedInUserName = this.authService.getLoggedInUserName();
        } else {
          this.loggedInUserName = undefined; 
        }
      });
    }

      ngOnDestroy(): void {
        this.authenticationSub.unsubscribe();
      }
    
        logout() {
            this.authService.logout();
        }
}