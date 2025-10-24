import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ChartConfiguration, ChartOptions } from 'chart.js';
import { fadeInUp } from 'src/app/animations/animations';
import { CategoryQuizCountResponseDTO } from 'src/app/model/CategoryQuizCountResponseDTO';
import { Quiz } from 'src/app/model/Quiz';
import { CategoryService } from 'src/app/services/category.service'; 
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  animations: [
    fadeInUp
  ]
})
export class HomeComponent implements OnInit {
  

  flipStates: { [categoryTitle: string]: boolean } = {};
  selectedQuiz: { [categoryTitle: string]: number } = {};
  userName: string = '';
  quizzesByCategory: { [categoryTitle: string]: Quiz[] } = {};
  searchCategory: string = '';

  constructor(
    private categoryService: CategoryService,
    private loginService: LoginService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    const user = this.loginService.getUser();
    this.userName = user ? user.username : '';

    this.categoryService.getActiveQuizCountByCategory().subscribe(data => {
      this.barChartLabels = data.map((d: CategoryQuizCountResponseDTO) => d.categoryTitle);
      this.barChartData[0].data = data.map((d: CategoryQuizCountResponseDTO) => d.quizCount);

      // Cargar quizzes activos por categoría
      data.forEach((cat: CategoryQuizCountResponseDTO) => {
        if (cat.quizCount > 0) {
          this.categoryService.getActiveQuizzesByCategory(cat.categoryId).subscribe(quizzes => {
            this.quizzesByCategory[cat.categoryTitle] = quizzes;
          });
        }
      });
    });
  }

  get filteredCategories(): string[] {
    if (!this.searchCategory.trim()) return this.barChartLabels;
    return this.barChartLabels.filter(cat =>
      cat.toLowerCase().includes(this.searchCategory.toLowerCase())
    );
  }

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

  /**
   * Starts the quiz with the given ID.
   * @param qId The ID of the quiz to start.
   * Navigates to the instructions page for the quiz.
   */
  startQuiz(qId: number): void {
    this.router.navigate(['/user-dashboard/instructions', qId]);
  }

  toggleFlip(categoryTitle: string): void {
    this.flipStates[categoryTitle] = !this.flipStates[categoryTitle];
  }

  closeFlip(categoryTitle: string): void {
    this.flipStates[categoryTitle] = false;
  }
}