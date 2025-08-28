import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

   constructor(private snack: MatSnackBar) {}

  success(message: string, title: string = 'Success') {
    Swal.fire(title, message, 'success');
  }

  error(message: string, title: string = 'Error') {
    Swal.fire(title, message, 'error');
  }

  warning(message: string, title: string = 'Warning') {
    Swal.fire(title, message, 'warning');
  }

  info(message: string, title: string = 'Info') {
    Swal.fire(title, message, 'info');
  }

  snackMessage(message: string, duration: number = 3000) {
    this.snack.open(message, '', {
      duration,
      verticalPosition: 'top',
    });
  }
}
