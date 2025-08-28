import { Injectable } from '@angular/core';
import { User } from '../model/User';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private httpClient: HttpClient
  ) { }

  /**
 * Sends a POST request to create a new user in the backend.
 *
 * @param user The user object containing the registration data.
 * @returns An Observable of the created User returned by the server.
 *
 */
  public addUser(user: User): Observable<User> {
    return this.httpClient.post<User>(`${environment.apiUrl}/user/`, user);
  }
}
