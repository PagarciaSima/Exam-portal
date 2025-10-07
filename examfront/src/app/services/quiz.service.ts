import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Quiz } from '../model/Quiz';

@Injectable({
  providedIn: 'root'
})
export class QuizService {

  private apiUrl = environment.apiUrl;

  constructor(
    private http: HttpClient
  ) { }

  /**
   * @param quizId The ID of the quiz to retrieve.
   * @returns An observable emitting the requested `Quiz` object.
   */
   getQuiz(quizId: any): Observable<Quiz> {
    return this.http.get<Quiz>(`${this.apiUrl}/quiz/${quizId}`);
   }
  
  /**
   * Retrieves the list of all quizzes from the backend API.
   *
   * @returns {Observable<Quiz[]>} An observable emitting an array of `Quiz` objects.
   *
   * @remarks
   * This method sends an HTTP GET request to the `/quiz/` endpoint of the configured API URL.
   * The returned observable will emit the quizzes once the HTTP request completes successfully.
   *
   * @example
   * this.quizService.getQuizzes().subscribe(quizzes => {
   *   console.log(quizzes);
   * });
   */
  public getQuizzes(): Observable<Quiz[]> {
    return this.http.get<Quiz[]>(`${this.apiUrl}/quiz/`);
  }

  /**
   * Adds a new quiz by sending a POST request to the backend API.
   *
   * @param quiz - The quiz object to be added.
   * @returns An Observable emitting the created Quiz object as returned by the API.
   */
  public addQuiz(quiz: Quiz): Observable<Quiz> {
    return this.http.post<Quiz>(`${this.apiUrl}/quiz/`, quiz);
  }

  /**
   * Deletes a quiz by its ID.
   *
   * @param qId The ID of the quiz to be deleted.
   * @returns An Observable emitting void.
   */
  public deleteQuiz(qId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/quiz/${qId}`);
  }

  /**
   * Updates an existing quiz.
   *
   * @param quiz The quiz object containing updated data.
   * @returns An Observable emitting the updated Quiz object.
   */
  public updateQuiz(quiz: Quiz): Observable<Quiz> {
    return this.http.put<Quiz>(`${this.apiUrl}/quiz/`, quiz);
  }

  /**
   * Retrieves paginated quizzes from the backend API.
   * @param page The page number (zero-based).
   * @param size The number of items per page.
   * @returns An observable emitting a Page object with quizzes.
   */
  public getQuizzesPaged(page: number, size: number, search?: string): Observable<{ content: Quiz[], totalPages: number, totalElements: number }> {
    let params = `?page=${page}&size=${size}`;
    if (search && search.trim()) {
      params += `&search=${encodeURIComponent(search.trim())}`;
    }
    return this.http.get<{ content: Quiz[], totalPages: number, totalElements: number }>(
      `${this.apiUrl}/quiz/paged${params}`
    );
  }
}
