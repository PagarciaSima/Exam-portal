import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { slideIn } from 'src/app/animations/animations';
import { Category } from 'src/app/model/Category';
import { CategoryService } from 'src/app/services/category.service';
import { LoadingService } from 'src/app/services/loading.service';
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

  @ViewChild('categoryForm') categoryForm!: NgForm;

  public isEditMode: boolean = false;

  category: Category = {
    cid: null,
    title: '',
    description: ''
  };

  constructor(
    private router: Router,
    private notificationService: NotificationService,
    private categoryService: CategoryService,
    private translate: TranslateService,
    private route: ActivatedRoute,
    private loadingService: LoadingService
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
    const cid = params.get('cid');
    if (cid) {
      this.isEditMode = true;
      this.loadCategory(+cid); 
    } else {
      this.isEditMode = false;
      this.category = { cid: 0, title: '', description: '' };
    }
  });
  }
  /**
   * Loads a category by its ID and assigns it to the local `category` property.
   * Displays an error notification if the request fails.
   *
   * @param {number} cId - The ID of the category to load.
   * @returns {void}
   */
  private loadCategory(cId: number) {
    this.loadingService.show();
    this.categoryService.getCategory(cId).subscribe({
      next: (category) => {
        this.category = category;
        this.loadingService.hide();
      },
      error: () => {
        this.notificationService.error(
          this.translate.instant('CATEGORY_LOAD_ERROR'),
          this.translate.instant('ERROR')
        );
        this.loadingService.hide();
      }
    });
  }

  /**
   * Handles the form submission for adding or editing a category.
   * Calls the appropriate method based on the current mode (add or edit).
   */
  public formSubmit() {
    // Trim inputs
    this.category.title = this.category.title.trim();
    this.category.description = this.category.description.trim();
    console.log(this.category);

    if (this.isEditMode) {
      this.editCategory();
    } else {
      this.addCategory();
    }
  }

  /**
   * Sends a request to add a new category using the CategoryService.
   * Displays success or error notifications based on the outcome of the operation.
   * Navigates back to the categories list upon successful addition.
   * 
   * @returns void
   * 
   * @example
   * this.addCategory();
   */
  private addCategory() {
    this.categoryService.addCategory(this.category).subscribe({
      next: () => {
        this.notificationService.success(
          this.translate.instant('CATEGORY_ADD_SUCCESS'),
          this.translate.instant('SUCCESS')
        );
        this.resetForm();
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

  /**
   * Sends a request to update an existing category using the CategoryService.
   * Displays success or error notifications based on the outcome of the operation.
   * Navigates back to the categories list upon successful update.
   * 
   * @returns void
   * 
   * @example
   * this.editCategory();
   */
  private editCategory() {
    this.loadingService.show();
    this.categoryService.updateCategory(this.category).subscribe({
      next: () => {
        this.loadingService.hide();
        this.notificationService.success(
          this.translate.instant('CATEGORY_UPDATE_SUCCESS'),
          this.translate.instant('SUCCESS')
        );
        this.resetForm();
        this.router.navigate(['/admin/categories']);
      },
      error: () => {
        this.loadingService.hide();
        this.notificationService.error(
          this.translate.instant('CATEGORY_UPDATE_ERROR'),
          this.translate.instant('ERROR')
        );
      }
    });
  }

  /**
   * Resets the form and clears the category object.
   */
  private resetForm() {
    this.category = { cid: 0, title: '', description: '' };
    if (this.categoryForm) {
      this.categoryForm.resetForm();
    }
  }
}
