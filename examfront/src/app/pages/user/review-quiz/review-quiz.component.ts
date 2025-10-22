import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { QuestionAttemptDTO, QuizAttemptDTO } from 'src/app/model/QuestionAttemptDTO';
import { NotificationService } from 'src/app/services/notification.service';
import { QuizStateService } from 'src/app/services/quiz-state.service';

@Component({
  selector: 'app-review-quiz',
  templateUrl: './review-quiz.component.html',
  styleUrls: ['./review-quiz.component.css']
})
export class ReviewQuizComponent implements OnInit {
  questions: QuestionAttemptDTO[] = [];
  marksGot: number = 0;
  correctAnswers: number = 0;
  maxMarks: number = 0;
  score: number = 0;

  constructor(
    private quizState: QuizStateService,
    private notificationService: NotificationService,
    private translateService: TranslateService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadLastQuizAttempts();
  }

  /**
   * Loads the last quiz attempts of the user and assigns the data to component properties.
   */
  private loadLastQuizAttempts(): void {
    this.quizState.getLastAttempts().subscribe({
      next: (data: QuizAttemptDTO) => {

        if (data && data.questions && data.questions.length > 0) {
          this.marksGot = data.marksGot;
          this.questions = data.questions;
          this.correctAnswers = data.correctAnswers;
          this.maxMarks = data.maxMarks;
          this.score = this.maxMarks > 0 ? (this.marksGot / this.maxMarks) * 10 : 0;
        }
      },
      error: (err) => {
        this.notificationService.error(
          this.translateService.instant('FAILED_LOADING_QUESTIONS'),
          this.translateService.instant('ERROR')
        );
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/user-dashboard', 0]);
  }
}
