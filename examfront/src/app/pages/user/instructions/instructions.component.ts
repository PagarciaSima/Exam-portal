import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Quiz } from 'src/app/model/Quiz';
import { NotificationService } from 'src/app/services/notification.service';
import { QuizService } from 'src/app/services/quiz.service';

@Component({
  selector: 'app-instructions',
  templateUrl: './instructions.component.html',
  styleUrls: ['./instructions.component.css']
})
export class InstructionsComponent implements OnInit {

  qId: number = 0;
  quiz: Quiz | null = null;

  constructor(
    private activatedRoute: ActivatedRoute,
    private quizService: QuizService,
    private notificationService: NotificationService,
    private translateService: TranslateService
  ) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      this.qId = +params['qId'] || 0;
      this.loadQuizDetails();
    });
  }

  loadQuizDetails(): void {
    this.quizService.getQuiz(this.qId).subscribe({
      next: (quiz) => {
        this.quiz = quiz;
      },
      error: () => {
        this.notificationService.error(
          this.translateService.instant('QUIZ_LOAD_ERROR'),
          this.translateService.instant('ERROR')
        );
      }
    });
  }
}
