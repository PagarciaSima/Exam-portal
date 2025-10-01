import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { slideIn } from 'src/app/animations/animations';
import { Question } from 'src/app/model/Question';
import { NotificationService } from 'src/app/services/notification.service';
import { QuestionService } from 'src/app/services/question.service';

@Component({
  selector: 'app-view-quiz-questions',
  templateUrl: './view-quiz-questions.component.html',
  styleUrls: ['./view-quiz-questions.component.css'],
  animations: [
    slideIn
  ]
})
export class ViewQuizQuestionsComponent implements OnInit {
addQuestion() {
throw new Error('Method not implemented.');
}

  qId: number;
  qTitle: string;
  questions: Question[] = [];

  constructor(
    private route: ActivatedRoute,
    private questionService: QuestionService,
    private notificationService: NotificationService
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.qId = params['id'];
      this.qTitle = params['title'];
    });

    this.getQuestionsOfQuiz(this.qId);
  }

  private getQuestionsOfQuiz(quizId: number): void {
    this.questionService.getQuestionsOfQuiz(quizId).subscribe({
      next: (data: any) => {
        this.questions = data;
        console.log(this.questions);
      },
      error: (error) => {
        this.notificationService.error('Error loading questions', 'Error');
        console.error('Error fetching questions:', error);
      }
    });
  }

}
