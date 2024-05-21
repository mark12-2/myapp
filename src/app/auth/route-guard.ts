import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { Observable } from "rxjs";
import { AuthService } from "./auth-service";

@Injectable()
export class RouteGuard implements CanActivate{

    constructor(private authService: AuthService, private router: Router){}

        
    canActivate(
      next: ActivatedRouteSnapshot,
      state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      console.log('RouteGuard canActivate called');
      if (this.authService.getIsAuthenticated()) {
        console.log('User is authenticated');
        return true;
      } else {
        console.log('User is not authenticated');
        this.router.navigate(['/login']);
        return false;
      }
    }

}