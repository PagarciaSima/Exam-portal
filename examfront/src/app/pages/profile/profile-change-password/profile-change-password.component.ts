import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { User } from 'src/app/model/User';

@Component({
  selector: 'app-profile-change-password',
  templateUrl: './profile-change-password.component.html',
  styleUrls: ['./profile-change-password.component.css']
})
export class ProfileChangePasswordComponent implements OnInit {

  newPassword: string = '';
  confirmPassword: string = '';
  
  constructor(
    public dialogRef: MatDialogRef<ProfileChangePasswordComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { user: User }
  ) { }
  
  ngOnInit(): void {
    
  }

  /**
   * Saves the new password if it matches the confirmation password.
   * Closes the dialog and returns the new password to the caller.
   * If the passwords do not match, the dialog remains open for correction.
   */
  save() {
    if (this.newPassword && this.newPassword === this.confirmPassword) {
      this.dialogRef.close(this.newPassword); // returns new password to the caller
    }
  }

  cancel() {
    this.dialogRef.close(null);
  }

}
