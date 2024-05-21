import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { BehaviorSubject, Observable, Subject, catchError, map, of, tap, throwError } from "rxjs";
import { AuthModel } from "./auth-model";

interface LoginResponse {
    token: string;
    username: string;
  }
  

@Injectable({providedIn:"root"})
export class AuthService{

    private token: string;
    private authenticatedSub = new Subject<boolean>();
    private isAuthenticated = false;
    private logoutTimer: any;
    private apiUrl = 'http://localhost:3000';
    private handleError(error: HttpErrorResponse) {
        console.error('An error occurred:', error);
        return throwError('Something bad happened; please try again later.');
      }
    private loginCompletedSource = new BehaviorSubject<boolean>(false);
    public loginCompleted$ = this.loginCompletedSource.asObservable();

    completeLoginProcess() {
    this.loginCompletedSource.next(true);
    }
        

    getIsAuthenticated(){
        return this.isAuthenticated;
    }
    getAuthenticatedSub(){
        return this.authenticatedSub.asObservable();
    }
    
    initializeAuthState(): void {
        const token = this.getToken();
        if (token) {
            this.isAuthenticated = true;
            this.authenticatedSub.next(true);
        } else {
            this.isAuthenticated = false;
            this.authenticatedSub.next(false);
        }
    }
    storeToken(token: string): void {
        localStorage.setItem('authToken', token);
    }

    getToken(): string | null {
        return localStorage.getItem('authToken');
    }

    clearToken(): void {
        localStorage.removeItem('authToken');
    }

    
    constructor(private http: HttpClient, private router: Router){
        this.token = '';
        this.initializeAuthState(); 
    }

    
    signupUser(username: string, password: string): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/sign-up`, { username, password }, { responseType: 'json' })
            .pipe(catchError(this.handleError));
    }

   
    loginUser(username: string, password: string): Observable<LoginResponse> {
        const authData: AuthModel = {username: username, password: password};
    
        return this.http.post<LoginResponse>('http://localhost:3000/login/', authData)
          .pipe(
                tap(response => {
                    localStorage.setItem('username', response.username);
                }),
                catchError(this.handleError)
            );
    }

    logout(){
        this.token = '';
        this.isAuthenticated = false;
        this.authenticatedSub.next(false);
        this.router.navigate(['/']);
        this.clearLoginDetails();
    }

    storeLoginDetails(token: string){
        localStorage.setItem('token', token);
    }

    clearLoginDetails(){
        localStorage.removeItem('token');
        localStorage.removeItem('expiresIn');
    }

    getLocalStorageData(){
        const token = localStorage.getItem('token');
        const expiresIn = localStorage.getItem('expiresIn');

        if(!token || !expiresIn){
            return;
        }
        return {
            'token': token,
            'expiresIn': new Date(expiresIn)
        }
    }

    authenticateFromLocalStorage(): void {
        const localStorageData = this.getLocalStorageData();
        if (localStorageData) {
            const now = new Date();
            const expiresIn = localStorageData.expiresIn.getTime() - now.getTime();
    
            if (expiresIn > 0) {
                this.token = localStorageData.token;
                this.isAuthenticated = true;
                this.authenticatedSub.next(true);
            } else {
                this.clearLoginDetails();
                this.isAuthenticated = false;
                this.authenticatedSub.next(false);
            }
        } else {
            this.isAuthenticated = false;
            this.authenticatedSub.next(false);
        }
    }

    getLoggedInUserName(): string {
        return localStorage.getItem('username') || 'Guest';
        
      }
    
}