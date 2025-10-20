import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';

import { LoginComponent } from './login.component';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/services/login.service';
import { NotificationService } from 'src/app/services/notification.service';
import { User } from 'src/app/model/User';
import { TranslateService } from '@ngx-translate/core';

class MockTranslateService {
  instant(key: string) {
    // Simulate translation keys for error/success
    if (key === 'LOGIN_SUCCESS') return 'Login successful';
    if (key === 'SUCCESS') return 'Success';
    if (key === 'LOGIN_FAILED') return 'Invalid credentials';
    if (key === 'INVALID_CREDENTIALS') return 'Invalid credentials';
    if (key === 'ERROR') return 'Error';
    return key;
  }
  get(key: string) { return of(key); }
}

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let loginServiceSpy: jasmine.SpyObj<LoginService>;
  let notificationServiceSpy: jasmine.SpyObj<NotificationService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    loginServiceSpy = jasmine.createSpyObj('LoginService', [
      'generateToken',
      'loginUser',
      'getCurrentUser',
      'setUser',
      'logout'
    ]);
    notificationServiceSpy = jasmine.createSpyObj('NotificationService', [
      'success',
      'error'
    ]);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [ LoginComponent ],
      providers: [
        { provide: LoginService, useValue: loginServiceSpy },
        { provide: NotificationService, useValue: notificationServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: TranslateService, useClass: MockTranslateService }
      ]
    })
    .overrideTemplate(LoginComponent, '') // Avoid template errors due to missing pipes
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call generateToken and handle successful login as ADMIN', () => {
    const jwtResponse = { token: 'abc' };
    const user:User = {
      username: 'admin',
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@example.com',
      phone: '1234567890',
      authorities: [{ authority: 'ADMIN' }]
    };
    loginServiceSpy.generateToken.and.returnValue(of(jwtResponse));
    loginServiceSpy.getCurrentUser.and.returnValue(of(user));

    component.loginData = { username: 'admin', password: 'pass' };
    component.formSubmit();

    expect(loginServiceSpy.generateToken).toHaveBeenCalledWith(component.loginData);
    expect(notificationServiceSpy.success).toHaveBeenCalledWith('Login successful', 'Success');
    expect(loginServiceSpy.loginUser).toHaveBeenCalledWith(jwtResponse.token);
    expect(loginServiceSpy.setUser).toHaveBeenCalledWith(user);
    expect(routerSpy.navigate).toHaveBeenCalledWith(['admin']);
  });

  it('should call generateToken and handle successful login as NORMAL', () => {
    const jwtResponse = { token: 'abc' };
    const user:User = {
      username: 'user',
      firstName: 'Normal',
      lastName: 'User',
      email: 'user@example.com',
      phone: '0987654321',
      authorities: [{ authority: 'NORMAL' }]
    };
    loginServiceSpy.generateToken.and.returnValue(of(jwtResponse));
    loginServiceSpy.getCurrentUser.and.returnValue(of(user));

    component.loginData = { username: 'user', password: 'pass' };
    component.formSubmit();

    expect(routerSpy.navigate).toHaveBeenCalledWith(['user-dashboard', 0]);
  });

  it('should call generateToken and handle successful login as OTHER', () => {
    const otherUser = {
      username: 'other',
      firstName: 'Other',
      lastName: 'User',
      email: 'other@example.com',
      phone: '1112223333',
      authorities: [{ authority: 'OTHER' }]
    };
    const jwtResponse = { token: 'abc' };
    loginServiceSpy.generateToken.and.returnValue(of(jwtResponse));
    loginServiceSpy.getCurrentUser.and.returnValue(of(otherUser));

    component.loginData = { username: 'other', password: 'pass' };
    component.formSubmit();

    expect(loginServiceSpy.logout).toHaveBeenCalled();
  });

  it('should logout if user has no ADMIN or NORMAL authority', () => {
    const jwtResponse = { token: 'token' };
    const user: User = {
      username: 'otheruser',
      firstName: 'Other',
      lastName: 'User',
      email: 'otheruser@example.com',
      phone: '0000000000',
      authorities: [{ authority: 'OTHER' }]
    };
    loginServiceSpy.generateToken.and.returnValue(of(jwtResponse));
    loginServiceSpy.getCurrentUser.and.returnValue(of(user));

    component.loginData = { username: 'otheruser', password: 'pass' };
    component.formSubmit();

    expect(loginServiceSpy.logout).toHaveBeenCalled();
  });

  it('should handle error on generateToken', () => {
    const error = { status: 401, error: { error: 'Invalid credentials' } };
    loginServiceSpy.generateToken.and.returnValue(throwError(() => error));

    component.loginData = { username: 'bad', password: 'wrong' };
    component.formSubmit();

    expect(notificationServiceSpy.error).toHaveBeenCalledWith('Invalid credentials', 'Error');
    expect(component.loginData.password).toBe('');
  });

  it('should handle error on getCurrentUser', () => {
    const jwtResponse = { token: 'token' };
    const error = { status: 401, error: { error: 'Invalid credentials' } };
    loginServiceSpy.generateToken.and.returnValue(of(jwtResponse));
    loginServiceSpy.getCurrentUser.and.returnValue(throwError(() => error));

    component.loginData = { username: 'bad', password: 'wrong' };
    component.formSubmit();

    expect(notificationServiceSpy.error).toHaveBeenCalledWith('Invalid credentials', 'Error');
    expect(component.loginData.password).toBe('');
  });

  it('should redirect ADMIN user', () => {
    const user = { authorities: [{ authority: 'ADMIN' }] };
    (component as any).redirectUser(user as any);
    expect(routerSpy.navigate).toHaveBeenCalledWith(['admin']);
  });

  it('should redirect NORMAL user', () => {
    const user = { authorities: [{ authority: 'NORMAL' }] };
    (component as any).redirectUser(user as any);
    expect(routerSpy.navigate).toHaveBeenCalledWith(['user-dashboard', 0]);
  });

  it('should logout for unknown authority', () => {
    const user = { authorities: [{ authority: 'UNKNOWN' }] };
    (component as any).redirectUser(user as any);
    expect(loginServiceSpy.logout).toHaveBeenCalled();
  });

  it('should handleLoginError with default message', () => {
    const error = { status: 500 };
    component.loginData.password = 'something';
    (component as any).handleLoginError(error);
    expect(notificationServiceSpy.error).toHaveBeenCalledWith('Invalid credentials', 'Error');
    expect(component.loginData.password).toBe('');
  });

  // Additional tests

  it('should not redirect if authorities is empty', () => {
    const user = { authorities: [] };
    (component as any).redirectUser(user as any);
    expect(loginServiceSpy.logout).toHaveBeenCalled();
  });

  it('should handleLoginError with missing error object', () => {
    component.loginData.password = 'test';
    (component as any).handleLoginError({});
    expect(notificationServiceSpy.error).toHaveBeenCalledWith('Invalid credentials', 'Error' );
    expect(component.loginData.password).toBe('');
  });

  it('should handleLoginError with error status 401 and no error message', () => {
    const error = { status: 401 };
    component.loginData.password = 'test';
    (component as any).handleLoginError(error);
    expect(notificationServiceSpy.error).toHaveBeenCalledWith('Invalid credentials', 'Error');
    expect(component.loginData.password).toBe('');
  });

  it('should handleLoginError with error status 401 and error message', () => {
    const error = { status: 401, error: { error: 'Invalid credentials' } };
    component.loginData.password = 'test';
    (component as any).handleLoginError(error);
    expect(notificationServiceSpy.error).toHaveBeenCalledWith('Invalid credentials', 'Error');
    expect(component.loginData.password).toBe('');
  });

  it('should call formSubmit with empty loginData', () => {
    component.loginData = { username: '', password: '' };
    loginServiceSpy.generateToken.and.returnValue(throwError(() => ({ status: 401 })));
    component.formSubmit();
    expect(notificationServiceSpy.error).toHaveBeenCalledWith('Invalid credentials', 'Error');
    expect(component.loginData.password).toBe('');
  });

  it('should call formSubmit and handle getCurrentUser error with missing error', () => {
    const jwtResponse = { token: 'token' };
    loginServiceSpy.generateToken.and.returnValue(of(jwtResponse));
    loginServiceSpy.getCurrentUser.and.returnValue(throwError(() => ({})));
    component.loginData = { username: 'user', password: 'pass' };
    component.formSubmit();
    expect(notificationServiceSpy.error).toHaveBeenCalledWith('Invalid credentials', 'Error');
    expect(component.loginData.password).toBe('');
  });
});
