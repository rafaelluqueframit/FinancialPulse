import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { TranslatePipe } from '../../pipes/translate-pipe';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, TranslatePipe],
  templateUrl: './forgot-password.component.html'
})
export class ForgotPasswordComponent {
  step = 1;
  email = '';
  code = '';
  newPassword = '';
  confirmPassword = '';
  message = '';
  error = '';

  constructor(private authService: AuthService, private router: Router) {}

  requestCode() {
    if (!this.email) {
      this.error = 'Introduce tu email';
      return;
    }
    this.authService.requestPasswordReset(this.email).subscribe({
      next: (res) => {
        this.message = res.message || 'Código enviado al email';
        this.step = 2;
        this.error = '';
      },
      error: (err) => {
        this.error = err.error?.message || 'Error al enviar el código';
      }
    });
  }

  resetPassword() {
    if (!this.code || !this.newPassword || this.newPassword !== this.confirmPassword) {
      this.error = 'Revisa los campos (las contraseñas deben coincidir)';
      return;
    }
    this.authService.resetPassword(this.email, this.code, this.newPassword).subscribe({
      next: () => {
        this.message = 'Contraseña actualizada. Redirigiendo al login...';
        setTimeout(() => this.router.navigate(['/login']), 2000);
      },
      error: (err) => {
        this.error = err.error?.error || 'Error al restablecer la contraseña';
      }
    });
  }
}