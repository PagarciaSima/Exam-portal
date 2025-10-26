import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoadQuizComponent } from './load-quiz.component';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NotificationService } from 'src/app/services/notification.service';
import { QuizService } from 'src/app/services/quiz.service';
import { LoadingService } from 'src/app/services/loading.service';
import { of, throwError } from 'rxjs';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'translate' })
class MockTranslatePipe implements PipeTransform {
  transform(value: string): string {
    return value;
  }
}

describe('LoadQuizComponent', () => {
  let component: LoadQuizComponent;
  let fixture: ComponentFixture<LoadQuizComponent>;
  let activatedRouteSpy: any;
  let notificationServiceSpy: jasmine.SpyObj<NotificationService>;
  let quizServiceSpy: jasmine.SpyObj<QuizService>;
  let translateServiceSpy: jasmine.SpyObj<TranslateService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let loadingServiceSpy: jasmine.SpyObj<LoadingService>;

  beforeEach(async () => {
    activatedRouteSpy = {
      params: of({ catId: 1 })
    };
    notificationServiceSpy = jasmine.createSpyObj('NotificationService', ['error', 'success']);
    quizServiceSpy = jasmine.createSpyObj('QuizService', ['getQuizzesPaged']);
    translateServiceSpy = jasmine.createSpyObj('TranslateService', ['instant']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    loadingServiceSpy = jasmine.createSpyObj('LoadingService', ['show', 'hide']);

    await TestBed.configureTestingModule({
      declarations: [LoadQuizComponent, MockTranslatePipe],
      imports: [
        HttpClientTestingModule,
        TranslateModule.forRoot(),
        MatSnackBarModule,
        BrowserAnimationsModule
      ],
      providers: [
        { provide: ActivatedRoute, useValue: activatedRouteSpy },
        { provide: NotificationService, useValue: notificationServiceSpy },
        { provide: QuizService, useValue: quizServiceSpy },
        { provide: TranslateService, useValue: translateServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: LoadingService, useValue: loadingServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoadQuizComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with catId from route params', () => {
    expect(component.catId).toBe(1);
  });

  it('should call loadQuizzes on ngOnInit', () => {
    spyOn(component, 'loadQuizzes');
    component.ngOnInit();
    expect(component.loadQuizzes).toHaveBeenCalled();
  });

  it('should load quizzes and set quizzes, totalPages, isLoading', () => {

  });

  it('should show error notification if loadQuizzes fails', () => {
    quizServiceSpy.getQuizzesPaged.and.returnValue(throwError(() => new Error('fail')));
    component.catId = 1;
    component.loadQuizzes();
    expect(notificationServiceSpy.error).toHaveBeenCalled();
    expect(component.isLoading).toBe(false);
  });

  it('should update searchTerm and reset page on onSearchTermChange', () => {
    spyOn(component, 'loadQuizzes');
    component.onSearchTermChange('math');
    expect(component.searchTerm).toBe('math');
    expect(component.page).toBe(0);
    expect(component.loadQuizzes).toHaveBeenCalled();
  });

  it('should go to valid page and call loadQuizzes', () => {
    component.totalPages = 3;
    spyOn(component, 'loadQuizzes');
    component.goToPage(2);
    expect(component.page).toBe(2);
    expect(component.loadQuizzes).toHaveBeenCalled();
  });

  it('should not go to invalid page', () => {
    component.totalPages = 2;
    spyOn(component, 'loadQuizzes');
    component.goToPage(-1);
    expect(component.page).not.toBe(-1);
    expect(component.loadQuizzes).not.toHaveBeenCalled();
  });
});
