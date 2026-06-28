import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { TranslatePipe } from '../../pipes/translate-pipe';
import { TooltipDirective } from '../../directives/tooltip.directive';

@Component({
  selector: 'app-buscar',
  standalone: true,
  imports: [CommonModule, TranslatePipe, TooltipDirective],
  templateUrl: './buscar.component.html',
  styleUrls: ['./buscar.component.css']
})
export class BuscarComponent {
  showDropdown = false;
  resultados: any[] = [];

  // Lista de ejemplos populares
  ejemplos = [
    { simbolo: 'AAPL', nombre: 'Apple Inc.' },
    { simbolo: 'MSFT', nombre: 'Microsoft' },
    { simbolo: 'GOOGL', nombre: 'Alphabet' },
    { simbolo: 'BTC-USD', nombre: 'Bitcoin USD' },
    { simbolo: 'ETH-USD', nombre: 'Ethereum USD' },
    { simbolo: '^GSPC', nombre: 'S&P 500' },
    { simbolo: '^IBEX', nombre: 'IBEX 35' },
    { simbolo: 'EURUSD=X', nombre: 'Euro/Dólar' }
  ];

  constructor(private router: Router, private http: HttpClient) {}

  irADashboard(simbolo: string) {
    if (simbolo && simbolo.trim()) {
      this.router.navigate(['/dashboard', simbolo.toUpperCase()]);
    }
  }

  cerrarDropdownConRetraso() {
    setTimeout(() => {
      this.showDropdown = false;
    }, 200);
  }

  buscarSimbolos(query: string) {
    if (query.length < 2) {
      this.resultados = [];
      return;
    }
    this.http.get(`/api/search/${query}`).subscribe((data: any) => {
      this.resultados = data.resultados || [];
    });
  }
}