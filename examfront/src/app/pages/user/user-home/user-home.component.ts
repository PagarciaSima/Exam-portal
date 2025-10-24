import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ChartConfiguration, ChartOptions } from 'chart.js';
import { slideIn } from 'src/app/animations/animations';
import { CategoryQuizCountResponseDTO } from 'src/app/model/CategoryQuizCountResponseDTO';
import { Quiz } from 'src/app/model/Quiz';
import { CategoryService } from 'src/app/services/category.service';
import { LoginService } from 'src/app/services/login.service';


@Component({
  selector: 'app-user-home',
  templateUrl: './user-home.component.html',
  styleUrls: ['./user-home.component.css'],
  animations: [slideIn]
})
export class UserHomeComponent {
  flipStates: { [categoryTitle: string]: boolean } = {};
  selectedQuiz: { [categoryTitle: string]: number } = {};
  userName: string = '';
  quizzesByCategory: { [categoryTitle: string]: Quiz[] } = {};
  searchCategory: string = '';

  public barChartOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      title: { display: true, text: 'Quizzes por Categoría' }
    }
  };
  public barChartLabels: string[] = [];
  public barChartData: ChartConfiguration<'bar'>['data']['datasets'] = [
    { data: [], label: 'Quizzes' }
  ];
  
  constructor(
    private categoryService: CategoryService,
    private loginService: LoginService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    const user = this.loginService.getUser();
    this.userName = user ? user.username : '';

    this.getActiveQuizCountByCategory();
  }
  
  /**
   * Fetches the count of active quizzes by category and updates the chart data.
   * Also retrieves the active quizzes for each category.
   */
  private getActiveQuizCountByCategory() {
    this.categoryService.getActiveQuizCountByCategory().subscribe(data => {
      this.barChartLabels = data.map((d: CategoryQuizCountResponseDTO) => d.categoryTitle);
      this.barChartData[0].data = data.map((d: CategoryQuizCountResponseDTO) => d.quizCount);


      data.forEach((cat: CategoryQuizCountResponseDTO) => {
        if (cat.quizCount > 0) {
          this.categoryService.getActiveQuizzesByCategory(cat.categoryId).subscribe(quizzes => {
            this.quizzesByCategory[cat.categoryTitle] = quizzes;
          });
        }
      });
    });
  }

  /** 
   * Filters the categories based on the search input.
   * @returns An array of filtered category titles.
   */
  get filteredCategories(): string[] {
    if (!this.searchCategory.trim()) return this.barChartLabels;
    return this.barChartLabels.filter(cat =>
      cat.toLowerCase().includes(this.searchCategory.toLowerCase())
    );
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
