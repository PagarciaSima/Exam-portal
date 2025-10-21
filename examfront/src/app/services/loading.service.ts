import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class LoadingService {
  private loadingSubject = new BehaviorSubject<boolean>(false);
  loading$ = this.loadingSubject.asObservable();

    /**
     * Show the loading indicator.
     */
  show() {
    this.loadingSubject.next(true);
  }

  /**
   * Hide the loading indicator.
   */
  hide() {
    this.loadingSubject.next(false);
  }
}