import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslatePipe } from '../../pipes/translate-pipe';

@Component({
  selector: 'app-cookie-consent',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslatePipe],
  templateUrl: './cookie-consent.component.html'
})
export class CookieConsentComponent implements OnInit {
  showBanner = false;

  ngOnInit(): void {
    const consent = localStorage.getItem('cookieConsent');
    if (!consent) {
      this.showBanner = true;
    }
  }

  aceptarCookies(): void {
    localStorage.setItem('cookieConsent', 'accepted');
    this.showBanner = false;
    // Aquí puedes inicializar Google Analytics u otras cookies analíticas
  }

  rechazarCookies(): void {
    localStorage.setItem('cookieConsent', 'rejected');
    this.showBanner = false;
    // No se cargan cookies no esenciales
  }
}