import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { LoginService } from '../services/login.service';

/**
 * Guard to protect routes for users with the 'NORMAL' role.
 * 
 * This guard checks if the user is logged in and has the 'NORMAL' role.
 * If the user does not meet these criteria, they are redirected to the login page.
 *
 * @remarks
 * Implements Angular's `CanActivate` interface to control route activation.
 *
 * @example
 * // Usage in routing module
 * {
 *   path: 'normal-dashboard',
 *   component: NormalDashboardComponent,
 *   canActivate: [NormalGuard]
 * }
 */
@Injectable({
  providedIn: 'root'
})
export class NormalGuard implements CanActivate {

  constructor(
    private loginService: LoginService,
    private router: Router
  ) {

  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (this.loginService.isLoggedIn() && this.loginService.getUserRole() == 'NORMAL') {
      return true;
    }
    this.router.navigate(['login']);
    return false;
  }
  
}
