= Estado del arte

Antes de ponerme a diseñar FinancialPulse, dediqué un tiempo a mirar qué otras
herramientas similares existían ya en el mercado. Quería hacerme una idea de qué
soluciones están disponibles, qué ofrecen exactamente y, sobre todo, en qué
aspectos se quedan cortas. Este análisis previo me pareció importante porque
ayuda a justificar la propuesta del proyecto y a detectar oportunidades de
mejora reales.

Lo que busco no es solo hacer una lista de competidores, sino entender por qué
una plataforma nueva podría tener sentido incluso cuando ya hay varias muy
consolidadas.

== Aplicaciones similares

A continuación describo algunas de las plataformas más representativas que
analicé durante este estudio. Me centré en las más conocidas y en las que más se
acercan, aunque sea parcialmente, a lo que pretendía construir.

=== Yahoo Finance

Yahoo Finance @yahoo-finance es una de las plataformas más veteranas y conocidas
en el mundo de las finanzas. Lleva muchísimos años ofreciendo datos en tiempo
real de acciones, índices, divisas y criptomonedas. También incluye noticias,
gráficos básicos y algunos indicadores técnicos como medias móviles o RSI. La
versión gratuita es bastante completa, aunque existe una modalidad de pago
(Premium) con algunas funcionalidades adicionales. En el siguiente enlace se
puede acceder a su página web:
https://es.finance.yahoo.com/

En términos generales, comparte con FinancialPulse la posibilidad de consultar
datos de mercado en tiempo real y visualizar gráficos históricos. Sin embargo,
presenta varias limitaciones importantes. Para empezar, no dispone de una
cartera virtual para simular inversiones sin dinero real. Tampoco incluye
análisis de sentimiento de noticias (sería interesante, pero no lo tiene).
Además, sus capacidades de predicción son muy básicas, o prácticamente
inexistentes si hablamos de modelos de machine learning. Y por si fuera poco, no
ofrece una gestión de favoritos avanzada ni una internacionalización completa
pensada en el usuario.

=== Investing.com

Investing.com @investing es otra plataforma muy popular, utilizada por millones
de personas. Destaca sobre todo por la enorme cantidad de activos que cubre, sus
gráficos interactivos bastante completos y una sección de noticias y calendario
económico muy extensa. Tiene una versión gratuita con publicidad y una versión
Pro de pago con más funcionalidades. En el siguiente enlace se puede acceder a
su página web:
https://www.investing.com/

Se parece a FinancialPulse en que ofrece datos en tiempo real y muchos
indicadores técnicos. Pero también tiene carencias importantes. Por ejemplo, no
permite hacer una simulación completa de cartera (como comprar y vender con
saldo ficticio de forma realista). Tampoco incorpora análisis de sentimiento
sobre noticias, y sus predicciones se basan sobre todo en opiniones de
analistas, no en modelos estadísticos ni de aprendizaje automático. Además, la
cantidad de información que muestra puede llegar a ser abrumadora para alguien
que está empezando. Es una herramienta potente, pero no demasiado amigable para
novatos.

=== TradingView

TradingView es una de las herramientas favoritas entre los traders más técnicos,
sobre todo por la calidad de sus gráficos y por lo personalizables que son.
Cuenta con una comunidad muy activa que comparte estrategias y scripts mediante
Pine Script, su propio lenguaje de programación. El modelo de negocio es
freemium: la versión gratuita es útil pero limitada, y hay varios planes de
pago. En el siguiente enlace se puede acceder a su página web:
https://www.tradingview.com/

Coincide con FinancialPulse en la presencia de indicadores técnicos avanzados y
en la posibilidad de hacer backtesting de estrategias (aunque con ciertas
restricciones según el plan contratado). Sin embargo, no incluye una cartera
virtual completa, ni análisis de sentimiento de noticias, ni predicciones
automáticas basadas en machine learning. La curva de aprendizaje puede ser
bastante elevada si no tienes experiencia previa, y la versión gratuita se queda
muy justa para según qué cosas.

=== Bloomberg Terminal

La Bloomberg Terminal @bloomberg es el estándar de oro en el sector financiero
profesional. Es la herramienta que usan los grandes fondos de inversión, bancos
de inversión y profesionales del sector. Ofrece datos en tiempo real, análisis
fundamental y técnico, noticias, mensajería entre usuarios y un montón de
herramientas avanzadas. El problema es su precio: es carísima, completamente
fuera del alcance de un estudiante o de un inversor particular.

Aunque comparte con FinancialPulse el enfoque en análisis financiero y datos en
tiempo real, está orientada a un entorno profesional muy exigente. No tiene un
modo de simulación como tal (está pensada para operar con dinero real), su
interfaz es compleja y no incorpora análisis de sentimiento basado en
inteligencia artificial. Vamos, que es una nave espacial cuando lo que necesitas
es un coche normal.

=== eToro

eToro @etoro es una plataforma de trading social que se ha hecho muy popular.
Permite invertir en acciones, criptomonedas y otros activos, pero su
característica más diferencial es el copy trading: puedes copiar automáticamente
las operaciones de otros inversores. También ofrece una cuenta demo con dinero
virtual para practicar sin riesgo.

La similitud con FinancialPulse está sobre todo en la posibilidad de operar con
dinero ficticio. Sin embargo, eToro no ofrece un análisis técnico profundo, no
incorpora predicciones basadas en modelos estadísticos ni análisis de
sentimiento de noticias. Además, no permite exportar todos tus datos personales
de forma completa (al menos no de manera sencilla) y está más enfocada al
trading social que al análisis educativo o técnico.

=== Robinhood

Robinhood @robinhood es una aplicación de inversión muy famosa en Estados
Unidos, sobre todo por su simplicidad y por la ausencia de comisiones. Permite
comprar y vender acciones, ETFs y criptomonedas con una interfaz bastante
intuitiva. El problema es que apenas está disponible fuera de EE. UU. y sus
herramientas de análisis técnico son muy limitadas.

En comparación con FinancialPulse, comparte la idea de una interfaz sencilla y
accesible. Pero no incluye simulación con dinero ficticio, ni análisis de
sentimiento, ni predicciones, ni herramientas avanzadas de análisis técnico.
Tampoco contempla funcionalidades relacionadas con la exportación de datos
personales o el cumplimiento del RGPD. Es una app muy simple para empezar, pero
se queda corta si quieres algo más que comprar y vender.

== Resumen comparativo

Para sintetizar las diferencias entre las plataformas analizadas, la Tabla 3.1
presenta una comparación visual de las funcionalidades más relevantes. Así se
puede identificar rápidamente qué cubre cada alternativa y en qué destaca
FinancialPulse.

#figure(
  table(
    columns: (2.8cm, 1fr, 1fr, 1fr, 1fr, 1fr, 1fr, 1fr),
    inset: 6pt,
    align: (left, center, center, center, center, center, center, center),
    [#strong[Plataforma]],
    [#strong[Tiempo real]],
    [#strong[Análisis técnico]],
    [#strong[Predicción]],
    [#strong[Sentimiento]],
    [#strong[Cartera virtual]],
    [#strong[I18n]],
    [#strong[RGPD]],

    [Yahoo Finance], [✓], [△], [✗], [✗], [✗], [△], [✗],
    [Investing.com], [✓], [✓], [✗], [✗], [✗], [△], [✗],
    [TradingView], [✓], [✓], [✗], [✗], [✗], [△], [✗],
    [Bloomberg Terminal], [✓], [✓], [✗], [✗], [✗], [△], [△],
    [eToro], [✓], [△], [✗], [✗], [✓], [△], [△],
    [Robinhood], [✓], [✗], [✗], [✗], [✗], [✗], [✗],
    [*FinancialPulse*], [✓], [✓], [✓], [✓], [✓], [✓], [✓],
  ),
  caption: "Comparativa de funcionalidades entre plataformas similares",
)<tabla:comparativa>


#text(size: 8pt)[Leyenda: ✓ = sí, △ = parcial o limitado, ✗ = no.]

La lectura de la tabla deja ver que varias plataformas cubren una parte de las
necesidades, pero ninguna reúne todo en una sola propuesta. FinancialPulse se
diferencia precisamente por integrar en un mismo entorno datos en tiempo real,
análisis técnico, predicción, sentimiento, cartera virtual, internacionalización
y cumplimiento del RGPD.

== Conclusiones del estado del arte

Del análisis realizado se pueden extraer varias conclusiones importantes:

1. *Falta de integración*: no existe una plataforma gratuita que combine en un
  mismo entorno datos en tiempo real, análisis técnico avanzado, predicción de
  precios, análisis de sentimiento, cartera virtual, internacionalización y
  cumplimiento del RGPD.

2. *Barreras económicas*: las soluciones más completas, como Bloomberg Terminal,
  están orientadas exclusivamente a profesionales y resultan inalcanzables para
  estudiantes o usuarios particulares. El dinero no debería ser un obstáculo
  para aprender.

3. *Complejidad de uso*: plataformas como TradingView o Investing.com ofrecen
  muchas funcionalidades, pero su densidad de información puede desorientar a
  usuarios principiantes. A veces menos es más.

4. *Ausencia de simulación completa*: aunque hay opciones con cuentas demo,
  pocas ofrecen una cartera virtual integrada con funcionalidades de análisis
  avanzado. La mayoría se quedan en un seguimiento básico.

5. *Falta de análisis de sentimiento*: ninguna de las plataformas estudiadas
  incorpora análisis automático de noticias mediante modelos de lenguaje o
  inteligencia artificial. Es una funcionalidad que me parecía interesante y que
  nadie ofrecía de forma integrada.

6. *Limitaciones en privacidad y RGPD*: pocas herramientas permiten exportar o
  eliminar completamente los datos personales del usuario de forma sencilla. Eso
  es un problema si te tomas en serio la privacidad.

7. *Internacionalización incompleta*: aunque algunas plataformas soportan varios
  idiomas, pocas ofrecen una experiencia completamente adaptada con traducciones
  dinámicas y elementos explicativos contextualizados. Los tooltips traducidos,
  por ejemplo, son algo que apenas se ve.

== Aportación de FinancialPulse

A partir de todas estas carencias, FinancialPulse se plantea como una
alternativa que intenta integrar varias funcionalidades en una única plataforma,
sin renunciar a la facilidad de uso:

- *Gratuita y de código abierto*: disponible públicamente con licencia MIT, para
  que cualquiera pueda usarla, estudiarla o modificarla.
- *Enfoque educativo y accesible*: interfaz sencilla, acompañada de tooltips y
  páginas de ayuda que explican los conceptos básicos.
- *Plataforma integral*: combina datos en tiempo real, indicadores técnicos,
  predicción con Prophet, análisis de sentimiento, cartera virtual, favoritos,
  noticias, internacionalización completa y cumplimiento del RGPD.
- *Despliegue sencillo*: mediante contenedores Docker, para que cualquier
  persona con conocimientos básicos pueda montar la aplicación en su propio
  equipo sin complicaciones.
- *Uso de tecnologías actuales*: modelos como Prophet, FinBERT y un modelo de
  sentimiento específico para español.

En los siguientes capítulos detallo cómo se llevó a cabo la planificación, el
diseño, la implementación y la validación de todo el sistema. El análisis del
estado del arte me sirvió para saber qué camino seguir y, sobre todo, para no
reinventar la rueda donde no hacía falta.
