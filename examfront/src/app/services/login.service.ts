import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { JwtRequest } from '../model/JwtRequest';
import { JwtResponse } from '../model/JwtResponse';
import { User } from '../model/User';

/**
 * Service for handling user authentication and session management.
 * Provides methods for login, logout, token management, and user retrieval.
 */
@Injectable({
  providedIn: 'root'
})
export class LoginService {

  /**
   * Subject to hold the current user state.
   */
  private userSubject = new BehaviorSubject<User | null>(this.getUser());

  /**
   * Observable for subscribing to user state changes.
   */
  public user$: Observable<User | null> = this.userSubject.asObservable();

  /**
   * Creates an instance of LoginService.
   * @param http Angular HttpClient for API requests.
   * @param router Angular Router for navigation.
   */
  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  /**
   * Sends login credentials to the backend to generate a JWT token.
   * @param loginData User credentials.
   * @returns Observable emitting JwtResponse.
   */
  public generateToken(loginData: JwtRequest): Observable<JwtResponse>  {
    return this.http.post<JwtResponse>(`${environment.apiUrl}/generate-token`, loginData);
  }

  /**
   * Stores the JWT token in localStorage.
   * @param token JWT token string.
   * @returns True if token is stored.
   */
  public loginUser(token): boolean {
    localStorage.setItem("token", token);
    return true;
  }

  /**
   * Checks if the user is currently logged in.
   * @returns True if token exists, false otherwise.
   */
  public isLoggedIn(): boolean {
    let tokenStr = localStorage.getItem("token");
    if (tokenStr == undefined || tokenStr == '' || tokenStr == null) {
      return false;
    } else {
      return true;
    }
  }

  /**
   * Retrieves the JWT token from localStorage.
   * @returns JWT token string.
   */
  public getToken(): string {
    return localStorage.getItem("token");
  }

  /**
   * Stores the user object in localStorage and updates the user subject.
   * @param user User object.
   */
  public setUser(user: User): void {
    localStorage.setItem("user", JSON.stringify(user));
    this.userSubject.next(user); 
  }

  /**
   * Logs out the user by removing token and user from localStorage,
   * updates the user subject, and navigates to the login page.
   */
  public logout(): void {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    this.userSubject.next(null); 
    this.router.navigate(['/login']);
  }

  /**
   * Retrieves the user object from localStorage.
   * @returns User object or null if not found.
   */
  public getUser(): User | null {
    let userStr = localStorage.getItem("user");
    if (userStr != null) {
      return JSON.parse(userStr);
    } else {
      return null; 
    }
  }

  /**
   * Gets the role of the current user.
   * @returns Role string.
   */
  public getUserRole(): string | null {
    const user = this.getUser();
    if (user && user.authorities && user.authorities.length > 0) {
      return user.authorities[0].authority;
    }
    return null;
  }

  /**
   * Fetches the current user from the backend.
   * @returns Observable emitting User object.
   */
  public getCurrentUser(): Observable<User> {
    return this.http.get<User>(`${environment.apiUrl}/current-user`);
  }
}