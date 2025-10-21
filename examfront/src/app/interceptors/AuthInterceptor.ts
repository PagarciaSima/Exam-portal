import { HTTP_INTERCEPTORS, HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import { LoginService } from "../services/login.service";
import { NotificationService } from "../services/notification.service";

const TOKEN_HEADER = 'Authorization';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    constructor(
        private loginService: LoginService,
        private router: Router,
        private notificationService: NotificationService
    ) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        let authReq = req;
        const token = this.loginService.getToken();

        if (token) {
            authReq = authReq.clone({
                setHeaders: {
                    [TOKEN_HEADER]: `Bearer ${token}`
                }
            });
        }

        return next.handle(authReq).pipe(
            catchError((err: HttpErrorResponse) => {
                if (err.status === 401 && err.error?.error === 'JWT Token has expired') {
                    // Redirigir al login
                    this.loginService.logout(); 
                    this.router.navigate(['/login']);
                    this.notificationService.warning('Session has expired. Please log in again.', 'Session Expired');
                }
                return throwError(() => err);
            })
        );
    }
}

export const authInterceptorProvider = [
    {
        provide: HTTP_INTERCEPTORS,
        useClass: AuthInterceptor,
        multi: true
    }
];
