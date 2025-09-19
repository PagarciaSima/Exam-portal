import { animate, style, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { JwtRequest } from 'src/app/model/JwtRequest';
import { LoginService } from 'src/app/services/login.service';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  animations: [
    trigger('fadeInUp', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('500ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ]
})
export class LoginComponent implements OnInit {

  loginData: JwtRequest = {
    username: '',
    password: ''
  }
  
  constructor(
    private loginService: LoginService,
    private notificationService: NotificationService,
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  formSubmit() {
    this.loginService.generateToken(this.loginData).subscribe({
      next: (jwtResponse) => {
        this.notificationService.success('Login successful');
        console.log(jwtResponse.token);
        this.router.navigate(['home']);
      }, error: (err) => {
        let errorMessage = 'Login failed. Please try again.';
        if (err.status === 401) {
          errorMessage = err.error?.error || 'Invalid credentials';
        }
        this.notificationService.error(errorMessage);
        }
    });
  }
  

}
