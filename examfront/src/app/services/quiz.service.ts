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

}
