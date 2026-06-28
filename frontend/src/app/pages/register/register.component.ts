import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { TranslatePipe } from '../../pipes/translate-pipe';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, TranslatePipe],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  nombre = '';
  email = '';
  password = '';
  successMessage = '';
  errorMessage = '';

  constructor(
    private auth: AuthService,
    private translatePipe: TranslatePipe
  ) {}

  onSubmit() {
    this.successMessage = '';
    this.errorMessage = '';

    this.auth.register(this.nombre, this.email, this.password).subscribe({
      next: () => {
        this.successMessage = this.translatePipe.transform('REGISTER_SUCCESS', { name: this.nombre });
        setTimeout(() => {
          window.location.href = '/login';
        }, 2000);
      },
      error: (err) => {
        const backendError = err.error?.error || err.message || '';
        let translationKey = 'REGISTER_ERROR_GENERIC';
        if (backendError.includes('email already exists') || backendError.includes('correo ya registrado')) {
          translationKey = 'REGISTER_ERROR_EMAIL_EXISTS';
        } else if (backendError.includes('weak') || backendError.includes('contraseña')) {
          translationKey = 'REGISTER_ERROR_WEAK_PASSWORD';
        }
        this.errorMessage = this.translatePipe.transform(translationKey);
      }
    });
  }
}