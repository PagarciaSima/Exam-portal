import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { AdminGuard } from './admin.guard';
import { Router } from '@angular/router';
import { LoginService } from '../services/login.service';

describe('AdminGuard', () => {
  let guard: AdminGuard;
  let loginServiceSpy: jasmine.SpyObj<LoginService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(() => {
    const loginSpy = jasmine.createSpyObj('LoginService', ['isLoggedIn', 'getUserRole']);
    const routerSpyObj = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        AdminGuard,
        { provide: LoginService, useValue: loginSpy },
        { provide: Router, useValue: routerSpyObj }
      ]
    });

    guard = TestBed.inject(AdminGuard);
    loginServiceSpy = TestBed.inject(LoginService) as jasmine.SpyObj<LoginService>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('should allow activation for logged in admin', () => {
    loginServiceSpy.isLoggedIn.and.returnValue(true);
    loginServiceSpy.getUserRole.and.returnValue('ADMIN');
    expect(guard.canActivate({} as any, {} as any)).toBeTrue();
    expect(routerSpy.navigate).not.toHaveBeenCalled();
  });

  it('should not allow activation for non-admin user', () => {
    loginServiceSpy.isLoggedIn.and.returnValue(true);
    loginServiceSpy.getUserRole.and.returnValue('USER');
    expect(guard.canActivate({} as any, {} as any)).toBeFalse();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['login']);
  });

  it('should not allow activation for not logged in user', () => {
    loginServiceSpy.isLoggedIn.and.returnValue(false);
    loginServiceSpy.getUserRole.and.returnValue('');
    expect(guard.canActivate({} as any, {} as any)).toBeFalse();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['login']);
  });
});
