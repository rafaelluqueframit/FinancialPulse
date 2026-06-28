export interface HistorialPrecio {
  fecha: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volumen: number;
  precio_cierre?: number;
}

export interface Prediccion {
  fecha: string;
  prediccion: number;
  lower?: number;
  upper?: number;
}

export interface SentimientoNoticia {
  sentimiento: string;
  confianza: number;
  positivo: number;
  negativo: number;
  neutral: number;
}

export interface Noticia {
  titulo: string;
  descripcion: string;
  url: string;
  fuente: string;
  fecha: string;
  sentimiento: SentimientoNoticia;
}

export interface ResumenSentimiento {
  positivo: number;
  neutral: number;
  negativo: number;
}

export interface DashboardData {
  simbolo_original: string;
  simbolo_resuelto: string;
  nombre: string;
  precio_actual: number;
  moneda: string;
  historial: HistorialPrecio[];
  noticias: Noticia[];
  resumen_sentimiento: ResumenSentimiento;
  prediccion: Prediccion[];
  mape?: number;
  fundamental?: {
    marketCap?: number;
    trailingPE?: number;
    forwardPE?: number;
    dividendYield?: number;
    eps?: number;
    revenue?: number;
    profitMargins?: number;
    beta?: number;
  };
}