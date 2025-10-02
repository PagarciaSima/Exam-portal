import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { slideIn } from 'src/app/animations/animations';
import { Question } from 'src/app/model/Question';
import { Quiz } from 'src/app/model/Quiz';
import { NotificationService } from 'src/app/services/notification.service';
import { QuestionService } from 'src/app/services/question.service';
import { TranslateService } from '@ngx-translate/core'; // Importa el servicio de traducción

@Component({
  selector: 'app-add-question',
  templateUrl: './add-question.component.html',
  styleUrls: ['./add-question.component.css'],
  animations: [slideIn]
})
export class AddQuestionComponent implements OnInit {

  @ViewChild('questionForm') questionForm: NgForm;
  
  qId: number;
  qTitle: string;
  question: Question = {
    content: '',
    option1: '',
    option2: '',
    option3: '',
    option4: '',
    answer: '',
    quiz: {} as Quiz
  }

  constructor(
    private activatedRoute: ActivatedRoute,
    private questionService: QuestionService,
    private notificationService: NotificationService,
    private translate: TranslateService // Inyecta el servicio de traducción
  ) { }

  ngOnInit(): void {
    this.qId = this.activatedRoute.snapshot.params['qid'];
    this.qTitle = this.activatedRoute.snapshot.params['title'];
    this.question.quiz.qId = this.qId;
  }

  /**
   * Handles the form submission to add a new question.
   * On success, it resets the form and shows a success notification.
   * On error, it shows an error notification.
   */
  formSubmit() {
    this.questionService.addQuestion(this.question).subscribe({
      next: () => {
        const successMsg = this.translate.instant('QUESTION_ADD_SUCCESS');
        const successTitle = this.translate.instant('SUCCESS');
        this.notificationService.success(successMsg, successTitle);
        this.questionForm.resetForm();
        this.question = {
          content: '',
          option1: '',
          option2: '',
          option3: '',
          option4: '',
          answer: '',
          quiz: { qId: this.qId } as Quiz
        };
      },
      error: (error) => {
        const errorMsg = this.translate.instant('QUESTION_ADD_ERROR');
        const errorTitle = this.translate.instant('ERROR');
        this.notificationService.error(errorMsg, errorTitle);
        console.error('Error adding question:', error);
      }
    });
  }
}
