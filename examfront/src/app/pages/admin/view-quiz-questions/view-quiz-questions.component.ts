import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { slideIn } from 'src/app/animations/animations';
import { Question } from 'src/app/model/Question';
import { NotificationService } from 'src/app/services/notification.service';
import { QuestionService } from 'src/app/services/question.service';
import { TranslateService } from '@ngx-translate/core'; // Importa TranslateService
import { switchMap } from 'rxjs/operators';

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

  constructor(
    private activatedRoute: ActivatedRoute,
    private questionService: QuestionService,
    private notificationService: NotificationService,
    private router: Router,
    private translate: TranslateService // Inyecta TranslateService
  ) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      this.qId = params['id'];
      this.qTitle = params['title'];
    });

    this.getQuestionsOfQuiz(this.qId);
  }

  /**
   * @param quizId ID of the quiz to fetch questions for
   * Fetches the questions for the specified quiz and handles success and error scenarios.
   */
  private getQuestionsOfQuiz(quizId: number): void {
    this.questionService.getQuestionsOfQuiz(quizId).subscribe({
      next: (data: any) => {
        this.questions = data;
      },
      error: (error) => {
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
        this.questionService.deleteQuestion(quesId).pipe(
          switchMap(() => this.questionService.getQuestionsOfQuiz(this.qId))
        ).subscribe({
          next: (questions) => {
            this.questions = questions;
            this.notificationService.success(
              this.translate.instant('QUESTION_DELETED_SUCCESS'),
              this.translate.instant('SUCCESS')
            );
          },
          error: (error) => {
            this.notificationService.error(
              this.translate.instant('QUESTION_DELETE_ERROR'),
              this.translate.instant('ERROR')
            );
            console.error('Error deleting question:', error);
          }
        });
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
  
}
