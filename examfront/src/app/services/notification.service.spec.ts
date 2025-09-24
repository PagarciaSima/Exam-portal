import { TestBed } from '@angular/core/testing';

import { NotificationService } from './notification.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import Swal from 'sweetalert2';

describe('NotificationService', () => {
  let service: NotificationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        NotificationService,
        MatSnackBar
      ]
    });
    service = TestBed.inject(NotificationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('NotificationService', () => {
    let service: NotificationService;
    let snackBarSpy: jasmine.SpyObj<MatSnackBar>;

    beforeEach(() => {
      snackBarSpy = jasmine.createSpyObj('MatSnackBar', ['open']);
      TestBed.configureTestingModule({
        providers: [
          NotificationService,
          { provide: MatSnackBar, useValue: snackBarSpy }
        ]
      });
      service = TestBed.inject(NotificationService);
    });

    it('should be created', () => {
      expect(service).toBeTruthy();
    });

    describe('SweetAlert2 methods', () => {
      let swalFireSpy: jasmine.Spy;

      beforeEach(() => {
        swalFireSpy = spyOn(Swal, 'fire');
      });

      it('should call Swal.fire with success type', () => {
        service.success('Success message', 'Success Title');
        expect(swalFireSpy).toHaveBeenCalledWith('Success Title', 'Success message', 'success');
      });

      it('should call Swal.fire with default success title', () => {
        service.success('Success message');
        expect(swalFireSpy).toHaveBeenCalledWith('Success', 'Success message', 'success');
      });

      it('should call Swal.fire with error type', () => {
        service.error('Error message', 'Error Title');
        expect(swalFireSpy).toHaveBeenCalledWith('Error Title', 'Error message', 'error');
      });

      it('should call Swal.fire with default error title', () => {
        service.error('Error message');
        expect(swalFireSpy).toHaveBeenCalledWith('Error', 'Error message', 'error');
      });

      it('should call Swal.fire with warning type', () => {
        service.warning('Warning message', 'Warning Title');
        expect(swalFireSpy).toHaveBeenCalledWith('Warning Title', 'Warning message', 'warning');
      });

      it('should call Swal.fire with default warning title', () => {
        service.warning('Warning message');
        expect(swalFireSpy).toHaveBeenCalledWith('Warning', 'Warning message', 'warning');
      });

      it('should call Swal.fire with info type', () => {
        service.info('Info message', 'Info Title');
        expect(swalFireSpy).toHaveBeenCalledWith('Info Title', 'Info message', 'info');
      });

      it('should call Swal.fire with default info title', () => {
        service.info('Info message');
        expect(swalFireSpy).toHaveBeenCalledWith('Info', 'Info message', 'info');
      });
    });

    describe('snackMessage', () => {
      it('should call MatSnackBar.open with message and default duration', () => {
        service.snackMessage('Test snack');
        expect(snackBarSpy.open).toHaveBeenCalledWith('Test snack', '', {
          duration: 3000,
          verticalPosition: 'top',
        });
      });

      it('should call MatSnackBar.open with message and custom duration', () => {
        service.snackMessage('Test snack', 5000);
        expect(snackBarSpy.open).toHaveBeenCalledWith('Test snack', '', {
          duration: 5000,
          verticalPosition: 'top',
        });
      });
    });
  });
});
