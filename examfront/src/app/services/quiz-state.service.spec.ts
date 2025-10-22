import { TestBed } from '@angular/core/testing';

import { QuizStateService } from './quiz-state.service';

describe('QuizStateService', () => {
  let service: QuizStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(QuizStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
