/**
 * SidebarComponent is responsible for rendering the sidebar section in the admin pages.
 * 
 * @remarks
 * This component uses the `sidebar.component.html` template and `sidebar.component.css` styles.
 * 
 * @example
 * Usage in a template:
 * ```html
 * <app-sidebar></app-sidebar>
 * ```
 * 
 * @implements OnInit
 */
import { Component, OnInit } from '@angular/core';
import { slideIn } from 'src/app/animations/animations';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
  animations: [
      slideIn
  ]
})
export class SidebarComponent implements OnInit {

  constructor(private loginService: LoginService) { }

  ngOnInit(): void {
  }

  logout() {
    this.loginService.logout();
  }
}
