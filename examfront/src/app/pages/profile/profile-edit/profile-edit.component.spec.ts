import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProfileEditComponent } from './profile-edit.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { UserService } from 'src/app/services/user.service';
import { NotificationService } from 'src/app/services/notification.service';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('ProfileEditComponent', () => {
  let component: ProfileEditComponent;
  let fixture: ComponentFixture<ProfileEditComponent>;
  let mockDialog: any;
  let mockUserService: any;
  let mockNotificationService: any;
  let mockTranslateService: any;

  beforeEach(async () => {
    mockDialog = {
      open: jasmine.createSpy('open').and.returnValue({
        afterClosed: () => of('newPassword')
      })
    };
    mockUserService = {
      updatePassword: jasmine.createSpy('updatePassword').and.returnValue(of({}))
    };
    mockNotificationService = {
      success: jasmine.createSpy('success'),
      error: jasmine.createSpy('error')
    };
    mockTranslateService = {
      instant: jasmine.createSpy('instant').and.callFake((key: string) => key),
      get: jasmine.createSpy('get').and.callFake((key?: string) => of(key ?? ''))
    };

    await TestBed.configureTestingModule({
      declarations: [ ProfileEditComponent ],
      imports: [
        MatDialogModule,
        FormsModule,
        TranslateModule.forRoot(),
        BrowserAnimationsModule 
      ],
      providers: [
        { provide: MatDialog, useValue: mockDialog },
        { provide: UserService, useValue: mockUserService },
        { provide: NotificationService, useValue: mockNotificationService },
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileEditComponent);
    component = fixture.componentInstance;
    component.user = {
      id: 1,
      username: 'test',
      email: 'test@test.com',
      authorities: [{}], // <-- agrega esta línea
      // agrega aquí otras propiedades si el template las usa
    } as any;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit save event with user on saveProfile()', () => {
    spyOn(component.save, 'emit');
    component.saveProfile();
    expect(component.save.emit).toHaveBeenCalledWith(component.user);
  });

  it('should emit cancel event on cancelEdit()', () => {
    spyOn(component.cancel, 'emit');
    component.cancelEdit();
    expect(component.cancel.emit).toHaveBeenCalled();
  });

  it('should open change password dialog and update password on success', () => {
    component.openChangePasswordModal();
    expect(mockDialog.open).toHaveBeenCalled();
    expect(mockUserService.updatePassword).toHaveBeenCalledWith(1, 'newPassword');
    expect(mockNotificationService.success).toHaveBeenCalledWith(
      'PASSWORD_CHANGE_SUCCESS',
      'SUCCESS'
    );
  });

  it('should show error notification if updatePassword fails', () => {
    mockDialog.open.and.returnValue({
      afterClosed: () => of('newPassword')
    });
    mockUserService.updatePassword.and.returnValue(throwError(() => new Error('fail')));
    component.openChangePasswordModal();
    expect(mockNotificationService.error).toHaveBeenCalledWith(
      'PASSWORD_CHANGE_ERROR',
      'ERROR'
    );
  });

  it('should not call updatePassword if no password is returned', () => {
    // Inicializa todas las propiedades usadas en el template
    component.user = {
      id: 1,
      username: 'test',
      email: 'test@test.com',
      authorities: [{}], // <-- agrega esta línea
      // agrega aquí otras propiedades si el template las usa
    } as any;
    mockDialog.open.and.returnValue({
      afterClosed: () => of(null)
    });
    fixture.detectChanges();
    component.openChangePasswordModal();
    expect(mockUserService.updatePassword).not.toHaveBeenCalled();
  });
});