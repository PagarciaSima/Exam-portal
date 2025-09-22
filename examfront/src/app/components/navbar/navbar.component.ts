import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/services/login.service';

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
    public loginService: LoginService
  ) { }

  ngOnInit(): void {
    this.loginService.user$.subscribe(user => {
      this.user = user;
      this.isLoggedIn = !!user;
    });
  }

  redirectHome() {
    this.router.navigate(['home']);
  }

  public logout() {
    this.loginService.logout();
    this.isLoggedIn = false;
    this.user = null;

  }
}
