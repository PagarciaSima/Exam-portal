import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { QuestionGenModalComponentComponent } from './question-gen-modal-component.component';
import { QuestionGenerationRequest } from 'src/app/model/QuestionGenerationRequest';
import { NO_ERRORS_SCHEMA, Pipe, PipeTransform } from '@angular/core';
import { FormsModule } from '@angular/forms'; 

@Pipe({ name: 'translate' })
class MockTranslatePipe implements PipeTransform {
  transform(value: string): string {
    return value;
  }
}

describe('QuestionGenModalComponentComponent', () => {
  let component: QuestionGenModalComponentComponent;
  let fixture: ComponentFixture<QuestionGenModalComponentComponent>;
  let dialogRef: { close: jasmine.Spy };

  beforeEach(() => {
    dialogRef = { close: jasmine.createSpy('close') };
    TestBed.configureTestingModule({
      imports: [FormsModule],
      declarations: [QuestionGenModalComponentComponent, MockTranslatePipe],
      providers: [
        { provide: MatDialogRef, useValue: dialogRef },
        { provide: MAT_DIALOG_DATA, useValue: { quizId: 1, numOfQuestions: 5 } as QuestionGenerationRequest }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    });
    fixture = TestBed.createComponent(QuestionGenModalComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should close dialog with data when form is valid', () => {
    const form = { valid: true };
    component.submit(form);
    expect(dialogRef.close).toHaveBeenCalledWith(component.data);
  });

  it('should not close dialog when form is invalid', () => {
    const form = { valid: false };
    component.submit(form);
    expect(dialogRef.close).not.toHaveBeenCalled();
  });

  it('should have correct injected data', () => {
    expect(component.data.quizId).toBe(1);
    expect(component.data.numOfQuestions).toBe(5);
  });

  it('should not throw error if submit called with undefined form', () => {
    expect(() => component.submit(undefined)).not.toThrow();
    expect(dialogRef.close).not.toHaveBeenCalled();
  });

  it('should not close dialog if form.valid is missing', () => {
    const form = {};
    component.submit(form);
    expect(dialogRef.close).not.toHaveBeenCalled();
  });
});