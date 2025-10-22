import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewQuizComponent } from './review-quiz.component';

describe('ReviewQuizComponent', () => {
  let component: ReviewQuizComponent;
  let fixture: ComponentFixture<ReviewQuizComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ReviewQuizComponent]
    });
    fixture = TestBed.createComponent(ReviewQuizComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
