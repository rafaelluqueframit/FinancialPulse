#import "../landscape_helpers.typ": landscape_page

= Conclusiones y trabajo futuro

En este capítulo final, se presentan las conclusiones del proyecto, se comparan
los objetivos iniciales con los resultados obtenidos, se analizan las lecciones
aprendidas y se proponen posibles mejoras y líneas de trabajo futuro. Además, se
reflexiona sobre la experiencia personal del autor durante el desarrollo del
Trabajo Fin de Grado y se destacan los aspectos más relevantes del proceso de
aprendizaje.

== Temporización real

La planificación inicial dividía el trabajo en 5 sprints de 4 semanas cada uno,
empezando en febrero de 2026 y acabando en junio de 2026. En la siguiente Tabla
8.1 se comparan las duraciones estimadas con las reales, y se comentan las
desviaciones.

#figure(
  table(
    columns: (1.5fr, 1.2fr, 1.2fr, 2.5fr),
    stroke: 1pt,
    align: center + horizon,
    inset: 4pt,
    [*Sprint*], [*Planificado*], [*Real*], [*Desviación / Observaciones*],
    [Sprint 1 (Configuración y autenticación)],
    [4 semanas],
    [4 semanas],
    [Sin desviación. Se completó la base de datos y el registro/login.],

    [Sprint 2 (Yahoo Finance y gráficos)],
    [4 semanas],
    [4 semanas],
    [Sin desviación. Integración correcta de datos en tiempo real.],

    [Sprint 3 (Predicción y sentimiento)],
    [4 semanas],
    [5 semanas],
    [Retraso de 1 semana por la dificultad de integrar Prophet y el modelo de
      sentimiento en español, que requirió ajustes de umbral y caché.],

    [Sprint 4 (Cartera virtual y backtest)],
    [4 semanas],
    [4 semanas],
    [Sin desviación. Se implementaron compra/venta y cálculo de posición.],

    [Sprint 5 (i18n, RGPD, pruebas, documentación)],
    [4 semanas],
    [4 semanas],
    [Sin desviación. Se completaron la internacionalización, tooltips, páginas
      de ayuda y las pruebas.],
  ),
  caption: [Comparación entre la planificación temporal inicial y la duración
    real de los sprints.],
) <tabla:temporizacion>

A continuación en la Figura 8.1 se muestra un diagrama de Gantt con la
temporización real de los sprints y las tareas principales. Se observa que, a
pesar del retraso en el Sprint 3, el proyecto se completó dentro del plazo
previsto.

#landscape_page[
  #figure(
    image("../Figures/Template/Chapter9/ganttfinal.png", width: 100%),
    caption: [Diagrama de Gantt final (temporización real).],
  ) <fig:gantt_final>
]

Como se puede apreciar comparando el diagrama de Gantt inicial con el final, la
planificación fue bastante acertada y permitió organizar el trabajo de manera
eficiente. La única desviación significativa se produjo en el Sprint 3, donde la
integración de Prophet y el modelo de sentimiento en español requirió más tiempo
del previsto. Ajustar el umbral de negatividad y añadir una caché para las
noticias supuso un retraso de una semana. A pesar de ello, todos los objetivos
se completaron antes de junio de 2026, recuperando el tiempo perdido en sprints
posteriores.

== Cumplimiento de objetivos

El objetivo principal del proyecto era diseñar e implementar una plataforma web
que permitiera analizar activos financieros en tiempo real, obtener
recomendaciones basadas en indicadores y sentimiento, y simular inversiones sin
arriesgar dinero. La siguiente Tabla 8.2 resume el estado de cada objetivo
específico.

#figure(
  table(
    columns: (3.5fr, 1fr, 2fr),
    stroke: 1pt,
    align: center + horizon,
    inset: 4pt,
    [*Objetivo específico*], [*Estado*], [*Comentarios*],
    [OB-1: Sistema de autenticación y gestión de usuarios (RGPD)],
    [Completo],
    [Registro, login, recuperación, exportación JSON y eliminación de cuenta
      implementados.],

    [OB-2: Integración con Yahoo Finance],
    [Completo],
    [Datos en tiempo real e históricos de acciones, criptomonedas, índices y
      divisas.],

    [OB-3: Módulo de análisis técnico],
    [Completo],
    [RSI, MACD, SMA, Bollinger, estocástico y backtesting de cruce SMA.],

    [OB-4: Predicción de precios con Prophet],
    [Completo],
    [Predicción a 30 días con intervalos de confianza y MAPE.],

    [OB-5: Análisis de sentimiento de noticias],
    [Completo],
    [FinBERT para EN y modelo específico para ES.],

    [OB-6: Cartera virtual],
    [Completo],
    [Saldo inicial 10k USD, compra/venta, historial, gráfico de evolución,
      composición con gráfico de tarta.],

    [OB-7: Sistema de favoritos y noticias personalizadas],
    [Completo],
    [Marcar activos favoritos, resumen de sentimiento con gráfico circular.],

    [OB-8: Internacionalización completa],
    [Completo],
    [Español/inglés con pipe de traducción y tooltips dinámicos.],

    [OB-9: Despliegue con contenedores Docker],
    [Completo],
    [docker-compose.yml funcional para desarrollo y producción.],

    [OB-10: Documentación exhaustiva],
    [Completo],
    [Memoria, manual de usuario y apéndices.],

    [OB-11: Publicación en URL pública],
    [Completo],
    [Se optó por ngrok, que proporciona una URL pública estable y gratuita.],
  ),
  caption: [Estado de cumplimiento de los objetivos específicos.],
) <tabla:objetivos>

Como se observa en la Tabla 8.2, todos los objetivos específicos se han cumplido
satisfactoriamente.

== Lecciones aprendidas

En cuanto a la parte técnica, he aprendido a integrar múltiples tecnologías
(Angular, Flask, PostgreSQL, Prophet, Transformers) en un solo proyecto, a
manejar sesiones y cookies de forma segura, a optimizar consultas a la base de
datos y a implementar un sistema de backtesting. También he mejorado mis
habilidades en el diseño de interfaces y experiencia de usuario, así como en la
internacionalización y accesibilidad de aplicaciones web.

- *Técnicos*: Angular (componentes standalone, pipes, directivas), Flask, manejo
  de sesiones, APIs externas (yfinance, NewsAPI), modelos de machine learning
  (Prophet, Transformers) y despliegue con Docker. También profundicé en el
  cálculo de indicadores con Pandas y en cómo normalizar una base de datos
  correctamente. Cosas que había visto en clase pero no había llevado a la
  práctica tan a fondo.

- *Metodológicos*: Me funcionó bien adaptar Scrum a un solo desarrollador. El
  diagrama de Gantt me ayudó a visualizar el progreso y a detectar retrasos a
  tiempo. Las reuniones diarias, aunque fueran breves y un poco artificiales, me
  mantuvieron centrado en lo que tocaba hacer cada día.

- *Dificultades encontradas*: El modelo de sentimiento en español fue más lento
  de lo que pensaba y dio algunos falsos negativos al principio. Lo solucioné
  cacheando resultados y ajustando el umbral al 20%. También tuve un problema de
  concurrencia en las compras rápidas (dos peticiones a la vez modificaban la
  misma cartera). Se solucionó con un bloqueo pesimista (`with_for_update()`) en
  la transacción.

- *Importancia de la documentación*: Escribir la memoria a la vez que
  desarrollaba me ayudó a recordar por qué tomé ciertas decisiones. Además,
  Typst me permitió llevar un control de versiones limpio de los capítulos, algo
  que se agradece sobre todo a la hora de revisar la memoria completa.

== Trabajo futuro

La aplicación funciona correctamente, pero existe margen de mejora. Algunas de
las posibles mejoras se han ido apuntando durante el desarrollo, otras han
surgido de los comentarios de los usuarios.

- *Mejorar la predicción*: probar modelos más avanzados (LSTM, Transformer) o
  dejar que el usuario elija el horizonte de predicción.
- *Ampliar el análisis de sentimiento*: incluir redes sociales (Twitter, Reddit)
  y añadir más fuentes de noticias (por ejemplo, RSS de bancos centrales).
- *Más indicadores técnicos*: ATR, Ichimoku, Fibonacci... y permitir que el
  usuario ajuste los parámetros.
- *Modo oscuro*: implementar un tema oscuro completo para usar la aplicación con
  poca luz. Varios usuarios lo pidieron.
- *Notificaciones push*: avisar en tiempo real cuando un favorito supere un
  umbral o cuando haya noticias relevantes.
- *Aplicación móvil*: desarrollar una versión nativa con Ionic o Flutter,
  reutilizando el backend.
- *Pruebas automáticas*: aumentar la cobertura de pruebas e implementar
  end-to-end con Cypress o Playwright.
- *Seguridad*: añadir protección CSRF, limitación de tasa (rate limiting) y un
  WAF si se despliega en producción.
- *Rendimiento*: cachear respuestas de yfinance y Prophet para reducir tiempos
  de carga.
- *Foro de usuarios*: un espacio donde los inversores puedan comentar
  estrategias y resolver dudas.
- *Canal de soporte técnico*: como sugirió uno de los usuarios en las pruebas de
  usabilidad, habilitar una forma de contacto directo con el administrador.

== Reflexión personal

Hacer este Trabajo Fin de Grado ha sido una experiencia muy enriquecedora. Me ha
permitido aplicar en un proyecto real lo que he estudiado durante el Doble Grado
de Ingeniería Informática y Administración de Empresas, combinando desarrollo
web, inteligencia artificial y finanzas. El resultado es una herramienta
educativa que puede ayudar a gente sin experiencia a iniciarse en la inversión
de una forma segura y guiada.

Agradezco a mi tutor por su orientación y a mi familia por darme su apoyo
durante estos meses. Espero que FinancialPulse siga creciendo y sea útil para
quien lo necesite.
