import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { BuscarComponent } from './pages/buscar/buscar.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { NoticiasComponent } from './pages/noticias/noticias.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { PerfilComponent } from './pages/perfil/perfil.component';
import { CarteraComponent } from './pages/cartera/cartera.component';
import { authGuard } from './guards/auth-guard';
import { ForgotPasswordComponent } from './pages/forgot-password/forgot-password.component';
import { FavoritosComponent } from './pages/favoritos/favoritos.component';
import { CarteraAyudaComponent } from './pages/cartera-ayuda/cartera-ayuda.component';
import { NoticiasAyudaComponent } from './pages/noticias-ayuda/noticias-ayuda.component';
import { AnalisisAyudaComponent } from './pages/analisis-ayuda/analisis-ayuda.component';
import { TerminosComponent } from './pages/terminos/terminos.component';
import { PrivacidadComponent } from './pages/privacidad/privacidad.component';
import { CookiesComponent } from './pages/cookies/cookies.component';

export const routes: Routes = [
  { path: '', component: HomeComponent, canActivate: [authGuard] },
  { path: 'buscar', component: BuscarComponent, canActivate: [authGuard] },
  { path: 'dashboard/:simbolo', component: DashboardComponent, canActivate: [authGuard] },
  { path: 'noticias', component: NoticiasComponent, canActivate: [authGuard] },
  { path: 'perfil', component: PerfilComponent, canActivate: [authGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'cartera', component: CarteraComponent, canActivate: [authGuard] },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'favoritos', component: FavoritosComponent, canActivate: [authGuard] },
  { path: 'cartera/ayuda', component: CarteraAyudaComponent, canActivate: [authGuard] },
  { path: 'noticias/ayuda', component: NoticiasAyudaComponent, canActivate: [authGuard] },
  { path: 'analisis/ayuda', component: AnalisisAyudaComponent, canActivate: [authGuard] },
  { path: 'terminos', component: TerminosComponent },
  { path: 'privacidad', component: PrivacidadComponent },
  { path: 'cookies', component: CookiesComponent },
  { path: '**', redirectTo: '' }
];