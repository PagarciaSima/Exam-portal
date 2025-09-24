import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { fadeInUp } from 'src/app/animations/animations';
import { User } from 'src/app/model/User';
import { NotificationService } from 'src/app/services/notification.service';
import { UserService } from 'src/app/services/user.service';

/**
 * Component responsible for user signup functionality.
 * Handles user registration form submission, input validation, and notification feedback.
 *
 * @remarks
 * Utilizes fadeInUp animation for UI transitions.
 *
 * @property {string} repeatPassword - Stores the repeated password for confirmation.
 * @property {User} user - Holds the user registration data.
 *
 * @constructor
 * @param {UserService} userService - Service for user-related API operations.
 * @param {NotificationService} notificationService - Service for displaying notifications.
 * @param {Router} router - Angular router for navigation.
 *
 * @method ngOnInit - Lifecycle hook called on component initialization.
 * @method formSubmit - Handles form submission, validates input, sends registration request, and manages notifications.
 */
@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
  animations: [
      fadeInUp
  ]
})
export class SignupComponent implements OnInit {
  public repeatPassword: string = '';

  public user: User = {
    password: '',
    username: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
  }

  constructor(
    private userService: UserService,
    private notificationService: NotificationService,
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  /**
   * Handles the user registration form submission.
   * 
   * - Validates that the username field is not empty or null.
   * - Displays a notification if the username is missing.
   * - Calls the user service to add a new user.
   * - On success, shows a success notification and navigates to the login page.
   * - On error, displays appropriate error notifications based on the HTTP status code:
   *   - 409: Username already exists.
   *   - 400: Invalid input data.
   *   - Other: Generic error message.
   */
  formSubmit() {
    if (this.user.username == '' || this.user.username == null) {
      this.notificationService.snackMessage('Username is required', 3000);
      return;
    }

    this.userService.addUser(this.user).subscribe({
      next: () => {
        this.notificationService.success('User registered successfully');
        this.router.navigate(['login']);
      },  error: (err) => {
        console.error(err);
        if (err.status === 409) {
          this.notificationService.error(err.error?.message || 'Username already exists');
        } else if (err.status === 400) {
          this.notificationService.error('Invalid input data');
        } else {
          this.notificationService.error('Something went wrong');
        }
      }
    });
  }

}
