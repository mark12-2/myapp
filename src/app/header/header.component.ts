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

    constructor(private authService: AuthService) { }

    ngOnDestroy(): void {
        this.authenticationSub.unsubscribe();
      }
    
      ngOnInit(): void {
        this.userAuthenticated = this.authService.getIsAuthenticated();
        this.authenticationSub = this.authService.getAuthenticatedSub().subscribe(status => {
          this.userAuthenticated = status;
        })
      }
    
    
        logout() {
            this.authService.logout();
        }
}