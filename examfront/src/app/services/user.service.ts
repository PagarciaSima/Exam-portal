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

  /**
   * Uploads a profile picture for the specified user.
   * @param userId The ID of the user.
   * @param file The profile picture file to upload.
   * @returns An Observable containing the profileUrl or error message.
   */
  uploadProfilePicture(userId: number, file: File): Observable<{ profileUrl?: string; error?: string }> {
    const formData = new FormData();
    formData.append('file', file);

    return this.httpClient.post<{ profileUrl?: string; error?: string }>(
      `${environment.apiUrl}/user/${userId}/profile`,
      formData
    );
  }

  /**
   * Deletes the profile picture for the specified user.
   * @param userId The ID of the user.
   * @returns An Observable containing a success or error message.
   */
  deleteProfilePicture(userId: number): Observable<{ message?: string; error?: string }> {
    return this.httpClient.delete<{ message?: string; error?: string }>(
      `${environment.apiUrl}/user/${userId}/profile`
    );
  }

  /**
   * Updates the user profile.
   * @param userId The ID of the user.
   * @param updatedUser The updated user data.
   * @returns An Observable of the updated User.
   */
  updateUser(userId: number, updatedUser: User): Observable<User> {
    return this.httpClient.put<User>(
      `${environment.apiUrl}/user/${userId}`,
      updatedUser
    );
  }
}
