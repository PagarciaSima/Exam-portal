import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { TranslateService } from '@ngx-translate/core';
import { slideIn } from 'src/app/animations/animations';
import { Question } from 'src/app/model/Question';
import { Quiz } from 'src/app/model/Quiz';
import { LoadingService } from 'src/app/services/loading.service';
import { NotificationService } from 'src/app/services/notification.service';
import { QuestionService } from 'src/app/services/question.service';

@Component({
  selector: 'app-add-question',
  templateUrl: './add-question.component.html',
  styleUrls: ['./add-question.component.css'],
  animations: [slideIn]
})
export class AddQuestionComponent implements OnInit {

  public Editor = ClassicEditor;

  @ViewChild('questionForm') questionForm: NgForm;
  
  qId: number;
  qTitle: string;
  quesId: number;
  isEditMode: boolean = false;

  question: Question = {
    content: '',
    option1: '',
    option2: '',
    option3: '',
    option4: '',
    answer: '',
    quiz: {} as Quiz
  }

  imageFile: File | null = null;

  constructor(
    private activatedRoute: ActivatedRoute,
    private questionService: QuestionService,
    private notificationService: NotificationService,
    private translate: TranslateService,
    private router: Router,
    private loadService: LoadingService
  ) { }

  ngOnInit(): void {
    this.qId = this.activatedRoute.snapshot.params['qid'];
    this.qTitle = this.activatedRoute.snapshot.params['title'];
    this.quesId = this.activatedRoute.snapshot.params['quesId'];
    this.question.quiz.qId = this.qId;
    if (this.quesId) {
      this.isEditMode = true;
      this.loadQuestion(this.quesId);
      console.log('Edit mode for question ID:', this.quesId);
    }
  }

  /**
   * Loads a question by its ID and assigns it to the local `question` property.
   * Displays an error notification if the request fails.
   * @param quesId The ID of the question to load.
   */
  private loadQuestion(quesId: number) {
    this.loadService.show();
    this.questionService.getQuestion(quesId).subscribe({
      next: (data) => {
        this.question = data;
        this.loadService.hide();
      },
      error: (error) => {
        this.loadService.hide();
        const errorMsg = this.translate.instant('QUESTION_LOAD_ERROR');
        const errorTitle = this.translate.instant('ERROR');
        this.notificationService.error(errorMsg, errorTitle);
        console.error('Error loading question:', error);
      }
    });
  }

  /**
   * Handles the form submission for adding or updating a question.
   * Calls the appropriate method based on the current mode (add or edit).
   */
  formSubmit() {
    // Trim all string inputs before submit
    this.question.content = this.question.content.trim();
    this.question.option1 = this.question.option1.trim();
    this.question.option2 = this.question.option2.trim();
    this.question.option3 = this.question.option3.trim();
    this.question.option4 = this.question.option4.trim();
    this.question.answer = this.question.answer.trim();

    if(this.isEditMode) {
      this.updateQuestion();
    } else {
      this.addNewQuestion();
    }
  }

  /** 
   * Adds a new question using the QuestionService.
   * Displays success or error notifications based on the outcome of the operation.
   */
  private addNewQuestion() {
    this.loadService.show();
    this.questionService.addQuestionWithImage(this.question, this.imageFile).subscribe({
      next: () => {
        this.loadService.hide();
        const successMsg = this.translate.instant('QUESTION_ADD_SUCCESS');
        const successTitle = this.translate.instant('SUCCESS');
        this.notificationService.success(successMsg, successTitle);
        this.resetState();
        this.imageFile = null;
      },
      error: (error) => {
        this.loadService.hide();
        const errorMsg = this.translate.instant('QUESTION_ADD_ERROR');
        const errorTitle = this.translate.instant('ERROR');
        this.notificationService.error(errorMsg, errorTitle);
        console.error('Error adding question:', error);
      }
    });
  }

  /** 
   * Updates an existing question using the QuestionService.
   * Displays success or error notifications based on the outcome of the operation.
   */
  private updateQuestion() {
    this.loadService.show();
    this.questionService.updateQuestion(this.question).subscribe({
      next: () => {
        this.loadService.hide();
        const successMsg = this.translate.instant('QUESTION_UPDATE_SUCCESS');
        const successTitle = this.translate.instant('SUCCESS');
        this.notificationService.success(successMsg, successTitle);
        this.router.navigate(['/admin/view-questions', this.qId, this.qTitle]);
      },
      error: (error) => {
        this.loadService.hide();
        const errorMsg = this.translate.instant('QUESTION_UPDATE_ERROR');
        const errorTitle = this.translate.instant('ERROR');
        this.notificationService.error(errorMsg, errorTitle);
        console.error('Error updating question:', error);
      }
    });
  }

 /** 
  * Resets the form and question state to initial values.
  */ 
  private resetState() {
    this.question = {
      content: '',
      option1: '',
      option2: '',
      option3: '',
      option4: '',
      answer: '',
      quiz: { qId: this.qId } as any
    };
    this.imageFile = null; 
    if (this.questionForm) {
      this.questionForm.resetForm();
    }
  }

  // Maneja el cambio de archivo
  onImageSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.imageFile = input.files[0];
    } else {
      this.imageFile = null;
    }
  }

}
