import { Component, Input, OnChanges, SimpleChanges, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslatePipe } from '../../../pipes/translate-pipe';

@Component({
  selector: 'app-historical-table',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslatePipe],
  templateUrl: './historical-table.component.html',
  styleUrls: ['./historical-table.component.css']
})
export class HistoricalTableComponent implements OnChanges {
  @Input() data: { fecha: string; precio_cierre: number }[] = [];

  filteredData: { fecha: string; precio_cierre: number }[] = [];
  paginatedData: { fecha: string; precio_cierre: number }[] = [];

  startDate: string = '';
  endDate: string = '';

  sortColumn: string = 'fecha';
  sortDirection: 'asc' | 'desc' = 'asc';

  // Paginación fija a 10 filas por página
  pageSize: number = 10;
  currentPage: number = 1;

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.filteredData.length / this.pageSize));
  }

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data']) {
      this.applyFilterAndSort();
    }
  }

  applyFilterAndSort(): void {
    let filtered = [...this.data];

    // Filtro por fecha
    if (this.startDate) {
      filtered = filtered.filter(item => item.fecha >= this.startDate);
    }
    if (this.endDate) {
      filtered = filtered.filter(item => item.fecha <= this.endDate);
    }

    // Ordenación
    filtered.sort((a, b) => {
      if (this.sortColumn === 'fecha') {
        return this.sortDirection === 'asc'
          ? a.fecha.localeCompare(b.fecha)
          : b.fecha.localeCompare(a.fecha);
      } else {
        return this.sortDirection === 'asc'
          ? a.precio_cierre - b.precio_cierre
          : b.precio_cierre - a.precio_cierre;
      }
    });

    this.filteredData = filtered;
    this.currentPage = 1; // Reset a primera página al filtrar/ordenar
    this.updatePaginatedData();
    this.cdr.detectChanges();
  }

  updatePaginatedData(): void {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedData = this.filteredData.slice(startIndex, endIndex);
  }

  getStartIndex(): number {
    return (this.currentPage - 1) * this.pageSize + 1;
  }

  getEndIndex(): number {
    return Math.min(this.currentPage * this.pageSize, this.filteredData.length);
  }

  // Métodos de paginación
  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.updatePaginatedData();
    this.cdr.detectChanges();
  }

  previousPage(): void {
    if (this.currentPage > 1) this.goToPage(this.currentPage - 1);
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) this.goToPage(this.currentPage + 1);
  }

  // Generar array de números de página para mostrar (máximo 5)
  getPagesArray(): number[] {
    const pages: number[] = [];
    const maxVisible = 5;
    let start = Math.max(1, this.currentPage - Math.floor(maxVisible / 2));
    let end = Math.min(this.totalPages, start + maxVisible - 1);
    if (end - start + 1 < maxVisible) start = Math.max(1, end - maxVisible + 1);
    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
  }

  // Eventos UI
  onSort(column: string): void {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }
    this.applyFilterAndSort();
  }

  onFilterChange(): void {
    this.applyFilterAndSort();
  }

  // trackBy para mejorar rendimiento
  trackByFecha(index: number, item: { fecha: string; precio_cierre: number }): string {
    return item.fecha;
  }
}