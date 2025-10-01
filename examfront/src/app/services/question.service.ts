import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Question } from '../model/Question';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class QuestionService {

  private apiUrl = environment.apiUrl;

  constructor(
    private http: HttpClient
  ) { }

  /**
   * Retrieves the list of questions for a specific quiz from the backend API.
   *
   * @param quizId - The ID of the quiz whose questions are to be retrieved.
   * @returns An Observable emitting an array of `Question` objects.
   *
   * @remarks
   * This method sends an HTTP GET request to the `/question/quiz/{quizId}` endpoint of the configured API URL.
   * The returned observable will emit the questions once the HTTP request completes successfully.
   *
   * @example
   * this.questionService.getQuestionsOfQuiz(1).subscribe(questions => {
   *   console.log(questions);
   * });
   */
  public getQuestionsOfQuiz(quizId: number): Observable<Question[]> {
    return this.http.get<Question[]>(`${this.apiUrl}/question/quiz/${quizId}`);
  }
    
}
