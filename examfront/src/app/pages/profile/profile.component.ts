import { Component, OnInit } from '@angular/core';
import { slideIn } from 'src/app/animations/animations';
import { User } from 'src/app/model/User';
import { LoginService } from 'src/app/services/login.service';
import { NotificationService } from 'src/app/services/notification.service';
import { TranslateService } from '@ngx-translate/core'; 
import { UserService } from 'src/app/services/user.service';

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
  isEditMode = false;
  private originalUser: User = null;

  constructor(
    private loginService: LoginService,
    private notificationService: NotificationService,
    private translate: TranslateService,
    private userService: UserService
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
      }, 
      error: (err) => {
        this.notificationService.error(
          this.translate.instant('PROFILE_LOAD_ERROR'),
          this.translate.instant('ERROR')
        );
        console.error(err);
      }
    });
  }

  /**
   * Enables edit mode for the profile, allowing the user to modify their information.
   * Stores a copy of the original user data to allow cancellation of edits.
   */
  toggleEdit() {
    this.isEditMode = true;
    this.originalUser = { ...this.user };
  }

  /**
   * Cancels the profile edit and reverts any changes made.
   * Restores the user data from the original copy and exits edit mode.
   */
  cancelEdit() {
    this.user = { ...this.originalUser };
    this.isEditMode = false;
  }

  saveProfile() {
    this.userService.updateUser(this.user.id, this.user).subscribe({
      next: (updatedUser) => {
        this.user = updatedUser;
        this.isEditMode = false;
        this.notificationService.success(
          this.translate.instant('PROFILE_UPDATE_SUCCESS'),
          this.translate.instant('SUCCESS')
        );
      },
      error: (err) => {
        this.notificationService.error(
          this.translate.instant('PROFILE_UPDATE_ERROR'),
          this.translate.instant('ERROR')
        );
        console.error(err);
      }
    });
  }

  onUploadPhoto(fileInput: HTMLInputElement) {
    fileInput.click();
  }

  /**
   * 
   * @param event The file input change event containing the selected file.
   * 
   * Handles the upload of a new profile photo. It retrieves the selected file from the event,
   * then calls the UserService to upload the file. On success, it updates the user's profile URL
   * and shows a success notification. On error, it shows an error notification and logs the error.
   */
  handlePhotoUpload(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0 && this.user) {
      const file = input.files[0];
      this.userService.uploadProfilePicture(this.user.id, file).subscribe({
        next: (response) => {
          if (response.profileUrl) {
            // Add param to force image refresh / cache busting
            this.user.profile = response.profileUrl + '?t=' + new Date().getTime();
            this.notificationService.success(
              this.translate.instant('PROFILE_PHOTO_UPLOAD_SUCCESS'),
              this.translate.instant('SUCCESS')
            );
          }
        },
        error: (err) => {
          this.notificationService.error(
            this.translate.instant('PROFILE_PHOTO_UPLOAD_ERROR'),
            this.translate.instant('ERROR')
          );
          console.error(err);
        }
      });
    }
  }

  /**
   * Handles the removal of the user's profile photo.
   * Prompts the user for confirmation before proceeding with the deletion.
   * On confirmation, it calls the UserService to delete the profile picture.
   * On success, it updates the user's profile to null and shows a success notification.
   * On error, it shows an error notification and logs the error.
   */
  onRemovePhoto() {
    this.notificationService.confirm(
      this.translate.instant('PROFILE_PHOTO_DELETE_CONFIRM'),
      this.translate.instant('CONFIRM')
    ).then(confirmed => {
      if (confirmed && this.user) {
        this.userService.deleteProfilePicture(this.user.id).subscribe({
          next: (response) => {
            if (response.message) {
              this.user.profile = null;
              this.notificationService.success(
                this.translate.instant('PROFILE_PHOTO_DELETE_SUCCESS'),
                this.translate.instant('SUCCESS')
              );
            }
          },
          error: (err) => {
            this.notificationService.error(
              this.translate.instant('PROFILE_PHOTO_DELETE_ERROR'),
              this.translate.instant('ERROR')
            );
            console.error(err);
          }
        });
      }
    });
  }

}
