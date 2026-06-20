import yfinance as yf
from yfinance import Search
import pandas as pd
import numpy as np
from prophet import Prophet
from flask import Flask, jsonify, request, session
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from transformers import AutoTokenizer, AutoModelForSequenceClassification
import torch
import requests
import os
from datetime import datetime, timedelta
from werkzeug.security import generate_password_hash, check_password_hash
import random
import traceback

# ====================
# Inicialización de la app
# ====================
app = Flask(__name__)

app.secret_key = os.environ.get('SECRET_KEY', 'clave_por_defecto')
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL', 'postgresql://postgres:Flflfv17%@localhost:5432/financial_pulse_db')
CORS(app)
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

# ====================
# Modelos de base de datos
# ====================
class Usuario(db.Model):
    __tablename__ = 'usuario'
    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    password_hash = db.Column(db.String(200), nullable=False)
    fecha_registro = db.Column(db.DateTime, server_default=db.func.now())

    def to_dict(self):
        return {
            'id': self.id,
            'nombre': self.nombre,
            'email': self.email,
            'fecha_registro': self.fecha_registro.isoformat() if self.fecha_registro else None
        }

class ResetToken(db.Model):
    __tablename__ = 'reset_token'
    id = db.Column(db.Integer, primary_key=True)
    usuario_id = db.Column(db.Integer, db.ForeignKey('usuario.id'), nullable=False)
    token = db.Column(db.String(6), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    usuario = db.relationship('Usuario', backref='reset_tokens')

class Cartera(db.Model):
    __tablename__ = 'cartera'
    id = db.Column(db.Integer, primary_key=True)
    usuario_id = db.Column(db.Integer, db.ForeignKey('usuario.id'), unique=True, nullable=False)
    saldo = db.Column(db.Float, default=10000.0)
    total_depositado = db.Column(db.Float, default=0.0)
    total_retirado = db.Column(db.Float, default=0.0)
    total_transacciones = db.Column(db.Integer, default=0)
    usuario = db.relationship('Usuario', backref=db.backref('cartera', uselist=False))

class Transaccion(db.Model):
    __tablename__ = 'transaccion'
    id = db.Column(db.Integer, primary_key=True)
    cartera_id = db.Column(db.Integer, db.ForeignKey('cartera.id'), nullable=False)
    accion_simbolo = db.Column(db.String(20), nullable=False)
    tipo = db.Column(db.String(10), nullable=False)
    cantidad = db.Column(db.Integer, nullable=False)
    precio = db.Column(db.Float, nullable=False)
    fecha = db.Column(db.DateTime, default=datetime.utcnow)
    cartera = db.relationship('Cartera', backref=db.backref('transacciones', lazy=True))

class Favorito(db.Model):
    __tablename__ = 'favorito'
    id = db.Column(db.Integer, primary_key=True)
    usuario_id = db.Column(db.Integer, db.ForeignKey('usuario.id'), nullable=False)
    simbolo = db.Column(db.String(20), nullable=False)
    creado_en = db.Column(db.DateTime, default=datetime.utcnow)
    usuario = db.relationship('Usuario', backref='favoritos')
    __table_args__ = (db.UniqueConstraint('usuario_id', 'simbolo', name='uq_usuario_simbolo'),)

with app.app_context():
    db.create_all()
    print("Base de datos inicializada (tablas creadas si no existían)")

# ====================
# Modelos de Sentimiento (FinBERT para inglés, finance-sentiment-es para español)
# ====================
# Modelo inglés
model_name_en = "ProsusAI/finbert"
tokenizer_en = AutoTokenizer.from_pretrained(model_name_en)
model_en = AutoModelForSequenceClassification.from_pretrained(model_name_en)
label_map_en = {0: "negative", 1: "neutral", 2: "positive"}
model_en.config.id2label = label_map_en
model_en.config.label2id = {v: k for k, v in label_map_en.items()}

# Modelo español
model_name_es = "bardsai/finance-sentiment-es-base"
tokenizer_es = AutoTokenizer.from_pretrained(model_name_es)
model_es = AutoModelForSequenceClassification.from_pretrained(model_name_es)
# Mapeo de etiquetas (comprobar cuales usa, suele ser mismo orden: 0 negativo, 1 neutro, 2 positivo)
# ====================
# Funciones auxiliares de indicadores técnicos
# ====================
def calcular_rsi(series, period=14):
    delta = series.diff()
    gain = (delta.where(delta > 0, 0)).rolling(window=period).mean()
    loss = (-delta.where(delta < 0, 0)).rolling(window=period).mean()
    rs = gain / loss
    rsi = 100 - (100 / (1 + rs))
    return rsi

def calcular_bollinger(series, window=20, num_std=2):
    sma = series.rolling(window).mean()
    std = series.rolling(window).std()
    upper = sma + (std * num_std)
    lower = sma - (std * num_std)
    return upper.iloc[-1], lower.iloc[-1]

def calcular_stochastic(high, low, close, period=14):
    low_min = low.rolling(period).min()
    high_max = high.rolling(period).max()
    k = 100 * ((close - low_min) / (high_max - low_min))
    return k.iloc[-1]

def calcular_macd(series, fast=12, slow=26, signal=9):
    ema_fast = series.ewm(span=fast, adjust=False).mean()
    ema_slow = series.ewm(span=slow, adjust=False).mean()
    macd_line = ema_fast - ema_slow
    macd_signal = macd_line.ewm(span=signal, adjust=False).mean()
    macd_histogram = macd_line - macd_signal
    return macd_line, macd_signal, macd_histogram

def calcular_sma(series, period):
    return series.rolling(window=period).mean()

def calcular_soportes_resistencias(df, window=20, tolerance=0.02):
    df = df.copy()
    df['min_local'] = df['Low'].rolling(window=window, center=True).min()
    df['max_local'] = df['High'].rolling(window=window, center=True).max()
    soportes = []
    resistencias = []
    for i in range(window, len(df)-window):
        if df['Low'].iloc[i] == df['min_local'].iloc[i]:
            soportes.append(df['Low'].iloc[i])
        if df['High'].iloc[i] == df['max_local'].iloc[i]:
            resistencias.append(df['High'].iloc[i])
    def agrupar_niveles(niveles, tolerancia):
        niveles = sorted(niveles)
        agrupados = []
        for n in niveles:
            if not agrupados or abs(n - agrupados[-1]) / agrupados[-1] > tolerancia:
                agrupados.append(n)
        return agrupados
    soportes = agrupar_niveles(soportes, tolerance)
    resistencias = agrupar_niveles(resistencias, tolerance)
    return soportes, resistencias

def backtest_sma_cross(df, short=20, long=50):
    df = df.copy()
    df['SMA_short'] = calcular_sma(df['Close'], short)
    df['SMA_long'] = calcular_sma(df['Close'], long)
    df['signal'] = 0
    df.loc[df['SMA_short'] > df['SMA_long'], 'signal'] = 1
    df.loc[df['SMA_short'] <= df['SMA_long'], 'signal'] = -1
    df['position'] = df['signal'].diff()
    trades = []
    in_position = False
    entry_price = 0
    for i in range(len(df)):
        if df['position'].iloc[i] == 2 and not in_position:
            entry_price = df['Close'].iloc[i]
            in_position = True
        elif df['position'].iloc[i] == -2 and in_position:
            exit_price = df['Close'].iloc[i]
            trades.append((exit_price - entry_price) / entry_price)
            in_position = False
    if in_position:
        exit_price = df['Close'].iloc[-1]
        trades.append((exit_price - entry_price) / entry_price)
    total_return = sum(trades) if trades else 0
    return total_return, len(trades)

def predecir_con_prophet(precios_historicos, dias_a_predecir=30):
    df = pd.DataFrame(precios_historicos)
    df.columns = ['ds', 'y']
    df['ds'] = pd.to_datetime(df['ds'])
    
    total_dias = len(df)
    if total_dias < 30:
        dias_a_predecir = max(1, total_dias // 2)
    
    modelo = Prophet(yearly_seasonality=True, weekly_seasonality=False, daily_seasonality=False, changepoint_prior_scale=0.05)
    modelo.fit(df)
    
    futuro = modelo.make_future_dataframe(periods=dias_a_predecir)
    prediccion = modelo.predict(futuro)
    ultima_fecha = df['ds'].max()
    futuras = prediccion[prediccion['ds'] > ultima_fecha][['ds', 'yhat', 'yhat_lower', 'yhat_upper']]
    resultados = []
    for _, row in futuras.iterrows():
        resultados.append({
            'fecha': row['ds'].strftime('%Y-%m-%d'),
            'prediccion': round(row['yhat'], 2),
            'lower': round(row['yhat_lower'], 2),
            'upper': round(row['yhat_upper'], 2)
        })
    
    mape = None
    try:
        from prophet.diagnostics import cross_validation, performance_metrics
        horizon = min(30, total_dias // 3)
        if horizon < 1:
            horizon = 1
        initial = min(365, total_dias - horizon - 1)
        if initial < 1:
            initial = total_dias - horizon - 1
        if initial >= 1 and horizon >= 1 and total_dias > initial + horizon:
            df_cv = cross_validation(modelo, initial=f'{initial} days', period='30 days', horizon=f'{horizon} days')
            if not df_cv.empty:
                df_p = performance_metrics(df_cv)
                mape = round(df_p['mape'].mean(), 2) if not df_p.empty else None
    except Exception as e:
        print(f"Error calculando MAPE: {e}")
        mape = None
    
    return resultados, mape

def resolver_simbolo(entrada):
    if not entrada:
        return None
    entrada_upper = entrada.upper().strip()
    indices = {
        "SP500": "^GSPC", "S&P500": "^GSPC", "IBEX35": "^IBEX",
        "DAX": "^GDAXI", "NASDAQ": "^IXIC", "DOWJONES": "^DJI",
        "DOW": "^DJI", "FTSE": "^FTSE", "CAC40": "^FCHI", "NIKKEI": "^N225"
    }
    if entrada_upper in indices:
        return indices[entrada_upper]
    divisas_mayores = ["EUR", "GBP", "JPY", "CHF", "CAD", "AUD", "NZD", "CNY", "HKD", "SGD"]
    if entrada_upper in divisas_mayores:
        return f"{entrada_upper}=X"
    if "/" in entrada:
        partes = entrada.split("/")
        if len(partes) == 2:
            return f"{partes[0].upper()}{partes[1].upper()}=X"
    criptos = ["BTC", "ETH", "XRP", "LTC", "ADA", "DOT", "BNB", "SOL", "MATIC"]
    if entrada_upper in criptos:
        return f"{entrada_upper}-USD"
    return entrada

def obtener_noticias(query, desde=None, hasta=None, max_resultados=10, idioma='en'):
    """
    Busca noticias relacionadas con el query.
    - query: término de búsqueda (obligatorio)
    - desde: fecha inicio (opcional, formato YYYY-MM-DD)
    - hasta: fecha fin (opcional)
    - max_resultados: número máximo de artículos
    - idioma: código de idioma (ej. 'es', 'en')
    """
    api_key = os.environ.get('NEWS_API_KEY', '8be6e46b17d040bf91a7a869e7259cbc')
    url = f"https://newsapi.org/v2/everything?q={query}&language={idioma}&sortBy=relevancy&apiKey={api_key}"
    if desde:
        url += f"&from={desde}"
    if hasta:
        url += f"&to={hasta}"
    try:
        response = requests.get(url, timeout=5)
        if response.status_code == 200:
            data = response.json()
            return data.get('articles', [])[:max_resultados]
        else:
            print(f"Error NewsAPI: {response.status_code}")
            return []
    except Exception as e:
        print(f"Error al obtener noticias: {e}")
        return []

def analizar_sentimiento(texto, idioma='en', umbral_negativo=0.25):
    """
    idioma: 'en' o 'es'
    """
    if not texto or len(texto.strip()) < 10:
        return {'sentimiento': 'neutral', 'confianza': 1.0, 
                'positivo': 0.0, 'negativo': 0.0, 'neutral': 1.0}
    try:
        # Seleccionar modelo según idioma
        if idioma == 'es':
            tokenizer = tokenizer_es
            model = model_es
        else:
            tokenizer = tokenizer_en
            model = model_en

        inputs = tokenizer(texto, return_tensors="pt", truncation=True, 
                           padding=True, max_length=512)
        with torch.no_grad():
            outputs = model(**inputs)
        scores = torch.nn.functional.softmax(outputs.logits, dim=-1)
        
        # El orden de las probabilidades depende del modelo.
        # Para finbert: [neg, neu, pos]? Normalmente para classification son [negativo, neutral, positivo]
        # Verificamos con el label mapping si está disponible; si no, asumimos orden común.
        # Como es más fiable, usamos directamente las probabilidades y determinamos el máximo.
        score_negative = scores[0][0].item()
        score_neutral = scores[0][1].item()
        score_positive = scores[0][2].item()
        
        # Aplicar umbral negativo solo si es español (ya que el inglés funciona bien)
        if idioma == 'es' and score_negative >= umbral_negativo:
            sentimiento = 'negativo'
            confianza = score_negative
        else:
            # Lógica estándar: elegir el de mayor probabilidad
            max_score = max(score_negative, score_neutral, score_positive)
            if max_score == score_positive:
                sentimiento = 'positivo'
                confianza = score_positive
            elif max_score == score_negative:
                sentimiento = 'negativo'
                confianza = score_negative
            else:
                sentimiento = 'neutral'
                confianza = score_neutral
        
        return {
            'sentimiento': sentimiento,
            'confianza': round(confianza, 4),
            'positivo': round(score_positive, 4),
            'negativo': round(score_negative, 4),
            'neutral': round(score_neutral, 4)
        }
    except Exception as e:
        print(f"Error en análisis de sentimiento: {e}")
        return {'sentimiento': 'neutral', 'confianza': 1.0, 
                'positivo': 0.0, 'negativo': 0.0, 'neutral': 1.0}

def limpiar_texto_para_analisis(texto):
    if not texto:
        return ""
    texto = " ".join(texto.split())
    return texto[:512]

def calcular_posicion_actual(usuario_id):
    cartera = Cartera.query.filter_by(usuario_id=usuario_id).first()
    if not cartera:
        return {}
    transacciones = Transaccion.query.filter_by(cartera_id=cartera.id).all()
    posicion = {}
    for t in transacciones:
        if t.tipo == 'compra':
            posicion[t.accion_simbolo] = posicion.get(t.accion_simbolo, 0) + t.cantidad
        else:
            posicion[t.accion_simbolo] = posicion.get(t.accion_simbolo, 0) - t.cantidad
    posicion = {simbolo: cant for simbolo, cant in posicion.items() if cant > 0}
    return posicion

# ====================
# Rutas de la API
# ====================
@app.route('/')
def home():
    return jsonify({'mensaje': 'Hola desde Flask'})

@app.route('/api/recommendation/<simbolo>', methods=['GET'])
def recommendation(simbolo):
    try:
        simbolo_resuelto = resolver_simbolo(simbolo)
        if not simbolo_resuelto:
            return jsonify({'error': 'Símbolo no válido'}), 400
        ticker = yf.Ticker(simbolo_resuelto)
        hist = ticker.history(period='1y')
        if hist.empty:
            return jsonify({'error': 'No hay datos históricos'}), 404

        precio_actual = hist['Close'].iloc[-1]
        rsi = calcular_rsi(hist['Close']).iloc[-1]
        macd_line, macd_signal, _ = calcular_macd(hist['Close'])
        sma_20 = calcular_sma(hist['Close'], 20).iloc[-1]
        sma_50 = calcular_sma(hist['Close'], 50).iloc[-1]
        soportes, resistencias = calcular_soportes_resistencias(hist)
        soporte_cercano = min(soportes, key=lambda x: abs(x - precio_actual)) if soportes else None
        resistencia_cercana = min(resistencias, key=lambda x: abs(x - precio_actual)) if resistencias else None
        ret_backtest, num_trades = backtest_sma_cross(hist)
        bb_upper, bb_lower = calcular_bollinger(hist['Close'])
        stoch_k = calcular_stochastic(hist['High'], hist['Low'], hist['Close'])

        puntos_compra = 0
        puntos_venta = 0
        max_puntos = 14

        # RSI
        if rsi < 30:
            puntos_compra += 2
        elif rsi > 70:
            puntos_venta += 2
        # MACD
        if macd_line.iloc[-1] > macd_signal.iloc[-1]:
            puntos_compra += 1
        else:
            puntos_venta += 1
        # Medias móviles
        if precio_actual > sma_20 and sma_20 > sma_50:
            puntos_compra += 2
        elif precio_actual < sma_20 and sma_20 < sma_50:
            puntos_venta += 2
        # Soportes/Resistencias
        if soporte_cercano and abs(precio_actual - soporte_cercano) / precio_actual < 0.02:
            puntos_compra += 2
        if resistencia_cercana and abs(precio_actual - resistencia_cercana) / precio_actual < 0.02:
            puntos_venta += 2
        # Backtest
        if ret_backtest > 0.1:
            puntos_compra += 1
        elif ret_backtest < -0.1:
            puntos_venta += 1
        # Bollinger
        if precio_actual <= bb_lower * 1.02:
            puntos_compra += 2
        elif precio_actual >= bb_upper * 0.98:
            puntos_venta += 2
        # Estocástico
        if stoch_k < 20:
            puntos_compra += 2
        elif stoch_k > 80:
            puntos_venta += 2

        if puntos_compra > puntos_venta:
            recomendacion = "COMPRAR"
            confianza_base = int(puntos_compra / max_puntos * 100)
        elif puntos_venta > puntos_compra:
            recomendacion = "VENDER"
            confianza_base = int(puntos_venta / max_puntos * 100)
        else:
            recomendacion = "MANTENER"
            confianza_base = 50

        confianza_ajustada = max(55, min(100, int(confianza_base * 1.2)))
        confianza = confianza_ajustada

        return jsonify({
            'simbolo': simbolo.upper(),
            'precio_actual': round(precio_actual, 2),
            'indicadores': {
                'rsi': round(rsi, 2),
                'macd_line': round(macd_line.iloc[-1], 4),
                'macd_signal': round(macd_signal.iloc[-1], 4),
                'sma_20': round(sma_20, 2),
                'sma_50': round(sma_50, 2),
                'bb_upper': round(bb_upper, 2),
                'bb_lower': round(bb_lower, 2),
                'stoch_k': round(stoch_k, 2)
            },
            'soportes_resistencias': {
                'soporte_cercano': round(soporte_cercano, 2) if soporte_cercano else None,
                'resistencia_cercana': round(resistencia_cercana, 2) if resistencia_cercana else None,
                'soportes': [round(s,2) for s in soportes[:5]],
                'resistencias': [round(r,2) for r in resistencias[:5]]
            },
            'backtest': {
                'estrategia': 'Cruce SMA (20,50)',
                'retorno_total': round(ret_backtest * 100, 2),
                'num_operaciones': num_trades
            },
            'recomendacion': recomendacion,
            'confianza': confianza
        })
    except Exception as e:
        print(f"Error en recomendación: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/accion/<simbolo>', methods=['GET'])
def obtener_accion(simbolo):
    try:
        ticker = yf.Ticker(simbolo)
        info = ticker.info
        fundamental = {}
        if info:
            fundamental = {
                'marketCap': info.get('marketCap'),
                'trailingPE': info.get('trailingPE'),
                'forwardPE': info.get('forwardPE'),
                'dividendYield': info.get('dividendYield'),
                'eps': info.get('trailingEps'),
                'revenue': info.get('totalRevenue'),
                'profitMargins': info.get('profitMargins'),
                'beta': info.get('beta')
            }
        hist = ticker.history(period="1mo")
        historial = []
        for fecha, row in hist.iterrows():
            historial.append({
                'fecha': fecha.strftime('%Y-%m-%d'),
                'open': round(row['Open'], 2),
                'high': round(row['High'], 2),
                'low': round(row['Low'], 2),
                'close': round(row['Close'], 2),
                'volumen': int(row['Volume']) if 'Volume' in row else 0
            })
        precio_actual = round(hist['Close'].iloc[-1], 2) if not hist.empty else None
        return jsonify({
            'simbolo': simbolo.upper(),
            'nombre': info.get('longName', simbolo),
            'precio_actual': precio_actual,
            'moneda': info.get('currency', 'USD'),
            'historial': historial,
            'fundamental': fundamental
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/export-data', methods=['GET'])
def export_user_data():
    user_id = session.get('user_id')
    if not user_id:
        return jsonify({'error': 'No autenticado'}), 401

    usuario = Usuario.query.get(user_id)
    if not usuario:
        return jsonify({'error': 'Usuario no encontrado'}), 404

    cartera = Cartera.query.filter_by(usuario_id=user_id).first()
    transacciones = Transaccion.query.filter_by(cartera_id=cartera.id).all() if cartera else []
    favoritos = Favorito.query.filter_by(usuario_id=user_id).all()

    data = {
        'usuario': {
            'id': usuario.id,
            'nombre': usuario.nombre,
            'email': usuario.email,
            'fecha_registro': usuario.fecha_registro.isoformat() if usuario.fecha_registro else None
        },
        'cartera': {
            'saldo': cartera.saldo if cartera else 0,
            'total_depositado': cartera.total_depositado if cartera else 0,
            'total_retirado': cartera.total_retirado if cartera else 0,
            'total_transacciones': cartera.total_transacciones if cartera else 0
        } if cartera else None,
        'transacciones': [{
            'id': t.id,
            'simbolo': t.accion_simbolo,
            'tipo': t.tipo,
            'cantidad': t.cantidad,
            'precio': t.precio,
            'fecha': t.fecha.isoformat()
        } for t in transacciones],
        'favoritos': [f.simbolo for f in favoritos]
    }

    return jsonify(data), 200

@app.route('/api/delete-account', methods=['DELETE'])
def delete_account():
    user_id = session.get('user_id')
    if not user_id:
        return jsonify({'error': 'No autenticado'}), 401

    # Obtener usuario
    usuario = Usuario.query.get(user_id)
    if not usuario:
        return jsonify({'error': 'Usuario no encontrado'}), 404

    # Eliminar relaciones (cascada manual o automática según tus modelos)
    # Primero favoritos
    Favorito.query.filter_by(usuario_id=user_id).delete()
    # Reset tokens (si los hay)
    ResetToken.query.filter_by(usuario_id=user_id).delete()
    # Cartera y transacciones (cartera tiene usuario_id único, transacciones están ligadas a cartera)
    cartera = Cartera.query.filter_by(usuario_id=user_id).first()
    if cartera:
        Transaccion.query.filter_by(cartera_id=cartera.id).delete()
        db.session.delete(cartera)
    # Finalmente el usuario
    db.session.delete(usuario)
    db.session.commit()

    # Cerrar sesión
    session.pop('user_id', None)

    return jsonify({'message': 'Cuenta eliminada permanentemente'}), 200

@app.route('/api/dashboard/<simbolo>', methods=['GET'])
def dashboard(simbolo):
    idioma_noticias = request.args.get('lang', 'en')
    period = request.args.get('period', '6mo')
    period_prediccion = '1y'
    period_to_days = {'1mo': 30, '3mo': 90, '6mo': 180, '1y': 365}
    dias_a_predecir = period_to_days.get(period, 30)
    try:
        simbolo_resuelto = resolver_simbolo(simbolo)
        if not simbolo_resuelto:
            return jsonify({'error': 'Símbolo no válido'}), 400
        ticker = yf.Ticker(simbolo_resuelto)
        hist_mostrar = ticker.history(period=period)
        if hist_mostrar.empty:
            return jsonify({'error': f'No hay datos para "{simbolo}" en período {period}'}), 404
        hist_prediccion = ticker.history(period=period_prediccion)
        if hist_prediccion.empty:
            hist_prediccion = hist_mostrar

        historial = []
        for fecha, row in hist_mostrar.iterrows():
            historial.append({
                'fecha': fecha.strftime('%Y-%m-%d'),
                'open': round(row['Open'], 2),
                'high': round(row['High'], 2),
                'low': round(row['Low'], 2),
                'close': round(row['Close'], 2),
                'volumen': int(row['Volume']) if 'Volume' in row else 0
            })
        precio_actual = round(hist_mostrar['Close'].iloc[-1], 2)

        info = ticker.info if ticker.info else {}
        nombre_empresa = info.get('longName') if isinstance(info, dict) else None
        query_noticias = nombre_empresa if nombre_empresa else simbolo
        noticias = obtener_noticias(query=query_noticias, max_resultados=10, idioma=idioma_noticias)
        noticias_con_sentimiento = []
        sentimientos = {'positivo': 0, 'negativo': 0, 'neutral': 0}
        for articulo in noticias:
            titulo = articulo.get('title', '')
            descripcion = articulo.get('description', '')
            fecha_publicacion = articulo.get('publishedAt', '')
            fecha = fecha_publicacion.split('T')[0] if fecha_publicacion else ''
            texto = f"{titulo}. {descripcion}" if descripcion else titulo
            if texto:
                analisis = analizar_sentimiento(texto, idioma=idioma_noticias, umbral_negativo=0.20)
                noticias_con_sentimiento.append({
                    'titulo': titulo,
                    'descripcion': descripcion,
                    'url': articulo.get('url'),
                    'fuente': articulo.get('source', {}).get('name'),
                    'fecha': fecha,
                    'sentimiento': analisis
                })
                sentimientos[analisis['sentimiento']] += 1
        total_noticias = len(noticias_con_sentimiento)
        if total_noticias > 0:
            resumen_sentimiento = {
                'positivo': round(sentimientos['positivo'] / total_noticias * 100, 1),
                'negativo': round(sentimientos['negativo'] / total_noticias * 100, 1),
                'neutral': round(sentimientos['neutral'] / total_noticias * 100, 1)
            }
        else:
            resumen_sentimiento = {'positivo': 0, 'negativo': 0, 'neutral': 0}

        historial_pred = []
        for fecha, row in hist_prediccion.iterrows():
            historial_pred.append({'fecha': fecha.strftime('%Y-%m-%d'), 'close': round(row['Close'], 2)})
        prediccion, mape = predecir_con_prophet(historial_pred, dias_a_predecir=dias_a_predecir)

        fundamental = {}
        if info:
            fundamental = {
                'marketCap': info.get('marketCap'),
                'trailingPE': info.get('trailingPE'),
                'forwardPE': info.get('forwardPE'),
                'dividendYield': info.get('dividendYield'),
                'eps': info.get('trailingEps'),
                'revenue': info.get('totalRevenue'),
                'profitMargins': info.get('profitMargins'),
                'beta': info.get('beta')
            }

        return jsonify({
            'simbolo_original': simbolo.upper(),
            'simbolo_resuelto': simbolo_resuelto,
            'nombre': info.get('longName', simbolo) if isinstance(info, dict) else simbolo,
            'precio_actual': precio_actual,
            'moneda': info.get('currency', 'USD') if isinstance(info, dict) else 'USD',
            'historial': historial,
            'noticias': noticias_con_sentimiento,
            'resumen_sentimiento': resumen_sentimiento,
            'prediccion': prediccion,
            'mape': mape,
            'fundamental': fundamental
        })
    except Exception as e:
        print(f"Error en dashboard para {simbolo}: {e}")
        traceback.print_exc()
        return jsonify({'error': f'Error interno: {str(e)}'}), 500


@app.route('/api/usuarios', methods=['GET'])
def obtener_usuarios():
    usuarios = Usuario.query.all()
    return jsonify([u.to_dict() for u in usuarios])

@app.route('/api/noticias', methods=['GET'])
def noticias_endpoint():
    query = request.args.get('q', 'finanzas')
    desde = request.args.get('desde', None)
    hasta = request.args.get('hasta', None)
    idioma = request.args.get('lang', 'en')
    noticias = obtener_noticias(query=query, desde=desde, hasta=hasta, max_resultados=30, idioma=idioma)
    
    resultados = []
    sentimientos = {'positivo': 0, 'negativo': 0, 'neutral': 0}
    for articulo in noticias:
        titulo = articulo.get('title', '')
        descripcion = articulo.get('description', '')
        texto = f"{titulo}. {descripcion}" if descripcion else titulo
        texto_limpio = limpiar_texto_para_analisis(texto)
        if texto:
            analisis = analizar_sentimiento(texto_limpio, idioma=idioma, umbral_negativo=0.20)
            fecha_publicacion = articulo.get('publishedAt', '')
            fecha = fecha_publicacion.split('T')[0] if fecha_publicacion else ''
            resultados.append({
                'titulo': titulo,
                'descripcion': descripcion,
                'url': articulo.get('url'),
                'fuente': articulo.get('source', {}).get('name'),
                'fecha': fecha,
                'sentimiento': analisis
            })
            sentimientos[analisis['sentimiento']] += 1
    total = len(resultados)
    if total > 0:
        resumen = {
            'positivo': round(sentimientos['positivo'] / total * 100, 1),
            'negativo': round(sentimientos['negativo'] / total * 100, 1),
            'neutral': round(sentimientos['neutral'] / total * 100, 1)
        }
    else:
        resumen = {'positivo': 0, 'negativo': 0, 'neutral': 0}
    return jsonify({
        'query': query,
        'total': total,
        'resumen_sentimiento': resumen,
        'noticias': resultados
    })

@app.route('/api/sentimiento', methods=['POST'])
def probar_sentimiento():
    data = request.get_json()
    texto = data.get('texto', '')
    idioma = data.get('idioma', 'en')
    if not texto:
        return jsonify({'error': 'Falta el texto'}), 400
    resultado = analizar_sentimiento(texto, idioma=idioma, umbral_negativo=0.20)
    return jsonify(resultado)

@app.route('/api/noticias-sentimiento/<simbolo>', methods=['GET'])
def noticias_sentimiento(simbolo):
    noticias = obtener_noticias(simbolo)
    idioma = request.args.get('lang', 'en')
    if not noticias:
        return jsonify({'error': 'No se encontraron noticias'}), 404
    resultados = []
    sentimientos = {'positivo': 0, 'negativo': 0, 'neutral': 0}
    for articulo in noticias:
        titulo = articulo.get('title', '')
        descripcion = articulo.get('description', '')
        fecha_publicacion = articulo.get('publishedAt', '')
        fecha = fecha_publicacion.split('T')[0] if fecha_publicacion else ''
        texto = f"{titulo}. {descripcion}" if descripcion else titulo
        if texto:
            analisis = analizar_sentimiento(texto, idioma=idioma, umbral_negativo=0.20)
            resultados.append({
                'titulo': titulo,
                'descripcion': descripcion,
                'url': articulo.get('url'),
                'fuente': articulo.get('source', {}).get('name'),
                'fecha': fecha,
                'sentimiento': analisis
            })
            sentimientos[analisis['sentimiento']] += 1
    total = len(resultados)
    if total > 0:
        resumen = {
            'positivo': round(sentimientos['positivo'] / total * 100, 1),
            'negativo': round(sentimientos['negativo'] / total * 100, 1),
            'neutral': round(sentimientos['neutral'] / total * 100, 1)
        }
    else:
        resumen = {'positivo': 0, 'negativo': 0, 'neutral': 0}
    return jsonify({
        'simbolo': simbolo,
        'total_noticias': total,
        'resumen_sentimiento': resumen,
        'noticias': resultados
    })

@app.route('/api/prediccion/<simbolo>', methods=['GET'])
def obtener_prediccion(simbolo):
    try:
        ticker = yf.Ticker(simbolo)
        hist = ticker.history(period="6mo")
        if hist.empty:
            return jsonify({'error': 'No hay datos históricos'}), 404
        historial = []
        for fecha, row in hist.iterrows():
            historial.append({
                'fecha': fecha.strftime('%Y-%m-%d'),
                'precio_cierre': round(row['Close'], 2)
            })
        prediccion, mape = predecir_con_prophet(historial, dias_a_predecir=30)
        return jsonify({
            'simbolo': simbolo.upper(),
            'prediccion': prediccion,
            'mape': mape
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/noticias/generales', methods=['GET'])
def noticias_generales():
    desde = request.args.get('desde', '7')
    query = request.args.get('q', 'finanzas OR economía OR mercado OR bolsa')
    idioma = request.args.get('idioma', 'es')
    try:
        api_key = os.environ.get('NEWS_API_KEY', '8be6e46b17d040bf91a7a869e7259cbc')
        url = f"https://newsapi.org/v2/everything?q={query}&language={idioma}&from={desde}&sortBy=relevancy&apiKey={api_key}"
        response = requests.get(url, timeout=5)
        if response.status_code != 200:
            return jsonify({'error': 'Error al obtener noticias'}), response.status_code
        data = response.json()
        articulos = data.get('articles', [])[:20]
        noticias_con_sentimiento = []
        sentimientos = {'positivo': 0, 'negativo': 0, 'neutral': 0}
        for art in articulos:
            titulo = art.get('title', '')
            descripcion = art.get('description', '')
            texto = f"{titulo}. {descripcion}" if descripcion else titulo
            if texto:
                analisis = analizar_sentimiento(texto, idioma=idioma, umbral_negativo=0.20)
                noticias_con_sentimiento.append({
                    'titulo': titulo,
                    'descripcion': descripcion,
                    'url': art.get('url'),
                    'fuente': art.get('source', {}).get('name'),
                    'fecha': art.get('publishedAt'),
                    'sentimiento': analisis
                })
                sentimientos[analisis['sentimiento']] += 1
        total = len(noticias_con_sentimiento)
        resumen = {}
        if total > 0:
            resumen = {
                'positivo': round(sentimientos['positivo']/total*100,1),
                'negativo': round(sentimientos['negativo']/total*100,1),
                'neutral': round(sentimientos['neutral']/total*100,1)
            }
        else:
            resumen = {'positivo':0, 'negativo':0, 'neutral':0}
        return jsonify({
            'total': total,
            'resumen_sentimiento': resumen,
            'noticias': noticias_con_sentimiento
        })
    except Exception as e:
        print(f"Error en noticias generales: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/search/<query>', methods=['GET'])
def buscar(query):
    try:
        if len(query) < 2:
            return jsonify({'error': 'La búsqueda debe tener al menos 2 caracteres'}), 400
        resultados_raw = Search(query, max_results=10)
        resultados = []
        if resultados_raw.quotes:
            for quote in resultados_raw.quotes:
                resultados.append({
                    'simbolo': quote.get('symbol'),
                    'nombre': quote.get('shortname') or quote.get('longname'),
                    'tipo': quote.get('quoteType'),
                    'exchange': quote.get('exchange')
                })
        return jsonify({
            'query': query,
            'resultados': resultados
        })
    except Exception as e:
        print(f"Error en búsqueda: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/register', methods=['POST'])
def register():
    data = request.get_json()
    nombre = data.get('nombre')
    email = data.get('email')
    password = data.get('password')

    if not nombre or not email or not password:
        return jsonify({'error': 'Faltan campos obligatorios'}), 400

    if Usuario.query.filter_by(email=email).first():
        return jsonify({'error': 'El email ya está registrado'}), 409

    hashed_password = generate_password_hash(password)
    nuevo_usuario = Usuario(nombre=nombre, email=email, password_hash=hashed_password)
    db.session.add(nuevo_usuario)
    db.session.flush()

    cartera = Cartera(usuario_id=nuevo_usuario.id)
    db.session.add(cartera)

    db.session.commit()
    return jsonify({'message': 'Usuario registrado con éxito'}), 201

@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    usuario = Usuario.query.filter_by(email=email).first()
    if usuario and check_password_hash(usuario.password_hash, password):
        session.permanent = True
        session['user_id'] = usuario.id
        return jsonify({
            'message': 'Login exitoso',
            'user': {
                'id': usuario.id,
                'nombre': usuario.nombre,
                'email': usuario.email
            }
        }), 200
    else:
        return jsonify({'error': 'Credenciales incorrectas'}), 401

@app.route('/api/logout', methods=['POST'])
def logout():
    session.pop('user_id', None)
    return jsonify({'message': 'Logout exitoso'}), 200

@app.route('/api/actualizar-perfil', methods=['PUT'])
def actualizar_perfil():
    user_id = session.get('user_id')
    if not user_id:
        return jsonify({'error': 'No autenticado'}), 401
    data = request.get_json()
    nombre = data.get('nombre')
    email = data.get('email')
    password_actual = data.get('password_actual')
    nueva_password = data.get('nueva_password')
    usuario = Usuario.query.get(user_id)
    if not usuario:
        return jsonify({'error': 'Usuario no encontrado'}), 404
    if nueva_password and (not password_actual or not check_password_hash(usuario.password_hash, password_actual)):
        return jsonify({'error': 'Contraseña actual incorrecta'}), 401
    if nombre:
        usuario.nombre = nombre
    if email:
        if email != usuario.email and Usuario.query.filter_by(email=email).first():
            return jsonify({'error': 'El email ya está en uso'}), 409
        usuario.email = email
    if nueva_password:
        usuario.password_hash = generate_password_hash(nueva_password)
    db.session.commit()
    return jsonify({'message': 'Perfil actualizado con éxito'}), 200

@app.route('/api/me', methods=['GET'])
def me():
    user_id = session.get('user_id')
    if user_id:
        usuario = Usuario.query.get(user_id)
        if usuario:
            return jsonify({
                'id': usuario.id,
                'nombre': usuario.nombre,
                'email': usuario.email
            }), 200
    return jsonify({'error': 'No autenticado'}), 401

@app.route('/api/favoritos', methods=['GET'])
def get_favoritos():
    user_id = session.get('user_id')
    if not user_id:
        return jsonify({'error': 'No autenticado'}), 401
    favoritos = Favorito.query.filter_by(usuario_id=user_id).all()
    return jsonify([f.simbolo for f in favoritos])

@app.route('/api/favoritos', methods=['POST'])
def add_favorito():
    user_id = session.get('user_id')
    if not user_id:
        return jsonify({'error': 'No autenticado'}), 401
    data = request.get_json()
    simbolo = data.get('simbolo')
    if not simbolo:
        return jsonify({'error': 'Símbolo requerido'}), 400
    existing = Favorito.query.filter_by(usuario_id=user_id, simbolo=simbolo).first()
    if existing:
        return jsonify({'message': 'Ya está en favoritos'}), 200
    fav = Favorito(usuario_id=user_id, simbolo=simbolo)
    db.session.add(fav)
    db.session.commit()
    return jsonify({'message': 'Añadido a favoritos'}), 201

@app.route('/api/favoritos/<simbolo>', methods=['DELETE'])
def delete_favorito(simbolo):
    user_id = session.get('user_id')
    if not user_id:
        return jsonify({'error': 'No autenticado'}), 401
    fav = Favorito.query.filter_by(usuario_id=user_id, simbolo=simbolo).first()
    if fav:
        db.session.delete(fav)
        db.session.commit()
    return jsonify({'message': 'Eliminado de favoritos'}), 200

@app.route('/api/cartera', methods=['GET'])
def obtener_cartera():
    user_id = session.get('user_id')
    if not user_id:
        return jsonify({'error': 'No autenticado'}), 401

    cartera = Cartera.query.filter_by(usuario_id=user_id).first()
    if not cartera:
        cartera = Cartera(usuario_id=user_id)
        db.session.add(cartera)
        db.session.commit()

    return jsonify({
        'id': cartera.id,
        'saldo': cartera.saldo,
        'total_depositado': cartera.total_depositado,
        'total_retirado': cartera.total_retirado,
        'total_transacciones': cartera.total_transacciones
    })

@app.route('/api/comprar', methods=['POST'])
def comprar_accion():
    user_id = session.get('user_id')
    if not user_id:
        return jsonify({'error': 'No autenticado'}), 401

    data = request.get_json()
    simbolo = data.get('simbolo')
    cantidad = data.get('cantidad')
    precio = data.get('precio')

    if not simbolo or not cantidad or not precio:
        return jsonify({'error': 'Faltan datos'}), 400

    cartera = Cartera.query.filter_by(usuario_id=user_id).first()
    if not cartera:
        return jsonify({'error': 'Cartera no encontrada'}), 404

    costo_total = cantidad * precio
    if cartera.saldo < costo_total:
        return jsonify({'error': 'Saldo insuficiente'}), 400

    cartera.saldo -= costo_total
    cartera.total_transacciones += 1

    transaccion = Transaccion(
        cartera_id=cartera.id,
        accion_simbolo=simbolo,
        tipo='compra',
        cantidad=cantidad,
        precio=precio
    )
    db.session.add(transaccion)
    db.session.commit()

    return jsonify({'message': 'Compra realizada con éxito', 'nuevo_saldo': cartera.saldo}), 200

@app.route('/api/posicion', methods=['GET'])
def obtener_posicion():
    user_id = session.get('user_id')
    if not user_id:
        return jsonify({'error': 'No autenticado'}), 401

    posicion = calcular_posicion_actual(user_id)
    return jsonify(posicion), 200

@app.route('/api/vender', methods=['POST'])
def vender_accion():
    user_id = session.get('user_id')
    if not user_id:
        return jsonify({'error': 'No autenticado'}), 401

    data = request.get_json()
    simbolo = data.get('simbolo')
    cantidad = data.get('cantidad')
    precio = data.get('precio')

    if not simbolo or not cantidad or not precio:
        return jsonify({'error': 'Faltan datos'}), 400

    cartera = Cartera.query.filter_by(usuario_id=user_id).first()
    if not cartera:
        return jsonify({'error': 'Cartera no encontrada'}), 404

    posicion = calcular_posicion_actual(user_id)
    disponible = posicion.get(simbolo, 0)
    if disponible < cantidad:
        return jsonify({'error': 'No tienes suficientes acciones de ese símbolo'}), 400

    ingreso = cantidad * precio
    cartera.saldo += ingreso
    cartera.total_transacciones += 1

    transaccion = Transaccion(
        cartera_id=cartera.id,
        accion_simbolo=simbolo,
        tipo='venta',
        cantidad=cantidad,
        precio=precio
    )
    db.session.add(transaccion)
    db.session.commit()

    return jsonify({'message': 'Venta realizada con éxito', 'nuevo_saldo': cartera.saldo}), 200

@app.route('/api/transacciones', methods=['GET'])
def obtener_transacciones():
    user_id = session.get('user_id')
    if not user_id:
        return jsonify({'error': 'No autenticado'}), 401

    cartera = Cartera.query.filter_by(usuario_id=user_id).first()
    if not cartera:
        return jsonify({'error': 'Cartera no encontrada'}), 404

    transacciones = Transaccion.query.filter_by(cartera_id=cartera.id).order_by(Transaccion.fecha.desc()).all()
    return jsonify([{
        'id': t.id,
        'simbolo': t.accion_simbolo,
        'tipo': t.tipo,
        'cantidad': t.cantidad,
        'precio': t.precio,
        'fecha': t.fecha.isoformat()
    } for t in transacciones])

@app.route('/api/market-summary', methods=['GET'])
def market_summary():
    indices = {
        'S&P 500': '^GSPC',
        'IBEX 35': '^IBEX',
        'Dow Jones': '^DJI',
        'Nasdaq': '^IXIC'
    }
    result = []
    for name, symbol in indices.items():
        try:
            ticker = yf.Ticker(symbol)
            hist = ticker.history(period='1d')
            if not hist.empty:
                close = hist['Close'].iloc[-1]
                open = hist['Open'].iloc[0] if len(hist) > 0 else close
                change = close - open
                change_percent = (change / open) * 100 if open != 0 else 0
                result.append({
                    'nombre': name,
                    'simbolo': symbol,
                    'precio': round(close, 2),
                    'cambio': round(change, 2),
                    'cambio_porcentaje': round(change_percent, 2)
                })
        except Exception as e:
            print(f"Error obteniendo {symbol}: {e}")
    return jsonify(result)

@app.route('/api/forgot-password', methods=['POST'])
def forgot_password():
    data = request.get_json()
    email = data.get('email')
    print(f"📧 Solicitud de reset para: {email}")
    usuario = Usuario.query.filter_by(email=email).first()
    if not usuario:
        print("❌ Email no encontrado")
        return jsonify({'message': 'Si el email está registrado, recibirás un código'}), 200

    token = str(random.randint(100000, 999999))
    ResetToken.query.filter_by(usuario_id=usuario.id).delete()
    new_token = ResetToken(usuario_id=usuario.id, token=token)
    db.session.add(new_token)
    db.session.commit()

    print(f"🔐 Código de verificación para {email}: {token}")
    # TODO: Configurar Flask-Mail y enviar correo real
    return jsonify({'message': 'Código enviado'}), 200

@app.route('/api/reset-password', methods=['POST'])
def reset_password():
    data = request.get_json()
    email = data.get('email')
    token = data.get('token')
    new_password = data.get('new_password')

    usuario = Usuario.query.filter_by(email=email).first()
    if not usuario:
        return jsonify({'error': 'Email no registrado'}), 404

    reset = ResetToken.query.filter_by(usuario_id=usuario.id, token=token).first()
    if not reset or (datetime.utcnow() - reset.created_at).seconds > 3600:
        return jsonify({'error': 'Código inválido o expirado'}), 400

    usuario.password_hash = generate_password_hash(new_password)
    db.session.delete(reset)
    db.session.commit()
    return jsonify({'message': 'Contraseña actualizada con éxito'}), 200

if __name__ == '__main__':
    app.run(debug=True, port=5000)