import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '../../pipes/translate-pipe';

@Component({
  selector: 'app-analisis-ayuda',
  standalone: true,
  imports: [CommonModule, TranslatePipe],
  templateUrl: './analisis-ayuda.component.html'
})
export class AnalisisAyudaComponent {}