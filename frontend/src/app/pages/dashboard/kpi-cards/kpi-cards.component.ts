import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '../../../pipes/translate-pipe';

@Component({
  selector: 'app-kpi-cards',
  standalone: true,
  imports: [CommonModule, TranslatePipe],
  templateUrl: './kpi-cards.component.html',
  styleUrls: ['./kpi-cards.component.css']
})
export class KpiCardsComponent implements OnChanges {
  @Input() historial: { fecha: string; precio_cierre: number }[] = [];
  @Input() precioActual: number = 0;
  @Input() moneda: string = 'USD';

  apertura: number = 0;
  maximo: number = 0;
  minimo: number = 0;
  variacion: number = 0;
  variacionPorcentaje: number = 0;

  fechaInicio: string = '';
  fechaFin: string = '';

  ngOnChanges(changes: SimpleChanges): void {
    if (this.historial && this.historial.length > 0) {
      this.calcularKPIs();
      this.obtenerRangoFechas();
    }
  }

  private calcularKPIs(): void {
    const precios = this.historial.map(h => h.precio_cierre);
    this.apertura = this.historial[0].precio_cierre;
    this.maximo = Math.max(...precios);
    this.minimo = Math.min(...precios);
    this.variacion = this.precioActual - this.apertura;
    this.variacionPorcentaje = (this.variacion / this.apertura) * 100;
  }

  private obtenerRangoFechas(): void {
    const fechas = this.historial.map(h => h.fecha).sort();
    this.fechaInicio = fechas[0];
    this.fechaFin = fechas[fechas.length - 1];
  }

  formatFecha(fecha: string): string {
    if (!fecha) return '';
    const [y, m, d] = fecha.split('-');
    return `${d}/${m}/${y}`;
  }
}