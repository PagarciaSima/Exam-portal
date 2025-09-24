import { HTTP_INTERCEPTORS, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { LoginService } from "../services/login.service";

const TOKEN_HEADER = 'Authorization';

/**
 * An HTTP interceptor that adds an authorization token to outgoing HTTP requests.
 *
 * This interceptor retrieves the authentication token from the `LoginService` and, if present,
 * attaches it as a Bearer token in the request headers under the key specified by `TOKEN_HEADER`.
 * If no token is available, the request is sent without modification.
 *
 * @example
 * // Automatically attaches the token to all HTTP requests
 * providers: [
 *   { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
 * ]
 *
 * @see HttpInterceptor
 * @see LoginService
 */
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    
    constructor(private loginService: LoginService) {}

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        let authReq = req;
        const token = this.loginService.getToken();

        if (token != null) {
            authReq = authReq.clone({
                setHeaders: {
                    [TOKEN_HEADER]: `Bearer ${token}`   
                }
            });
        }

        return next.handle(authReq); 
    }
}

export const authInterceptorProvider = [
    {
        provide: HTTP_INTERCEPTORS,
        useClass: AuthInterceptor,
        multi: true
    }
]