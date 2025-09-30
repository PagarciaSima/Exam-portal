import { Component, OnInit, ViewChild } from '@angular/core';
import { slideIn } from 'src/app/animations/animations';
import { Category } from 'src/app/model/Category';
import { Quiz } from 'src/app/model/Quiz';
import { CategoryService } from 'src/app/services/category.service';
import { NotificationService } from 'src/app/services/notification.service';
import { TranslateService } from '@ngx-translate/core';
import { QuizService } from 'src/app/services/quiz.service';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-quiz',
  templateUrl: './add-quiz.component.html',
  styleUrls: ['./add-quiz.component.css'],
  animations: [
    slideIn
  ]
})
export class AddQuizComponent implements OnInit {

  quiz: Quiz = this.setQuizDefaultValue();
  categories: Category[] = [];
  @ViewChild('quizForm') quizForm: NgForm;

  constructor(
    private categoryService: CategoryService,
    private notificationService: NotificationService,
    private quizService: QuizService,
    private translate: TranslateService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadCategories();
  }

  /**
   * Loads the list of categories from the backend service and assigns them to the `categories` property.
   * 
   * On success, updates the local `categories` array with the fetched data.
   * On error, displays a localized error notification using the translation and notification services,
   * and logs the error to the console.
   *
   * @returns void
   */
  loadCategories() {
    this.categoryService.getCategories().subscribe({
      next: (data) => {
        this.categories = data;
      },
      error: (error) => {
        this.translate.get('CATEGORY_LOAD_ERROR').subscribe((msg: string) => {
          this.notificationService.error(msg, this.translate.instant('ERROR'));
        });
        console.error('Error loading categories', error);
      }
    });
  }

  /**
   * Handles the form submission for adding a new quiz.
   * 
   * This method sends the quiz data to the backend using the `quizService.addQuiz` method.
   * On successful addition, it displays a success notification using a translated message,
   * resets the form, and reinitializes the quiz object to its default values.
   * If an error occurs during the process, it displays an error notification with a translated message
   * and logs the error to the console.
   */
  formSubmit() {
    this.quizService.addQuiz(this.quiz).subscribe({
      next: () => {
        this.translate.get('QUIZ_ADD_SUCCESS').subscribe((msg: string) => {
          this.notificationService.success(msg, this.translate.instant('SUCCESS'));
        });
        this.quizForm.resetForm();
        this.quiz = this.setQuizDefaultValue();
        this.router.navigate(['/admin/quizzes']);
      },
      error: (error) => {
        this.translate.get('QUIZ_ADD_ERROR').subscribe((msg: string) => {
          this.notificationService.error(msg, this.translate.instant('ERROR'));
        });
        console.error('Error adding quiz', error);
      }
    });
  }

  /**
   * Sets and returns the default values for a `Quiz` object.
   *
   * @returns {Quiz} A `Quiz` object initialized with default values:
   * - `title`: An empty string.
   * - `description`: An empty string.
   * - `questions`: An empty array.
   * - `qId`: 0.
   * - `maxMarks`: 0.
   * - `numberOfQuestions`: 0.
   * - `active`: false.
   * - `category`: An object with `cid` as 0, and empty `title` and `description`.
   */
  private setQuizDefaultValue(): Quiz {
    return this.quiz = {
      title: '',
      description: '',
      questions: [],
      qId: 0,
      maxMarks: 0,
      numberOfQuestions: 0,
      active: false,
      category: { cid: 0, title: '', description: '' }
    };
  }
}

