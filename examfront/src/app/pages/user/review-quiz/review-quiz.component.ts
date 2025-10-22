import { Component, OnInit } from '@angular/core';
import { QuestionAttemptDTO, QuizAttemptDTO } from 'src/app/model/QuestionAttemptDTO';
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
    private quizState: QuizStateService
  ) { }

  ngOnInit(): void {
    this.loadLastQuizAttempts();
  }

  private loadLastQuizAttempts(): void {
    this.quizState.getLastAttempts().subscribe({
      next: (data: QuizAttemptDTO) => {
        console.log('Last attempts data:', data);

        if (data && data.questions && data.questions.length > 0) {
          this.marksGot = data.marksGot;
          this.questions = data.questions;
          this.correctAnswers = data.correctAnswers;
          this.maxMarks = data.maxMarks;
          this.score = this.maxMarks > 0 ? (this.marksGot / this.maxMarks) * 10 : 0;
        }
      },
      error: (err) => {
        console.error('Error fetching last attempts:', err);
      }
    });
  }
}
