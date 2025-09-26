import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Category } from '../model/Category';
import { environment } from 'src/environments/environment';

/**
 * Service for managing categories.
 */
@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private apiUrl = `${environment.apiUrl}/category`;

  constructor(private http: HttpClient) { }

  /**
   * Get all categories.
   */
  public getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.apiUrl}/`);
  }

  /**
   * Get a category by id.
   */
  public getCategory(id: number): Observable<Category> {
    return this.http.get<Category>(`${this.apiUrl}/${id}`);
  }

  /**
   * Add a new category.
   */
  public addCategory(category: Category): Observable<Category> {
    return this.http.post<Category>(`${this.apiUrl}/`, category);
  }

  /**
   * Update an existing category.
   */
  public updateCategory(category: Category): Observable<Category> {
    return this.http.put<Category>(`${this.apiUrl}/${category.cid}`, category);
  }

  /**
   * Delete a category by id.
   */
  public deleteCategory(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
