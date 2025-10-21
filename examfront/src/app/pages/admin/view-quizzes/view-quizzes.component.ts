import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { slideIn } from 'src/app/animations/animations';
import { Quiz } from 'src/app/model/Quiz';
import { LoadingService } from 'src/app/services/loading.service';
import { NotificationService } from 'src/app/services/notification.service';
import { QuizService } from 'src/app/services/quiz.service';

@Component({
  selector: 'app-view-quizzes',
  templateUrl: './view-quizzes.component.html',
  styleUrls: ['./view-quizzes.component.css'],
  animations: [
    slideIn
  ]
})
export class ViewQuizzesComponent implements OnInit {

  quizzes: Quiz[] = [];
  page = 0;
  size = 5;
  totalPages = 1;
  searchTerm: string = '';
  isLoading: boolean = true;

  constructor(
    private quizService: QuizService,
    private notificacionService: NotificationService,
    private translate: TranslateService,
    private router: Router,
    private loadingService: LoadingService
  ) { }

  ngOnInit(): void {
    this.loadQuizzesPaged();
  }

  /**
   * Loads a paginated list of quizzes from the server.
   * Updates the local `quizzes` array and `totalPages` based on the response.
   */
  loadQuizzesPaged(): void {
    this.loadingService.show();
    this.quizService.getQuizzesPaged(this.page, this.size, this.searchTerm).subscribe({
      next: (data) => {
        this.quizzes = data.content;
        this.totalPages = data.totalPages;
        this.isLoading = false;
        this.loadingService.hide();
      },
      error: (error) => {
        this.loadingService.hide();
        this.notificacionService.error(
          this.translate.instant('QUIZZES_LOAD_ERROR'),
          this.translate.instant('ERROR')
        );
        console.error('Error fetching quizzes:', error);
      }
    });
  }

  /**
   * Truncates a string to a specified length and adds ellipsis if truncated.
   * @param desc The description to truncate.
   * @param limit The maximum length of the truncated string.
   * @returns The truncated string with ellipsis if truncated.
   */
  truncateDescription(desc: string, limit: number = 100): string {
    if (!desc) return '';
    return desc.length > limit ? desc.substring(0, limit) + '...' : desc;
  }

  /**
   *  Navigates the user to the "Add Quiz" page within the admin section.
   */
  addQuiz() {
    this.router.navigate(['/admin/add-quiz']);
  }

  /**
   * 
   * @param qId The ID of the quiz to be deleted.
   * Deletes a quiz by its ID after user confirmation.
   * Displays success or error notifications based on the outcome of the delete operation.
   * 
   * @returns void
   * 
   * @example
   * this.deleteQuiz(1);
   */
  deleteQuiz(qId: number) {
    this.notificacionService.confirm(
      this.translate.instant('QUIZ_DELETE_CONFIRM'),
      this.translate.instant('CONFIRM')
    ).then(confirmed => {
      if (confirmed) {
        this.loadingService.show();
        this.quizService.deleteQuiz(qId).subscribe({
          next: () => {
            this.loadingService.hide();
            this.notificacionService.success(
              this.translate.instant('QUIZ_DELETED_SUCCESS'),
              this.translate.instant('SUCCESS')
            );
            this.quizzes = this.quizzes.filter(q => q.qId !== qId);
          },
          error: (error) => {
            this.loadingService.hide();
            this.notificacionService.error(
              this.translate.instant('QUIZ_DELETE_ERROR'),
              this.translate.instant('ERROR')
            );
            console.error('Error deleting quiz:', error);
          }
        });
      } else {
        this.loadingService.hide();
      }
    });
  }

  /**
   * @param qId The ID of the quiz to be edited.
   * Navigates to the edit quiz page for the specified quiz ID.
   */
  editQuiz(qId: number) {
    this.router.navigate(['/admin/add-quiz', qId]);
  }

  /**
   * @param qId The ID of the quiz whose questions are to be viewed.
   * @param title The title of the quiz whose questions are to be viewed.
   */
  public viewQuestions(qId: number, title: string): void {
    this.router.navigate(['/admin/view-questions', qId, title]);
  }

  /**
   * Called when the search term is changed.
   * Updates the searchTerm property and reloads the quizzes.
   * @param term The new search term.
   */
  onSearchTermChange(term: string) {
    this.searchTerm = term;
    this.page = 0; // Reset to first page on new search
    this.loadQuizzesPaged();
  }

  /**
   * Navigates to the specified page of quizzes.
   * @param page The page number to navigate to.
   */
  goToPage(page: number) {
    if (page >= 0 && page < this.totalPages) {
      this.page = page;
      this.loadQuizzesPaged();
    }
  }
}