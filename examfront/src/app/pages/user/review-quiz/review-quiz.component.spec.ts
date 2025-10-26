import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReviewQuizComponent } from './review-quiz.component';
import { QuizStateService } from 'src/app/services/quiz-state.service';
import { NotificationService } from 'src/app/services/notification.service';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Pipe, PipeTransform } from '@angular/core';

class MockQuizStateService {
  getLastAttempts() { return of({}); }
}

@Pipe({ name: 'translate' })
class MockTranslatePipe implements PipeTransform {
  transform(value: string): string {
    return value;
  }
}

describe('ReviewQuizComponent', () => {
  let component: ReviewQuizComponent;
  let fixture: ComponentFixture<ReviewQuizComponent>;
  let quizStateSpy: jasmine.SpyObj<QuizStateService>;
  let notificationServiceSpy: jasmine.SpyObj<NotificationService>;
  let translateServiceSpy: jasmine.SpyObj<TranslateService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(() => {
    quizStateSpy = jasmine.createSpyObj('QuizStateService', ['getLastAttempts']);
    notificationServiceSpy = jasmine.createSpyObj('NotificationService', ['error']);
    translateServiceSpy = jasmine.createSpyObj('TranslateService', ['instant']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [ReviewQuizComponent, MockTranslatePipe],
      providers: [
        { provide: QuizStateService, useValue: quizStateSpy },
        { provide: NotificationService, useValue: notificationServiceSpy },
        { provide: TranslateService, useValue: translateServiceSpy },
        { provide: Router, useValue: routerSpy }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    });

    fixture = TestBed.createComponent(ReviewQuizComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load last quiz attempts and set properties', () => {
    const mockData = {
      id: 1,
      marksGot: 8,
      attempted: 3,
      attemptDate: '2024-06-01T12:00:00Z',
      questions: [
        { id: 101, content: 'Q1', givenAnswer: 'A', answer: 'A', image: '' },
        { id: 102, content: 'Q2', givenAnswer: 'B', answer: 'C', image: '' },
        { id: 103, content: 'Q3', givenAnswer: 'D', answer: 'D', image: '' }
      ],
      correctAnswers: 2,
      maxMarks: 10
    };
    quizStateSpy.getLastAttempts.and.returnValue(of(mockData));
    component['loadLastQuizAttempts']();
    expect(component.marksGot).toBe(8);
    expect(component.questions.length).toBe(3);
    expect(component.correctAnswers).toBe(2);
    expect(component.maxMarks).toBe(10);
    expect(component.score).toBe(8 / 10 * 10);
  });

  it('should call notificationService.error on error', () => {
    quizStateSpy.getLastAttempts.and.returnValue(throwError(() => new Error('error')));
    translateServiceSpy.instant.and.callFake((key: string) => key);
    component['loadLastQuizAttempts']();
    expect(notificationServiceSpy.error).toHaveBeenCalledWith('FAILED_LOADING_QUESTIONS', 'ERROR');
  });

  it('should navigate back when goBack is called', () => {
    component.goBack();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/user-dashboard', 0]);
  });
});
