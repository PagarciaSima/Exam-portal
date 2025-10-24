import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { AddQuizComponent } from './add-quiz.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Subject, of, throwError } from 'rxjs';
import { CategoryService } from 'src/app/services/category.service';
import { QuizService } from 'src/app/services/quiz.service';
import { NotificationService } from 'src/app/services/notification.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('AddQuizComponent', () => {
  let component: AddQuizComponent;
  let fixture: ComponentFixture<AddQuizComponent>;
  let categoryServiceSpy: jasmine.SpyObj<CategoryService>;
  let quizServiceSpy: jasmine.SpyObj<QuizService>;
  let notificationServiceSpy: jasmine.SpyObj<NotificationService>;
  let translateServiceMock: jasmine.SpyObj<TranslateService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let activatedRouteSpy: any;

  beforeEach(async () => {
    const onLangChangeSubject = new Subject();

    translateServiceMock = jasmine.createSpyObj('TranslateService', [
      'get', 'instant', 'use', 'setDefaultLang', 'addLangs', 'getBrowserLang',
      'getLangs', 'getTranslation', 'stream', 'set'
    ], {
      onLangChange: onLangChangeSubject.asObservable(),
      onTranslationChange: new Subject().asObservable(),
      onDefaultLangChange: new Subject().asObservable()
    });

    translateServiceMock.get.and.callFake((key: string) => of(key));
    translateServiceMock.instant.and.callFake((key: string) => key);
    translateServiceMock.use.and.returnValue(of('en'));
    translateServiceMock.getBrowserLang.and.returnValue('en');
    translateServiceMock.getLangs.and.returnValue(['en', 'es']);
    translateServiceMock.getTranslation.and.returnValue(of({}));
    translateServiceMock.stream.and.callFake((key: string) => of(key));

    categoryServiceSpy = jasmine.createSpyObj('CategoryService', ['getCategories']);
    quizServiceSpy = jasmine.createSpyObj('QuizService', ['getQuiz', 'addQuiz', 'updateQuiz']);
    notificationServiceSpy = jasmine.createSpyObj('NotificationService', ['success', 'error']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    activatedRouteSpy = {
      params: of({})
    };

    await TestBed.configureTestingModule({
      declarations: [ AddQuizComponent ],
      imports: [
        HttpClientTestingModule,
        MatSnackBarModule,
        TranslateModule.forRoot(),
        FormsModule,
        RouterTestingModule,
        BrowserAnimationsModule
      ],
      providers: [
        { provide: CategoryService, useValue: categoryServiceSpy },
        { provide: QuizService, useValue: quizServiceSpy },
        { provide: NotificationService, useValue: notificationServiceSpy },
        { provide: TranslateService, useValue: translateServiceMock },
        { provide: Router, useValue: routerSpy },
        { provide: ActivatedRoute, useValue: activatedRouteSpy }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  });

  beforeEach(() => {
    categoryServiceSpy.getCategories.and.returnValue(of([]));
    fixture = TestBed.createComponent(AddQuizComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });


  it('should call notificationService.error if addQuiz fails and translation fails', fakeAsync(() => {
    quizServiceSpy.addQuiz.and.returnValue(throwError(() => new Error('error')));
    
    (component as any).addQuiz();
    tick(); 
    
    expect(notificationServiceSpy.error).toHaveBeenCalledWith('QUIZ_ADD_ERROR', 'ERROR');
  }));

  it('should call notificationService.error if editQuiz fails and translation fails', fakeAsync(() => {
    quizServiceSpy.updateQuiz.and.returnValue(throwError(() => new Error('error')));
    
    (component as any).editQuiz();
    tick(); 
    
    expect(notificationServiceSpy.error).toHaveBeenCalledWith('QUIZ_UPDATE_ERROR', 'ERROR');
  }));

  it('should call notificationService.error if loadQuiz fails and translation fails', fakeAsync(() => {
    quizServiceSpy.getQuiz.and.returnValue(throwError(() => new Error('ERROR')));
    
    component.loadQuiz(1);
    tick(); 
    
    expect(notificationServiceSpy.error).toHaveBeenCalledWith('QUIZ_LOAD_ERROR', 'ERROR');
  }));

  it('should call notificationService.error if loadCategories fails and translation fails', fakeAsync(() => {
    categoryServiceSpy.getCategories.and.returnValue(throwError(() => new Error('error')));
    
    component.loadCategories();
    tick(); 

    expect(notificationServiceSpy.error).toHaveBeenCalledWith('CATEGORY_LOAD_ERROR', 'ERROR');
  }));
});