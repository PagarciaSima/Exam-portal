import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { slideIn } from 'src/app/animations/animations';
import { Quiz } from 'src/app/model/Quiz';
import { NotificationService } from 'src/app/services/notification.service';
import { QuizService } from 'src/app/services/quiz.service';

@Component({
  selector: 'app-load-quiz',
  templateUrl: './load-quiz.component.html',
  styleUrls: ['./load-quiz.component.css'],
  animations: [
    slideIn
  ]
})
export class LoadQuizComponent implements OnInit {
  page = 0;
  size = 6;
  totalPages = 1;
  searchTerm: string = '';
  private catId: number = 0;
  quizzes: Quiz[] = []; 
  isLoading: boolean = true;

  constructor(
    private activatedRoute: ActivatedRoute,
    private notificationService: NotificationService,
    private quizService: QuizService,
    private translateService: TranslateService
  ) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      this.catId = params['catId'];
    });

    if (this.catId == undefined || this.catId == null || this.catId == 0) {
      this.loadQuizzes();
    }
  }

  onSearchTermChange(term: string): void {
    this.searchTerm = term;
    this.page = 0; // Reinicia a la primera página en cada búsqueda
    this.loadQuizzes();
  }

  loadQuizzes(): void {
    if (this.catId == undefined || this.catId == null || this.catId == 0) {
      this.quizService.getQuizzesPaged(this.page, this.size, this.searchTerm).subscribe({
        next: (data) => {
          this.quizzes = data.content;
          this.totalPages = data.totalPages;
          this.isLoading = false;
        },
        error: () => {
          this.notificationService.error(
            this.translateService.instant('QUIZZES_LOAD_ERROR'),
            this.translateService.instant('ERROR')
          );
        }
      });    
    }
  }

  truncateDescription(desc: string, limit: number = 100): string {
    if (!desc) return '';
    return desc.length > limit ? desc.substring(0, limit) + '...' : desc;
  }

  goToPage(page: number): void {
    this.page = page;
    this.loadQuizzes();
  }

}
