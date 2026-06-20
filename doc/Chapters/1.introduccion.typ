= Introducción

== Contexto y motivación

La inversión en bolsa siempre se ha visto como algo complejo, casi reservado
para personas que dominan términos técnicos y entienden cómo funcionan los
mercados financieros. Durante años, acceder a información fiable y saber
interpretarla correctamente ha supuesto una barrera importante para mucha gente.
Sin embargo, en los últimos años esta situación ha cambiado bastante. Hoy en día
cualquier persona puede consultar cotizaciones en tiempo real, leer noticias
económicas o incluso operar desde el móvil con apenas unos clics, gracias a las
plataformas digitales.

A pesar de ello, muchas de las plataformas más conocidas siguen sin estar
pensadas para usuarios que empiezan desde cero. *Yahoo Finance* @yahoo-finance,
por ejemplo, ofrece datos gratuitos y una interfaz relativamente sencilla, pero
carece de herramientas avanzadas como una cartera virtual para simular
inversiones, análisis de sentimiento de noticias o predicciones basadas en
machine learning. *Investing.com* @investing-com es muy completa, pero su enorme
cantidad de información puede resultar abrumadora para un usuario novel, y
tampoco permite practicar sin riesgo real. Por otro lado, *Bloomberg Terminal*
@bloomberg, es el estándar de oro en el sector profesional, pero su coste es
prohibitivo (miles de euros al mes) y su complejidad la hace inaccesible para
estudiantes o pequeños inversores. En resumen, la mayoría de estas plataformas o
bien son de pago, o bien ofrecen una interfaz demasiado densa, o carecen de
funcionalidades educativas como la simulación sin riesgo.

Esta situación afecta especialmente a estudiantes, pequeños ahorradores o, en
general, a personas interesadas en comprender cómo funciona el mercado sin poner
en riesgo sus ahorros. George Soros, uno de los inversores más conocidos,
afirmaba que «el problema no es lo que uno no sabe, sino lo que uno cree que
sabe estando equivocado» @soros. Esa idea refleja bastante bien uno de los
principales problemas relacionados con la inversión: muchas personas no se
acercan a este ámbito por miedo a equivocarse o porque consideran que no tienen
la formación suficiente. Además de esto, también influye el hecho de escuchar
constantemente historias sobre pérdidas económicas importantes. Por eso, más que
una herramienta orientada únicamente a mostrar datos, considero que hace falta
una plataforma que ayude a interpretar la información y permita practicar de
manera segura antes de invertir dinero real.

Entre las fuentes de datos financieros disponibles, se optó por *Yahoo Finance*
por varias razones: ofrece acceso gratuito a datos históricos y en tiempo real
de acciones, criptomonedas, índices y divisas; dispone de una API bien
documentada y fácil de integrar mediante la librería `yfinance` @yfinance2024 en
Python @python2026; y, a pesar de sus limitaciones, cubre los requisitos básicos
para un proyecto académico de este tipo. Además, su popularidad y la abundancia
de ejemplos en la comunidad facilitaron el desarrollo.

Combinando los datos aportados por la API de Yahoo Finance con técnicas de
machine learning —como modelos de predicción de series temporales (Prophet
@prophet2026) y análisis de sentimiento sobre noticias financieras (FinBERT
@finbert2023 y un modelo específico para español)— se ha podido ir mucho más
allá de lo que ofrecen estas plataformas por sí solas. De hecho, el machine
learning permite extraer patrones y tendencias que a simple vista pasan
desapercibidos, y también ayuda a interpretar el estado de ánimo del mercado a
través de las noticias. Esto convierte a FinancialPulse en una herramienta que
no solo muestra datos, sino que intenta aportar valor añadido al inversor.

Otras alternativas como Alpha Vantage @alphavantage o IEX Cloud @iexcloud
también se tuvieron en consideración, pero debido a sus restricciones de tasa y
la necesidad de clave de API con límites reducidos las hicieron menos atractivas
para este proyecto el cual busca simplicidad y a coste cero.

Por otro lado, este trabajo surge precisamente de la intención de combinar los
conocimientos que he adquirido durante el Doble Grado en Ingeniería Informática
y Administración y Dirección de Empresas, intentando unir la parte tecnológica
con la financiera en una plataforma útil, accesible y orientada tanto al
aprendizaje como al análisis práctico, eliminando la incertidumbre y el pánico
que a menudo afectan a los inversores.

== Definición del problema

A partir del análisis anterior se identifican varias carencias en las soluciones
actuales. Por un lado, no existe una plataforma gratuita que integre datos en
tiempo real, indicadores técnicos avanzados, predicción de precios, análisis de
sentimiento de noticias y una cartera virtual completa. Por otro, las
aplicaciones existentes o bien son demasiado caras, o bien resultan demasiado
complejas para usuarios sin experiencia. Además, la mayoría no cumplen con los
requisitos básicos del RGPD, como la exportación de datos personales o la
eliminación completa de la cuenta.

Este vacío funcional afecta a distintos perfiles de usuario. Por un lado están
los inversores con cierta experiencia tecnológica que buscan herramientas de
backtesting y análisis avanzado. Por otro, personas sin conocimientos
financieros previos que necesitan una interfaz clara, con ayuda integrada y
posibilidad de simular sin riesgo. También hay estudiantes o profesionales del
sector que requieren exportar datos para análisis externos y validar estrategias
cuantitativas.

Teniendo en cuenta estas necesidades, el problema que se aborda en este trabajo
es el diseño y desarrollo de una aplicación web que ofrezca de forma unificada:
acceso a datos financieros actualizados, análisis técnico, predicción mediante
machine learning, análisis de sentimiento de noticias, cartera virtual,
favoritos, internacionalización completa y cumplimiento del RGPD. Todo ello con
un enfoque educativo y accesible, y sin coste para el usuario final.

Bajo este contexto y motivación, el objetivo de este proyecto es diseñar e
implementar una plataforma web que permita a cualquier usuario analizar activos
financieros en tiempo real, obtener recomendaciones basadas en indicadores
técnicos y análisis de sentimiento, y simular inversiones sin arriesgar dinero
real. Dicha plataforma se ha denominado *FinancialPulse* y se describe con
detalle a lo largo de esta memoria.

== Objetivos del proyecto

El objetivo principal de este trabajo consiste en *diseñar e implementar una
plataforma web que permita a cualquier usuario analizar activos financieros en
tiempo real, obtener recomendaciones basadas en indicadores técnicos y análisis
de sentimiento, y simular inversiones sin arriesgar dinero real*.

Para alcanzar este objetivo general, se han definido varios objetivos
específicos que cubren las distintas funcionalidades de la plataforma:

+ OB-1: Desarrollar un sistema de autenticación completo (registro, inicio de
  sesión, recuperación de contraseña, edición de perfil, exportación de datos y
  eliminación de cuenta) que cumpla con los requisitos establecidos por el RGPD
  (Reglamento General de Protección de Datos) @gdpr_faq2026.
+ OB-2: Integrar la API de Yahoo Finance para obtener datos actualizados e
  históricos de acciones, criptomonedas, índices y divisas.
+ OB-3: Construir un módulo de análisis técnico capaz de calcular y representar
  indicadores como RSI, MACD, SMA, Bandas de Bollinger y estocástico. Además,
  incluir la posibilidad de realizar backtesting mediante una estrategia
  sencilla basada en cruces de medias móviles. Todos estos indicadores se
  describen en el Capítulo 2, sección 2.1.2.
+ OB-4: Incorporar un modelo de predicción de precios utilizando el modelo de
  predicción de series temporales Prophet @prophet2026 (el cual se describe con
  más detalle en el Capítulo 2, sección 2.2.5), de manera que sea posible
  generar proyecciones a 30 días junto con intervalos de confianza y una métrica
  de error, como el MAPE (Mean Absolute Percentage Error) el cual es una métrica
  estadística utilizada para medir la precisión de un modelo de predicción o
  pronóstico. Haciendo que el uso de estas métricas permita estimar la
  fiabilidad de las predicciones.
+ OB-5: Implementar un sistema de análisis de sentimiento aplicado a noticias
  financieras usando modelos preentrenados, concretamente FinBERT @finbert2023
  para noticias en inglés y `bardsai/finance-sentiment-es-base`
  @sentiment_es2024 para español.
+ OB-6: Diseñar una cartera virtual que permita comprar y vender activos con un
  saldo ficticio, mostrando tanto la evolución del saldo como los beneficios no
  realizados.
+ OB-7: Crear un sistema de favoritos y noticias personalizadas, incluyendo un
  resumen visual del sentimiento mediante gráficos circulares.
+ OB-8: Garantizar que toda la aplicación esté disponible tanto en español como
  en inglés mediante un sistema propio de traducción y tooltips adaptados al
  idioma seleccionado.
+ OB-9: Empaquetar la aplicación utilizando contenedores Docker @docker2026 con
  el objetivo de facilitar su despliegue en distintos entornos.
+ OB-10: Documentar el proyecto de manera exhaustiva, incluyendo la memoria
  técnica, diagramas, manual de usuario y apéndices con ejemplos de despliegue y
  uso.
+ OB-11: Publicar la aplicación en una URL pública accesible desde cualquier
  dispositivo sin necesidad de instalación, evaluando diferentes alternativas de
  despliegue gratuito (Render @render2026, Oracle Cloud @oraclecloud2026, GitHub
  Pages @githubpages2026) y seleccionando la más adecuada para el contexto de
  una presentación académica, que en este caso ha sido ngrok @ngrok2026.

== Estructura de la memoria

La memoria se ha organizado en varios capítulos, cada uno centrado en una parte
concreta del proyecto:

- *Capítulo 2: Conceptos preliminares*. En este capítulo se introducen las
  nociones financieras y tecnológicas necesarias para comprender el resto del
  trabajo. Entre otros temas, se explican conceptos relacionados con activos
  financieros, indicadores técnicos, aplicaciones SPA, APIs REST @rest2000,
  modelos Prophet @prophet2026 y Transformers @transformers2026 .

- *Capítulo 3: Estado del arte*. Se analizan algunas de las plataformas
  financieras más conocidas, como Yahoo Finance, TradingView o Investing.com,
  comparando sus funcionalidades y señalando qué aspectos intenta cubrir
  FinancialPulse.

- *Capítulo 4: Planificación y diseño*. Se explica la metodología de desarrollo
  utilizada, basada en Scrum @scrumguide2020 y adaptada a un proyecto
  individual. También se incluyen la planificación temporal, el presupuesto, los
  requisitos funcionales y no funcionales, los casos de uso, el diseño de la
  base de datos, la arquitectura del software y los primeros bocetos de
  interfaz. Además, se definen los stakeholders y usuarios, las historias de
  usuario, los backlogs y los diagramas de secuencia que ilustran el
  funcionamiento de las operaciones más importantes del sistema.

- *Capítulo 5: Herramientas y datos*. Se detallan las tecnologías empleadas
  durante el desarrollo, tanto en frontend como en backend, incluyendo Angular,
  Tailwind @tailwindcss2026, ngx-echarts @ngxecharts2026, Flask, SQLAlchemy
  @sqlalchemy2026, yfinance @yfinance2024, transformers @transformers2026,
  prophet y Docker. Además, se describen las APIs externas utilizadas, como
  Yahoo Finance y NewsAPI @newsapi2026.

- *Capítulo 6: Software desarrollado*. Se explica la implementación de los
  distintos módulos del sistema, como autenticación, dashboard financiero,
  predicción de precios, análisis de sentimiento, cartera virtual, favoritos,
  internacionalización y funcionalidades relacionadas con RGPD.

- *Capítulo 7: Evaluación y pruebas*. Se presentan las pruebas realizadas
  durante el desarrollo, incluyendo pruebas unitarias, de integración, de
  aceptación y de usabilidad, junto con los resultados obtenidos.

- *Capítulo 8: Conclusiones y trabajo futuro*. Se resumen los objetivos
  alcanzados, se analiza el resultado final del proyecto, se comentan las
  principales lecciones aprendidas y se plantean posibles mejoras futuras.

- *Bibliografía*.

- *Apéndices*.
