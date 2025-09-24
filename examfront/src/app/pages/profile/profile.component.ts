import { animate, style, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { slideIn } from 'src/app/animations/animations';
import { User } from 'src/app/model/User';
import { LoginService } from 'src/app/services/login.service';
import { NotificationService } from 'src/app/services/notification.service';

/**
 * Component responsible for displaying the profile of the currently logged-in user.
 * 
 * @remarks
 * Fetches the current user data on initialization and handles errors by showing notifications.
 * 
 * @component
 * @example
 * <app-profile></app-profile>
 */
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  animations: [
    slideIn
  ]
})
export class ProfileComponent implements OnInit {

  user: User = null;

  constructor(
    private loginService: LoginService,
    private notificationService: NotificationService
  ) { }

  ngOnInit(): void {
    this.getCurrentUser();
  }

  /**
   * Fetches the current user's data from the server using the login service.
   * On success, assigns the retrieved user data to the `user` property.
   * On error, displays a notification and logs the error to the console.
   *
   * @private
   */
  private getCurrentUser() {
    this.loginService.getCurrentUser().subscribe({
      next: (user) => {
        this.user = user;
      }, error: (err) => {
        this.notificationService.error('Could not fetch the current user data', 'Error');
        console.error(err);
      }
    });
  }
}
