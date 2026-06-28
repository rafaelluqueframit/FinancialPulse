import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EChartsOption } from 'echarts';
import { NgxEchartsModule } from 'ngx-echarts';
import { TranslatePipe } from '../../../pipes/translate-pipe';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-news-section',
  standalone: true,
  imports: [CommonModule, NgxEchartsModule, TranslatePipe],
  templateUrl: './news-section.component.html',
  styleUrls: ['./news-section.component.css']
})
export class NewsSectionComponent implements OnChanges {
  @Input() noticias: any[] = [];
  @Input() resumenSentimiento: { positivo: number; neutral: number; negativo: number } | null = null;

  orden: string = 'fecha_desc';
  noticiasOrdenadas: any[] = [];
  noticiasFiltradas: any[] = [];

  selectedSentiments = { positivo: true, neutral: true, negativo: true };

  pieChartOption: EChartsOption = {};

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['noticias'] && this.noticias) {
      this.aplicarFiltroSentimiento();
      this.ordenarNoticias();
    }
    if (this.resumenSentimiento) {
      this.prepararGraficoSentimiento();
    }
  }

  aplicarFiltroSentimiento(): void {
    this.noticiasFiltradas = this.noticias.filter(noticia => {
      const sent = noticia.sentimiento?.sentimiento;
      if (sent === 'positivo') return this.selectedSentiments.positivo;
      if (sent === 'neutral') return this.selectedSentiments.neutral;
      if (sent === 'negativo') return this.selectedSentiments.negativo;
      return true;
    });
    this.ordenarNoticias();
  }

  cambiarOrden(nuevoOrden: string): void {
    this.orden = nuevoOrden;
    this.ordenarNoticias();
  }

  ordenarNoticias(): void {
    if (!this.noticiasFiltradas) return;
    let ordenadas = [...this.noticiasFiltradas];
    if (this.orden === 'fecha_desc') {
      ordenadas.sort((a, b) => (a.fecha > b.fecha ? -1 : 1));
    } else if (this.orden === 'fecha_asc') {
      ordenadas.sort((a, b) => (a.fecha < b.fecha ? -1 : 1));
    } else if (this.orden === 'sentimiento') {
      const peso: any = { 'positivo': 0, 'neutral': 1, 'negativo': 2 };
      ordenadas.sort((a, b) => {
        return peso[a.sentimiento.sentimiento] - peso[b.sentimiento.sentimiento];
      });
    }
    this.noticiasOrdenadas = ordenadas;
  }

  prepararGraficoSentimiento(): void {
    if (!this.resumenSentimiento) return;
    this.pieChartOption = {
      tooltip: { trigger: 'item' },
      legend: {
        orient: 'vertical',
        left: 'left',
        selected: {
          'Positivo': this.selectedSentiments.positivo,
          'Neutral': this.selectedSentiments.neutral,
          'Negativo': this.selectedSentiments.negativo
        }
      },
      series: [
        {
          name: 'Sentimiento',
          type: 'pie',
          radius: '50%',
          data: [
            { value: this.resumenSentimiento.positivo, name: 'Positivo', itemStyle: { color: '#22c55e' } },
            { value: this.resumenSentimiento.neutral, name: 'Neutral', itemStyle: { color: '#eab308' } },
            { value: this.resumenSentimiento.negativo, name: 'Negativo', itemStyle: { color: '#ef4444' } }
          ],
          emphasis: { scale: true }
        }
      ]
    };
  }

  toggleSentimiento(tipo: 'positivo' | 'neutral' | 'negativo'): void {
    if (tipo === 'positivo') {
      this.selectedSentiments.positivo = !this.selectedSentiments.positivo;
    } else if (tipo === 'neutral') {
      this.selectedSentiments.neutral = !this.selectedSentiments.neutral;
    } else if (tipo === 'negativo') {
      this.selectedSentiments.negativo = !this.selectedSentiments.negativo;
    }
    this.aplicarFiltroSentimiento();
    this.prepararGraficoSentimiento();
    this.cdr.detectChanges();
  }

  onLegendSelectChanged(event: any): void {
    // event.selected es un objeto con todas las leyendas, ejemplo:
    // { 'Positivo': true, 'Neutral': false, 'Negativo': true }
    this.selectedSentiments.positivo = event.selected['Positivo'] ?? true;
    this.selectedSentiments.neutral = event.selected['Neutral'] ?? true;
    this.selectedSentiments.negativo = event.selected['Negativo'] ?? true;
    
    this.aplicarFiltroSentimiento();
    this.prepararGraficoSentimiento(); // actualiza el gráfico (aunque visualmente ya lo hace)
    this.cdr.detectChanges();
  }

  getSentimientoColor(sentimiento: string): string {
    const colores: any = {
      positivo: 'bg-green-100 text-green-800',
      neutral: 'bg-yellow-100 text-yellow-800',
      negativo: 'bg-red-100 text-red-800'
    };
    return colores[sentimiento] || 'bg-gray-100 text-gray-800';
  }
}