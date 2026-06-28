import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CarteraService } from '../../services/cartera.service';
import { TranslatePipe } from '../../pipes/translate-pipe';
import { TooltipDirective } from '../../directives/tooltip.directive';
import { NgxEchartsModule } from 'ngx-echarts';
import type { EChartsOption } from 'echarts';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-cartera',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslatePipe, TooltipDirective, NgxEchartsModule],
  templateUrl: './cartera.component.html'
})
export class CarteraComponent implements OnInit {
  // Datos básicos de la cartera
  saldo: number = 0;
  transacciones: any[] = [];
  posicion: any = {};
  tienePosicion: boolean = false;
  loading: boolean = true;
  accionesList: { simbolo: string, cantidad: number, precioActual: number, valor: number }[] = [];

  // Resumen mejorado
  valorAcciones: number = 0;      // Valor actual de todas las acciones
  valorTotal: number = 0;         // Saldo + valorAcciones
  ultimasTransacciones: any[] = [];
  rendimientoNoRealizado: number = 0;
  preciosActuales: { [simbolo: string]: number } = {};  // ← NUEVO
  pieChartOption: EChartsOption = {};                    // ← NUEVO

  // Variables para compra
  simboloCompraInput: string = '';
  simboloCompra: string = '';
  cantidadCompra: number = 1;
  precioCompra: number = 0;
  resultadosCompra: any[] = [];
  showDropdownCompra: boolean = false;

  // Variables para venta
  simboloVentaInput: string = '';
  simboloVenta: string = '';
  cantidadVenta: number = 1;
  precioVenta: number = 0;
  resultadosVenta: any[] = [];
  showDropdownVenta: boolean = false;

  mensaje: string = '';
  error: string = '';
  activeTab: string = 'resumen';

  evolucionChartOption: EChartsOption = {};

  constructor(
    private carteraService: CarteraService,
    private cdr: ChangeDetectorRef,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.cargarDatos();
  }

  cargarDatos(): void {
    this.loading = true;
    this.cdr.detectChanges();

    Promise.all([
      this.carteraService.getCartera().toPromise(),
      this.carteraService.getTransacciones().toPromise(),
      this.carteraService.getPosicion().toPromise()
    ]).then(([cartera, transacciones, posicion]) => {
      this.saldo = cartera?.saldo ?? 0;
      this.transacciones = transacciones ?? [];
      this.posicion = posicion ?? {};
      this.tienePosicion = Object.keys(this.posicion).length > 0;
      this.ultimasTransacciones = [...this.transacciones].sort((a,b) => 
        new Date(b.fecha).getTime() - new Date(a.fecha).getTime()).slice(0, 3);
      this.loading = false;
      this.calcularEvolucion();
      this.calcularValoresActuales(); // Calcula preciosActuales y pieChartOption
      this.cdr.detectChanges();
    }).catch(err => {
      console.error('Error al cargar datos de cartera', err);
      this.error = 'Error al cargar los datos de la cartera';
      this.loading = false;
      this.cdr.detectChanges();
    });
  }

  // Calcula el valor actual de las acciones y llena preciosActuales
  calcularValoresActuales(): void {
    if (!this.tienePosicion) {
      this.valorAcciones = 0;
      this.valorTotal = this.saldo;
      this.rendimientoNoRealizado = 0;
      this.preciosActuales = {};
      this.accionesList = [];
      this.pieChartOption = {};
      return;
    }

    const promises = Object.keys(this.posicion).map(async (simbolo) => {
      try {
        const data: any = await this.http.get(`/api/dashboard/${simbolo}?period=1d`).toPromise();
        const precioActual = data?.precio_actual || 0;
        const cantidad = this.posicion[simbolo];
        return { simbolo, cantidad, precioActual, valor: cantidad * precioActual };
      } catch (error) {
        console.error(`Error al obtener precio de ${simbolo}`, error);
        return { simbolo, cantidad: this.posicion[simbolo], precioActual: 0, valor: 0 };
      }
    });

    Promise.all(promises).then(resultados => {
      this.valorAcciones = resultados.reduce((acc, r) => acc + r.valor, 0);
      this.valorTotal = this.saldo + this.valorAcciones;
      this.preciosActuales = {};
      this.accionesList = [];
      resultados.forEach(r => {
        this.preciosActuales[r.simbolo] = r.precioActual;
        this.accionesList.push({
          simbolo: r.simbolo,
          cantidad: r.cantidad,
          precioActual: r.precioActual,
          valor: r.valor
        });
      });
      this.calcularRendimientoNoRealizado(resultados);
      this.prepararGraficoPastel(resultados);
      this.cdr.detectChanges();
    });
  }

  prepararGraficoPastel(resultados: any[]): void {
    if (this.valorAcciones > 0) {
      const dataPie = resultados.map(r => ({
        name: r.simbolo,
        value: r.valor,
        itemStyle: { color: this.getColorForSymbol(r.simbolo) }
      }));
      this.pieChartOption = {
        tooltip: { trigger: 'item', formatter: '{b}: {d}%' },
        legend: { orient: 'vertical', left: 'left' },
        series: [{
          type: 'pie',
          radius: '50%',
          data: dataPie,
          emphasis: { scale: true },
          label: { show: true, formatter: '{b}' }
        }]
      };
    } else {
      this.pieChartOption = {};
    }
  }

  // Colores consistentes por símbolo
  getColorForSymbol(simbolo: string): string {
    const colores: { [key: string]: string } = {
      'AAPL': '#3b82f6',
      'MSFT': '#10b981',
      'GOOGL': '#f59e0b',
      'AMZN': '#ef4444',
      'TSLA': '#8b5cf6',
      'META': '#06b6d4',
      'BTC-USD': '#f7931a',
      'ETH-USD': '#627eea'
    };
    return colores[simbolo] || '#888888';
  }

  // Añadir getters
  get saldoInsuficiente(): boolean {
    return this.precioCompra * this.cantidadCompra > this.saldo;
  }

  get accionesDisponiblesParaVenta(): boolean {
    return (this.posicion[this.simboloVenta] || 0) >= this.cantidadVenta && this.simboloVenta !== '';
  }

  calcularRendimientoNoRealizado(valoresActuales: any[]): void {
    // Obtener todas las transacciones de compra
    const compras = this.transacciones.filter(t => t.tipo === 'compra');
    const costePorSimbolo: { [simbolo: string]: { totalGastado: number, cantidad: number } } = {};

    compras.forEach(t => {
      if (!costePorSimbolo[t.simbolo]) {
        costePorSimbolo[t.simbolo] = { totalGastado: 0, cantidad: 0 };
      }
      costePorSimbolo[t.simbolo].totalGastado += t.cantidad * t.precio;
      costePorSimbolo[t.simbolo].cantidad += t.cantidad;
    });

    let costeTotal = 0;
    for (const simbolo of Object.keys(this.posicion)) {
      const poseidas = this.posicion[simbolo];
      const datos = costePorSimbolo[simbolo];
      if (datos && datos.cantidad > 0) {
        const precioMedio = datos.totalGastado / datos.cantidad;
        costeTotal += precioMedio * poseidas;
      }
    }
    this.rendimientoNoRealizado = this.valorAcciones - costeTotal;
  }

  calcularEvolucion(): void {
    if (!this.transacciones.length) {
      this.evolucionChartOption = {
        title: { show: true, text: 'No hay transacciones para mostrar evolución', left: 'center', top: 'center' }
      };
      return;
    }
    const sorted = [...this.transacciones].sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime());
    let saldoCorriente = 10000;
    const fechas: string[] = [];
    const saldos: number[] = [];
    for (const t of sorted) {
      if (t.tipo === 'compra') {
        saldoCorriente -= t.cantidad * t.precio;
      } else if (t.tipo === 'venta') {
        saldoCorriente += t.cantidad * t.precio;
      }
      fechas.push(new Date(t.fecha).toLocaleDateString());
      saldos.push(Number(saldoCorriente.toFixed(2)));
    }
    this.evolucionChartOption = {
      tooltip: { trigger: 'axis' },
      xAxis: { type: 'category', data: fechas, name: 'Fecha' },
      yAxis: { type: 'value', name: 'Saldo (USD)' },
      series: [{ type: 'line', data: saldos, smooth: true, lineStyle: { color: '#3b82f6' }, areaStyle: { opacity: 0.2 } }]
    };
  }

  // Búsqueda para compra
  buscarSimbolosCompra(event: any) {
    const query = event.target.value;
    if (query.length < 2) {
      this.resultadosCompra = [];
      return;
    }
    this.http.get(`/api/search/${query}`).subscribe((data: any) => {
      this.resultadosCompra = data.resultados || [];
    });
  }

  seleccionarSimboloCompra(simbolo: string) {
    this.simboloCompra = simbolo;
    this.simboloCompraInput = simbolo;
    this.showDropdownCompra = false;
    this.obtenerPrecioActual(simbolo, 'compra');
  }

  cerrarDropdownCompra() {
    setTimeout(() => this.showDropdownCompra = false, 200);
  }

  // Búsqueda para venta
  buscarSimbolosVenta(event: any) {
    const query = event.target.value;
    if (query.length < 2) {
      this.resultadosVenta = [];
      return;
    }
    this.http.get(`/api/search/${query}`).subscribe((data: any) => {
      this.resultadosVenta = data.resultados || [];
    });
  }

  seleccionarSimboloVenta(simbolo: string) {
    this.simboloVenta = simbolo;
    this.simboloVentaInput = simbolo;
    this.showDropdownVenta = false;
    this.obtenerPrecioActual(simbolo, 'venta');
  }

  cerrarDropdownVenta() {
    setTimeout(() => this.showDropdownVenta = false, 200);
  }

  obtenerPrecioActual(simbolo: string, tipo: 'compra' | 'venta') {
    this.http.get(`/api/dashboard/${simbolo}?period=1d`).subscribe((data: any) => {
      if (data && data.precio_actual) {
        if (tipo === 'compra') {
          this.precioCompra = data.precio_actual;
        } else {
          this.precioVenta = data.precio_actual;
        }
      }
    });
  }

  comprar(): void {
    if (!this.simboloCompra || this.cantidadCompra <= 0 || this.precioCompra <= 0) {
      this.error = 'Rellena todos los campos correctamente';
      this.cdr.detectChanges();
      return;
    }
    this.carteraService.comprar(this.simboloCompra, this.cantidadCompra, this.precioCompra).subscribe({
      next: (res) => {
        this.mensaje = res.message;
        this.saldo = res.nuevo_saldo;
        this.cargarDatos();
        this.simboloCompra = '';
        this.simboloCompraInput = '';
        this.cantidadCompra = 1;
        this.precioCompra = 0;
        this.error = '';
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.error = err.error?.error || 'Error al comprar';
        this.mensaje = '';
        this.cdr.detectChanges();
      }
    });
  }

  vender(): void {
    if (!this.simboloVenta || this.cantidadVenta <= 0 || this.precioVenta <= 0) {
      this.error = 'Rellena todos los campos correctamente';
      this.cdr.detectChanges();
      return;
    }
    this.carteraService.vender(this.simboloVenta, this.cantidadVenta, this.precioVenta).subscribe({
      next: (res) => {
        this.mensaje = res.message;
        this.saldo = res.nuevo_saldo;
        this.cargarDatos();
        this.simboloVenta = '';
        this.simboloVentaInput = '';
        this.cantidadVenta = 1;
        this.precioVenta = 0;
        this.error = '';
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.error = err.error?.error || 'Error al vender';
        this.mensaje = '';
        this.cdr.detectChanges();
      }
    });
  }
}