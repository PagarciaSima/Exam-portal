import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionGenModalComponentComponent } from './question-gen-modal-component.component';

describe('QuestionGenModalComponentComponent', () => {
  let component: QuestionGenModalComponentComponent;
  let fixture: ComponentFixture<QuestionGenModalComponentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [QuestionGenModalComponentComponent]
    });
    fixture = TestBed.createComponent(QuestionGenModalComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
