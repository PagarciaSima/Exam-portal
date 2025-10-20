import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { of, throwError } from 'rxjs';

import { ProfileComponent } from './profile.component';
import { LoginService } from 'src/app/services/login.service';
import { NotificationService } from 'src/app/services/notification.service';
import { UserService } from 'src/app/services/user.service';
import { TranslateService } from '@ngx-translate/core';

describe('ProfileComponent', () => {
  let fixture: ComponentFixture<ProfileComponent>;
  let component: ProfileComponent;
  let loginServiceSpy: jasmine.SpyObj<LoginService>;
  let notificationServiceSpy: jasmine.SpyObj<NotificationService>;
  let userServiceSpy: jasmine.SpyObj<UserService>;
  let translateServiceStub: Partial<TranslateService>;

  const mockUser = {
    id: 1,
    username: 'test',
    firstName: 'Test',
    lastName: 'User',
    email: 'test@example.com',
    phone: '123456789',
    profile: 'url'
  };

  beforeEach(async () => {
    loginServiceSpy = jasmine.createSpyObj('LoginService', ['getCurrentUser']);
    notificationServiceSpy = jasmine.createSpyObj('NotificationService', ['error', 'success', 'confirm']);
    userServiceSpy = jasmine.createSpyObj('UserService', ['updateUser', 'uploadProfilePicture', 'deleteProfilePicture']);
    translateServiceStub = { instant: (key: string) => key };

    await TestBed.configureTestingModule({
      declarations: [ProfileComponent],
      imports: [
        HttpClientTestingModule,
        MatSnackBarModule
      ],
      providers: [
        { provide: LoginService, useValue: loginServiceSpy },
        { provide: NotificationService, useValue: notificationServiceSpy },
        { provide: UserService, useValue: userServiceSpy },
        { provide: TranslateService, useValue: translateServiceStub }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileComponent);
    component = fixture.componentInstance;
  });

  it('debería instanciarse correctamente', () => {
    expect(component).not.toBeNull();
  });

  it('debe obtener el usuario actual en ngOnInit', () => {
    loginServiceSpy.getCurrentUser.and.returnValue(of(mockUser));
    component.ngOnInit();
    expect(loginServiceSpy.getCurrentUser).toHaveBeenCalled();
    expect(component.user).toEqual(mockUser);
  });

  it('debe manejar error al obtener usuario actual', () => {
    loginServiceSpy.getCurrentUser.and.returnValue(throwError(() => new Error('fail')));
    component.ngOnInit();
    expect(notificationServiceSpy.error).toHaveBeenCalled();
  });

  it('debe activar el modo edición y guardar usuario original', () => {
    component.user = { ...mockUser };
    component.toggleEdit();
    expect(component.isEditMode).toBeTrue();
    expect(component.originalUser).toEqual(mockUser);
  });

  it('debe cancelar edición y restaurar usuario original', () => {
    component.originalUser = { ...mockUser, username: 'original' };
    component.user = { ...mockUser, username: 'editado' };
    component.isEditMode = true;
    component.cancelEdit();
    expect(component.user).toEqual(component.originalUser);
    expect(component.isEditMode).toBeFalse();
  });

  it('debe guardar el perfil y mostrar notificación de éxito', () => {
    component.user = { ...mockUser };
    userServiceSpy.updateUser.and.returnValue(of({ ...mockUser, username: 'nuevo' }));
    component.isEditMode = true;
    component.saveProfile();
    expect(userServiceSpy.updateUser).toHaveBeenCalledWith(mockUser.id, mockUser);
    expect(component.isEditMode).toBeFalse();
    expect(notificationServiceSpy.success).toHaveBeenCalled();
  });

  it('debe manejar error al guardar el perfil', () => {
    component.user = { ...mockUser };
    userServiceSpy.updateUser.and.returnValue(throwError(() => new Error('fail')));
    component.saveProfile();
    expect(notificationServiceSpy.error).toHaveBeenCalled();
  });

  it('debe manejar la subida de foto de perfil correctamente', () => {
    component.user = { ...mockUser };
    const file = new File([''], 'photo.png');
    const event = { target: { files: [file] } } as any;
    userServiceSpy.uploadProfilePicture.and.returnValue(of({ profileUrl: 'newUrl' }));
    component.handlePhotoUpload(event);
    expect(userServiceSpy.uploadProfilePicture).toHaveBeenCalledWith(mockUser.id, file);
    expect(notificationServiceSpy.success).toHaveBeenCalled();
    expect(component.user.profile).toContain('newUrl');
  });

  it('debe manejar error al subir foto de perfil', () => {
    component.user = { ...mockUser };
    const file = new File([''], 'photo.png');
    const event = { target: { files: [file] } } as any;
    userServiceSpy.uploadProfilePicture.and.returnValue(throwError(() => new Error('fail')));
    component.handlePhotoUpload(event);
    expect(notificationServiceSpy.error).toHaveBeenCalled();
  });

  it('debe eliminar la foto de perfil tras confirmación', async () => {
    component.user = { ...mockUser };
    notificationServiceSpy.confirm.and.returnValue(Promise.resolve(true));
    userServiceSpy.deleteProfilePicture.and.returnValue(of({ message: 'ok' }));
    await component.onRemovePhoto();
    expect(userServiceSpy.deleteProfilePicture).toHaveBeenCalledWith(mockUser.id);
    expect(notificationServiceSpy.success).toHaveBeenCalled();
    expect(component.user.profile).toBeNull();
  });

  it('no debe eliminar la foto si no hay confirmación', async () => {
    component.user = { ...mockUser };
    notificationServiceSpy.confirm.and.returnValue(Promise.resolve(false));
    await component.onRemovePhoto();
    expect(userServiceSpy.deleteProfilePicture).not.toHaveBeenCalled();
  });

  it('debe manejar error al eliminar foto de perfil', async () => {
    component.user = { ...mockUser };
    notificationServiceSpy.confirm.and.returnValue(Promise.resolve(true));
    userServiceSpy.deleteProfilePicture.and.returnValue(throwError(() => new Error('fail')));
    await component.onRemovePhoto();
    expect(notificationServiceSpy.error).toHaveBeenCalled();
  });
});
