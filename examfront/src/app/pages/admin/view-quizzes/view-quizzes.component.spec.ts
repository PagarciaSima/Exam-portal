import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA, Pipe, PipeTransform } from '@angular/core';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';

import { ViewQuizzesComponent } from './view-quizzes.component';
import { QuizService } from '../../../services/quiz.service';
import { NotificationService } from '../../../services/notification.service';
import { TranslateService } from '@ngx-translate/core';

// Mock para TranslatePipe
@Pipe({ name: 'translate' })
class MockTranslatePipe implements PipeTransform {
  transform(value: string): string {
    return value;
  }
}

// Mock para NotificationService
class MockNotificationService {
  showSuccess(message: string) {}
  showError(message: string) {}
  confirm(message: string, title: string) {
    return Promise.resolve(true);
  }
  success(message: string, title: string) {}
  error(message: string, title: string) {}
}

// Mock para TranslateService
class MockTranslateService {
  instant(key: string): string {
    return key;
  }
  use(lang: string) {}
  get(key: string) {
    return of(key);
  }
}

// Mock para Router
class MockRouter {
  navigate(commands: any[]) {
    return Promise.resolve(true);
  }
}

describe('ViewQuizzesComponent', () => {
  let component: ViewQuizzesComponent;
  let fixture: ComponentFixture<ViewQuizzesComponent>;
  let quizService: QuizService;
  let notificationService: NotificationService;
  let router: Router;
  let translateService: TranslateService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ 
        ViewQuizzesComponent,
        MockTranslatePipe
      ],
      imports: [HttpClientTestingModule],
      providers: [
        QuizService,
        { provide: NotificationService, useClass: MockNotificationService },
        { provide: TranslateService, useClass: MockTranslateService },
        { provide: Router, useClass: MockRouter }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewQuizzesComponent);
    component = fixture.componentInstance;
    quizService = TestBed.inject(QuizService);
    notificationService = TestBed.inject(NotificationService);
    router = TestBed.inject(Router);
    translateService = TestBed.inject(TranslateService);

    spyOn(quizService, 'getQuizzesPaged').and.returnValue(of({
      content: [],
      totalPages: 1,
      totalElements: 0,
      size: 5,
      number: 0,
      first: true,
      last: true
    }));

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load quizzes on init', () => {
    expect(quizService.getQuizzesPaged).toHaveBeenCalledWith(0, 5, '');
  });

  it('should call deleteQuiz method', () => {
    spyOn(notificationService, 'confirm').and.callThrough();
    spyOn(quizService, 'deleteQuiz').and.returnValue(of(void 0));

    component.deleteQuiz(1);

    expect(notificationService.confirm).toHaveBeenCalled();
  });

  it('should not delete quiz if not confirmed', async () => {
    spyOn(notificationService, 'confirm').and.returnValue(Promise.resolve(false));
    spyOn(quizService, 'deleteQuiz');

    await component.deleteQuiz(1);

    expect(notificationService.confirm).toHaveBeenCalled();
    expect(quizService.deleteQuiz).not.toHaveBeenCalled();
  });

  it('should show error notification if deleteQuiz fails', async () => {
    spyOn(notificationService, 'confirm').and.returnValue(Promise.resolve(true));
    spyOn(quizService, 'deleteQuiz').and.returnValue(throwError(() => new Error('Delete failed')));
    spyOn(notificationService, 'error');

    await component.deleteQuiz(1);

    expect(notificationService.error).toHaveBeenCalled();
  });

  it('should update quizzes after successful delete', async () => {
    component.quizzes = [{ qId: 1, title: 'Quiz 1' } as any, { qId: 2, title: 'Quiz 2' } as any];
    spyOn(notificationService, 'confirm').and.returnValue(Promise.resolve(true));
    spyOn(quizService, 'deleteQuiz').and.returnValue(of(void 0));
    spyOn(notificationService, 'success');

    await component.deleteQuiz(1);

    expect(component.quizzes.length).toBe(1);
    expect(component.quizzes[0].qId).toBe(2);
    expect(notificationService.success).toHaveBeenCalled();
  });

  it('should navigate to add quiz', () => {
    spyOn(router, 'navigate');

    component.addQuiz();

    expect(router.navigate).toHaveBeenCalledWith(['/admin/add-quiz']);
  });

  it('should navigate to edit quiz', () => {
    spyOn(router, 'navigate');

    component.editQuiz(1);

    expect(router.navigate).toHaveBeenCalledWith(['/admin/add-quiz', 1]);
  });

  it('should update search term and reload quizzes', () => {
    spyOn(component, 'loadQuizzesPaged');

    component.onSearchTermChange('test');

    expect(component.searchTerm).toBe('test');
    expect(component.page).toBe(0);
    expect(component.loadQuizzesPaged).toHaveBeenCalled();
  });

  it('should navigate to specific page', () => {
    component.totalPages = 3;
    spyOn(component, 'loadQuizzesPaged');

    component.goToPage(1);

    expect(component.page).toBe(1);
    expect(component.loadQuizzesPaged).toHaveBeenCalled();
  });

  it('should not navigate to invalid page', () => {
    component.totalPages = 2;
    spyOn(component, 'loadQuizzesPaged');

    component.goToPage(-1);
    expect(component.page).not.toBe(-1);
    expect(component.loadQuizzesPaged).not.toHaveBeenCalled();

    component.goToPage(2);
    expect(component.page).not.toBe(2);
    expect(component.loadQuizzesPaged).not.toHaveBeenCalled();
  });

  it('should view questions', () => {
    spyOn(router, 'navigate');

    component.viewQuestions(1, 'Test Quiz');

    expect(router.navigate).toHaveBeenCalledWith(['/admin/view-questions', 1, 'Test Quiz']);
  });

  it('should show error notification if loadQuizzesPaged fails', () => {
    (quizService.getQuizzesPaged as jasmine.Spy).and.returnValue(throwError(() => new Error('Load failed')));
    spyOn(notificationService, 'error');

    component.loadQuizzesPaged();

    expect(notificationService.error).toHaveBeenCalled();
  });

  it('should set isLoading to false after loading quizzes', () => {
    component.isLoading = true;
    component.loadQuizzesPaged();
    expect(component.isLoading).toBe(false);
  });
});