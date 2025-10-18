import { LocationStrategy } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Question } from 'src/app/model/Question';
import { NotificationService } from 'src/app/services/notification.service';
import { QuestionService } from 'src/app/services/question.service';

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
    private translateService: TranslateService
  ) {
  }

  /**
   * Initializes the component by preventing back navigation and loading shuffled questions.
   */
  ngOnInit(): void {
    this.preventBackButton();
    this.activatedRoute.params.subscribe(params => {
      this.qId = +params['qId'] || null;
      this.loadQuestionsShuffled(this.qId);
    });
  }

  /**
   * loads questions and shuffles them
   * @param qId 
   */
  loadQuestionsShuffled(qId: number | null): void {
    this.questionService.getQuestionsOfQuiz(qId).subscribe({
      next: (result) => {
        this.questions = result;
        if (!this.isShuffled) {
          this.shuffledQuestions = this.shuffleArray([...this.questions]);
          this.isShuffled = true;
        }
        this.totalElements = this.shuffledQuestions.length;
        this.totalPages = Math.ceil(this.totalElements / this.pageSize);
        this.setPage(this.currentPage);
      },
      error: (error) => {
        this.notificationService.error(
          this.translateService.instant("QUESTIONS_LOAD_ERROR"),
          this.translateService.instant("ERROR")
        );
        console.error("Error loading questions:", error);
      }
    });
  }

  /**
   * shuffles the questions array
   * @param array 
   * @returns 
   */
  shuffleArray(array: Question[]): Question[] {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  /**
   * Sets the current page of questions to display.
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
   * Navigates to the next page of questions.
   */
  nextPage(): void {
    if (this.currentPage < this.totalPages - 1) {
      this.currentPage++;
      this.setPage(this.currentPage);
    }
  }

  /**
   * Navigates to the previous page of questions.
   */
  prevPage(): void {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.setPage(this.currentPage);
    }
  }

  /**
   * Prevents the user from navigating back to the previous page using the browser's back button.
   * This is done by manipulating the browser's history state.
   */
  preventBackButton(): void {
    history.pushState(null, '', location.href);
    this.locationSt.onPopState(() => {
      history.pushState(null, '', location.href);
    });
  }

  submitQuiz(): void {  
    this.notificationService.confirm(
      this.translateService.instant("SUBMIT_QUIZ_CONFIRMATION"),
      this.translateService.instant('CONFIRM')
    ).then((confirmed) => {
      if (confirmed) {
        this.isSubmit = true;
        this.questions.forEach(q => {
          if (q.givenAnswer === q.answer) {
            this.correctAnswers++;
            let marksSingle = this.questions[0].quiz.maxMarks / this.questions.length;
            this.marksGot += marksSingle;

            if (q.givenAnswer.trim() === '') {
              this.attempted++;
            }

            console.log("Correct Answers: " + this.correctAnswers);
            console.log("Marks Got: " + this.marksGot);
          }
          if (q.givenAnswer.trim() !== '') {
            this.attempted++;
          }
        });
      }
    });
  }

  // Guarda la respuesta cada vez que el usuario selecciona una opción
  onAnswerChange(question: Question): void {
    this.answersMap[question.quesId] = question.givenAnswer;
  }
}
