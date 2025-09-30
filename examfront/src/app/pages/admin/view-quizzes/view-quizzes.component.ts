import { Component, OnInit } from '@angular/core';
import { Quiz } from 'src/app/model/Quiz';
import { NotificationService } from 'src/app/services/notification.service';
import { QuizService } from 'src/app/services/quiz.service';
import { TranslateService } from '@ngx-translate/core';
import { slideIn } from 'src/app/animations/animations';
import { Router } from '@angular/router';

@Component({
  selector: 'app-view-quizzes',
  templateUrl: './view-quizzes.component.html',
  styleUrls: ['./view-quizzes.component.css'],
  animations: [
    slideIn
  ]
})
export class ViewQuizzesComponent implements OnInit {

  quizzes: Quiz[] = [
    {
      qId: 1,
      title: 'Quiz 1',
      description: 'Description for Quiz 1',
      maxMarks: 100,
      numberOfQuestions: 10,
      active: true,
      category: { cid: 1, title: 'Category 1', description: 'Description for Category 1' }
    },
    {
      qId: 2,
      title: 'Quiz 2',
      description: 'Description for Quiz 2',
      maxMarks: 100,
      numberOfQuestions: 10,
      active: true,
      category: { cid: 2, title: 'Category 2', description: 'Description for Category 2' }
    },
    {
      qId: 3,
      title: 'Quiz 3',
      description: 'Description for Quiz 3',
      maxMarks: 100,
      numberOfQuestions: 10,
      active: true,
      category: { cid: 3, title: 'Category 3', description: 'Description for Category 3' }
    },
    {
      qId: 4,
      title: 'Quiz 4',
      description: 'Description for Quiz 4',
      maxMarks: 100,
      numberOfQuestions: 10,
      active: true,
      category: { cid: 4, title: 'Category 4', description: 'Description for Category 4' }
    }
  ];

  constructor(
    private quizService: QuizService,
    private notificacionService: NotificationService,
    private translate: TranslateService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadQuizzes();
  }

  private loadQuizzes(): void {
    this.quizService.getQuizzes().subscribe({
      next: (data: any) => {
        this.quizzes = data;
        console.log(this.quizzes);
      },
      error: (error) => {
        this.notificacionService.error(
          this.translate.instant('CATEGORY_LOAD_ERROR'),
          this.translate.instant('ERROR')
        );
        console.error('Error fetching quizzes:', error);
      }
    });
  }

  addQuiz() {
    this.router.navigate(['/admin/add-quiz']);
  }

}
