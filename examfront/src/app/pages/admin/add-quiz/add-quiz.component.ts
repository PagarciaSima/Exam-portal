import { Component, OnInit } from '@angular/core';
import { slideIn } from 'src/app/animations/animations';
import { Category } from 'src/app/model/Category';
import { Quiz } from 'src/app/model/Quiz';
import { CategoryService } from 'src/app/services/category.service';

@Component({
  selector: 'app-add-quiz',
  templateUrl: './add-quiz.component.html',
  styleUrls: ['./add-quiz.component.css'],
  animations: [
    slideIn
  ]
})
export class AddQuizComponent implements OnInit {

  quiz: Quiz = {
    title: '',
    description: '',
    questions: [],
    qId: 0,
    maxMarks: 0,
    numberOfQuestions: 0,
    active: false,
    category: { cid: 0, title: '', description: '' }
  };

  categories: Category [] = [];

  constructor(
    private categoryService: CategoryService  
  ) { }

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories() {
    this.categoryService.getCategories().subscribe({
      next: (data) => {
        this.categories = data;
      },
      error: (error) => {
        console.error('Error loading categories', error);
      }
    });
  }

  formSubmit() {
  }
}
