import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';

@Component({
  selector: 'app-price-chart',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  templateUrl: './price-chart.component.html',
  styleUrls: ['./price-chart.component.css']
})
export class PriceChartComponent implements OnChanges {
  @Input() historial: { fecha: string; precio_cierre: number }[] = [];
  @Input() prediccion: { fecha: string; prediccion: number }[] = [];

  // Configuración del gráfico
  public lineChartData: ChartData<'line'> = {
    datasets: [
      { data: [], label: 'Historial', borderColor: '#3b82f6', fill: false },
      { data: [], label: 'Predicción', borderColor: '#f59e0b', fill: false, borderDash: [5, 5] }
    ],
    labels: []
  };

  public lineChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: true },
      tooltip: { mode: 'index', intersect: false }
    }
  };

  public lineChartType: ChartType = 'line';

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['historial'] || changes['prediccion']) {
      this.actualizarGrafico();
    }
  }

  private actualizarGrafico(): void {
    const fechas = [
      ...this.historial.map(h => h.fecha),
      ...this.prediccion.map(p => p.fecha)
    ];
    // Ordenar fechas
    fechas.sort((a, b) => a.localeCompare(b));

    // Crear arrays de datos con la misma longitud que las fechas
    const historialData = fechas.map(f => {
      const encontrado = this.historial.find(h => h.fecha === f);
      return encontrado ? encontrado.precio_cierre : null;
    });
    const prediccionData = fechas.map(f => {
      const encontrado = this.prediccion.find(p => p.fecha === f);
      return encontrado ? encontrado.prediccion : null;
    });

    this.lineChartData.labels = fechas;
    this.lineChartData.datasets[0].data = historialData;
    this.lineChartData.datasets[1].data = prediccionData;
  }
}