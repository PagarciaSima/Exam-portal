import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ViewQuizQuestionsComponent } from './view-quiz-questions.component';
import { QuestionService } from 'src/app/services/question.service';
import { NotificationService } from 'src/app/services/notification.service';
import { TranslateModule, TranslateService, TranslatePipe } from '@ngx-translate/core';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { NO_ERRORS_SCHEMA } from '@angular/core';

// Mock para TranslatePipe
class MockTranslatePipe extends TranslatePipe {
  transform(value: string): string {
    return value;
  }
}

describe('ViewQuizQuestionsComponent', () => {
  let component: ViewQuizQuestionsComponent;
  let fixture: ComponentFixture<ViewQuizQuestionsComponent>;
  let questionServiceSpy: jasmine.SpyObj<QuestionService>;
  let notificationServiceSpy: jasmine.SpyObj<NotificationService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let translateServiceSpy: jasmine.SpyObj<TranslateService>;

  beforeEach(async () => {
    // Crear spies más robustos
    questionServiceSpy = jasmine.createSpyObj('QuestionService', [
      'getQuestionsOfQuiz',
      'getQuestionsOfQuizPaged',
      'deleteQuestion'
    ], {
      // Añadir propiedades observables si son necesarias
    });

    notificationServiceSpy = jasmine.createSpyObj('NotificationService', [
      'error', 'success', 'confirm'
    ]);

    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    translateServiceSpy = jasmine.createSpyObj('TranslateService', [
      'get', 'instant', 'use', 'setDefaultLang', 'addLangs', 'getBrowserLang', 'getLangs'
    ]);
    
    // Configurar el spy para que siempre devuelva un observable
    translateServiceSpy.get.and.returnValue(of('translated-text'));
    translateServiceSpy.instant.and.returnValue('translated-text');
    translateServiceSpy.use.and.returnValue(of('en'));
    translateServiceSpy.getBrowserLang.and.returnValue('en');
    translateServiceSpy.getLangs.and.returnValue(['en', 'es']);

    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        MatSnackBarModule, // Importar módulo de Material para NotificationService
        TranslateModule.forRoot() // Mantener el módulo de translate
      ],
      declarations: [
        ViewQuizQuestionsComponent,
        MockTranslatePipe // Usar el mock en lugar del pipe real
      ],
      providers: [
        { provide: QuestionService, useValue: questionServiceSpy },
        { provide: NotificationService, useValue: notificationServiceSpy },
        { provide: Router, useValue: routerSpy },
        { 
          provide: ActivatedRoute, 
          useValue: { 
            params: of({ id: 1, title: 'Test Quiz' }), 
            snapshot: { paramMap: { get: () => '1' } } 
          } 
        },
        { provide: TranslateService, useValue: translateServiceSpy }
      ],
      schemas: [NO_ERRORS_SCHEMA] // Ignorar elementos desconocidos en el template
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewQuizQuestionsComponent);
    component = fixture.componentInstance;
    
    // Configurar datos iniciales antes de detectChanges
    component.qId = 1;
    component.qTitle = 'Test Quiz';
    
    // Configurar respuestas por defecto para los servicios
    questionServiceSpy.getQuestionsOfQuizPaged.and.returnValue(of({
      content: [],
      totalPages: 1,
      totalElements: 0,
      size: 7,
      number: 0,
      numberOfElements: 0,
      first: true,
      last: true,
      empty: true
    }));
    
    questionServiceSpy.getQuestionsOfQuiz.and.returnValue(of([]));
    questionServiceSpy.deleteQuestion.and.returnValue(of(void 0));
    
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call getQuestionsOfQuizPaged on ngOnInit', () => {
    // El método ya se llama en el beforeEach debido a fixture.detectChanges()
    expect(questionServiceSpy.getQuestionsOfQuizPaged)
      .toHaveBeenCalledWith(1, 0, 7, '');
  });

  it('should navigate to add question', () => {
    component.addQuestion();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/admin/add-question', 1, 'Test Quiz']);
  });

  it('should navigate to edit question', () => {
    component.editQuestion(5);
    expect(routerSpy.navigate).toHaveBeenCalledWith(['admin/add-question', 1, 'Test Quiz', 5]);
  });

  it('should update searchTerm and call getQuestionsOfQuizPaged on search', () => {
    spyOn(component, 'getQuestionsOfQuizPaged');
    component.onSearchTermChange('math');
    expect(component.searchTerm).toBe('math');
    expect(component.page).toBe(0);
    expect(component.getQuestionsOfQuizPaged).toHaveBeenCalled();
  });

  it('should go to valid page and call getQuestionsOfQuizPaged', () => {
    component.totalPages = 3;
    spyOn(component, 'getQuestionsOfQuizPaged');
    
    component.goToPage(2);
    
    expect(component.page).toBe(2);
    expect(component.getQuestionsOfQuizPaged).toHaveBeenCalled();
  });

  it('should not go to invalid page', () => {
    component.totalPages = 2;
    spyOn(component, 'getQuestionsOfQuizPaged');
    
    // Página negativa
    component.goToPage(-1);
    expect(component.page).not.toBe(-1);
    expect(component.getQuestionsOfQuizPaged).not.toHaveBeenCalled();
    
    // Página mayor que totalPages
    component.goToPage(5);
    expect(component.page).not.toBe(5);
    expect(component.getQuestionsOfQuizPaged).not.toHaveBeenCalled();
  });

  it('should handle deleteQuestion confirmed', async () => {
    notificationServiceSpy.confirm.and.returnValue(Promise.resolve(true));
    
    await component.deleteQuestion(10);

    expect(questionServiceSpy.deleteQuestion).toHaveBeenCalledWith(10);
    expect(notificationServiceSpy.success).toHaveBeenCalled();
  });

  it('should handle deleteQuestion not confirmed', async () => {
    notificationServiceSpy.confirm.and.returnValue(Promise.resolve(false));
    
    await component.deleteQuestion(10);
    
    expect(questionServiceSpy.deleteQuestion).not.toHaveBeenCalled();
    expect(notificationServiceSpy.success).not.toHaveBeenCalled();
  });

  it('should handle error when fetching questions', () => {
    const errorResponse = new Error('Test error');
    questionServiceSpy.getQuestionsOfQuizPaged.and.returnValue(
      new Observable(observer => observer.error(errorResponse))
    );
    
    spyOn(console, 'error');
    
    component.getQuestionsOfQuizPaged();
    
    expect(notificationServiceSpy.error).toHaveBeenCalled();
    expect(console.error).toHaveBeenCalledWith('Error fetching questions:', errorResponse);
  });

  it('should handle error when deleting question', async () => {
    notificationServiceSpy.confirm.and.returnValue(Promise.resolve(true));
    questionServiceSpy.deleteQuestion.and.returnValue(
      new Observable(observer => observer.error(new Error('Delete error')))
    );
    
    spyOn(console, 'error');
    
    await component.deleteQuestion(10);
    
    expect(notificationServiceSpy.error).toHaveBeenCalled();
    expect(console.error).toHaveBeenCalledWith('Error deleting question:', jasmine.any(Error));
  });
});