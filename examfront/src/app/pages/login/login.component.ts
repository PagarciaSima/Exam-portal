import { animate, style, transition, trigger } from '@angular/animations';
import { ChangeDetectorRef, Component, NgZone, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { JwtRequest } from 'src/app/model/JwtRequest';
import { JwtResponse } from 'src/app/model/JwtResponse';
import { User } from 'src/app/model/User';
import { LoginService } from 'src/app/services/login.service';
import { NotificationService } from 'src/app/services/notification.service';
import { fadeInUp } from 'src/app/animations/animations';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  animations: [
    fadeInUp
  ]
})
export class LoginComponent implements OnInit {

  loginData: JwtRequest = {
    username: '',
    password: ''
  }
  
  constructor(
    private loginService: LoginService,
    private notificationService: NotificationService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    
  }

  formSubmit() {
    this.loginService.generateToken(this.loginData).subscribe({
      next: (jwtResponse: JwtResponse) => {
        this.notificationService.success('Login successful');
        this.loginService.loginUser(jwtResponse.token);
        
        this.loginService.getCurrentUser().subscribe({
          next: (user: User) => {
            this.loginService.setUser(user);
            this.redirectUser(user);
          },
          error: (err) => this.handleLoginError(err)
        });
      },
      error: (err) => this.handleLoginError(err)
    });
  }

  private redirectUser(user: User) {
    const authorities = (user.authorities?.map(a => a.authority).filter(Boolean)) || [];

    if (authorities.includes("ADMIN")) {
      this.router.navigate(['admin']);
    } else if (authorities.includes("NORMAL")) {
      this.router.navigate(['user-dashboard']);
    } else {
      this.loginService.logout();
    }
  }

  private handleLoginError(err: any) {
    let errorMessage = 'Login failed. Please try again.';
    if (err.status === 401) {
      errorMessage = err.error?.error || 'Invalid credentials';
    }
    this.notificationService.error(errorMessage);
    this.loginData.password = '';
  }
}
