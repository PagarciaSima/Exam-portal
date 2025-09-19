import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtRequest } from '../model/JwtRequest';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { JwtResponse } from '../model/JwtResponse';
import { Router } from '@angular/router';
import { User } from '../model/User';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

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

  public logout(): void {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    this.router.navigate(['/login']);
  }

  public getToken(): string {
    return localStorage.getItem("token");
  }

  public setUser(user): void {
    localStorage.setItem("user", JSON.stringify(user))
  }

  public getUSer(): User | null {
    let userStr = localStorage.getItem("user");
    if (userStr != null) {
      return JSON.parse(userStr);
    } else {
      this.logout();
      return null
    }
  }

  public getUserRole() {
    let user = this.getUSer();
    return user.authorities[0].authority;
  }
}
