import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { slideIn } from 'src/app/animations/animations';
import { Category } from 'src/app/model/Category';
import { CategoryService } from 'src/app/services/category.service';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'app-add-category',
  templateUrl: './add-category.component.html',
  styleUrls: ['./add-category.component.css'],
  animations: [
    slideIn
  ]
})
export class AddCategoryComponent implements OnInit {

  category: Category = {
    cid: 0,
    title: '',
    description: ''
  };

  constructor(
    private router: Router,
    private notificationService: NotificationService,
    private categoryService: CategoryService,
    private translate: TranslateService
  ) { }

  ngOnInit(): void {

  }

  /**
   * Handles the submission of the category form.
   * 
   * Sends the current category data to the backend via the CategoryService.
   * On successful addition, displays a success notification and navigates to the categories list.
   * On error, displays an error notification.
   *
   * @returns void
   */
  formSubmit() {
    this.categoryService.addCategory(this.category).subscribe({
      next: () => {
       this.notificationService.success(
        this.translate.instant('CATEGORY_ADD_SUCCESS'),
        this.translate.instant('SUCCESS')
      );
        this.router.navigate(['/admin/categories']);
      },
      error: () => {
        this.notificationService.error(
          this.translate.instant('CATEGORY_ADD_ERROR'),
          this.translate.instant('ERROR')
        );
      }
    });
  }
}
