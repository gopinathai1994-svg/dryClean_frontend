import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface AdminProfile {
  email: string;
  role: string;
}

interface LoginResponse {
  token: string;
  admin: AdminProfile;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly tokenKey = 'tl_admin_token';
  private readonly adminKey = 'tl_admin_profile';

  constructor(private readonly http: HttpClient) {}

  login(email: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${environment.apiUrl}/auth/login`, { email, password }).pipe(
      tap((response) => this.saveSession(response)),
    );
  }

  profile(): Observable<AdminProfile> {
    return this.http.get<AdminProfile>(`${environment.apiUrl}/auth/profile`).pipe(
      tap((admin) => this.saveAdmin(admin)),
    );
  }

  updateEmail(email: string): Observable<LoginResponse> {
    return this.http.patch<LoginResponse>(`${environment.apiUrl}/auth/profile/email`, { email }).pipe(
      tap((response) => this.saveSession(response)),
    );
  }

  updatePassword(currentPassword: string, password: string): Observable<AdminProfile> {
    return this.http.patch<AdminProfile>(`${environment.apiUrl}/auth/profile/password`, {
      currentPassword,
      password,
    }).pipe(tap((admin) => this.saveAdmin(admin)));
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.adminKey);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  currentAdmin(): AdminProfile | null {
    const value = localStorage.getItem(this.adminKey);
    if (!value) {
      return null;
    }

    try {
      return JSON.parse(value) as AdminProfile;
    } catch {
      return null;
    }
  }

  private saveSession(response: LoginResponse): void {
    localStorage.setItem(this.tokenKey, response.token);
    this.saveAdmin(response.admin);
  }

  private saveAdmin(admin: AdminProfile): void {
    localStorage.setItem(this.adminKey, JSON.stringify(admin));
  }
}
