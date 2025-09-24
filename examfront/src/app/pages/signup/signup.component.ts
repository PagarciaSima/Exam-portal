import { animate, style, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { fadeInUp } from 'src/app/animations/animations';
import { User } from 'src/app/model/User';
import { NotificationService } from 'src/app/services/notification.service';
import { UserService } from 'src/app/services/user.service';

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
