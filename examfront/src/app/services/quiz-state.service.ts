import { Injectable } from '@angular/core';
import { Question } from '../model/Question';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { UserService } from './user.service';
import { map, switchMap } from 'rxjs/operators';
import { LoginService } from './login.service';
import { QuizAttemptDTO } from '../model/QuestionAttemptDTO';

@Injectable({
  providedIn: 'root'
})
export class QuizStateService {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getUserId(): number | null {
    console.log('Obteniendo ID de usuario desde localStorage');
    const user = localStorage.getItem('user');
    if (!user) return null;
    return JSON.parse(user).id;
  }

  getLastAttempts(): Observable<QuizAttemptDTO> {
    const userId = this.getUserId();
    if (!userId) throw new Error('Usuario no autenticado');
    return this.http.get<QuizAttemptDTO>(`${this.baseUrl}/quiz-attempts/last/10`);
  }
}