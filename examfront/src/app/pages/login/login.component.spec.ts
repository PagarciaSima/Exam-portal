import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginComponent } from './login.component';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { LoginService } from 'src/app/services/login.service';
import { NotificationService } from 'src/app/services/notification.service';
import { User } from 'src/app/model/User';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoginComponent ]
    })
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
        declarations: [ LoginComponent ],
        providers: [
          { provide: LoginService, useValue: loginServiceSpy },
          { provide: NotificationService, useValue: notificationServiceSpy },
          { provide: Router, useValue: routerSpy }
        ]
      })
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
      expect(notificationServiceSpy.success).toHaveBeenCalledWith('Login successful');
      const normalUser = {
        username: 'user',
        firstName: 'Normal',
        lastName: 'User',
        email: 'user@example.com',
        phone: '0987654321',
        authorities: [{ authority: 'NORMAL' }]
      };
      loginServiceSpy.generateToken.and.returnValue(of(jwtResponse));
      loginServiceSpy.getCurrentUser.and.returnValue(of(normalUser));
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

      component.loginData = { username: 'user', password: 'pass' };
      component.formSubmit();

      expect(routerSpy.navigate).toHaveBeenCalledWith(['user-dashboard']);
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

      component.formSubmit();

      expect(loginServiceSpy.logout).toHaveBeenCalled();
    });

    it('should handle error on generateToken', () => {
      const error = { status: 401, error: { error: 'Invalid credentials' } };
      loginServiceSpy.generateToken.and.returnValue(throwError(() => error));

      component.loginData = { username: 'bad', password: 'wrong' };
      component.formSubmit();

      expect(notificationServiceSpy.error).toHaveBeenCalledWith('Invalid credentials');
      expect(component.loginData.password).toBe('');
    });

    it('should handle error on getCurrentUser', () => {
      const jwtResponse = { token: 'token' };
      const error = { status: 401, error: { error: 'Invalid credentials' } };
      loginServiceSpy.generateToken.and.returnValue(of(jwtResponse));
      loginServiceSpy.getCurrentUser.and.returnValue(throwError(() => error));

      component.formSubmit();

      expect(notificationServiceSpy.error).toHaveBeenCalledWith('Invalid credentials');
      expect(component.loginData.password).toBe('');
    });

    it('should redirect ADMIN user', () => {
      const user = { authorities: [{ authority: 'ADMIN' }] };
      component['redirectUser'](user as any);
      expect(routerSpy.navigate).toHaveBeenCalledWith(['admin']);
    });

    it('should redirect NORMAL user', () => {
      const user = { authorities: [{ authority: 'NORMAL' }] };
      component['redirectUser'](user as any);
      expect(routerSpy.navigate).toHaveBeenCalledWith(['user-dashboard']);
    });

    it('should logout for unknown authority', () => {
      const user = { authorities: [{ authority: 'UNKNOWN' }] };
      component['redirectUser'](user as any);
      expect(loginServiceSpy.logout).toHaveBeenCalled();
    });

    it('should handleLoginError with default message', () => {
      const error = { status: 500 };
      component.loginData.password = 'something';
      component['handleLoginError'](error);
      expect(notificationServiceSpy.error).toHaveBeenCalledWith('Login failed. Please try again.');
      expect(component.loginData.password).toBe('');
    });
  });
});
