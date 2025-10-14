import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { fadeInUp } from 'src/app/animations/animations';
import { JwtRequest } from 'src/app/model/JwtRequest';
import { JwtResponse } from 'src/app/model/JwtResponse';
import { User } from 'src/app/model/User';
import { LoginService } from 'src/app/services/login.service';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  animations: [
    fadeInUp
  ]
})
/**
 * Component responsible for handling user login functionality.
 * 
 * - Manages login form data and submission.
 * - Interacts with `LoginService` to authenticate users and retrieve JWT tokens.
 * - Displays notifications using `NotificationService` for success or error events.
 * - Redirects users based on their roles (`ADMIN`, `NORMAL`) after successful login.
 * - Handles login errors and resets password field on failure.
 * 
 * @remarks
 * This component assumes that `LoginService` provides methods for token generation, user retrieval, and session management.
 * 
 * @example
 * ```html
 * <form (ngSubmit)="formSubmit()">
 *   <!-- form fields for username and password -->
 * </form>
 * ```
 */
export class LoginComponent implements OnInit {

  loginData: JwtRequest = {
    username: '',
    password: ''
  }
  
  constructor(
    private loginService: LoginService,
    private notificationService: NotificationService,
    private router: Router,
    private translate: TranslateService
  ) { }

  ngOnInit(): void {
    
  }

  /**
   * Handles the login form submission by generating a JWT token and authenticating the user.
   * 
   * - Calls `loginService.generateToken` with the provided login data.
   * - On successful token generation, displays a success notification and logs in the user.
   * - Fetches the current user details and sets the user in the login service.
   * - Redirects the user based on their role or other criteria.
   * - Handles errors during token generation or user retrieval by invoking `handleLoginError`.
   */
  formSubmit() {
    this.loginService.generateToken(this.loginData).subscribe({
      next: (jwtResponse: JwtResponse) => {
        this.notificationService.success(
          this.translate.instant('LOGIN_SUCCESS'),
          this.translate.instant('SUCCESS')
        );
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

  /**
   * Redirects the user to the appropriate route based on their authorities.
   *
   * - If the user has the "ADMIN" authority, navigates to the 'admin' route.
   * - If the user has the "NORMAL" authority, navigates to the 'user-dashboard' route.
   * - If the user has neither authority, logs the user out.
   *
   * @param user The user object containing authority information.
   */
  private redirectUser(user: User) {
    const authorities = (user.authorities?.map(a => a.authority).filter(Boolean)) || [];

    if (authorities.includes("ADMIN")) {
      this.router.navigate(['admin']);
    } else if (authorities.includes("NORMAL")) {
      this.router.navigate(['user-dashboard', 0]);
    } else {
      this.loginService.logout();
    }
  }

  /**
   * Handles errors that occur during the login process.
   * Displays an appropriate error notification to the user and clears the password field.
   *
   * @param err - The error object received from the failed login attempt.
   *   If the error status is 401, displays a specific message for invalid credentials.
   */
  private handleLoginError(err: any) {
    let errorMessage = this.translate.instant('LOGIN_FAILED');
    if (err.status === 401) {
      errorMessage = err.error?.error
        ? this.translate.instant('INVALID_CREDENTIALS')
        : this.translate.instant('INVALID_CREDENTIALS');
    }
    this.notificationService.error(
      errorMessage,
      this.translate.instant('ERROR')
    );
    this.loginData.password = '';
  }
}
