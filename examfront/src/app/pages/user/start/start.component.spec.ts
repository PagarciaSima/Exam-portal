import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StartComponent } from './start.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

describe('StartComponent', () => {
  let component: StartComponent;
  let fixture: ComponentFixture<StartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StartComponent],
      imports: [
        HttpClientTestingModule,
        TranslateModule.forRoot(),
        MatSnackBarModule,
        BrowserAnimationsModule
      ],
      providers: [
        TranslateService,
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({ qId: 1 }),
            snapshot: { paramMap: { get: () => 1 } }
          }
        },
        {
          provide: 'QuestionService',
          useValue: { getQuestionsOfQuiz: () => of([]) }
        },
        {
          provide: 'LoadingService',
          useValue: { show: () => {}, hide: () => {} }
        },
        {
          provide: 'NotificationService',
          useValue: { error: () => {}, confirm: () => Promise.resolve(true) }
        },
        {
          provide: 'QuizService',
          useValue: { submitQuiz: () => of({ marksGot: 0, correctAnswers: 0, attempted: 0 }) }
        },
        {
          provide: 'QuizStateService',
          useValue: {}
        }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(StartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call ngOnInit', () => {
    spyOn(component, 'ngOnInit').and.callThrough();
    component.ngOnInit();
    expect(component.ngOnInit).toHaveBeenCalled();
  });

  it('should go to next page', () => {
    component.totalPages = 2;
    component.currentPage = 0;
    spyOn(component, 'setPage');
    component.nextPage();
    expect(component.currentPage).toBe(1);
    expect(component.setPage).toHaveBeenCalledWith(1);
  });

  it('should go to previous page', () => {
    component.totalPages = 2;
    component.currentPage = 1;
    spyOn(component, 'setPage');
    component.prevPage();
    expect(component.currentPage).toBe(0);
    expect(component.setPage).toHaveBeenCalledWith(0);
  });

  it('should format timer correctly', () => {
    component.timer = 125;
    expect(component.formattedTimer).toBe('2:05');
  });
});