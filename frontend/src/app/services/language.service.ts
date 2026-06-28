import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class LanguageService {
  private currentLangSubject = new BehaviorSubject<string>('es');
  public currentLang$ = this.currentLangSubject.asObservable();

  constructor() {
    const savedLang = localStorage.getItem('language');
    if (savedLang && (savedLang === 'es' || savedLang === 'en')) {
      this.currentLangSubject.next(savedLang);
    }
  }

  getCurrentLang(): string {
    return this.currentLangSubject.value;
  }

  setLanguage(lang: string): void {
    if (lang === 'es' || lang === 'en') {
      this.currentLangSubject.next(lang);
      localStorage.setItem('language', lang);
    }
  }
}