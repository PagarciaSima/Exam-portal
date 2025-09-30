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

  categories: Category[] = [
    { cid: 1, title: 'Science', description: 'Quizzes related to various scientific topics.' },
    { cid: 2, title: 'Mathematics', description: 'Quizzes covering mathematical concepts and problems.' },
    { cid: 3, title: 'History', description: 'Quizzes about historical events and figures.' },
    { cid: 4, title: 'Geography', description: 'Quizzes on geographical locations and features.' },
    { cid: 5, title: 'Literature', description: 'Quizzes about literary works and authors.' }
  ];

  constructor(
    private categoryService: CategoryService,
    private notificationService: NotificationService,
    private router: Router,
    private translate: TranslateService 
  ) { }

  ngOnInit(): void {
    this.fetchAllCategories();
  }

  /**
   * Fetches all categories from the backend service and assigns them to the local `categories` property.
   * Displays an error notification if the request fails.
   *
   * @private
   * @returns {void}
   */
  private fetchAllCategories() {
    this.categoryService.getCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
      },
      error: () => {
        this.notificationService.error(
          this.translate.instant('CATEGORY_LOAD_ERROR'),
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
}
