import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { NgxEchartsModule } from 'ngx-echarts';
import type { EChartsOption } from 'echarts';
import { LanguageService } from '../../services/language.service';
import { TranslatePipe } from '../../pipes/translate-pipe';
import { TooltipDirective } from '../../directives/tooltip.directive';

@Component({
  selector: 'app-noticias',
  standalone: true,
  imports: [CommonModule, FormsModule, NgxEchartsModule, TranslatePipe, TooltipDirective],
  templateUrl: './noticias.component.html',
  styleUrls: ['./noticias.component.css']
})
export class NoticiasComponent implements OnInit {
  noticias: any[] = [];
  noticiasFiltradas: any[] = [];
  resumenSentimiento: { positivo: number; neutral: number; negativo: number } | null = null;
  loading = false;
  error = '';
  query: string = 'finanzas';
  orden: string = 'fecha_desc';
  fechaDesde: string = '';
  fechaHasta: string = '';

  // Filtro de sentimiento
  selectedSentiments: { positivo: boolean; neutral: boolean; negativo: boolean } = {
    positivo: true,
    neutral: true,
    negativo: true
  };

  sugerencias: string[] = ['Bitcoin', 'Apple', 'Tesla', 'IBEX35', 'Fed', 'IA'];

  pieChartOption: EChartsOption = {};

  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef,
    private languageService: LanguageService
  ) {}

  ngOnInit(): void {
    // Establecer query según idioma
    const lang = this.languageService.getCurrentLang();
    this.query = lang === 'en' ? 'finance' : 'finanzas';
    this.cargarNoticias();
  }

  cargarNoticias(): void {
    this.loading = true;
    const lang = this.languageService.getCurrentLang();
    let url = `/api/noticias?q=${encodeURIComponent(this.query)}&lang=${lang}`;
    if (this.fechaDesde) {
      url += `&desde=${this.fechaDesde}`;
    }
    if (this.fechaHasta) {
      url += `&hasta=${this.fechaHasta}`;
    }
    
    this.http.get(url).subscribe({
      next: (data: any) => {
        this.noticias = data.noticias || [];
        this.resumenSentimiento = data.resumen_sentimiento || null;
        this.aplicarFiltroSentimiento(); // Aplica filtro y orden
        this.prepararGraficoSentimiento();
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error(err);
        this.error = 'Error al cargar noticias';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
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
    this.prepararGraficoSentimiento(); // para actualizar la leyenda del gráfico (solo visual)
    this.cdr.detectChanges();
  }

  aplicarFiltroSentimiento(): void {
    this.noticiasFiltradas = this.noticias.filter(noticia => {
      const sent = noticia.sentimiento?.sentimiento;
      if (sent === 'positivo') return this.selectedSentiments.positivo;
      if (sent === 'neutral') return this.selectedSentiments.neutral;
      if (sent === 'negativo') return this.selectedSentiments.negativo;
      return true; // por si acaso
    });
    this.aplicarOrden();
  }

  aplicarOrden(): void {
    if (this.orden === 'fecha_desc') {
      this.noticiasFiltradas.sort((a, b) => (a.fecha > b.fecha ? -1 : 1));
    } else if (this.orden === 'fecha_asc') {
      this.noticiasFiltradas.sort((a, b) => (a.fecha < b.fecha ? -1 : 1));
    } else if (this.orden === 'sentimiento') {
      const peso: { [key: string]: number } = {
        'positivo': 0,
        'neutral': 1,
        'negativo': 2
      };
      this.noticiasFiltradas.sort((a, b) => {
        const sentA = a.sentimiento?.sentimiento;
        const sentB = b.sentimiento?.sentimiento;
        const pesoA = sentA && peso.hasOwnProperty(sentA) ? peso[sentA] : 1;
        const pesoB = sentB && peso.hasOwnProperty(sentB) ? peso[sentB] : 1;
        return pesoA - pesoB;
      });
    }
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
      series: [{
        name: 'Sentimiento',
        type: 'pie',
        radius: '50%',
        data: [
          { value: this.resumenSentimiento.positivo, name: 'Positivo', itemStyle: { color: '#22c55e' } },
          { value: this.resumenSentimiento.neutral, name: 'Neutral', itemStyle: { color: '#eab308' } },
          { value: this.resumenSentimiento.negativo, name: 'Negativo', itemStyle: { color: '#ef4444' } }
        ],
        emphasis: { scale: true }
      }]
    };
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

  buscar(): void {
    this.cargarNoticias();
  }

  buscarSugerencia(sugerencia: string): void {
    this.query = sugerencia;
    this.cargarNoticias();
  }

  cambiarOrden(nuevoOrden: string): void {
    this.orden = nuevoOrden;
    this.aplicarOrden();
    this.cdr.detectChanges();
  }
}