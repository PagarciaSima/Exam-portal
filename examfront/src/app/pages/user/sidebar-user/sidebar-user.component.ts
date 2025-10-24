import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { slideIn } from 'src/app/animations/animations';
import { Category } from 'src/app/model/Category';
import { CategoryService } from 'src/app/services/category.service';
import { LoadingService } from 'src/app/services/loading.service';
import { LoginService } from 'src/app/services/login.service';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'app-sidebar-user',
  templateUrl: './sidebar-user.component.html',
  styleUrls: ['./sidebar-user.component.css'],
  animations: [
    slideIn
  ]
})
export class SidebarUserComponent implements OnInit {
  categories: Category[] = [];
  page: number = 0;
  totalPages: number = 1;
  pageSize: number = 8;
  searchTerm: string = '';

  constructor(
    private loginService: LoginService,
    private notificationService: NotificationService,
    private translateService: TranslateService,
    private categoryService: CategoryService,
    private loadingService: LoadingService
  ) { }
  
  ngOnInit(): void {
    this.loadCategories(this.page);
  }

  /**
   * Loads a paginated list of categories from the server.
   * Updates the local `categories` array and `totalPages` based on the response.
   *
   * @param {number} page - The page number to load.  
   */
  loadCategories(page: number): void {
    this.loadingService.show();
    this.categoryService.getCategoriesPaged(page, this.pageSize, this.searchTerm).subscribe({
      next: (res) => {
        this.categories = res.content;
        this.totalPages = res.totalPages;
        this.page = page;
        this.loadingService.hide();
      },
      error: (err) => {
        this.categories = [];
        this.totalPages = 1;
        this.loadingService.hide();
      }
    });
  }

  /**
   * Navigates to a specific page of categories.
   * @param {number} page - The page number to navigate to
   *
   */
  goToPage(page: number): void {
    this.loadCategories(page);
  }

  /**
   * Handles changes to the search term and reloads categories.
   * @param {string} term - The new search term
   * 
   */
  onSearchTermChange(term: string): void {
    this.searchTerm = term;
    this.page = 0; 
    this.loadCategories(this.page);
  }

  /**
   * Logs out the current user and shows a success notification.
   */
  logout() {
    this.loginService.logout();
    const message = this.translateService.instant('LOGOUT.SUCCESS');
    const title = this.translateService.instant('LOGOUT.TITLE');
    this.notificationService.success(message, title);
  }
}
