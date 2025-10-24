import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddQuestionComponent } from './add-question.component';
import { ActivatedRoute } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('AddQuestionComponent', () => {
  let component: AddQuestionComponent;
  let fixture: ComponentFixture<AddQuestionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddQuestionComponent ],
      imports: [
        HttpClientTestingModule,
        MatSnackBarModule,
        TranslateModule.forRoot(),
        FormsModule,
        BrowserAnimationsModule 
      ],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              params: {
                qid: 1,
                title: 'Sample Quiz',
                quesId: null
              }
            }
          }
        },
        TranslateService
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddQuestionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set qId, qTitle, quesId and quiz.qId on ngOnInit', () => {
    component.ngOnInit();
    expect(component.qId).toBe(1);
    expect(component.qTitle).toBe('Sample Quiz');
    expect(component.quesId).toBeNull();
    expect(component.question.quiz.qId).toBe(1);
  });

  it('should call addNewQuestion when not in edit mode on formSubmit', () => {
    spyOn(component as any, 'addNewQuestion');
    component.isEditMode = false;
    component.formSubmit();
    expect((component as any).addNewQuestion).toHaveBeenCalled();
  });

  it('should call updateQuestion when in edit mode on formSubmit', () => {
    spyOn(component as any, 'updateQuestion');
    component.isEditMode = true;
    component.formSubmit();
    expect((component as any).updateQuestion).toHaveBeenCalled();
  });

  it('should trim question content on formSubmit', () => {
    component.question.content = '  test content  ';
    component.isEditMode = false;
    spyOn(component as any, 'addNewQuestion');
    component.formSubmit();
    expect(component.question.content).toBe('test content');
  });

  it('should set imageFile on onImageSelected', () => {
    const file = new File([''], 'test.png', { type: 'image/png' });
    const event = {
      target: {
        files: [file]
      }
    } as any;
    component.onImageSelected(event);
    expect(component.imageFile).toBe(file);
  });

  it('should reset question and form on resetState', () => {
    component.question = {
      content: 'test',
      option1: 'a',
      option2: 'b',
      option3: 'c',
      option4: 'd',
      answer: 'a',
      quiz: { qId: 1 } as any
    };
    component.imageFile = new File([''], 'test.png');
    component.questionForm = {
      resetForm: jasmine.createSpy('resetForm')
    } as any;
    (component as any).resetState();
    expect(component.question.content).toBe('');
    expect(component.imageFile).toBeNull();
    expect(component.questionForm.resetForm).toHaveBeenCalled();
  });
});
