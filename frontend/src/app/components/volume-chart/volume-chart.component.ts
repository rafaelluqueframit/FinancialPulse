import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxEchartsModule } from 'ngx-echarts';
import type { EChartsOption } from 'echarts';

@Component({
  selector: 'app-volume-chart',
  standalone: true,
  imports: [CommonModule, NgxEchartsModule],
  templateUrl: './volume-chart.component.html',
  styleUrls: ['./volume-chart.component.css']
})
export class VolumeChartComponent implements OnChanges {
  @Input() historial: { fecha: string; volumen: number }[] = [];
  @Input() colores: string[] = ['#2563eb']; // Color por defecto

  chartOption: EChartsOption = {};

  ngOnChanges(changes: SimpleChanges): void {
    if (this.historial.length) {
      this.prepararGrafico();
    }
  }

  private prepararGrafico(): void {
    const fechas = this.historial.map(h => h.fecha);
    const volumenes = this.historial.map(h => h.volumen);

    this.chartOption = {
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'shadow' }
      },
      grid: { left: '5%', right: '5%', top: '10%', bottom: '10%' },
      xAxis: {
        type: 'category',
        data: fechas,
        axisLabel: { rotate: 45, interval: 'auto' }
      },
      yAxis: {
        type: 'value',
        name: 'Volumen'
      },
      series: [
        {
          name: 'Volumen',
          type: 'bar',
          data: volumenes,
          itemStyle: { color: this.colores[0] }
        }
      ],
      dataZoom: [
        { type: 'slider', start: 0, end: 100 },
        { type: 'inside', start: 0, end: 100 }
      ]
    };
  }
}