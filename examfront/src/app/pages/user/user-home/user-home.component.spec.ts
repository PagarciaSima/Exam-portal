import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserHomeComponent } from './user-home.component';
import { CategoryService } from 'src/app/services/category.service';
import { LoginService } from 'src/app/services/login.service';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { Pipe, PipeTransform } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@Pipe({ name: 'translate' })
class MockTranslatePipe implements PipeTransform {
  transform(value: string): string {
    return value;
  }
}

describe('UserHomeComponent', () => {
  let component: UserHomeComponent;
  let fixture: ComponentFixture<UserHomeComponent>;
  let categoryServiceSpy: jasmine.SpyObj<CategoryService>;
  let loginServiceSpy: jasmine.SpyObj<LoginService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    categoryServiceSpy = jasmine.createSpyObj('CategoryService', [
      'getActiveQuizCountByCategory',
      'getActiveQuizzesByCategory'
    ]);
    loginServiceSpy = jasmine.createSpyObj('LoginService', ['getUser']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    loginServiceSpy.getUser.and.returnValue({
      username: 'testuser',
      firstName: 'Test',
      lastName: 'User',
      email: 'test@example.com',
      phone: '1234567890'
    });

    categoryServiceSpy.getActiveQuizCountByCategory.and.returnValue(of([
      { categoryTitle: 'Math', quizCount: 2, categoryId: 1 },
      { categoryTitle: 'Science', quizCount: 0, categoryId: 2 }
    ]));
    categoryServiceSpy.getActiveQuizzesByCategory.and.returnValue(of([
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
        active: true
      }
    ]));

    await TestBed.configureTestingModule({
      declarations: [UserHomeComponent, MockTranslatePipe], 
      imports: [BrowserAnimationsModule],
      providers: [
        { provide: CategoryService, useValue: categoryServiceSpy },
        { provide: LoginService, useValue: loginServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(UserHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set userName on init', () => {
    expect(component).toBeTruthy();
  });

  it('should set userName on init', () => {
    expect(component.userName).toBe('testuser');
  });

  it('should call getActiveQuizCountByCategory on init and set barChartLabels/data', () => {
    expect(categoryServiceSpy.getActiveQuizCountByCategory).toHaveBeenCalled();
    
    expect(component.barChartLabels).toEqual(['Math', 'Science']);
    expect(component.barChartData[0].data).toEqual([2, 0]);
  });

  it('should load quizzes for categories with quizCount > 0', () => {
    expect(categoryServiceSpy.getActiveQuizzesByCategory).toHaveBeenCalledWith(1);
    expect(categoryServiceSpy.getActiveQuizzesByCategory).not.toHaveBeenCalledWith(2); 
    expect(component.quizzesByCategory['Math']).toEqual([
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
        active: true
      }
    ]);
    
    expect(component.quizzesByCategory['Science']).toBeUndefined();
  });

  it('should filter categories by searchCategory', () => {
    component.searchCategory = 'math';
    expect(component.filteredCategories).toEqual(['Math']);
    
    component.searchCategory = 'MATH';
    expect(component.filteredCategories).toEqual(['Math']);
    
    component.searchCategory = 'at';
    expect(component.filteredCategories).toEqual(['Math']);
    
    component.searchCategory = '';
    expect(component.filteredCategories).toEqual(['Math', 'Science']);
    
    component.searchCategory = '   ';
    expect(component.filteredCategories).toEqual(['Math', 'Science']);
    
    component.searchCategory = 'history';
    expect(component.filteredCategories).toEqual([]);
  });

  it('should navigate to instructions when startQuiz is called', () => {
    const quizId = 123;
    component.startQuiz(quizId);
    
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/user-dashboard/instructions', quizId]);
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
    fixture = TestBed.createComponent(UserHomeComponent);
    component = fixture.componentInstance;
    
    loginServiceSpy.getUser.and.returnValue(null);
    
    fixture.detectChanges();
    
    expect(component.userName).toBe('');
  });

  it('should initialize with empty chart data', () => {
    expect(component.barChartLabels).toEqual(['Math', 'Science']);
    expect(component.barChartData[0].data).toEqual([2, 0]);
    expect(component.barChartData[0].label).toBe('Quizzes');
  });

  it('should have correct chart options', () => {
    expect(component.barChartOptions.responsive).toBeTrue();
    expect(component.barChartOptions.maintainAspectRatio).toBeFalse();
    expect(component.barChartOptions.plugins?.legend?.display).toBeFalse();
    expect(component.barChartOptions.plugins?.title?.display).toBeTrue();
    expect(component.barChartOptions.plugins?.title?.text).toBe('Quizzes por Categoría');
  });
});