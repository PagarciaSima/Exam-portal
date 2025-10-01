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

  /**
   * Muestra un modal de confirmación usando SweetAlert2.
   * @param message Mensaje a mostrar en el modal.
   * @param title Título del modal. Por defecto '¿Estás seguro?'.
   * @returns Promise<boolean> Resuelve true si el usuario confirma, false si cancela.
   */
  confirm(message: string, title: string = '¿Estás seguro?'): Promise<boolean> {
    return Swal.fire({
      title,
      text: message,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí',
      cancelButtonText: 'No',
      customClass: {
        confirmButton: 'mat-raised-button mat-primary swal2-confirm mr20', 
        cancelButton: 'mat-raised-button mat-warn swal2-cancel'
      },
      buttonsStyling: false 
    }).then(result => result.isConfirmed);
  }

}