import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '../../pipes/translate-pipe';

@Component({
  selector: 'app-performance-table',
  standalone: true,
  imports: [CommonModule, TranslatePipe],
  templateUrl: './performance-table.component.html',
  styleUrls: ['./performance-table.component.css']
})
export class PerformanceTableComponent implements OnChanges {
  @Input() historial: { fecha: string; precio_cierre: number }[] = [];

  periods = [
    { label: '1 semana', days: 7 },
    { label: '1 mes', days: 30 },
    { label: '3 meses', days: 90 },
    { label: '6 meses', days: 180 },
    { label: '1 año', days: 365 }
  ];

  performanceData: { label: string; rendimiento: number | null }[] = [];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['historial'] && this.historial.length) {
      this.calcularRendimientos();
    }
  }

  private calcularRendimientos(): void {
    const sorted = [...this.historial].sort((a, b) => a.fecha.localeCompare(b.fecha));
    if (sorted.length === 0) return;

    const today = new Date();
    const ultimoPrecio = sorted[sorted.length - 1].precio_cierre;

    this.performanceData = this.periods.map(period => {
      const startDate = new Date(today);
      startDate.setDate(startDate.getDate() - period.days);
      const startStr = startDate.toISOString().split('T')[0];

      let precioInicio: number | null = null;
      for (let i = sorted.length - 1; i >= 0; i--) {
        if (sorted[i].fecha <= startStr) {
          precioInicio = sorted[i].precio_cierre;
          break;
        }
      }

      if (precioInicio !== null) {
        const rendimiento = ((ultimoPrecio - precioInicio) / precioInicio) * 100;
        return { label: period.label, rendimiento };
      } else {
        return { label: period.label, rendimiento: null };
      }
    });
  }
}