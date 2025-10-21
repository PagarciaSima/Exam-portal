import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { slideIn } from 'src/app/animations/animations';
import { Question } from 'src/app/model/Question';
import { NotificationService } from 'src/app/services/notification.service';
import { QuestionService } from 'src/app/services/question.service';
import { TranslateService } from '@ngx-translate/core'; 
import { switchMap } from 'rxjs/operators';
import { LoadingService } from 'src/app/services/loading.service';

@Component({
  selector: 'app-view-quiz-questions',
  templateUrl: './view-quiz-questions.component.html',
  styleUrls: ['./view-quiz-questions.component.css'],
  animations: [
    slideIn
  ]
})
export class ViewQuizQuestionsComponent implements OnInit {

  qId: number;
  qTitle: string;
  questions: Question[] = [];
  page = 0;
  size = 7;
  totalPages = 1;
  searchTerm = ''; 
  isLoading = true;

  constructor(
    private activatedRoute: ActivatedRoute,
    private questionService: QuestionService,
    private notificationService: NotificationService,
    private router: Router,
    private translate: TranslateService,
    private loadingService: LoadingService
  ) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      this.qId = params['id'];
      this.qTitle = params['title'];
      this.getQuestionsOfQuizPaged();
    });
  }

  /**
   * Fetches paginated questions for the current quiz.
   * Handles loading state and error notifications.
   * Uses the QuestionService to retrieve data.
   * Updates the questions array and totalPages on success.
   * Displays an error notification if the fetch fails.
   */
  getQuestionsOfQuizPaged(): void {
    this.loadingService.show();
    this.questionService.getQuestionsOfQuizPaged(this.qId, this.page, this.size, this.searchTerm).subscribe({
      next: (data) => {
        this.loadingService.hide();
        this.questions = data.content;
        this.totalPages = data.totalPages;
        this.isLoading = false;
      },
      error: (error) => {
        this.loadingService.hide();
        this.notificationService.error(
          this.translate.instant('QUESTIONS_LOAD_ERROR'),
          this.translate.instant('ERROR')
        );
        console.error('Error fetching questions:', error);
      }
    });
  }

  /**
   * Navigates to the Add Question page for the current quiz.
   */
  addQuestion() {
    this.router.navigate(['/admin/add-question', this.qId, this.qTitle]);
  }

  /**
   * Deletes a question by its ID.
   * @param quesId The ID of the question to be deleted.
   */
  deleteQuestion(quesId: number): void {
    
    this.notificationService.confirm(
      this.translate.instant('QUESTION_DELETE_CONFIRM'),
      this.translate.instant('CONFIRM')
    ).then(confirmed => {
      if (confirmed) {
        this.loadingService.show();
        this.questionService.deleteQuestion(quesId).pipe(
          switchMap(() => this.questionService.getQuestionsOfQuiz(this.qId))
        ).subscribe({
          next: (questions) => {
            this.loadingService.hide();
            this.questions = questions;
            this.notificationService.success(
              this.translate.instant('QUESTION_DELETED_SUCCESS'),
              this.translate.instant('SUCCESS')
            );
          },
          error: (error) => {
            this.loadingService.hide();
            this.notificationService.error(
              this.translate.instant('QUESTION_DELETE_ERROR'),
              this.translate.instant('ERROR')
            );
            console.error('Error deleting question:', error);
          }
        });
      } else {
        this.loadingService.hide();
      }
    });
  }

  /**
   * Navigates to the Edit Question page for the specified question ID.
   * @param quesId The ID of the question to be edited.
   */
  editQuestion(quesId: number): void {
    this.router.navigate(['admin/add-question', this.qId, this.qTitle, quesId]);
  }

  /**
   * 
   * @param term The search term entered by the user.
   * Updates the searchTerm property and resets the page to 0.
   * Calls getQuestionsOfQuizPaged to fetch filtered questions.
   */
  onSearchTermChange(term: string) {
    this.searchTerm = term;
    this.page = 0; // Reinicia la paginación al buscar
    this.getQuestionsOfQuizPaged();
  }

  /**
   * 
   * @param page The page number to navigate to.
   * Updates the page property and calls getQuestionsOfQuizPaged to fetch questions for the new page.
   */
  goToPage(page: number) {
    if (page >= 0 && page < this.totalPages) {
      this.page = page;
      this.getQuestionsOfQuizPaged();
    }
  }
  
}
