import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '../../pipes/translate-pipe';

@Component({
  selector: 'app-noticias-ayuda',
  standalone: true,
  imports: [CommonModule, TranslatePipe],
  templateUrl: './noticias-ayuda.component.html'
})
export class NoticiasAyudaComponent {}