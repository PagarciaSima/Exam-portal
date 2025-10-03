import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { slideIn } from 'src/app/animations/animations';
import { Category } from 'src/app/model/Category';
import { CategoryService } from 'src/app/services/category.service';
import { NotificationService } from 'src/app/services/notification.service';
import { NgForm } from '@angular/forms';

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
    cid: 0,
    title: '',
    description: ''
  };

  constructor(
    private router: Router,
    private notificationService: NotificationService,
    private categoryService: CategoryService,
    private translate: TranslateService,
    private route: ActivatedRoute
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
    this.categoryService.getCategory(cId).subscribe({
      next: (category) => {
        this.category = category;
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
   * Handles the form submission for adding or editing a category.
   * Calls the appropriate method based on the current mode (add or edit).
   */
  public formSubmit() {
    // Trim inputs
    this.category.title = this.category.title.trim();
    this.category.description = this.category.description.trim();

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
    this.categoryService.updateCategory(this.category).subscribe({
      next: () => {
        this.notificationService.success(
          this.translate.instant('CATEGORY_UPDATE_SUCCESS'),
          this.translate.instant('SUCCESS')
        );
        this.resetForm();
        this.router.navigate(['/admin/categories']);
      },
      error: () => {
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
