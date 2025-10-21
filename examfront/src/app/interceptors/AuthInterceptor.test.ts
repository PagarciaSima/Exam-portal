import { AuthInterceptor } from './AuthInterceptor';
import { LoginService } from '../services/login.service';
import { HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { of } from 'rxjs';

describe('AuthInterceptor', () => {
    let interceptor: AuthInterceptor;
    let loginServiceSpy: jasmine.SpyObj<LoginService>;
    let httpHandlerSpy: jasmine.SpyObj<HttpHandler>;

    beforeEach(() => {
        loginServiceSpy = jasmine.createSpyObj('LoginService', ['getToken']);
        httpHandlerSpy = jasmine.createSpyObj('HttpHandler', ['handle']);
        const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
        const notificationServiceSpy = jasmine.createSpyObj('NotificationService', ['success', 'error']);
        interceptor = new AuthInterceptor(loginServiceSpy, routerSpy, notificationServiceSpy);
    });

    it('should add Authorization header when token is present', () => {
        const token = 'test-token';
        loginServiceSpy.getToken.and.returnValue(token);

        const req = new HttpRequest('GET', '/test');
        httpHandlerSpy.handle.and.returnValue(of({} as HttpEvent<any>));

        interceptor.intercept(req, httpHandlerSpy).subscribe();

        const calledReq = httpHandlerSpy.handle.calls.argsFor(0)[0];
        expect(calledReq.headers.get('Authorization')).toBe(`Bearer ${token}`);
    });

    it('should not add Authorization header when token is null', () => {
        loginServiceSpy.getToken.and.returnValue(null);

        const req = new HttpRequest('GET', '/test');
        httpHandlerSpy.handle.and.returnValue(of({} as HttpEvent<any>));

        interceptor.intercept(req, httpHandlerSpy).subscribe();

        const calledReq = httpHandlerSpy.handle.calls.argsFor(0)[0];
        expect(calledReq.headers.has('Authorization')).toBe(false);
    });

    it('should call next.handle with the request', () => {
        loginServiceSpy.getToken.and.returnValue(null);

        const req = new HttpRequest('GET', '/test');
        httpHandlerSpy.handle.and.returnValue(of({} as HttpEvent<any>));

        interceptor.intercept(req, httpHandlerSpy).subscribe();

        expect(httpHandlerSpy.handle).toHaveBeenCalledWith(req);
    });
});