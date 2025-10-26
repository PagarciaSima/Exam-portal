import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { QuizStateService } from './quiz-state.service';
import { QuizAttemptDTO } from '../model/QuestionAttemptDTO';
import { PopularQuizStatsDTO } from '../model/PopularQuizStatsDTO';

describe('QuizStateService', () => {
  let service: QuizStateService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(QuizStateService);
    httpMock = TestBed.inject(HttpTestingController);
    localStorage.clear();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('getUserId should return null if no user in localStorage', () => {
    expect(service.getUserId()).toBeNull();
  });

  it('getUserId should return id if user exists in localStorage', () => {
    localStorage.setItem('user', JSON.stringify({ id: 123 }));
    expect(service.getUserId()).toBe(123);
  });

  it('getLastQuizAttempts should return observable', (done) => {
    localStorage.setItem('user', JSON.stringify({ id: 123 }));
    const mockAttempt: QuizAttemptDTO = {
      id: 1,
      marksGot: 10,
      correctAnswers: 5,
      attempted: 5,
      attemptDate: '2024-06-01T12:00:00Z',
      questions: [],
      maxMarks: 10
    };
    service.getLastAttempts().subscribe((data) => {
      expect(data).toEqual(mockAttempt);
      done();
    });
    const req = httpMock.expectOne((r) => r.url.includes('/quiz-attempts/last/123'));
    expect(req.request.method).toBe('GET');
    req.flush(mockAttempt);
  });

  it('getTopAttemptedQuizzes should return observable', (done) => {
    const mockStats: PopularQuizStatsDTO[] = [
      { quizId: 1, quizTitle: 'Quiz 1', totalAttempts: 10, averageMarks: 7.5 },
      { quizId: 2, quizTitle: 'Quiz 2', totalAttempts: 8, averageMarks: 6.2 }
    ];
    service.getTopQuizzesByAttempts().subscribe((data) => {
      expect(data).toEqual(mockStats);
      done();
    });
    const req = httpMock.expectOne((r) => r.url.includes('/quiz-attempts/top-attempts'));
    expect(req.request.method).toBe('GET');
    req.flush(mockStats);
  });
});
