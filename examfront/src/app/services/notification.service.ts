import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  /**
   * Creates an instance of NotificationService.
   * @param snack Angular Material snack bar service for showing snack messages.
   */
  constructor(private snack: MatSnackBar) {}

  /**
   * Shows a success notification using SweetAlert2.
   * @param message The message to display.
   * @param title The title of the notification. Defaults to 'Success'.
   */
  success(message: string, title: string = 'Success') {
    Swal.fire(title, message, 'success');
  }

  /**
   * Shows an error notification using SweetAlert2.
   * @param message The message to display.
   * @param title The title of the notification. Defaults to 'Error'.
   */
  error(message: string, title: string = 'Error') {
    Swal.fire(title, message, 'error');
  }

  /**
   * Shows a warning notification using SweetAlert2.
   * @param message The message to display.
   * @param title The title of the notification. Defaults to 'Warning'.
   */
  warning(message: string, title: string = 'Warning') {
    Swal.fire(title, message, 'warning');
  }

  /**
   * Shows an informational notification using SweetAlert2.
   * @param message The message to display.
   * @param title The title of the notification. Defaults to 'Info'.
   */
  info(message: string, title: string = 'Info') {
    Swal.fire(title, message, 'info');
  }

  /**
   * Shows a snack bar message using Angular Material.
   * @param message The message to display.
   * @param duration Duration in milliseconds. Defaults to 3000.
   */
  snackMessage(message: string, duration: number = 3000) {
    this.snack.open(message, '', {
      duration,
      verticalPosition: 'top',
    });
  }
}