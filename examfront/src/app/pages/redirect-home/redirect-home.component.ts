import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-redirect-home',
  templateUrl: './redirect-home.component.html',
  styleUrls: ['./redirect-home.component.css']
})
export class RedirectHomeComponent implements OnInit {

  constructor(private loginService: LoginService, private router: Router) {}

  ngOnInit(): void {
    if (this.loginService.isLoggedIn()) {
      const user = this.loginService.getUserRole();
      if (user === 'ADMIN') {
        this.router.navigate(['/admin']);
      } else {
        this.router.navigate(['/user-dashboard']);
      }
    } else {
      this.router.navigate(['/login']);
    }
  }
}