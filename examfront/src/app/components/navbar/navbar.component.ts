import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/services/login.service';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from 'src/app/services/language.service';

/**
 * NavbarComponent is responsible for displaying the application's navigation bar.
 * It manages user authentication state and provides navigation and logout functionality.
 *
 * @remarks
 * - Uses `LoginService` to track user authentication status.
 * - Updates `isLoggedIn` and `user` properties based on authentication changes.
 * - Provides methods to redirect to the home page and to log out the user.
 *
 * @example
 * <app-navbar></app-navbar>
 */
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  isLoggedIn = false;
  user = null;

  constructor(
    private router: Router,
    public loginService: LoginService,
    private translate: TranslateService,
    private languageService: LanguageService
  ) {
    const lang = this.languageService.getLanguage();
    this.translate.setDefaultLang(lang);
    this.translate.use(lang);
  }

  ngOnInit(): void {
    this.loginService.user$.subscribe(user => {
      this.user = user;
      this.isLoggedIn = !!user;
    });
  }

  redirectHome() {
    this.router.navigate(['home']);
  }

  /**
   * Logs out the current user by invoking the logout method from the login service,
   * updates the authentication state, and clears the user information.
   *
   * @remarks
   * This method should be called when the user chooses to log out from the application.
   *
   * @returns void
   */
  public logout() {
    this.loginService.logout();
    this.isLoggedIn = false;
    this.user = null;
  }

  /**
   * Switches the application's language to the specified language code.
   * @param lang The language code to switch to (e.g., 'en', 'es').
   * 
   * @remarks
   * This method updates the application's language by setting it in the LanguageService
   * and applying it through the TranslateService.
   * 
   * @returns void
   */
  selectLanguage(lang: string) {
    this.languageService.setLanguage(lang);
    this.translate.use(lang);
  }
}
