import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtRequest } from '../model/JwtRequest';
import { environment } from 'src/environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';
import { JwtResponse } from '../model/JwtResponse';
import { Router } from '@angular/router';
import { User } from '../model/User';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private userSubject = new BehaviorSubject<User | null>(this.getUser());
  public user$: Observable<User | null> = this.userSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  public generateToken(loginData: JwtRequest): Observable<JwtResponse>  {
    return this.http.post<JwtResponse>(`${environment.apiUrl}/generate-token`, loginData);
  }

  public loginUser(token): boolean {
    localStorage.setItem("token", token);
    return true;
  }

  public isLoggedIn(): boolean {
    let tokenStr = localStorage.getItem("token");
    if (tokenStr == undefined || tokenStr == '' || tokenStr == null) {
      return false;
    } else {
      return true;
    }
  }

  public getToken(): string {
    return localStorage.getItem("token");
  }

  public setUser(user: User): void {
    localStorage.setItem("user", JSON.stringify(user));
    this.userSubject.next(user); 
  }

  public logout(): void {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    this.userSubject.next(null); 
    this.router.navigate(['/login']);
  }

public getUser(): User | null {
  let userStr = localStorage.getItem("user");
  if (userStr != null) {
    return JSON.parse(userStr);
  } else {
    return null; 
  }
}

  public getUserRole(): string {
    let user = this.getUser();
    return user.authorities[0].authority;
  }

  public getCurrentUser(): Observable<User> {
    return this.http.get<User>(`${environment.apiUrl}/current-user`);
  }
}
