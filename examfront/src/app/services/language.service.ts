import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class LanguageService {
  private readonly KEY = 'app_language';

  setLanguage(lang: string) {
    localStorage.setItem(this.KEY, lang);
  }

  getLanguage(): string {
    return localStorage.getItem(this.KEY) || 'en';
  }
}