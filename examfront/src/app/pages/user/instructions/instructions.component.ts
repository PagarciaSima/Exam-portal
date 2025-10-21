import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { slideIn } from 'src/app/animations/animations';
import { Quiz } from 'src/app/model/Quiz';
import { LoadingService } from 'src/app/services/loading.service';
import { NotificationService } from 'src/app/services/notification.service';
import { QuizService } from 'src/app/services/quiz.service';

@Component({
  selector: 'app-instructions',
  templateUrl: './instructions.component.html',
  styleUrls: ['./instructions.component.css'],
  animations: [
    slideIn
  ]
})
export class InstructionsComponent implements OnInit {

  qId: number = 0;
  quiz: Quiz | null = null;

  constructor(
    private activatedRoute: ActivatedRoute,
    private quizService: QuizService,
    private notificationService: NotificationService,
    private translateService: TranslateService,
    private router: Router,
    private loadingService: LoadingService 
  ) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      this.qId = +params['qId'] || 0;
      this.loadQuizDetails();
    });
  }

  /**
   * Fetches quiz details using the QuizService and handles success and error scenarios.
   */
  loadQuizDetails(): void {
    this.loadingService.show(); 
    this.quizService.getQuiz(this.qId).subscribe({
      next: (quiz) => {
        this.quiz = quiz;
        this.loadingService.hide(); 
      },
      error: () => {
        this.loadingService.hide(); 
        this.notificationService.error(
          this.translateService.instant('QUIZ_LOAD_ERROR'),
          this.translateService.instant('ERROR')
        );
      }
    });
  }

  /**
   * Navigates to the start page for the quiz with the given ID.
   * @param qId The ID of the quiz to start.
   */
  async startQuiz(qId: number): Promise<void> {
    const confirmed = await this.notificationService.confirm(
      this.translateService.instant('START_QUIZ_CONFIRMATION'),
      this.translateService.instant('START_QUIZ')
    );
    if (confirmed) {
      this.router.navigate(['/start', qId]);
    }
  }
}
