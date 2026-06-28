import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FavoritosService } from '../../services/favoritos.service';
import { DashboardService } from '../../services/dashboard.service';
import { forkJoin } from 'rxjs';
import { TranslatePipe } from '../../pipes/translate-pipe';

@Component({
  selector: 'app-favoritos',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslatePipe],
  templateUrl: './favoritos.component.html',
  styleUrls: ['./favoritos.component.css']
})
export class FavoritosComponent implements OnInit {
  loading = true;
  favoritosData: any[] = [];

  constructor(
    private favoritosService: FavoritosService,
    private dashboardService: DashboardService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.cargarFavoritos();
  }

  cargarFavoritos(): void {
    this.loading = true;
    this.cdr.detectChanges();
    this.favoritosService.getFavoritos().subscribe({
      next: (simbolos) => {
        if (simbolos.length === 0) {
          this.loading = false;
          this.cdr.detectChanges();
          return;
        }
        const requests = simbolos.map(simbolo =>
          this.dashboardService.getDashboardData(simbolo, '1d')
        );
        forkJoin(requests).subscribe({
          next: (resultados) => {
            this.favoritosData = resultados.map((data, idx) => {
              // Usamos 'close' en lugar de 'precio_cierre'
              const historial = data.historial;
              const primerPrecio = historial.length > 0 ? historial[0].close : 0;
              const ultimoPrecio = historial.length > 0 ? historial[historial.length - 1].close : 0;
              const cambio = ultimoPrecio - primerPrecio;
              const cambioPorcentaje = primerPrecio !== 0 ? (cambio / primerPrecio) * 100 : 0;
              return {
                simbolo: simbolos[idx],
                nombre: data.nombre,
                precio: data.precio_actual,
                moneda: data.moneda,
                cambio: cambio,
                cambioPorcentaje: cambioPorcentaje
              };
            });
            this.loading = false;
            this.cdr.detectChanges();
          },
          error: (err) => {
            console.error(err);
            this.loading = false;
            this.cdr.detectChanges();
          }
        });
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  eliminarFavorito(simbolo: string): void {
    this.favoritosService.removeFavorito(simbolo).subscribe({
      next: () => {
        this.favoritosData = this.favoritosData.filter(f => f.simbolo !== simbolo);
        this.cdr.detectChanges();
      },
      error: (err) => console.error(err)
    });
  }
}