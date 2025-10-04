import { Injectable } from '@angular/core';
import { User } from '../model/User';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { PasswordUpdateRequest } from '../model/PasswordUpdateRequest';

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

  /**
   * Updates the password for a user.
   * @param userId The ID of the user whose password is to be updated.
   * @param newPassword The new password to be set for the user.
   * @returns An Observable containing a message indicating the result of the operation.
   */
  updatePassword(userId: number, newPassword: string): Observable<{ message: string }> {
    const body: PasswordUpdateRequest = { newPassword };
    return this.httpClient.patch<{ message: string }>(`${environment.apiUrl}/user/${userId}/password`, body);
  }
}
