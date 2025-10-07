import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { slideIn } from 'src/app/animations/animations';
import { Category } from 'src/app/model/Category';
import { CategoryService } from 'src/app/services/category.service';
import { NotificationService } from 'src/app/services/notification.service';
import { TranslateService } from '@ngx-translate/core'; 

@Component({
  selector: 'app-view-categories',
  templateUrl: './view-categories.component.html',
  styleUrls: ['./view-categories.component.css'],
  animations: [
    slideIn
  ]
})
export class ViewCategoriesComponent implements OnInit {

  categories: Category[] = [];
  page = 0;
  size = 7;
  totalPages = 1;
  searchTerm: string = '';

  constructor(
    private categoryService: CategoryService,
    private notificationService: NotificationService,
    private router: Router,
    private translate: TranslateService 
  ) { }

  ngOnInit(): void {
    this.fetchCategoriesPaged();
  }

  /**
   * Fetches a paginated list of categories from the backend service.
   * Updates the local `categories` property and `totalPages` based on the response.
   * Displays an error notification if the request fails.
   *
   * @private
   * @returns {void}
   */
  private fetchCategoriesPaged() {
    this.categoryService.getCategoriesPaged(this.page, this.size, this.searchTerm).subscribe({
      next: (data) => {
        this.categories = data.content;
        this.totalPages = data.totalPages;
      },
      error: () => {
        this.notificationService.error(
          this.translate.instant('CATEGORIES_LOAD_ERROR'),
          this.translate.instant('ERROR')
        );
      }
    });
  }

  /**
   * Navigates the user to the "Add Category" page within the admin section.
   *
   * This method uses Angular's Router to redirect the user to the route
   * responsible for adding a new category.
   */
  addCategory() {
    this.router.navigate(['/admin/add-category']);
  }

  /**
   * Navigates to the edit category page.
   */
  editCategory(categoryId: number): void {
    this.router.navigate(['/admin/add-category', categoryId]);
  }

  /**
   * Deletes a category by its id after confirmation and updates the local list.
   * Shows a notification on success or error.
   */
  deleteCategory(categoryId: number): void {
    this.notificationService.confirm(
      this.translate.instant('CATEGORY_DELETE_CONFIRM'),
      this.translate.instant('CONFIRM')
    ).then(confirmed => {
      if (confirmed) {
        this.categoryService.deleteCategory(categoryId).subscribe({
          next: () => {
            this.categories = this.categories.filter(cat => cat.cid !== categoryId);
            this.notificationService.success(
              this.translate.instant('CATEGORY_DELETED_SUCCESS'),
              this.translate.instant('SUCCESS')
            );
          },
          error: () => {
            this.notificationService.error(
              this.translate.instant('CATEGORY_DELETE_ERROR'),
              this.translate.instant('ERROR')
            );
          }
        });
      }
    });
  }

  /**
   * Executes a search for categories based on the current search term.
   * Resets the page to 0 (first page) and fetches the categories.
   *
   * @returns {void}
   */
  onSearch() {
    this.page = 0; // Reset to first page on new search
    this.fetchCategoriesPaged();
  }

  /**
   * Navigates to the specified page of categories if within valid range.
   *
   * @param {number} page - The page number to navigate to.
   * @returns {void}
   */
  goToPage(page: number) {
    if (page >= 0 && page < this.totalPages) {
      this.page = page;
      this.fetchCategoriesPaged();
    }
  }

  onSearchTermChange(term: string) {
    this.searchTerm = term;
    this.page = 0; // Reset to first page on new search
    this.fetchCategoriesPaged();
  }
}
