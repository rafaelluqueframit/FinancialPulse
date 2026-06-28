import { Component, OnInit, ChangeDetectorRef, Injector } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { DashboardService } from '../../services/dashboard.service';
import { DashboardData } from '../../models/dashboard.model';
import { NgxEchartsModule } from 'ngx-echarts';
import type { EChartsOption } from 'echarts';
import { HistoricalTableComponent } from './historical-table/historical-table.component';
import { NewsSectionComponent } from './news-section/news-section.component';
import { KpiCardsComponent } from './kpi-cards/kpi-cards.component';
import { PerformanceTableComponent } from '../../components/performance-table/performance-table.component';
import { RecommendationService } from '../../services/recommendation.service';
import { FavoritosService } from '../../services/favoritos.service';
import { LanguageService } from '../../services/language.service';
import { TranslatePipe } from '../../pipes/translate-pipe';
import { TooltipDirective } from '../../directives/tooltip.directive';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    NgxEchartsModule,
    HistoricalTableComponent,
    NewsSectionComponent,
    KpiCardsComponent,
    PerformanceTableComponent,
    TranslatePipe,
    TooltipDirective
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  private translatePipe!: TranslatePipe;
  data?: DashboardData;
  error?: string;
  simbolo: string = '';
  loading = false;
  recommendation: any = null;
  activeTab: string = 'resumen';
  esFavorito = false;
  favoritosList: string[] = [];

  // Selector de vista de gráfico: 'unified' | 'separated'
  viewType: 'unified' | 'separated' = 'unified';

  // Tipo de gráfico para vista unificada: 'line' | 'candlestick'
  chartType: 'line' | 'candlestick' = 'line';

  // Opciones para gráficos separados
  chartHistOption: EChartsOption = {};
  chartPredOption: EChartsOption = {};

  // Para gráfico unificado (se actualiza según chartType)
  chartOption: EChartsOption = {};

  selectedPeriod: string = '6mo';
  periods: { label: string; value: string }[] = [
    { label: '1M', value: '1mo' },
    { label: '3M', value: '3mo' },
    { label: '6M', value: '6mo' },
    { label: '1A', value: '1y' }
  ];

  // get historialParaHijos() {
  //   return this.data?.historial.map(h => ({ fecha: h.fecha, precio_cierre: h.close })) || [];
  // }
  historialParaHijos: { fecha: string; precio_cierre: number }[] = [];

  constructor(
    private route: ActivatedRoute,
    private dashboardService: DashboardService,
    private recommendationService: RecommendationService,
    private favoritosService: FavoritosService,
    private cdr: ChangeDetectorRef,
    private injector: Injector,
    private languageService: LanguageService
  ) {}

  ngOnInit(): void {
    this.translatePipe = this.injector.get(TranslatePipe);
    this.route.params.subscribe(params => {
      this.simbolo = params['simbolo'] || 'AAPL';
      this.cargarDatos();
      this.cargarRecomendacion();
      // this.translatePipe = this.injector.get(TranslatePipe);
      this.verificarSiEsFavorito();
    });
  }

  private t(key: string): string {
    return this.translatePipe.transform(key);
  }

  cambiarPeriodo(period: string): void {
    this.selectedPeriod = period;
    this.cargarDatos();
  }

  cargarDatos(): void {
    if (!this.simbolo) return;
    const lang = this.languageService.getCurrentLang();
    localStorage.setItem('lastDashboardSymbol', this.simbolo);
    this.loading = true;
    this.dashboardService.getDashboardData(this.simbolo, this.selectedPeriod, lang).subscribe({
      next: (data) => {
        this.data = data;
        this.historialParaHijos = this.data?.historial.map(h => ({ fecha: h.fecha, precio_cierre: h.close })) || [];
        if (!this.data.fundamental) this.data.fundamental = {};
        this.prepararGraficos();   // Actualiza todos los gráficos según viewType y chartType
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.error = 'Error al cargar: ' + err.message;
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  // Cambia entre gráfico de líneas y velas (solo en vista unificada)
  toggleChartType(): void {
    this.chartType = this.chartType === 'line' ? 'candlestick' : 'line';
    if (this.viewType === 'unified') {
      this.prepararGraficoUnificado();
    }
    this.cdr.detectChanges();
  }

  // Método principal que orquesta la creación de gráficos
  prepararGraficos(): void {
    if (!this.data || !this.data.historial) return;
    if (this.viewType === 'unified') {
      this.prepararGraficoUnificado();
    } else {
      this.prepararGraficoHistorico();
      this.prepararGraficoPrediccion();
    }
  }

  // Gráfico unificado (líneas o velas según chartType)
  prepararGraficoUnificado(): void {
    if (!this.data || !this.data.historial) return;
    const fechas = [...this.data.historial.map(h => h.fecha), ...(this.data.prediccion?.map(p => p.fecha) || [])];
    const valoresPred = this.data.prediccion ? this.data.prediccion.map(p => p.prediccion) : [];
    const valoresUpper = this.data.prediccion ? this.data.prediccion.map(p => p.upper || null) : [];
    const valoresLower = this.data.prediccion ? this.data.prediccion.map(p => p.lower || null) : [];

    if (this.chartType === 'line') {
      const valoresHist = this.data.historial.map(h => h.close);
      this.chartOption = {
        tooltip: { trigger: 'axis' },
        legend: { 
          data: [this.t('LEGEND_HISTORICO'), this.t('LEGEND_PREDICCION')], 
          bottom: 0, left: 'center', type: 'scroll' 
        },
        xAxis: { type: 'category', data: fechas, axisLabel: { rotate: 45, interval: 'auto', show: false } },
        yAxis: { type: 'value', name: `Precio (${this.data.moneda})` },
        series: [
          { name: this.t('LEGEND_HISTORICO'), type: 'line', data: valoresHist, smooth: true, lineStyle: { color: '#3b82f6', width: 2 } },
          { name: this.t('LEGEND_PREDICCION'), type: 'line', data: [...Array(this.data.historial.length).fill(null), ...valoresPred], lineStyle: { color: '#e67e22', width: 2, type: 'dashed' } },
          { name: this.t('LEGEND_INTERVALO_SUPERIOR'), type: 'line', data: [...Array(this.data.historial.length).fill(null), ...valoresUpper], lineStyle: { opacity: 0 }, showSymbol: false, tooltip: { show: false } },
          { name: this.t('LEGEND_INTERVALO_INFERIOR'), type: 'line', data: [...Array(this.data.historial.length).fill(null), ...valoresLower], lineStyle: { opacity: 0 }, showSymbol: false, tooltip: { show: false } }
        ],
        dataZoom: [{ type: 'slider', start: 0, end: 100 }]
      };
    } else { // candlestick
      const candlestickData = this.data.historial.map(h => [h.open, h.close, h.low, h.high]);
      this.chartOption = {
        tooltip: { trigger: 'axis' },
        legend: { data: [this.t('LEGEND_VELAS'), this.t('LEGEND_PREDICCION')], bottom: 0, left: 'center', type: 'scroll' },
        xAxis: { type: 'category', data: fechas, axisLabel: { rotate: 45, interval: 'auto', show: false } },
        yAxis: { type: 'value', name: `Precio (${this.data.moneda})` },
        series: [
          {
            name: this.t('LEGEND_VELAS'),
            type: 'candlestick',
            data: candlestickData,
            itemStyle: { color: '#00da3c', color0: '#ec0000', borderColor: '#008F28', borderColor0: '#8B0000' }
          },
          {
            name: this.t('LEGEND_PREDICCION'),
            type: 'line',
            data: [...Array(this.data.historial.length).fill(null), ...valoresPred],
            lineStyle: { color: '#f39c12', width: 2, type: 'dashed' },
            symbol: 'circle',
            symbolSize: 6
          }
        ],
        dataZoom: [{ type: 'slider', start: 0, end: 100 }]
      };
    }
  }

  // Gráfico separado: histórico (con velas)
  prepararGraficoHistorico(): void {
    if (!this.data || !this.data.historial) return;
    const fechasHist = this.data.historial.map(h => h.fecha);
    const candlestickData = this.data.historial.map(h => [h.open, h.close, h.low, h.high]);

    this.chartHistOption = {
      tooltip: { trigger: 'axis' },
      legend: { data: [this.t('LEGEND_HISTORICO_VELAS')], bottom: 0, left: 'center' },
      xAxis: { type: 'category', data: fechasHist, axisLabel: { rotate: 45, interval: 'auto', show: false } },
      yAxis: { type: 'value', name: `Precio (${this.data.moneda})` },
      series: [
        {
          name: this.t('LEGEND_VELAS'),
          type: 'candlestick',
          data: candlestickData,
          itemStyle: { color: '#00da3c', color0: '#ec0000', borderColor: '#008F28', borderColor0: '#8B0000' }
        }
      ],
      dataZoom: [{ type: 'slider', start: 0, end: 100 }]
    };
  }

  // Gráfico separado: predicción (línea con bandas)
  prepararGraficoPrediccion(): void {
    // Validación: si no hay datos de predicción, mostrar un gráfico con mensaje
    if (!this.data || !this.data.prediccion || this.data.prediccion.length === 0) {
      this.chartPredOption = {
        title: {
          show: true,
          text: 'No hay datos de predicción disponibles',
          left: 'center',
          top: 'middle',
          textStyle: { fontSize: 14, color: '#888' }
        },
        // Eliminar series y ejes para no mostrar nada adicional
        xAxis: { show: false },
        yAxis: { show: false },
        series: []
      };
      return;
    }

    // Si hay datos, proceder con el gráfico normal
    const fechasPred = this.data.prediccion.map(p => p.fecha);
    const valoresPred = this.data.prediccion.map(p => p.prediccion);
    const valoresUpper = this.data.prediccion.map(p => p.upper || null);
    const valoresLower = this.data.prediccion.map(p => p.lower || null);

    this.chartPredOption = {
      tooltip: { trigger: 'axis' },
      legend: { data: [this.t('LEGEND_PREDICCION'), this.t('LEGEND_INTERVALO_SUPERIOR'), this.t('LEGEND_INTERVALO_INFERIOR')], bottom: 0, left: 'center', type: 'scroll' },
      xAxis: {
        type: 'category',
        data: fechasPred,
        axisLabel: { show: false }  // ← Ocultar fechas (ya no rotan)
      },
      yAxis: { type: 'value', name: `Precio (${this.data.moneda})` },
      series: [
        { name: this.t('LEGEND_PREDICCION'), type: 'line', data: valoresPred, smooth: true, lineStyle: { color: '#e67e22', width: 2, type: 'dashed' } },
        { name: this.t('LEGEND_INTERVALO_SUPERIOR'), type: 'line', data: valoresUpper, lineStyle: { color: '#fbbf24', width: 1, type: 'dotted' }, showSymbol: false },
        { name: this.t('LEGEND_INTERVALO_INFERIOR'), type: 'line', data: valoresLower, lineStyle: { color: '#fbbf24', width: 1, type: 'dotted' }, showSymbol: false }
      ],
      dataZoom: [{ type: 'slider', start: 0, end: 100 }]
    };
  }

  // Cambiar entre vistas unificada y separada
  toggleViewType(): void {
    this.viewType = this.viewType === 'unified' ? 'separated' : 'unified';
    this.prepararGraficos();
    this.cdr.detectChanges();
  }

  // Resto de métodos (favoritos, recomendación, etc.)
  cargarRecomendacion(): void {
    this.recommendationService.getRecommendation(this.simbolo).subscribe({
      next: (data) => this.recommendation = data,
      error: (err) => console.error('Error al cargar recomendación:', err)
    });
  }

  toggleFavorito(): void {
    if (this.esFavorito) {
      this.favoritosService.removeFavorito(this.simbolo).subscribe({
        next: () => { this.esFavorito = false; this.cdr.detectChanges(); },
        error: (err) => console.error(err)
      });
    } else {
      this.favoritosService.addFavorito(this.simbolo).subscribe({
        next: () => { this.esFavorito = true; this.cdr.detectChanges(); },
        error: (err) => console.error(err)
      });
    }
  }

  verificarSiEsFavorito(): void {
    this.favoritosService.getFavoritos().subscribe({
      next: (lista) => { this.esFavorito = lista.includes(this.simbolo); this.cdr.detectChanges(); },
      error: (err) => console.error(err)
    });
  }
}