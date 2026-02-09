import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export interface RegistrationRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface RegistrationResponse {
  success: boolean;
  message: string;
  userId?: string;
  token?: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'https://api.example.com/api/auth'; // Replace with your API endpoint

  constructor(private http: HttpClient) { }

  register(userData: RegistrationRequest): Observable<RegistrationResponse> {
    return this.http.post<RegistrationResponse>(`${this.apiUrl}/register`, userData)
      .pipe(
        catchError(error => {
          console.error('Registration error:', error);
          return throwError(() => new Error(error.error?.message || 'Registration failed'));
        })
      );
  }

  checkEmailExists(email: string): Observable<{ exists: boolean }> {
    return this.http.get<{ exists: boolean }>(`${this.apiUrl}/check-email/${email}`)
      .pipe(
        catchError(error => {
          console.error('Email check error:', error);
          return throwError(() => new Error('Unable to check email availability'));
        })
      );
  }
}