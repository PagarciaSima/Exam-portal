import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminHomeComponent } from './admin-home.component';
import { CategoryService } from 'src/app/services/category.service';
import { LoginService } from 'src/app/services/login.service';
import { Router } from '@angular/router';
import { QuizService } from 'src/app/services/quiz.service';
import { QuizStateService } from 'src/app/services/quiz-state.service';
import { TranslateService } from '@ngx-translate/core';
import { of } from 'rxjs';
import { Pipe, PipeTransform } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@Pipe({ name: 'translate' })
class MockTranslatePipe implements PipeTransform {
  transform(value: string): string {
    return value;
  }
}

class MockTranslateService {
  instant(key: string) {
    return key;
  }
}

describe('AdminHomeComponent', () => {
  let component: AdminHomeComponent;
  let fixture: ComponentFixture<AdminHomeComponent>;
  let categoryServiceSpy: jasmine.SpyObj<CategoryService>;
  let loginServiceSpy: jasmine.SpyObj<LoginService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let quizServiceSpy: jasmine.SpyObj<QuizService>;
  let quizStateServiceSpy: jasmine.SpyObj<QuizStateService>;
  let translateService: TranslateService;

  beforeEach(async () => {
    categoryServiceSpy = jasmine.createSpyObj('CategoryService', ['getQuizCountByCategory']);
    loginServiceSpy = jasmine.createSpyObj('LoginService', ['getUser']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    quizServiceSpy = jasmine.createSpyObj('QuizService', ['getQuizzes']);
    quizStateServiceSpy = jasmine.createSpyObj('QuizStateService', ['getTopQuizzesByAttempts']);

    loginServiceSpy.getUser.and.returnValue({
      username: 'adminuser',
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@example.com',
      phone: '987654321'
    });

    categoryServiceSpy.getQuizCountByCategory.and.returnValue(of([
      { categoryId: 1, categoryTitle: 'Math', quizCount: 3 },
      { categoryId: 2, categoryTitle: 'Science', quizCount: 1 }
    ]));

    quizServiceSpy.getQuizzes.and.returnValue(of([
      {
        qId: 1,
        title: 'Quiz 1',
        description: 'desc',
        maxMarks: 10,
        numberOfQuestions: 5,
        active: true
      },
      {
        qId: 2,
        title: 'Quiz 2',
        description: 'desc',
        maxMarks: 10,
        numberOfQuestions: 5,
        active: false
      },
      {
        qId: 3,
        title: 'Quiz 3',
        description: 'desc',
        maxMarks: 10,
        numberOfQuestions: 5,
        active: true
      }
    ]));

    quizStateServiceSpy.getTopQuizzesByAttempts.and.returnValue(of([
      { quizId: 1, quizTitle: 'Quiz 1', totalAttempts: 10, averageMarks: 7.5 },
      { quizId: 2, quizTitle: 'Quiz 2', totalAttempts: 5, averageMarks: 8.0 }
    ]));

    await TestBed.configureTestingModule({
      declarations: [AdminHomeComponent, MockTranslatePipe],
      imports: [BrowserAnimationsModule],
      providers: [
        { provide: CategoryService, useValue: categoryServiceSpy },
        { provide: LoginService, useValue: loginServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: QuizService, useValue: quizServiceSpy },
        { provide: QuizStateService, useValue: quizStateServiceSpy },
        { provide: TranslateService, useClass: MockTranslateService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AdminHomeComponent);
    component = fixture.componentInstance;
    translateService = TestBed.inject(TranslateService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should toggle flip states correctly', () => {
    component.toggleFlip('Math');
    expect(component.flipStates['Math']).toBeTrue();
    component.toggleFlip('Math');
    expect(component.flipStates['Math']).toBeFalse();
    component.toggleFlip('History');
    expect(component.flipStates['History']).toBeTrue();
  });

  it('should close flip states correctly', () => {
    component.flipStates['Math'] = true;
    component.closeFlip('Math');
    expect(component.flipStates['Math']).toBeFalse();
    component.closeFlip('Science');
    expect(component.flipStates['Science']).toBeFalse();
  });

  it('should handle empty user data gracefully', () => {
    loginServiceSpy.getUser.and.returnValue(null);
    fixture = TestBed.createComponent(AdminHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component.userName).toBe('');
  });

  it('should initialize chart options correctly', () => {
    expect(component.quizCategoryChartOptions.responsive).toBeTrue();
    expect(component.quizCategoryChartOptions.maintainAspectRatio).toBeFalse();
    expect(component.quizCategoryChartOptions.plugins?.legend?.display).toBeFalse();
    expect(component.quizCategoryChartOptions.plugins?.title?.display).toBeFalse();
    expect(component.quizCategoryChartOptions.plugins?.title?.text).toBe('Quizzes por Categoría');

    expect(component.quizStatusChartOptions.responsive).toBeTrue();
    expect(component.quizStatusChartOptions.plugins?.legend?.display).toBeTrue();
    expect(component.quizStatusChartOptions.plugins?.legend?.position).toBe('bottom');
    expect(component.quizStatusChartOptions.plugins?.title?.display).toBeTrue();
    expect(component.quizStatusChartOptions.plugins?.title?.text).toBe('Estado de Quizzes');
  });

});