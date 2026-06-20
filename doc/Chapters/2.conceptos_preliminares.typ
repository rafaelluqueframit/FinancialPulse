= Conceptos preliminares

Para comprender correctamente el resto de la memoria conviene tener claros
algunos conceptos básicos, tanto relacionados con el ámbito financiero como con
las tecnologías utilizadas durante el desarrollo. En este capítulo se recogen
los que se han considerado más importantes para entender el funcionamiento de
FinancialPulse y las decisiones tomadas a lo largo del proyecto. La intención no
es profundizar de manera exhaustiva en cada tema, sino ofrecer una base
suficiente para situar al lector antes de entrar en apartados más técnicos.

== Conceptos financieros básicos

=== Activos financieros

Un activo financiero puede entenderse como un instrumento que posee valor
económico y que puede generar ingresos o beneficios en el futuro. Dentro de la
aplicación se trabaja principalmente con cuatro tipos de activos:

- *Acciones*: representan una pequeña parte de la propiedad de una empresa. Su
  precio varía constantemente en función de factores como la oferta y la
  demanda, los resultados financieros de la compañía o las expectativas que
  tenga el mercado sobre ella. Son probablemente el tipo de activo más conocido
  entre los inversores particulares.

- *Criptomonedas*: son activos digitales descentralizados que utilizan técnicas
  criptográficas para asegurar las transacciones y controlar la creación de
  nuevas unidades. Bitcoin y Ethereum son algunos de los ejemplos más conocidos.
  Su comportamiento suele ser bastante más volátil que el de las acciones
  tradicionales, lo que implica tanto mayores oportunidades como un riesgo más
  elevado.

- *Índices bursátiles*: reflejan la evolución conjunta de un grupo de acciones
  representativas de un mercado o sector concreto. Algunos ejemplos conocidos
  son el S&P 500 o el IBEX 35. Aunque no se compran directamente como una acción
  normal, sirven como referencia para analizar el estado general del mercado.

- *Divisas*: hacen referencia al intercambio entre monedas de distintos países,
  como el par EUR/USD. El mercado Forex, centrado en el comercio de divisas, es
  el mercado financiero con mayor volumen de operaciones a nivel mundial.

=== Indicadores técnicos

El análisis técnico se basa en estudiar la evolución histórica de los precios y
los volúmenes de negociación con el objetivo de detectar patrones o posibles
movimientos futuros. FinancialPulse incorpora varios indicadores bastante
utilizados en este ámbito:

- *Media Móvil Simple (SMA)*: calcula el precio medio de un activo durante un
  número determinado de períodos, por ejemplo 20 días. Este indicador ayuda a
  suavizar las fluctuaciones diarias y facilita identificar tendencias. Cuando
  una media móvil de corto plazo cruza por encima de otra de largo plazo,
  algunos analistas lo interpretan como una señal alcista conocida como *cruce
  dorado*. En cambio, si ocurre lo contrario, se suele considerar una señal
  bajista o *cruce de la muerte*.

- *RSI (Relative Strength Index)*: mide la magnitud de las variaciones recientes
  del precio para intentar identificar situaciones de sobrecompra o sobreventa.
  Su valor oscila entre 0 y 100. Habitualmente, valores superiores a 70 indican
  posible sobrecompra, mientras que valores inferiores a 30 pueden sugerir
  sobreventa.

- *MACD (Moving Average Convergence Divergence)*: muestra la relación entre dos
  medias móviles, normalmente de 12 y 26 períodos. Está compuesto por una línea
  MACD, una línea de señal y un histograma. Los cruces entre ambas líneas suelen
  utilizarse para detectar posibles cambios de tendencia o generar señales de
  compra y venta.

- *Bandas de Bollinger*: consisten en una media móvil central acompañada de dos
  bandas laterales calculadas a partir de desviaciones típicas. Estas bandas se
  expanden o contraen dependiendo de la volatilidad del activo. Cuando el precio
  toca o supera alguna de las bandas, algunos inversores interpretan que puede
  existir una continuación de la tendencia o una posible reversión.

- *Estocástico (Stochastic Oscillator)*: compara el precio de cierre actual con
  el rango de precios registrado durante un período determinado. Está formado
  por dos líneas, conocidas como %K y %D. Valores por encima de 80 suelen
  asociarse con sobrecompra, mientras que valores por debajo de 20 se relacionan
  con sobreventa.

- *Backtesting de estrategia SMA*: FinancialPulse incorpora una simulación
  sencilla basada en la estrategia de cruce entre las medias móviles SMA20 y
  SMA50. El objetivo es mostrar qué habría ocurrido si dicha estrategia se
  hubiera aplicado sobre datos históricos reales. En la Figura 2.1, además del
  rendimiento total, se puede ver también el número de operaciones realizadas,
  permitiendo hacerse una idea aproximada de cómo habría funcionado la
  estrategia en el pasado.

#figure(
  image("../Figures/Template/Chapter2/ejemplo_indicadores.png", width: 100%),
  caption: [Un ejemplo de cómo se ven los indicadores (RSI, MACD, Bollinger) en
    el dashboard de FinancialPulse.],
) <fig:indicadores>

== Conceptos técnicos y tecnológicos

=== Aplicaciones web de una sola página (SPA) y Angular

Una SPA (*Single Page Application*) @spa2026 es un tipo de aplicación web que
carga una única página HTML y actualiza dinámicamente el contenido según las
acciones del usuario, evitando recargar toda la página continuamente. Esto
permite conseguir una experiencia mucho más fluida y cercana a la de una
aplicación de escritorio tradicional.

*Angular* @angular2026 es un framework de código abierto mantenido por Google y
orientado al desarrollo de este tipo de aplicaciones. Utiliza TypeScript
@typescript2026 y organiza el código mediante componentes reutilizables. La
elección de Angular se debe, en parte, a que ya tenía experiencia previa
utilizándolo en otros proyectos, pero también a que incluye muchas herramientas
integradas que ayudan a mantener una estructura ordenada cuando la aplicación
empieza a crecer. Entre ellas destacan el sistema de rutas, el cliente HTTP
(Hypertext Transfer Protocol) @http2026 o la inyección de dependencias. Además,
funcionalidades como los pipes y las directivas personalizadas resultaron
especialmente útiles para implementar la internacionalización y los tooltips
dinámicos.

=== APIs REST y comunicación cliente-servidor

REST es un estilo arquitectónico utilizado para diseñar servicios web basados en
HTTP. Generalmente, se emplean métodos como GET, POST, PUT o DELETE para
realizar operaciones sobre distintos recursos identificados mediante URLs.

En FinancialPulse, el backend desarrollado con Flask @flask2026 expone una API
REST que es consumida por el frontend Angular utilizando el módulo `HttpClient`.
Toda la comunicación entre cliente y servidor se realiza mediante mensajes en
formato JSON (JavaScript Object Notation - Notación de Objetos de JavaScript)
@json2026, lo que simplifica el intercambio de información y facilita la
integración entre ambas partes del sistema.

=== Autenticación y gestión de sesiones

El sistema de autenticación implementado se basa en sesiones gestionadas
mediante cookies. Cuando un usuario inicia sesión correctamente, el backend crea
una sesión utilizando `flask_login` y almacena el identificador asociado al
usuario. A partir de ese momento, la cookie se envía automáticamente en las
siguientes peticiones, permitiendo que el servidor identifique quién está
realizando cada acción sin necesidad de autenticarse continuamente.

Para la recuperación de contraseña se genera un token numérico aleatorio de seis
dígitos. Este token se almacena temporalmente en la base de datos con una
validez de una hora. En la implementación actual el código se muestra por
consola, aunque en una aplicación real lo habitual sería enviarlo mediante
correo electrónico.

=== Modelos de aprendizaje automático para análisis de sentimiento

El análisis de sentimiento consiste en clasificar un texto según la opinión o
emoción que transmite, normalmente en categorías como positiva, negativa o
neutral. Dentro del ámbito financiero, el sentimiento presente en las noticias
puede influir bastante en el comportamiento de determinados activos, por lo que
resultó interesante incorporar esta funcionalidad al proyecto.

Para noticias en inglés se utilizó *FinBERT* @finbert2023, un modelo basado en
BERT ajustado específicamente para textos financieros y desarrollado por
ProsusAI. En el caso del español, se empleó el modelo
`bardsai/finance-sentiment-es-base`, también basado en BERT y entrenado con
noticias financieras en castellano. Ambos modelos se cargan mediante la
biblioteca `transformers` de Hugging Face y se ejecutan en CPU. Aunque el
rendimiento no es tan alto como utilizando GPU, para el volumen de pruebas del
proyecto el funcionamiento fue suficientemente aceptable.

El proceso seguido sería el siguiente: primero se obtienen noticias desde
NewsAPI, después se identifica automáticamente el idioma de cada noticia, se
aplica el modelo correspondiente para calcular el sentimiento y el nivel de
confianza, y finalmente los resultados se agrupan en un gráfico circular que
permite visualizar rápidamente la distribución de sentimientos.

=== Predicción de series temporales con Prophet

*Prophet* @prophet2026 es un modelo de predicción de series temporales
desarrollado por Facebook, actualmente Meta. Una de las razones por las que se
ha popularizado en los últimos años es su fiabilidad, es por esto que ofrece
buenos resultados incluso cuando existen valores atípicos o patrones
estacionales complejos.

El modelo descompone la serie temporal en distintos componentes, como tendencia,
estacionalidad y efectos periódicos. A diferencia de otros enfoques más
clásicos, como ARIMA @arima2026, Prophet no requiere que la serie sea
estacionaria ni que los datos estén perfectamente completos, lo que facilita
bastante su uso en aplicaciones reales.

En FinancialPulse se utiliza para generar predicciones del precio de cierre de
un activo durante los próximos 30 días a partir de datos históricos del último
año. El entrenamiento se realiza bajo demanda cada vez que el usuario solicita
la predicción. La salida incluye tanto el valor estimado como intervalos de
confianza del 80% y 95%. Además, se calcula el error MAPE utilizando un pequeño
subconjunto de validación para ofrecer una referencia aproximada sobre la
precisión esperada del modelo.

=== Bases de datos relacionales y SQLAlchemy

*PostgreSQL* @postgresql2026 es un sistema gestor de bases de datos relacional
de código abierto muy utilizado por su estabilidad, robustez y cumplimiento de
estándares. Para interactuar con la base de datos desde Python se empleó
*SQLAlchemy* @sqlalchemy2026, un ORM que permite trabajar con objetos Python en
lugar de escribir directamente sentencias SQL. Esto hace que el desarrollo
resulte más cómodo y ayuda a reducir errores.

La base de datos de FinancialPulse incluye las tablas `usuario`, `cartera`,
`transaccion`, `favorito` y `reset_token`. El esquema se encuentra normalizado
hasta tercera forma normal (3FN), evitando redundancias y manteniendo la
integridad de los datos almacenados. Esta parte de la implementación se detalla
con más profundidad en el Capítulo 5, sección 5.6.

=== Contenedores Docker y despliegue

*Docker* @docker2026 es una tecnología de virtualización ligera que permite
empaquetar una aplicación junto con todas sus dependencias dentro de
contenedores aislados. Esto simplifica mucho el despliegue y evita problemas
relacionados con diferencias entre entornos de desarrollo y producción.

En el proyecto se preparó un archivo `docker-compose.yml` encargado de definir
los tres servicios principales de la aplicación: la base de datos PostgreSQL, el
backend desarrollado con Flask y el frontend Angular. Gracias a ello, la
aplicación completa puede iniciarse con un único comando `docker-compose up`,
sin necesidad de instalar manualmente herramientas como Python @python2026,
Node.js @nodejs2026 o PostgreSQL @postgresql2026.

=== Internacionalización (i18n) y tooltips dinámicos

La internacionalización permite adaptar una aplicación a distintos idiomas y
regiones sin modificar el código fuente principal. En FinancialPulse se
implementó un `TranslatePipe` propio basado en diccionarios incrustados, uno en
español y otro en inglés. El pipe recibe una clave, por ejemplo `"login.title"`,
y devuelve automáticamente la traducción correspondiente según el idioma
almacenado en `localStorage`.

Además, se desarrolló una directiva `TooltipDirective` que muestra información
adicional al pasar el cursor sobre determinados elementos de la interfaz, como
indicadores técnicos o botones concretos. Los tooltips también se encuentran
traducidos y la directiva calcula automáticamente la posición más adecuada para
evitar que el contenido se salga de la pantalla.

=== Cumplimiento normativo (RGPD)

El Reglamento General de Protección de Datos (RGPD) @rgpd2016 establece una
serie de obligaciones para las aplicaciones que manejan información personal de
usuarios dentro de la Unión Europea. Para cumplir con algunos de los derechos
más importantes definidos por el reglamento, FinancialPulse incorpora distintas
funcionalidades relacionadas con la gestión de datos personales.

Entre ellas destacan:

- *Derecho de acceso y portabilidad*: el usuario puede exportar todos sus datos,
  incluyendo información de perfil, transacciones y favoritos, en formato JSON.

- *Derecho de supresión (derecho al olvido)*: el usuario tiene la posibilidad de
  eliminar completamente su cuenta, provocando el borrado en cascada de toda la
  información asociada, como cartera, transacciones, favoritos y tokens de
  recuperación.
