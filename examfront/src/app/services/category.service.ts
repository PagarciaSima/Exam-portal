import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Category } from '../model/Category';
import { CategoryQuizCountResponseDTO } from '../model/CategoryQuizCountResponseDTO';
import { Quiz } from '../model/Quiz';

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
    return this.http.get<Category[]>(`${this.apiUrl}`);
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
    return this.http.post<Category>(`${this.apiUrl}`, category);
  }

  /**
   * Update an existing category.
   */
  public updateCategory(category: Category): Observable<Category> {
    return this.http.put<Category>(`${this.apiUrl}`, category);
  }

  /**
   * Delete a category by id.
   */
  public deleteCategory(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  /**
   * Create a new category.
   */
  public createCategory(category: Category): Observable<Category> {
    return this.http.post<Category>(`${this.apiUrl}`, category);
  }

  /**
   * Get paginated categories.
   */
  public getCategoriesPaged(page: number, size: number, search?: string): Observable<{ content: Category[], totalPages: number, totalElements: number }> {
    let params = `?page=${page}&size=${size}`;
    if (search && search.trim()) {
      params += `&search=${encodeURIComponent(search.trim())}`;
    }
    return this.http.get<{ content: Category[], totalPages: number, totalElements: number }>(
      `${this.apiUrl}/paged${params}`
    );
  }
  
  /**
   * Get the count of active quizzes by category.
   * @returns An observable with the count of active quizzes for each category.
   */
  getActiveQuizCountByCategory(): Observable<CategoryQuizCountResponseDTO[]> {
    return this.http.get<CategoryQuizCountResponseDTO[]>(`${environment.apiUrl}/category/quizzes/count/active`);
  }

  /**
   * Get all active quizzes for a specific category.
   * @param categoryId The ID of the category to retrieve quizzes for.
   * @returns An observable with the list of active quizzes for the specified category.
   */
  getActiveQuizzesByCategory(categoryId: number): Observable<Quiz[]> {
    return this.http.get<Quiz[]>(`${this.apiUrl}/quizzes/active/${categoryId}`);
  }
}