= Herramientas y datos

En este capítulo se describen las herramientas de software que se usan para
desarrollar FinancialPulse, así como las fuentes de datos externas (APIs). La
idea es documentar el stack tecnológico y justificar, aunque sea brevemente, por
qué se eligió cada cosa. No es una lista exhaustiva, pero sí lo más relevante.

== Entorno de desarrollo

En esta fase no solo importaba elegir herramientas conocidas, sino también un
entorno que me permitiera desarrollar, probar y desplegar la aplicación con
cierta comodidad. Por eso se combinaron herramientas locales de trabajo, gestión
del proyecto y contenedores para reproducir el entorno de ejecución de forma más
fiel.

- *Sistema operativo*: Windows 11 como sistema principal de desarrollo y WSL2
  para trabajar con un entorno Linux sin abandonar mi equipo habitual. Esto me
  evitó tener que cambiar de sistema durante el proyecto y facilitó la prueba de
  comandos y dependencias propias de Linux. Para el despliegue final se usó
  Ubuntu 22.04, que encaja mejor con el entorno de servidor previsto.
- *Editor de código*: Visual Studio Code, acompañado de extensiones para
  Angular, Python, Tailwind CSS y Docker. Lo elegí porque ya lo conocía de otros
  proyectos, porque ofrece una buena integración con el stack usado y porque me
  permitía depurar y editar frontend y backend desde un mismo lugar.
- *Control de versiones*: Git con repositorio remoto en GitHub. Fue la opción
  natural para registrar el progreso, poder volver atrás si algo fallaba y tener
  una copia de seguridad remota del código durante todo el desarrollo.
- *Gestión del trabajo*: Trello para seguir el avance mediante tableros Kanban y
  Canva para preparar los diagramas de Gantt iniciales. Trello @trello2026 me
  ayudó a visualizar tareas pendientes, en curso y terminadas, mientras que
  Mermaid @mermaid2026 fue útil para plasmar la planificación temporal de forma
  clara en la memoria.
- *Contenedores*: Docker y Docker Compose para empaquetar la aplicación
  completa. Esta decisión permitió separar frontend, backend y base de datos,
  reproducir el despliegue en diferentes máquinas y reducir problemas de
  configuración entre entornos.

== Frontend

A continuación se detallan las herramientas y tecnologías utilizadas para el
desarrollo del frontend de FinancialPulse, junto con una breve justificación de
cada elección. La siguiente Tabla 5.1 resume las principales herramientas
empleadas:

#figure(
  table(
    columns: (1.5fr, 2.5fr),
    stroke: 1pt,
    align: center + horizon,
    inset: 4pt,
    [*Herramienta*], [*Descripción*],
    [Angular 21],
    [Framework principal para la SPA. Componentes standalone, servicios,
      inyección de dependencias, enrutador.],

    [TypeScript],
    [Lenguaje tipado que mejora la robustez y mantenibilidad del código.],

    [Tailwind CSS],
    [Framework de utilidades CSS para estilizar rápido y de forma consistente,
      responsive.],

    [ngx-echarts],
    [Librería de gráficos basada en ECharts. Útil para líneas, velas, áreas y
      gráficos circulares.],

    [RxJS],
    [Programación reactiva (Observables) para peticiones HTTP y eventos.],

    [Angular CLI],
    [Para generar componentes, servicios y gestionar la compilación.],
  ),
  caption: [Herramientas del frontend.],
) <tabla:frontend>

=== Justificación de la elección del framework

En cuanto al uso de Angular, la decisión se basó en varios factores. Podría
haber optado por React o Vue, que son opciones populares, pero Angular ofrecía
un ecosistema más integrado y una arquitectura basada en módulos y componentes
que se adaptaba bien a la complejidad del proyecto. Además, al estar escrito en
TypeScript, Angular proporcionaba una mayor robustez y mantenibilidad del
código, lo que era importante para un proyecto de esta envergadura. Aunque la
curva de aprendizaje de Angular es más pronunciada que la de React, ya tenía
experiencia previa con Angular, lo que facilitó el desarrollo sin tener que
partir de cero. En resumen, Angular se ajustaba mejor a mis necesidades y
preferencias para este proyecto específico.

- Trae un ecosistema integrado (enrutador, cliente HTTP, formularios reactivos,
  inyección de dependencias), así que no tuve que andar buscando muchas
  librerías externas.
- Al estar escrito en TypeScript, la integración es natural y el código queda
  más robusto. Menos errores tontos, vaya.
- Su arquitectura basada en módulos y componentes ayuda a organizar un proyecto
  grande como este. Cuando las cosas crecen, se agradece.
- Aunque la curva de aprendizaje es más pronunciada que en React, ya tenía
  experiencia previa con Angular, así que no partía de cero.

La Tabla 5.2 compara Angular con las alternativas más comunes:

#figure(
  table(
    columns: (1.5fr, 2.5fr, 2.5fr),
    stroke: 1pt,
    align: center + horizon,
    inset: 4pt,
    [*Característica*], [*Angular*], [*React / Vue*],
    [Ecosistema integrado],
    [Sí (router, HTTP, forms)],
    [Requiere librerías externas],

    [Lenguaje], [TypeScript], [JavaScript/TypeScript (opcional)],
    [Curva de aprendizaje], [Moderada-alta], [Baja (React) o moderada (Vue)],
    [Rendimiento], [Muy bueno], [Excelente],
    [Mantenibilidad a largo plazo], [Alta (patrón MVC)], [Variable],
  ),
  caption: [Comparativa de frameworks de frontend.],
) <tabla:comparativa_frontend>

Además de lo básico, se crearon algunos elementos personalizados que resultaron
muy útiles:

- `TranslatePipe`: un pipe de Angular para internacionalización (i18n). Usa
  diccionarios embebidos (español/inglés) y detecta el idioma desde
  `localStorage`.
- `TooltipDirective`: directiva que muestra tooltips informativos al hacer
  hover. Los tooltips se traducen automáticamente y la directiva calcula la
  posición para que no se salga de la pantalla. Pequeños detalles que mejoran
  mucho la experiencia.
- Varios servicios (`AuthService`, `AssetService`, `PortfolioService`,
  `NewsService`, etc.) que encapsulan la comunicación con el backend. Así el
  código queda más limpio y no tengo peticiones HTTP esparcidas por todos los
  componentes.

== Backend

En cuanto al backend, se optó por Flask como framework principal para la API
REST. La elección de Flask se basó en su simplicidad, flexibilidad y excelente
integración con librerías de ciencia de datos en Python, como pandas, numpy,
Prophet y transformers. Al estar escrito en Python, Flask permitió escribir
tanto la lógica de negocio como los modelos de machine learning en el mismo
lenguaje,sin necesidad de montar servicios adicionales para la comunicación
entre lenguajes. Además, Flask es un microframework que no impone una estructura
rígida, lo que facilitó añadir solo las extensiones necesarias (como SQLAlchemy
para la base de datos y Flask-Login para la gestión de sesiones) y mantener el
código despejado. Aunque Django es un framework más completo, su estructura
full-stack no se ajustaba tan bien a las necesidades específicas del proyecto, y
Node.js con Express no ofrecía la misma facilidad de integración con las
herramientas de análisis financiero y machine learning que se querían usar. En
resumen, Flask se adaptaba mejor a las necesidades y preferencias para este
proyecto específico. La siguiente Tabla 5.1 resume las principales herramientas
utilizadas en el backend:

#figure(
  table(
    columns: (1.5fr, 2.5fr),
    stroke: 1pt,
    align: center + horizon,
    inset: 4pt,
    [*Herramienta*], [*Descripción*],
    [Flask],
    [Microframework de Python para la API REST. Lo elegí por su simplicidad y
      flexibilidad.],

    [Flask-CORS], [Para permitir peticiones desde el frontend en desarrollo.],
    [Flask-Login], [Manejo de sesiones de usuario.],
    [SQLAlchemy], [ORM para interactuar con PostgreSQL.],
    [Psycopg2], [Adaptador de PostgreSQL para Python.],
    [yfinance],
    [Librería que obtiene datos financieros (históricos y en tiempo real) de
      Yahoo Finance.],

    [Transformers (Hugging Face)],
    [Para cargar los modelos de análisis de sentimiento (FinBERT y
      `bardsai/finance-sentiment-es-base`).],

    [Torch], [Backend para ejecutar los modelos de transformers.],
    [Prophet],
    [Modelo de predicción de series temporales de Facebook (Meta). Lo usé en
      Python.],

    [NumPy y Pandas], [Para procesar datos históricos y calcular indicadores.],

    [Backtesting manual],
    [Implementación propia de la estrategia de cruce de medias móviles SMA
      20/50.],

    [Flask-Mail],
    [Opcional, para el envío de correos de recuperación de contraseña (lo dejé
      preparado pero no lo configuré del todo).],
  ),
  caption: [Herramientas del backend.],
) <tabla:backend>

=== Justificación de la elección del framework web

Para el desarrollo del backend, consideré varias opciones, entre ellas Django,
Node.js con Express y Flask. Al final me decanté por Flask debido a su
simplicidad, flexibilidad y excelente integración con librerías de ciencia de
datos en Python, como pandas, numpy, Prophet y transformers. Al estar escrito en
Python, Flask permitió escribir tanto la lógica de negocio como los modelos de
machine learning en el mismo lenguaje, sin necesidad de montar servicios
adicionales para la comunicación entre lenguajes. Además, Flask es un
microframework que no impone una estructura rígida, lo que facilitó añadir solo
las extensiones necesarias (como SQLAlchemy para la base de datos y Flask-Login
para la gestión de sesiones) y mantener el código despejado. Aunque Django es un
framework más completo, su estructura full-stack no se ajustaba tan bien a las
necesidades específicas del proyecto, y Node.js con Express no ofrecía la misma
facilidad de integración con las herramientas de análisis financiero y machine
learning que se querían usar. En resumen, Flask se adaptaba mejor a las
necesidades y preferencias para este proyecto específico. La siguiente Tabla 5.4
compara Flask con las alternativas más comunes:

#figure(
  table(
    columns: (1.5fr, 2.5fr, 2.5fr),
    stroke: 1pt,
    align: center + horizon,
    inset: 4pt,
    [*Característica*], [*Flask*], [*Django*],
    [*Node.js + Express*], [Curva de aprendizaje], [Baja],
    [Moderada], [Media], [Integración con IA/Data Science],
    [Excelente (Python nativo)], [Buena], [Limitada],
    [Estructura impuesta], [Mínima (microframework)], [Alta (full-stack)],
    [Mínima], [Rendimiento], [Bueno],
    [Bueno], [Muy bueno], [Madurez / Comunidad],
    [Muy alta], [Muy alta], [Muy alta],
  ),
  caption: [Comparativa de frameworks de backend.],
) <tabla:comparativa_backend>

La posibilidad de usar Python tanto para la lógica de negocio como para los
modelos de ML fue determinante. Flask, al ser minimalista, permitió añadir solo
las extensiones que se necesitaban (SQLAlchemy, Flask-Login, etc.) y mantener el
código despejado. Además, la comunidad de Flask es muy activa y hay mucha
documentación y ejemplos disponibles, lo que facilitó el desarrollo. En resumen,
Flask se adaptaba mejor a las necesidades y preferencias para este proyecto
específico, especialmente por su integración con el ecosistema de ciencia de
datos en Python.

== Base de datos

En cuanto a la base de datos, se optó por PostgreSQL 15. Esta elección se basó
en su robustez, rendimiento y compatibilidad con SQLAlchemy. PostgreSQL es un
sistema de gestión de bases de datos relacional de código abierto que ofrece
características avanzadas como transacciones ACID, soporte para JSON, índices
avanzados y una comunidad activa. Además, PostgreSQL es ampliamente utilizado en
aplicaciones web y tiene una excelente integración con Python a través de
SQLAlchemy y Psycopg2. Aunque existen otras opciones como MySQL o SQLite,
PostgreSQL se ajustaba mejor a las necesidades del proyecto en términos de
escalabilidad, características avanzadas y facilidad de uso durante el
desarrollo. En resumen, PostgreSQL fue la opción más adecuada para gestionar los
datos de FinancialPulse debido a su robustez, rendimiento y compatibilidad con
el stack tecnológico elegido.

Se definió el esquema directamente con SQLAlchemy (no se usó Alembic, se fueron
creando las tablas manualmente desde los modelos). Las tablas principales son
`usuario`, `cartera`, `transaccion`, `favorito` y `reset_token`. El diagrama ER
se mostró en el capítulo anterior.

== APIs externas

FinancialPulse se apoya en dos APIs externas. La primera es Yahoo Finance, a
través de la librería `yfinance`, que proporciona datos históricos y en tiempo
real de acciones, criptomonedas, índices y divisas. Es la fuente principal de
datos financieros para la aplicación. Aunque no requiere una clave de API, tiene
limitaciones de tasa, lo que se manejó con una caché simple para evitar saturar
la API durante el desarrollo y las pruebas. La segunda API es NewsAPI, que se
utiliza para obtener noticias financieras en tiempo real. Esta API sí requiere
una clave gratuita, que permite hasta 100 solicitudes por día. Para no superar
este límite, se implementó una estrategia de caché y se optimizaron las
consultas para obtener solo la información necesaria. Ambas APIs fueron
fundamentales para proporcionar datos actualizados y relevantes a los usuarios
de FinancialPulse, aunque sus limitaciones de tasa requirieron una gestión
cuidadosa para garantizar una experiencia fluida. La siguiente Tabla 5.5 resume
las características de estas APIs:

#figure(
  table(
    columns: (1.2fr, 1.5fr, 2fr),
    stroke: 1pt,
    align: center + horizon,
    inset: 4pt,
    [*API*], [*Uso*], [*Limitaciones*],
    [Yahoo Finance (yfinance)],
    [Datos históricos y en tiempo real de #linebreak() acciones, criptomonedas,
      índices, divisas. Es la fuente principal.],
    [Sin clave de API, pero con #linebreak() limitaciones de tasa. Lo manejé con
      una caché simple.],

    [NewsAPI],
    [Obtención de noticias financieras en tiempo real.],
    [Requiere una clave gratuita (100 solicitudes/día).],
  ),
  caption: [APIs externas utilizadas.],
) <tabla:apis>

No se usaron datasets estáticos; todos los datos se obtienen bajo demanda. Esto
hace que la aplicación dependa de Internet, pero también que la información esté
siempre actualizada. Para el análisis de sentimiento, se usan modelos de
Transformers preentrenados (FinBERT y `bardsai/finance-sentiment-es-base`), que
se cargan localmente y no requieren conexión a una API externa. Para la
predicción de precios,se utiliza Prophet, que también se ejecuta localmente con
los datos obtenidos de Yahoo Finance.

== Herramientas de pruebas

Para asegurar que el software funcionaba, se realizaron pruebas manuales y se
usaron algunas herramientas auxiliares:

- *Frontend*: pruebas manuales durante el desarrollo, verificando la
  renderización de componentes, la funcionalidad de los servicios y la
  integración con el backend. Probé especialmente los pipes de traducción y la
  directiva de tooltip. No se implementaron pruebas unitarias automáticas por
  falta de tiempo, aunque se dejó preparada la estructura para añadirlas después
  si hiciera falta.
- *Backend*: pruebas unitarias manuales de las funciones auxiliares (cálculo de
  RSI, Prophet, análisis de sentimiento) y de los modelos SQLAlchemy. Se
  escribieron pequeños scripts en Python que llamaban a las funciones con datos
  de prueba y comprobaba los resultados directamente en consola. No usé ningún
  framework específico; era más rápido así para el volumen de pruebas que
  necesitaba.
- *API*: se usó Thunder Client (una extensión de VSCode) para probar todos los
  endpoints manualmente durante el desarrollo. Se consideró más cómodo que
  Postman, ya que no requería cambiar de aplicación y se integraba bien con el
  código. Se verificaron tanto las respuestas correctas como los casos de error
  (por ejemplo, peticiones sin autenticación, datos inválidos, etc.).

El plan de pruebas se detalla con más profundidad en el capítulo 8.

== Despliegue

Para facilitar el despliegue, se preparó un archivo `docker-compose.yml` que
levanta tres servicios:

- `db`: contenedor con PostgreSQL.
- `backend`: contenedor con Flask (código montado en volumen para desarrollo).
- `frontend`: contenedor con Angular (con `ng serve` en desarrollo o servidor
  estático en producción).

La comunicación entre contenedores se hace a través de una red interna de
Docker. El frontend accede al backend mediante `http://backend:5000` (aunque en
desarrollo local se usó un proxy de Angular para evitar problemas de CORS).

=== Dockerfile del backend

El backend se ejecuta sobre una imagen base de Python 3.10-slim. Se instalan las
dependencias (incluyendo `gfortran` y `build-essential`, que hacen falta para
compilar algunas librerías como TA-Lib, aunque al final no se usó). Luego se
copia el código y se expone el puerto 5000.

=== Archivo docker-compose.yml

El orquestador define tres servicios. La base de datos tiene un healthcheck para
asegurar que esté lista antes de que el backend intente conectarse. Los datos de
PostgreSQL se persisten en un volumen llamado `pgdata`. El backend y el frontend
montan el código local en un volumen para facilitar el desarrollo, aunque en
producción se podría cambiar esto por una imagen con el código ya incluido.

=== Puesta en marcha

Para levantar la aplicación completa, basta con ejecutar en la raíz del
proyecto:

```bash
docker-compose up --build
```

Esto construye las imágenes (si no existen) y arranca los contenedores. El
frontend queda accesible en http://localhost, el backend en
http://localhost:5000 y la base de datos en el puerto 5432. Los volúmenes hacen
que los datos de PostgreSQL persistan aunque se paren los contenedores.

En el apéndice incluyo un manual de despliegue más detallado, por si alguien
quiere montar la aplicación en su propio equipo.

=== Opciones de despliegue evaluadas y decisión final

Durante el desarrollo se exploraron varias alternativas para poner la aplicación
a disposición del tribunal de forma pública y gratuita. La primera opción
considerada fue *Render* @render2026, una plataforma PaaS que permite desplegar
aplicaciones web con facilidad. Sin embargo, tras varios intentos, la
configuración daba errores en el proceso de construcción del frontend (problemas
con la ruta de _package.json_ y el directorio de publicación), y la base de
datos gratuita se duerme tras 15 minutos de inactividad, lo que no es adecuado
para una presentación académica.

La segunda opción fue *Oracle Cloud Free Tier* @oraclecloud2026, que ofrece una
máquina virtual ARM con recursos generosos (hasta 4 OCPU y 24 GB RAM) de forma
gratuita y permanente. No obstante, al intentar crear la instancia, se recibió
el error "Out of capacity for shape VM.Standard.A1.Flex", indicando que no había
disponibilidad en la región de Madrid en ese momento. A pesar de probar con
otros availability domains y con el shape AMD alternativo, no fue posible
obtener una VM funcional.

También se valoró *GitHub Pages* @githubpages2026, pero se descartó rápidamente
porque está diseñado exclusivamente para páginas web estáticas. No puede
ejecutar un backend en Flask ni una base de datos PostgreSQL, por lo que no es
compatible con la arquitectura de FinancialPulse.

Finalmente, se optó por *ngrok* @ngrok2026, una herramienta que crea túneles
HTTPS públicos hacia un servidor local. Esta solución es gratuita (con límites
de uso mensual suficientes para una presentación), no requiere configuración
compleja, y la URL pública es estable y no cambia al reiniciar el túnel. Con
ngrok, los profesores pueden acceder a la aplicación ejecutándose en el
ordenador del desarrollador sin necesidad de instalar nada. La aplicación puede
iniciarse tanto con Docker (_docker-compose up_) como con comandos separados
para el backend (_python app.py_) y el frontend (_ng serve --host 0.0.0.0 --port
4200_).

La URL pública generada por ngrok es
https://subtext-anteater-consoling.ngrok-free.dev, que se ha incluido en el
apéndice junto con un código QR para facilitar el acceso desde dispositivos
móviles.

== Conclusión

Las herramientas que se seleccionaron permitieron cubrir todos los requisitos
del proyecto. La combinación de Angular y Flask dió un desarrollo ágil y una
separación clara de responsabilidades. yfinance y NewsAPI, aunque tienen
limitaciones de tasa, funcionaron bien para un proyecto académico. Los modelos
de Transformers y Prophet aportaron un valor añadido al análisis financiero. En
el siguiente capítulo se explica con detalle cómo se implementa cada módulo.
