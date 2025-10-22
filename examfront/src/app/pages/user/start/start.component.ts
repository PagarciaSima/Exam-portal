import { LocationStrategy } from '@angular/common';
import { Component, NgZone, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Question } from 'src/app/model/Question';
import { LoadingService } from 'src/app/services/loading.service';
import { NotificationService } from 'src/app/services/notification.service';
import { QuestionService } from 'src/app/services/question.service';
import { QuizStateService } from 'src/app/services/quiz-state.service';
import { QuizService } from 'src/app/services/quiz.service';

@Component({
  selector: 'app-start',
  templateUrl: './start.component.html',
  styleUrls: ['./start.component.css']
})
export class StartComponent implements OnInit {

  qId: number | null = null;
  questions: Question[] = [];
  shuffledQuestions: Question[] = [];
  isShuffled = false;
  marksGot = 0;
  correctAnswers = 0;
  attempted = 0;
  isSubmit = false;
  timer: number | null = null;
  totalTime: number = 0;
  minutesPerQuestion: number = 1;

  currentPage = 0;
  pageSize = 7; 
  totalPages = 0;
  totalElements = 0;
  answersMap: { [qid: number]: string } = {}; 

  constructor(
    private locationSt: LocationStrategy,
    private activatedRoute: ActivatedRoute,
    private questionService: QuestionService,
    private notificationService: NotificationService,
    private translateService: TranslateService,
    private router: Router,
    private ngZone: NgZone,
    private loadService: LoadingService,
    private quizService: QuizService,
    private quizState: QuizStateService
  ) {}

  ngOnInit(): void {
    this.preventBackButton();
    this.activatedRoute.params.subscribe(params => {
      this.qId = +params['qId'] || null;
      this.loadQuestionsShuffled(this.qId);
    });
  }

  /**
   * Load questions for the quiz and shuffle them.
   * @param qId 
   */
  loadQuestionsShuffled(qId: number | null): void {
    this.loadService.show();
    this.questionService.getQuestionsOfQuiz(qId).subscribe({
      next: (result) => {
        this.loadService.hide();
        result.forEach(q => {
          if (q.givenAnswer === undefined) q.givenAnswer = '';
        });
        this.questions = result;
        if (!this.isShuffled) {
          this.shuffledQuestions = this.shuffleArray([...this.questions]);
          this.shuffledQuestions.forEach(q => {
            if (q.givenAnswer === undefined) q.givenAnswer = '';
          });
          this.isShuffled = true;
        }
        this.totalElements = this.shuffledQuestions.length;
        this.totalPages = Math.ceil(this.totalElements / this.pageSize);
        this.setPage(this.currentPage);
        this.totalTime = this.totalElements * this.minutesPerQuestion * 60;
        this.timer = this.totalTime;
        this.checkTimerForSubmit();
      },
      error: (error) => {
        this.loadService.hide();
        this.notificationService.error(
          this.translateService.instant("QUESTIONS_LOAD_ERROR"),
          this.translateService.instant("ERROR")
        );
        console.error("Error loading questions:", error);
      }
    });
  }

  /**
   * Shuffle the questions in the array.
   * @param array 
   * @returns Shuffled array
   */
  shuffleArray(array: Question[]): Question[] {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  /**
   * Set the current page of questions to display.
   * @param page The page number to set.
   */
  setPage(page: number): void {
    const start = page * this.pageSize;
    const end = start + this.pageSize;
    this.questions = this.shuffledQuestions.slice(start, end);
    this.questions.forEach(q => {
      q.givenAnswer = this.answersMap[q.quesId] || '';
    });
  }

  /**
   * Go to the next page of questions.
   */
  nextPage(): void {
    if (this.currentPage < this.totalPages - 1) {
      this.currentPage++;
      this.setPage(this.currentPage);
    }
  }

  /**
   * Go to the previous page of questions.
   */
  prevPage(): void {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.setPage(this.currentPage);
    }
  }

  /**
   * Prevent the back button from navigating away.
   */
  preventBackButton(): void {
    history.pushState(null, '', location.href);
    this.locationSt.onPopState(() => {
      history.pushState(null, '', location.href);
    });
  }

  /**
   * Submit the quiz.
   * @param skipConfirm Whether to skip the confirmation dialog.
   * @returns void
   */
  submitQuiz(skipConfirm: boolean = false): void {  
    if (skipConfirm) {
      this.isSubmit = true;
      this.finalizeQuiz();
      return;
    }
    this.notificationService.confirm(
      this.translateService.instant("SUBMIT_QUIZ_CONFIRMATION"),
      this.translateService.instant('CONFIRM')
    ).then((confirmed) => {
      console.log("CONFIRMERED:", confirmed);
      if (confirmed) {
        this.ngZone.run(() => {
          this.isSubmit = true;
          console.log("isSubmit:", this.isSubmit);
          this.finalizeQuiz();
        });
      }
    });
  }

  /**
   * Finalize the quiz by calculating results.
   */
  private finalizeQuiz(): void {
    this.shuffledQuestions.forEach(q => {
      q.givenAnswer = this.answersMap[q.quesId] || '';
    });

    this.loadService.show();
    this.quizService.submitQuiz(this.shuffledQuestions).subscribe({
      next: (res) => {
        this.loadService.hide();
        this.marksGot = res.marksGot;
        this.correctAnswers = res.correctAnswers;
        this.attempted = res.attempted;
      },
      error: (err) => {
        this.loadService.hide();
        this.notificationService.error(
          this.translateService.instant("SUBMIT_QUIZ_ERROR"),
          this.translateService.instant("ERROR")
        );
      }
    });
  }

  /**
   * Handle changes to the answer for a specific question.
   * @param question The question whose answer has changed.
   */
  onAnswerChange(question: Question): void {
    this.answersMap[question.quesId] = question.givenAnswer;
  }

  /**
   * Navigate to the user dashboard home.
   */
  goHome(): void {
    this.router.navigate(['/user-dashboard/0']);
  }

  /**
   * Get the formatted timer string in MM:SS format.
   * @returns Formatted timer string.
   */
  get formattedTimer(): string {
    if (this.timer === null) return '';
    const minutes = Math.floor(this.timer / 60);
    const seconds = this.timer % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }

  /**
   * Check the timer and submit the quiz when time runs out.
   */
  checkTimerForSubmit(): void {
    let t = window.setInterval(() => {
      if (this.timer !== null) {
        if (this.timer <= 0) {
          this.submitQuiz(true);
          clearInterval(t);
        } else {
          this.timer--;
        }
      }
    }, 1000);
  }

  /**
   * Navigate to the review quiz page.
   */
  goToReview(): void {
    this.router.navigate(['/review-quiz']);
  }

  /**
   * Print the quiz results.
   */
  printResults(): void {
    window.print();
  }
}