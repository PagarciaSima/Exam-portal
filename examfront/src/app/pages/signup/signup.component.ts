import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { User } from 'src/app/model/User';
import { NotificationService } from 'src/app/services/notification.service';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

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
    private notificationService: NotificationService
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
        this.notificationService.success('User registered successfully')
      }, error: () => {
        this.notificationService.error('Something went wrong');
      }
    });

  }

}
