import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '../../pipes/translate-pipe';

@Component({
  selector: 'app-cartera-ayuda',
  standalone: true,
  imports: [CommonModule, TranslatePipe],
  templateUrl: './cartera-ayuda.component.html'
})
export class CarteraAyudaComponent {}