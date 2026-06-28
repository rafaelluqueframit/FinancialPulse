import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { TranslatePipe } from '../../pipes/translate-pipe';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslatePipe],
  templateUrl: './perfil.component.html'
})

export class PerfilComponent implements OnInit {
  user: any = { nombre: '', email: '' };
  passwordActual = '';
  nuevaPassword = '';
  mensaje = '';
  error = '';
  activeTab: 'info' | 'privacidad' = 'info';

  constructor(private authService: AuthService, private http: HttpClient, private translatePipe: TranslatePipe) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      if (user) {
        this.user = { ...user };
      }
    });
  }

  exportarDatos(): void {
    this.http.get('/api/export-data', { responseType: 'blob' }).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `financialpulse_data_${this.user.email}.json`;
        a.click();
        window.URL.revokeObjectURL(url);
        this.mensaje = 'Datos exportados correctamente';
        setTimeout(() => this.mensaje = '', 3000);
      },
      error: (err) => {
        this.error = 'Error al exportar datos';
        console.error(err);
      }
    });
  }

  eliminarCuenta(): void {
    if (confirm(this.t('CONFIRMAR_ELIMINACION'))) {
      this.http.delete('/api/delete-account').subscribe({
        next: () => {
          this.authService.logout().subscribe(() => {
            window.location.href = '/login';
          });
        },
        error: (err) => {
          this.error = 'Error al eliminar la cuenta';
          console.error(err);
        }
      });
    }
  }

  onSubmit(): void {
    const datos: any = {
      nombre: this.user.nombre,
      email: this.user.email
    };
    if (this.nuevaPassword) {
      datos.password_actual = this.passwordActual;
      datos.nueva_password = this.nuevaPassword;
    }
    this.authService.actualizarPerfil(datos).subscribe({
      next: () => {
        this.mensaje = 'Perfil actualizado con éxito';
        this.error = '';
        // Recargar datos del usuario actual
        this.authService.getCurrentUser().subscribe();
        this.passwordActual = '';
        this.nuevaPassword = '';
      },
      error: (err) => {
        this.error = err.error?.error || 'Error al actualizar';
        this.mensaje = '';
      }
    });
  }

  private t(key: string): string {
    // Necesitarás inyectar TranslatePipe o usar el servicio de idioma. 
    // Como ya tienes TranslatePipe inyectado en otros sitios, puedes hacerlo así:
    return this.translatePipe.transform(key);
  }

}