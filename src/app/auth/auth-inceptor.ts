import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpEventType } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Get the auth token from local storage
    const authToken = localStorage.getItem('token');

    // Clone the request to add the new header
    const clonedRequest = request.clone();

    // Add the Authorization header with the token
    if (authToken) {
      clonedRequest.headers.set('Authorization', `Bearer ${authToken}`);
    }

    // Pass the cloned request instead of the original request
    return next.handle(clonedRequest);
  }
}