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
  animations: [slideIn]
})
export class LoadQuizComponent implements OnInit {
  page = 0;
  size = 6;
  totalPages = 1;
  searchTerm: string = '';
  catId: number = 0;
  quizzes: Quiz[] = [];
  isLoading: boolean = true;
  showOnlyActiveQuizzes: boolean = true;

  constructor(
    private activatedRoute: ActivatedRoute,
    private notificationService: NotificationService,
    private quizService: QuizService,
    private translateService: TranslateService
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      this.catId = +params['catId'] || 0;
      console.log("Cargando quizzes de la categoría:", this.catId);
      this.page = 0; 
      this.loadQuizzes();
    });
  }

  /**
   * Loads quizzes from the backend, either all quizzes or filtered by category.
   * Handles loading state and error notifications.
   */
  loadQuizzes(): void {
    this.isLoading = true;
    const obs = this.quizService.getQuizzesPaged(
      this.page,
      this.size,
      this.searchTerm,
      this.catId === 0 ? undefined : this.catId,
      this.showOnlyActiveQuizzes
    );

    obs.subscribe({
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
        this.isLoading = false;
      }
    });
  }

  /**
   * Handles changes to the search term input.
   *
   * @param term The new search term.
   */
  onSearchTermChange(term: string): void {
    this.searchTerm = term;
    this.page = 0;
    this.loadQuizzes();
  }

  /**
   * Navigates to the specified page.
   *
   * @param page The page number to navigate to.
   */
  goToPage(page: number): void {
    this.page = page;
    this.loadQuizzes();
  }

  /**
   * 
   * @param desc 
   * @param limit 
   * @returns Truncated description with ellipsis if it exceeds the limit.
   */
  truncateDescription(desc: string, limit: number = 100): string {
    if (!desc) return '';
    return desc.length > limit ? desc.substring(0, limit) + '...' : desc;
  }
}
