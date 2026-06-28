import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '../../pipes/translate-pipe';
import { LanguageService } from '../../services/language.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-cookies',
  standalone: true,
  imports: [CommonModule, TranslatePipe],
  templateUrl: './cookies.component.html'
})
export class CookiesComponent implements OnInit, OnDestroy {
  currentDate = '';
  private langSubscription!: Subscription;

  constructor(private languageService: LanguageService) {}

  ngOnInit(): void {
    this.updateDate();
    this.langSubscription = this.languageService.currentLang$.subscribe(() => {
      this.updateDate();
    });
  }

  updateDate(): void {
    const lang = this.languageService.getCurrentLang();
    const locale = lang === 'es' ? 'es-ES' : 'en-US';
    const now = new Date();
    this.currentDate = now.toLocaleDateString(locale, { year: 'numeric', month: 'long', day: 'numeric' });
  }

  ngOnDestroy(): void {
    if (this.langSubscription) this.langSubscription.unsubscribe();
  }
}