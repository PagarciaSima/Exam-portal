import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RedirectHomeComponent } from './redirect-home.component';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/services/login.service';

describe('RedirectHomeComponent', () => {
  let component: RedirectHomeComponent;
  let fixture: ComponentFixture<RedirectHomeComponent>;
  let routerSpy: jasmine.SpyObj<Router>;
  let loginServiceSpy: jasmine.SpyObj<LoginService>;

  beforeEach(() => {
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    loginServiceSpy = jasmine.createSpyObj('LoginService', ['isLoggedIn', 'getUserRole']);

    TestBed.configureTestingModule({
      declarations: [RedirectHomeComponent],
      providers: [
        { provide: Router, useValue: routerSpy },
        { provide: LoginService, useValue: loginServiceSpy }
      ]
    });
    fixture = TestBed.createComponent(RedirectHomeComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should redirect to /admin if user is ADMIN', () => {
    loginServiceSpy.isLoggedIn.and.returnValue(true);
    loginServiceSpy.getUserRole.and.returnValue('ADMIN');
    component.ngOnInit();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/admin']);
  });

  it('should redirect to /user-dashboard if user is NORMAL', () => {
    loginServiceSpy.isLoggedIn.and.returnValue(true);
    loginServiceSpy.getUserRole.and.returnValue('NORMAL');
    component.ngOnInit();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/user-dashboard']);
  });

  it('should redirect to /login if not logged in', () => {
    loginServiceSpy.isLoggedIn.and.returnValue(false);
    component.ngOnInit();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
  });
});
