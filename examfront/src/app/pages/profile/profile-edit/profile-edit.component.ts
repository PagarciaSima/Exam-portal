import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { User } from 'src/app/model/User';
import { ProfileChangePasswordComponent } from '../profile-change-password/profile-change-password.component';
import { MatDialog } from '@angular/material/dialog';
import { slideIn } from 'src/app/animations/animations';
import { UserService } from 'src/app/services/user.service';
import { NotificationService } from 'src/app/services/notification.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-profile-edit',
  templateUrl: './profile-edit.component.html',
  styleUrls: ['./profile-edit.component.css'],
  animations: [
    slideIn
  ]    
})
export class ProfileEditComponent implements OnInit {

  @Input() user: User;
  @Output() save = new EventEmitter<User>();
  @Output() cancel = new EventEmitter<void>();
  confirmPassword: string;

  constructor(
    private dialog: MatDialog,
    private userService: UserService,
    private notificationService: NotificationService,
    private translate: TranslateService
  ) { }

  ngOnInit(): void {
    
  }

  saveProfile() {
    this.save.emit(this.user);
  }

  cancelEdit() {
    this.cancel.emit();
  }

  /**
   * Opens a modal dialog to change the user's password.
   * After the dialog is closed, if a new password was provided,
   * it calls the UserService to update the password in the backend.
   * Displays success or error notifications based on the result.
   */
  openChangePasswordModal() {
    const dialogRef = this.dialog.open(ProfileChangePasswordComponent, {
      width: '400px',
      data: { user: this.user }
    });

    dialogRef.afterClosed().subscribe((newPassword: string | null) => {
      if (newPassword) {
        this.userService.updatePassword(this.user.id, newPassword).subscribe({
          next: () => {
            this.notificationService.success(
              this.translate.instant('PASSWORD_CHANGE_SUCCESS'),
              this.translate.instant('SUCCESS')
            );
          },
          error: (err) => {
            console.error('Failed to update password', err);
            this.notificationService.error(
              this.translate.instant('PASSWORD_CHANGE_ERROR'),
              this.translate.instant('ERROR')
            );
          }
        });
      }
    });
  }
}
