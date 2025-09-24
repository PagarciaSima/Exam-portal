import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignupComponent } from './signup.component';
import { UserService } from 'src/app/services/user.service';
import { NotificationService } from 'src/app/services/notification.service';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';

describe('SignupComponent', () => {
  let component: SignupComponent;
  let fixture: ComponentFixture<SignupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SignupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SignupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('SignupComponent', () => {
    let component: SignupComponent;
    let fixture: ComponentFixture<SignupComponent>;
    let userServiceSpy: jasmine.SpyObj<UserService>;
    let notificationServiceSpy: jasmine.SpyObj<NotificationService>;
    let routerSpy: jasmine.SpyObj<Router>;

    beforeEach(async () => {
      userServiceSpy = jasmine.createSpyObj('UserService', ['addUser']);
      notificationServiceSpy = jasmine.createSpyObj('NotificationService', ['snackMessage', 'success', 'error']);
      routerSpy = jasmine.createSpyObj('Router', ['navigate']);

      await TestBed.configureTestingModule({
        declarations: [ SignupComponent ],
        providers: [
          { provide: UserService, useValue: userServiceSpy },
          { provide: NotificationService, useValue: notificationServiceSpy },
          { provide: Router, useValue: routerSpy }
        ]
      })
      .compileComponents();
    });

    beforeEach(() => {
      fixture = TestBed.createComponent(SignupComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should show notification if username is empty', () => {
      component.user.username = '';
      component.formSubmit();
      expect(notificationServiceSpy.snackMessage).toHaveBeenCalledWith('Username is required', 3000);
      expect(userServiceSpy.addUser).not.toHaveBeenCalled();
    });

    it('should show notification if username is null', () => {
      component.user.username = null as any;
      component.formSubmit();
      expect(notificationServiceSpy.snackMessage).toHaveBeenCalledWith('Username is required', 3000);
      expect(userServiceSpy.addUser).not.toHaveBeenCalled();
    });

    it('should call addUser and show success notification on success', () => {
      component.user.username = 'testuser';
      userServiceSpy.addUser.and.returnValue(of({
        username: 'testuser',
        firstName: 'Test',
        lastName: 'User',
        email: 'testuser@example.com',
        phone: '1234567890'
      }));
      component.formSubmit();
      expect(userServiceSpy.addUser).toHaveBeenCalledWith(component.user);
      expect(notificationServiceSpy.success).toHaveBeenCalledWith('User registered successfully');
      expect(routerSpy.navigate).toHaveBeenCalledWith(['login']);
    });

    it('should show error notification for 409 status', () => {
      component.user.username = 'testuser';
      userServiceSpy.addUser.and.returnValue(throwError(() => ({ status: 409, error: { message: 'Username exists' } })));
      component.formSubmit();
      expect(notificationServiceSpy.error).toHaveBeenCalledWith('Username exists');
    });

    it('should show error notification for 400 status', () => {
      component.user.username = 'testuser';
      userServiceSpy.addUser.and.returnValue(throwError(() => ({ status: 400 })));
      component.formSubmit();
      expect(notificationServiceSpy.error).toHaveBeenCalledWith('Invalid input data');
    });

    it('should show generic error notification for other errors', () => {
      component.user.username = 'testuser';
      userServiceSpy.addUser.and.returnValue(throwError(() => ({ status: 500 })));
      component.formSubmit();
      expect(notificationServiceSpy.error).toHaveBeenCalledWith('Something went wrong');
    });
  });
});
