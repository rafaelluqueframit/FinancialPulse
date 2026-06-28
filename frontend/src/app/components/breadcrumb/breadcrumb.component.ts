import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd, RouterModule } from '@angular/router';
import { filter } from 'rxjs/operators';
import { TranslatePipe } from '../../pipes/translate-pipe';

@Component({
  selector: 'app-breadcrumb',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslatePipe],
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.css']
})
export class BreadcrumbComponent implements OnInit {
  breadcrumbs: { label: string, url: string }[] = [];

  // Mapeo de rutas a claves de traducción
  private routeLabels: { [key: string]: string } = {
    'inicio': 'INICIO',
    'buscar': 'BUSCAR',
    'favoritos': 'FAVORITOS',
    'cartera': 'CARTERA',
    'noticias': 'NOTICIAS',
    'perfil': 'PERFIL',
    'login': 'INICIAR_SESION',
    'register': 'REGISTRARSE',
    'forgot-password': 'RECUPERAR_CONTRASENA',
    'terminos': 'TERMINOS_USO',
    'privacidad': 'PRIVACIDAD',
    'cookies': 'COOKIES',
    'ayuda': 'AYUDA',  // genérico, pero se especializa por contexto
    'analisis': 'ANALISIS'
  };

  constructor(private router: Router) {}

  ngOnInit() {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.breadcrumbs = this.buildBreadcrumbs(this.router.url);
    });
  }

  buildBreadcrumbs(url: string): { label: string, url: string }[] {
    const parts = url.split('/').filter(p => p && p !== '');
    const breadcrumbs: { label: string, url: string }[] = [{ label: 'INICIO', url: '/' }];
    let currentPath = '';

    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      currentPath += `/${part}`;
      let labelKey: string;

      // Caso especial: dashboard con símbolo
      if (part === 'dashboard') {
        if (parts[i+1]) {
          const symbol = parts[i+1].toUpperCase();
          labelKey = `DASHBOARD:${symbol}`;
          currentPath += `/${symbol}`;
          breadcrumbs.push({ label: labelKey, url: currentPath });
          break;
        } else {
          labelKey = 'DASHBOARD';
        }
      }
      // Caso especial: ayuda dentro de secciones (cartera/ayuda, noticias/ayuda, analisis/ayuda)
      else if (part === 'ayuda') {
        const parent = parts[i-1];
        if (parent === 'cartera') {
          labelKey = 'AYUDA_CARTERA';
        } else if (parent === 'noticias') {
          labelKey = 'AYUDA_NOTICIAS';
        } else if (parent === 'analisis') {
          labelKey = 'AYUDA_ANALISIS';
        } else {
          labelKey = 'AYUDA';
        }
      }
      // Resto de rutas
      else {
        labelKey = this.routeLabels[part] || part.toUpperCase();
      }

      breadcrumbs.push({ label: labelKey, url: currentPath });
    }
    return breadcrumbs;
  }
}