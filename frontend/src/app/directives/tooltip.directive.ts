import { Directive, ElementRef, Input, OnInit, OnDestroy, Renderer2, Injector } from '@angular/core';
import { TranslatePipe } from '../pipes/translate-pipe';
import { LanguageService } from '../services/language.service';
import { Subscription } from 'rxjs';

@Directive({
  selector: '[appTooltip]',
  standalone: true
})
export class TooltipDirective implements OnInit, OnDestroy {
  @Input('appTooltip') tooltipKey: string = '';
  private tooltipElement: HTMLDivElement | null = null;
  private langSubscription!: Subscription;
  private translatePipe!: TranslatePipe;

  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
    private langService: LanguageService,
    private injector: Injector
  ) {}

  ngOnInit(): void {
    this.translatePipe = this.injector.get(TranslatePipe);

    // Crear el tooltip
    this.tooltipElement = this.renderer.createElement('div');
    this.renderer.addClass(this.tooltipElement, 'custom-tooltip');
    this.renderer.setStyle(this.tooltipElement, 'position', 'absolute');
    this.renderer.setStyle(this.tooltipElement, 'background', '#1f2937');
    this.renderer.setStyle(this.tooltipElement, 'color', 'white');
    this.renderer.setStyle(this.tooltipElement, 'padding', '8px 12px');
    this.renderer.setStyle(this.tooltipElement, 'border-radius', '8px');
    this.renderer.setStyle(this.tooltipElement, 'font-size', '13px');
    this.renderer.setStyle(this.tooltipElement, 'max-width', '300px');
    this.renderer.setStyle(this.tooltipElement, 'min-width', '120px');
    this.renderer.setStyle(this.tooltipElement, 'white-space', 'normal');   // Permitir saltos de línea
    this.renderer.setStyle(this.tooltipElement, 'word-wrap', 'break-word');
    this.renderer.setStyle(this.tooltipElement, 'text-align', 'left');
    this.renderer.setStyle(this.tooltipElement, 'z-index', '1000');
    this.renderer.setStyle(this.tooltipElement, 'pointer-events', 'none');
    this.renderer.setStyle(this.tooltipElement, 'opacity', '0');
    this.renderer.setStyle(this.tooltipElement, 'transition', 'opacity 0.2s');
    this.renderer.setStyle(this.tooltipElement, 'box-shadow', '0 4px 12px rgba(0,0,0,0.3)');
    this.renderer.setStyle(this.tooltipElement, 'line-height', '1.4');
    this.renderer.appendChild(document.body, this.tooltipElement);

    // Suscripción a cambios de idioma
    this.langSubscription = this.langService.currentLang$.subscribe(() => {
      if (this.tooltipElement && this.tooltipKey) {
        this.tooltipElement.innerText = this.translatePipe.transform(this.tooltipKey);
      }
    });

    // Eventos
    this.renderer.listen(this.el.nativeElement, 'mouseenter', () => this.showTooltip());
    this.renderer.listen(this.el.nativeElement, 'mouseleave', () => this.hideTooltip());
  }

  private showTooltip(): void {
    if (!this.tooltipElement || !this.tooltipKey) return;
    // Actualizar texto por si cambió
    this.tooltipElement.innerText = this.translatePipe.transform(this.tooltipKey);
    
    const rect = this.el.nativeElement.getBoundingClientRect();
    // Forzar a que el tooltip tenga tamaño antes de calcular la posición
    this.tooltipElement.style.visibility = 'hidden';
    this.tooltipElement.style.display = 'block';
    const tooltipRect = this.tooltipElement.getBoundingClientRect();
    this.tooltipElement.style.display = '';
    this.tooltipElement.style.visibility = '';
    
    let top = rect.bottom + window.scrollY + 8;
    let left = rect.left + window.scrollX + (rect.width / 2) - (tooltipRect.width / 2);
    
    // Ajuste para que no se salga por la derecha
    if (left + tooltipRect.width > window.innerWidth) {
      left = window.innerWidth - tooltipRect.width - 10;
    }
    // Ajuste para que no se salga por la izquierda
    if (left < 10) left = 10;
    
    this.renderer.setStyle(this.tooltipElement, 'top', `${top}px`);
    this.renderer.setStyle(this.tooltipElement, 'left', `${left}px`);
    this.renderer.setStyle(this.tooltipElement, 'opacity', '1');
  }

  private hideTooltip(): void {
    if (this.tooltipElement) {
      this.renderer.setStyle(this.tooltipElement, 'opacity', '0');
    }
  }

  ngOnDestroy(): void {
    if (this.tooltipElement) {
      this.renderer.removeChild(document.body, this.tooltipElement);
    }
    if (this.langSubscription) {
      this.langSubscription.unsubscribe();
    }
  }
}