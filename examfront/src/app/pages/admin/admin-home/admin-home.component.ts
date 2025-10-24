import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Chart, ChartConfiguration, ChartData, ChartOptions } from 'chart.js';
import { slideIn } from 'src/app/animations/animations';
import { CategoryQuizCountResponseDTO } from 'src/app/model/CategoryQuizCountResponseDTO';
import { PopularQuizStatsDTO } from 'src/app/model/PopularQuizStatsDTO';
import { Quiz } from 'src/app/model/Quiz';
import { User } from 'src/app/model/User';
import { CategoryService } from 'src/app/services/category.service'; 
import { LoginService } from 'src/app/services/login.service';
import { QuizStateService } from 'src/app/services/quiz-state.service';
import { QuizService } from 'src/app/services/quiz.service';


@Component({
  selector: 'app-admin-home',
  templateUrl: './admin-home.component.html',
  styleUrls: ['./admin-home.component.css'],
  animations: [slideIn]
})
export class AdminHomeComponent implements OnInit {
  flipStates: { [categoryTitle: string]: boolean } = {};
  userName: string = '';
  quizzesByCategory: { [categoryTitle: string]: Quiz[] } = {};
  chartDoughnut: Chart | undefined;

  public quizCategoryLabels: string[] = [];
  public quizCategoryData: ChartConfiguration<'bar'>['data']['datasets'] = [
    { data: [], label: 'Quizzes' }
  ];
  
  public quizStatusLabels: string[] = [];
  public quizStatusData: ChartData<'doughnut'> = {
    labels: [],
    datasets: [{ data: [0, 0], label: '' }]
  };

  topAttemptQuizzes: PopularQuizStatsDTO[] = [];
  topAverageQuizzes: PopularQuizStatsDTO[] = [];

  public quizCategoryChartOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      title: { display: false, text: 'Quizzes por Categoría' }
    }
  };

  public quizStatusChartOptions: ChartOptions = {
    responsive: true,
    plugins: {
      legend: { display: true, position: 'bottom' },
      title: { display: true, text: 'Estado de Quizzes' }
    }
  };

  constructor(
    private categoryService: CategoryService,
    private loginService: LoginService,
    private router: Router,
    private quizService: QuizService,
    private quizStateService: QuizStateService,
    private translateService: TranslateService

  ) { }

  ngOnInit(): void {
    const user: User = this.loginService.getUser();
    this.userName = user ? user.username : '';

    this.quizStatusLabels = [
      this.translateService.instant('ACTIVE_QUIZZES'),
      this.translateService.instant('INACTIVE_QUIZZES')
    ];
    this.quizStatusData.labels = this.quizStatusLabels;
    this.quizStatusData.datasets[0].label = this.translateService.instant('QUIZ_STATUS_LABEL');

    this.getQuizCountByCategory();
    this.getTopQuizzesByAttempt();
    this.getQuizzes();
  }

  /**
   * Fetches the count of quizzes by category and updates the bar chart data.
   * @returns void
   */
  private getQuizCountByCategory(): void {
    this.categoryService.getQuizCountByCategory().subscribe(data => {
      this.quizCategoryLabels = data.map((d: CategoryQuizCountResponseDTO) => d.categoryTitle);
      this.quizCategoryData[0].data = data.map((d: CategoryQuizCountResponseDTO) => d.quizCount);
    });
  }

  /**
   * Fetches the top quizzes by number of attempts and assigns them to the component property.
   * @returns void
   */
  private getTopQuizzesByAttempt(): void {
    this.quizStateService.getTopQuizzesByAttempts().subscribe(data => {
      this.topAttemptQuizzes = data;
    });
  }

  /**
   * Fetches all quizzes and initializes the doughnut chart with active and inactive quiz counts.
   * @returns void
   */
  private getQuizzes(): void {
    this.quizService.getQuizzes().subscribe((quizzes: Quiz[]) => {
      const activos = quizzes.filter(q => q.active).length;
      const inactivos = quizzes.length - activos;

      this.loadDougnutChart(activos, inactivos);
    });
  }

  /**
  * Initializes the doughnut chart with the given active and inactive quiz counts.
  * @param activos The number of active quizzes.
  * @param inactivos The number of inactive quizzes.
  */
  private loadDougnutChart(activos: number, inactivos: number) {
    const activeLabel = this.translateService.instant('ACTIVE_QUIZZES');
    const inactiveLabel = this.translateService.instant('INACTIVE_QUIZZES');
    const chartLabel = this.translateService.instant('QUIZ_STATUS_LABEL');

    setTimeout(() => {
      this.chartDoughnut = new Chart('canvas-doughnut', {
        type: 'doughnut',
        data: {
          labels: [activeLabel, inactiveLabel],
          datasets: [
            {
              label: chartLabel,
              data: [activos, inactivos],
              backgroundColor: ['#36A2EB', '#FF6384'],
            }
          ]
        },
        options: {
          responsive: true,
          plugins: {
            legend: { display: true, position: 'bottom' },
            title: { display: false, text: chartLabel }
          }
        }
      });
    }, 0);
  }

  /**
   * Starts the quiz with the given ID.
   * @param qId The ID of the quiz to start.
   * Navigates to the instructions page for the quiz.
   */
  startQuiz(qId: number): void {
    this.router.navigate(['/user-dashboard/instructions', qId]);
  }

  /**
   * Toggles the flip state of the category card.
   * @param categoryTitle The title of the category to toggle.
   */
  toggleFlip(categoryTitle: string): void {
    this.flipStates[categoryTitle] = !this.flipStates[categoryTitle];
  }

  /**
   * Closes the flip state of the category card.
   * @param categoryTitle The title of the category to close.
   */
  closeFlip(categoryTitle: string): void {
    this.flipStates[categoryTitle] = false;
  }

}
