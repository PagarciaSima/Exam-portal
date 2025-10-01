import { Component, OnInit } from '@angular/core';
import { Quiz } from 'src/app/model/Quiz';
import { NotificationService } from 'src/app/services/notification.service';
import { QuizService } from 'src/app/services/quiz.service';
import { TranslateService } from '@ngx-translate/core';
import { slideIn } from 'src/app/animations/animations';
import { Router } from '@angular/router';

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

  constructor(
    private quizService: QuizService,
    private notificacionService: NotificationService,
    private translate: TranslateService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadQuizzes();
  }

  /**
   * Fetches all quizzes from the backend service and assigns them to the local `quizzes` property.
   * Displays an error notification if the request fails.
   */
  private loadQuizzes(): void {
    this.quizService.getQuizzes().subscribe({
      next: (data: any) => {
        this.quizzes = data;
        console.log(this.quizzes);
      },
      error: (error) => {
        this.notificacionService.error(
          this.translate.instant('QUIZZES_LOAD_ERROR'),
          this.translate.instant('ERROR')
        );
        console.error('Error fetching quizzes:', error);
      }
    });
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
        this.quizService.deleteQuiz(qId).subscribe({
          next: () => {
            this.notificacionService.success(
              this.translate.instant('QUIZ_DELETED_SUCCESS'),
              this.translate.instant('SUCCESS')
            );
            this.quizzes = this.quizzes.filter(q => q.qId !== qId);
          },
          error: (error) => {
            this.notificacionService.error(
              this.translate.instant('QUIZ_DELETE_ERROR'),
              this.translate.instant('ERROR')
            );
            console.error('Error deleting quiz:', error);
          }
        });
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
}
