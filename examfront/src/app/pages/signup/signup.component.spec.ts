import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { FormsModule } from '@angular/forms'; 
import { SignupComponent } from './signup.component';
import { UserService } from 'src/app/services/user.service';
import { NotificationService } from 'src/app/services/notification.service';
import { Router } from '@angular/router';
import { of, throwError, Subject } from 'rxjs';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('SignupComponent', () => {
  let component: SignupComponent;
  let fixture: ComponentFixture<SignupComponent>;
  let userServiceSpy: jasmine.SpyObj<UserService>;
  let notificationServiceSpy: jasmine.SpyObj<NotificationService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let translateServiceSpy: jasmine.SpyObj<TranslateService>;

  beforeEach(async () => {
    const onLangChangeSubject = new Subject();

    translateServiceSpy = jasmine.createSpyObj('TranslateService', [
      'get', 'instant', 'use', 'setDefaultLang', 'addLangs', 'getBrowserLang', 
      'getLangs', 'getTranslation', 'stream', 'set'
    ], {
      onLangChange: onLangChangeSubject.asObservable(),
      onTranslationChange: new Subject().asObservable(),
      onDefaultLangChange: new Subject().asObservable()
    });

    translateServiceSpy.get.and.callFake((key: any) => {
      if (Array.isArray(key)) {
        const result: any = {};
        key.forEach((k: string) => result[k] = k);
        return of(result);
      }
      return of(key);
    });
    translateServiceSpy.instant.and.callFake((key: string) => key);
    translateServiceSpy.use.and.returnValue(of('en'));
    translateServiceSpy.getBrowserLang.and.returnValue('en');
    translateServiceSpy.getLangs.and.returnValue(['en', 'es']);
    translateServiceSpy.getTranslation.and.returnValue(of({}));
    translateServiceSpy.stream.and.returnValue(of('translated-text'));

    userServiceSpy = jasmine.createSpyObj('UserService', ['addUser']);
    notificationServiceSpy = jasmine.createSpyObj('NotificationService', ['snackMessage', 'success', 'error']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      declarations: [ SignupComponent ],
      imports: [
        HttpClientTestingModule,
        MatSnackBarModule,
        FormsModule, 
        TranslateModule.forRoot(),
        NoopAnimationsModule
      ],
      providers: [
        { provide: UserService, useValue: userServiceSpy },
        { provide: NotificationService, useValue: notificationServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: TranslateService, useValue: translateServiceSpy }
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
    expect(notificationServiceSpy.snackMessage).toHaveBeenCalledWith('USERNAME_REQUIRED', 3000);
    expect(userServiceSpy.addUser).not.toHaveBeenCalled();
  });

  it('should show notification if username is null', () => {
    component.user.username = null as any;
    component.formSubmit();
    expect(notificationServiceSpy.snackMessage).toHaveBeenCalledWith('USERNAME_REQUIRED', 3000);
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
    expect(notificationServiceSpy.success).toHaveBeenCalledWith('USER_REGISTERED_SUCCESS', 'SUCCESS');
    expect(routerSpy.navigate).toHaveBeenCalledWith(['login']);
  });

  it('should show error notification for 409 status', () => {
    component.user.username = 'testuser';
    userServiceSpy.addUser.and.returnValue(throwError(() => ({ status: 409, error: { message: 'Username exists' } })));
    component.formSubmit();
    expect(notificationServiceSpy.error).toHaveBeenCalledWith('SOMETHING_WENT_WRONG', 'ERROR');
  });

  it('should show error notification for 400 status', () => {
    component.user.username = 'testuser';
    userServiceSpy.addUser.and.returnValue(throwError(() => ({ status: 400 })));
    component.formSubmit();
    expect(notificationServiceSpy.error).toHaveBeenCalledWith('SOMETHING_WENT_WRONG', 'ERROR');
  });

  it('should show generic error notification for other errors', () => {
    component.user.username = 'testuser';
    userServiceSpy.addUser.and.returnValue(throwError(() => ({ status: 500 })));
    component.formSubmit();
    expect(notificationServiceSpy.error).toHaveBeenCalledWith('SOMETHING_WENT_WRONG', 'ERROR');
  });
});