import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { JwtRequest } from '../model/JwtRequest';
import { JwtResponse } from '../model/JwtResponse';
import { User } from '../model/User';
import { LoginService } from './login.service';

describe('LoginService', () => {
  let service: LoginService;
  let httpMock: HttpTestingController;
  let routerSpy: jasmine.SpyObj<Router>;

  const mockToken = 'mock-token';
  const mockUser: User = {
    username: 'testuser',
    authorities: [{ authority: 'ROLE_USER' }],
    firstName: 'Test',
    lastName: 'User',
    email: 'testuser@example.com',
    phone: '1234567890'
    // add other required User fields if needed
  };

  beforeEach(() => {
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        { provide: Router, useValue: routerSpy }
      ]
    });
    service = TestBed.inject(LoginService);
    httpMock = TestBed.inject(HttpTestingController);
    localStorage.clear();
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should generate token via POST', () => {
    const loginData: JwtRequest = { username: 'user', password: 'pass' };
    const mockResponse: JwtResponse = { token: mockToken };

    service.generateToken(loginData).subscribe(res => {
      expect(res).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/generate-token`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(loginData);
    req.flush(mockResponse);
  });

  it('should store token on loginUser', () => {
    expect(service.loginUser(mockToken)).toBeTrue();
    expect(localStorage.getItem('token')).toBe(mockToken);
  });

  it('should return true for isLoggedIn when token exists', () => {
    localStorage.setItem('token', mockToken);
    expect(service.isLoggedIn()).toBeTrue();
  });

  it('should return false for isLoggedIn when token does not exist', () => {
    expect(service.isLoggedIn()).toBeFalse();
    localStorage.setItem('token', '');
    expect(service.isLoggedIn()).toBeFalse();
    localStorage.removeItem('token');
    expect(service.isLoggedIn()).toBeFalse();
  });

  it('should get token from localStorage', () => {
    localStorage.setItem('token', mockToken);
    expect(service.getToken()).toBe(mockToken);
  });

  it('should set user in localStorage and update user$', (done) => {
    service.setUser(mockUser);
    expect(localStorage.getItem('user')).toBe(JSON.stringify(mockUser));
    service.user$.subscribe(user => {
      expect(user).toEqual(mockUser);
      done();
    });
  });

  it('should logout and clear localStorage, update user$, and navigate', (done) => {
    localStorage.setItem('token', mockToken);
    localStorage.setItem('user', JSON.stringify(mockUser));
    service.logout();
    expect(localStorage.getItem('token')).toBeNull();
    expect(localStorage.getItem('user')).toBeNull();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
    service.user$.subscribe(user => {
      expect(user).toBeNull();
      done();
    });
  });

  it('should get user from localStorage', () => {
    localStorage.setItem('user', JSON.stringify(mockUser));
    expect(service.getUser()).toEqual(mockUser);
  });

  it('should return null from getUser if user not in localStorage', () => {
    localStorage.removeItem('user');
    expect(service.getUser()).toBeNull();
  });

  it('should get user role from user', () => {
    localStorage.setItem('user', JSON.stringify(mockUser));
    expect(service.getUserRole()).toBe('ROLE_USER');
  });

  it('should fetch current user from backend', () => {
    service.getCurrentUser().subscribe(user => {
      expect(user).toEqual(mockUser);
    });
    const req = httpMock.expectOne(`${environment.apiUrl}/current-user`);
    expect(req.request.method).toBe('GET');
    req.flush(mockUser);
  });
});
