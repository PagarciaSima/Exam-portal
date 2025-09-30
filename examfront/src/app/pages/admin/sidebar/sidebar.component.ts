import { Component, OnInit } from '@angular/core';
import { slideIn } from 'src/app/animations/animations';
import { LoginService } from 'src/app/services/login.service';
import { NotificationService } from 'src/app/services/notification.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
  animations: [
      slideIn
  ]
})
export class SidebarComponent implements OnInit {

  constructor(
    private loginService: LoginService,
    private notificationService: NotificationService,
    private translateService: TranslateService
  ) { }

  ngOnInit(): void {
  }

  logout() {
    this.loginService.logout();
    const message = this.translateService.instant('LOGOUT.SUCCESS');
    const title = this.translateService.instant('LOGOUT.TITLE');
    this.notificationService.success(message, title);
  }
}
