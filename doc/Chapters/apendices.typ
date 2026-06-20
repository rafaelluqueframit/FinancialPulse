= Apéndices

== A. Manual de usuario

Este manual explica las principales funcionalidades de FinancialPulse pensando
en un usuario final que sabe navegar por la web pero no tiene por qué conocer
finanzas a fondo.

=== A.1. Requisitos previos

- Un navegador actual (Chrome, Firefox, Edge, Safari).
- Conexión a Internet (para los datos en tiempo real y las noticias).
- Si quieres desplegarlo en local: Docker y Docker Compose.

=== A.2. Registro e inicio de sesión

1. Ve a la página principal.
2. Haz clic en *Registrarse* y rellena el formulario (nombre, email, contraseña;
  mínimo 6 caracteres).
3. Una vez registrado, inicia sesión con tus credenciales.
4. El sistema te crea automáticamente una cartera virtual con 10.000 USD de
  saldo inicial.

#figure(
  image("../Figures/Template/Apendices/mockup_login.png", width: 100%),
  caption: [Pantalla de inicio de sesión.],
) <fig:ap_login>

#figure(
  image("../Figures/Template/Apendices/mockup_register.png", width: 100%),
  caption: [Pantalla de registro de nuevo usuario.],
) <fig:ap_register>

=== A.3. Página principal (Home)

Una vez dentro, la página de inicio te muestra:

- Barra de navegación arriba, con enlaces a las secciones y selector de idioma.
- Un resumen de índices (S&P 500, IBEX 35, Dow Jones, Nasdaq) con su precio y
  variación.
- Las últimas noticias destacadas.
- Un resumen rápido de tu cartera (saldo, beneficio) y un enlace a la página de
  cartera.
- La lista de tus últimas transacciones.

#figure(
  image("../Figures/Template/Apendices/mockup_home.png", width: 100%),
  caption: [Página principal (Home) con resumen de índices y noticias.],
) <fig:ap_home>

=== A.4. Búsqueda y análisis de activos

La funcionalidad principal es analizar activos. Así se hace:

1. En el buscador central, escribe el nombre o símbolo de un activo (por
  ejemplo, "Apple", "AAPL", "Bitcoin", "EUR/USD").
2. Aparecerán sugerencias; selecciona una para ir al dashboard.
3. El dashboard tiene varias pestañas:

  - *Resumen*: principales indicadores (apertura, máximo, mínimo, variación) y
    una tabla con el rendimiento en 1 semana, 1 mes y 3 meses.
  - *Gráficas*: gráfico interactivo (velas o líneas) con selector de período
    (1d, 5d, 1m, 3m, 6m, 1y, 5y, max). Puedes hacer zoom y descargar la imagen.
  - *Análisis técnico*: indicadores (SMA20, SMA50, RSI, MACD, Bollinger,
    estocástico), recomendación (Comprar/Vender/Mantener) con nivel de
    confianza, backtesting del cruce SMA 20/50 y niveles de soporte/resistencia.
  - *Noticias y sentimiento*: noticias del activo, cada una con su sentimiento
    (positivo/neutral/negativo) y un gráfico circular resumen.
  - *Datos históricos*: tabla con fechas, precios de apertura, máximo, mínimo,
    cierre y volumen. Puedes filtrar por fechas.
  - *Fundamental*: datos de la empresa (capitalización, PER, beneficio por
    acción, dividendos, etc.).

4. Además, desde esta pantalla puedes marcar el activo como favorito (estrella),
  comprar o vender acciones (botones que abren un modal, solo si has iniciado
  sesión).

#figure(
  image("../Figures/Template/Apendices/mockup_dashboard.png", width: 100%),
  caption: [Dashboard de un activo (ejemplo: Apple Inc.).],
) <fig:ap_dashboard>

=== A.5. Cartera virtual

En el menú superior, entra en "Cartera". Aquí ves:

- Una tarjeta con tu saldo actual, total depositado, total retirado y beneficio
  no realizado.
- Un gráfico de líneas con la evolución de tu balance (puedes seleccionar
  período: 1 semana, 1 mes, 3 meses, 1 año).
- Un gráfico de tarta con la composición de tu cartera (qué porcentaje
  representa cada activo).
- Una tabla con las transacciones recientes (ordenadas por fecha) y paginación.

También puedes añadir o retirar dinero virtual para hacer pruebas.

#figure(
  image("../Figures/Template/Apendices/mockup_portfolio.png", width: 100%),
  caption: [Página de cartera virtual.],
) <fig:ap_portfolio>

=== A.6. Favoritos

En cualquier dashboard, haz clic en la estrella para añadir o quitar un activo
de favoritos. La página "Favoritos" lista todos los que hayas marcado,
mostrando:

- Símbolo y nombre.
- Precio actual y cambio diario.
- Un botón "Ver detalle" para ir al dashboard.

#figure(
  image("../Figures/Template/Apendices/mockup_favorites.png", width: 100%),
  caption: [Página de favoritos.],
) <fig:ap_favorites>

=== A.7. Noticias y análisis de sentimiento

En la página "Noticias" puedes buscar por palabra clave (por ejemplo,
"tecnología", "bitcoin", "inflación"). Al buscar:

- Aparece un gráfico circular con el resumen del sentimiento de las noticias
  encontradas.
- Cada resultado se muestra como una tarjeta con título, fuente, fecha y un
  icono que indica el sentimiento. Si haces clic en la tarjeta, se abre la
  noticia original en otra pestaña.

#figure(
  image("../Figures/Template/Apendices/mockup_news.png", width: 100%),
  caption: [Página de noticias con análisis de sentimiento.],
) <fig:ap_news>

=== A.8. Configuración del perfil y RGPD

En el menú de usuario, selecciona "Perfil". Desde aquí puedes:

- Cambiar tu nombre y email.
- Cambiar la contraseña (necesitas la actual).
- Exportar todos tus datos a un archivo JSON (para llevar tus datos a otra
  parte).
- Eliminar la cuenta permanentemente (pide confirmación doble; se borran
  cartera, transacciones, favoritos y tokens).

#figure(
  image("../Figures/Template/Apendices/mockup_profile.png", width: 100%),
  caption: [Página de perfil de usuario.],
) <fig:ap_profile>

=== A.9. Ayuda integrada

En el menú "Ayuda" hay tres páginas: "Análisis técnico", "Cartera virtual" y
"Noticias". Explican cómo funciona cada sección, qué significan los indicadores
y cómo interpretar las predicciones y el sentimiento. Están traducidas a ambos
idiomas.

#figure(
  image("../Figures/Template/Apendices/mockup_help.png", width: 100%),
  caption: [Página de ayuda (ejemplo: Análisis técnico).],
) <fig:ap_help>

== B. Vista del sitio web (Back-end)

FinancialPulse no tiene un panel de administración gráfico, pero el backend
expone una API REST. Puedes consultarla con herramientas como *Thunder Client*
(extensión de VSCode). Durante el desarrollo hice pruebas con endpoints como
`/api/register`, `/api/dashboard`, `/api/accion` y `/api/recommendation`. Los
administradores también pueden conectarse directamente a la base de datos
PostgreSQL si necesitan hacer consultas o mantenimiento.

La siguiente imagen muestra una petición GET a `/api/dashboard/AAPL` con Thunder
Client, que devuelve un JSON con datos históricos, predicción, noticias con
sentimiento e información fundamental.

#figure(
  image("../Figures/Template/Apendices/thunder_client.png", width: 100%),
  caption: [Ejemplo de petición a la API con Thunder Client.],
) <fig:ap_thunder_client>

La lista completa de endpoints está en la tabla de la sección 5.2 (capítulo 5).
Para más detalles, consulta el código fuente en GitHub.

== C. Tableros de gestión de proyectos con Trello

Para seguir el desarrollo usé Trello, adaptando Scrum a un único desarrollador.
Hice 5 sprints de 4 semanas cada uno. Aquí están las capturas de los tableros
Kanban con las tareas de cada sprint.

#figure(
  image("../Figures/Template/Apendices/trello_sprint1.png", width: 100%),
  caption: [Tablero del Sprint 1 (configuración inicial y autenticación).],
) <fig:ap_trello1>

#figure(
  image("../Figures/Template/Apendices/trello_sprint2.png", width: 100%),
  caption: [Tablero del Sprint 2 (integración con Yahoo Finance y gráficos).],
) <fig:ap_trello2>

#figure(
  image("../Figures/Template/Apendices/trello_sprint3.png", width: 100%),
  caption: [Tablero del Sprint 3 (indicadores, predicción y sentimiento).],
) <fig:ap_trello3>

#figure(
  image("../Figures/Template/Apendices/trello_sprint4.png", width: 100%),
  caption: [Tablero del Sprint 4 (cartera virtual y backtesting).],
) <fig:ap_trello4>

#figure(
  image("../Figures/Template/Apendices/trello_sprint5.png", width: 100%),
  caption: [Tablero del Sprint 5 (internacionalización, RGPD, pruebas y
    documentación).],
) <fig:ap_trello5>

== D. Manual técnico de despliegue con Docker

Este manual explica cómo montar la aplicación completa (backend + frontend +
base de datos) usando contenedores Docker.

=== D.1. Requisitos previos

- Tener instalados *Docker* y *Docker Compose*.
- (Opcional) Git para clonar el repositorio.

=== D.2. Clonar el repositorio

```bash
git clone https://github.com/rafaelluqueframit/FinancialPulse.git
cd FinancialPulse
```
=== D.3. Configurar variables de entorno

Crea un archivo .env en la raíz del proyecto (junto al docker-compose.yml) con
este contenido:

#figure(
  ```env
    NEWS_API_KEY=tu_clave_de_newsapi,
  SECRET_KEY=clave_secreta_aleatoria
  ```,
  caption: [Archivo `.env` de ejemplo.],
) <code:env_dotenv>

- `NEWS_API_KEY`: necesaria para las noticias. La obtienes registrándote en
  https://newsapi.org.
- `SECRET_KEY`: clave secreta para las sesiones de Flask. Puedes generarla con
  `openssl rand -hex 32` o cualquier cadena aleatoria.

Si no pones `NEWS_API_KEY`, el módulo de noticias dará error controlado, pero el
resto funcionará.

=== D.4. Construir y ejecutar con Docker Compose

Ejecuta desde la raíz del proyecto:

#figure(
  ```bash
  docker-compose up --build
  ```,
  caption: [Comando para construir y levantar los contenedores.],
) <code:docker_build>

Este comando:
- Construye las imágenes de los tres servicios: `db` (PostgreSQL), `backend`
  (Flask) y `frontend` (Angular).
- Levanta los contenedores y muestra los logs en la terminal.
- El frontend estará en `http://localhost`.
- El backend en `http://localhost:5000`.
- La base de datos en `localhost:5432` (solo para desarrollo).

Para ejecutar en segundo plano (modo detach):

```bash
docker-compose up --build -d
```

=== D.5. Detener los contenedores

- Sin borrar los datos (la base de datos persistirá):
```bash
docker-compose down
```
- Borrando también los volúmenes (se pierden los datos de la BD):
```bash
docker-compose down -v
```

=== D.6. Acceso a la base de datos

Para conectarte directamente a PostgreSQL dentro del contenedor:

```bash
docker exec -it FinancialPulse-db-1 psql -U postgres -d financial_pulse_db
```

La contraseña está en el archivo docker-compose.yml. En producción se recomienda
cambiarla por una segura.

=== D.7. Compartición pública con ngrok

Para que cualquier persona pueda acceder a la aplicación sin necesidad de
instalar nada, se ha utilizado ngrok. Esta herramienta crea un túnel seguro
desde el puerto local de la aplicación hasta una URL pública HTTPS. La URL es
estable y no cambia al reiniciar el túnel, siempre que se use la misma cuenta de
ngrok.

La URL pública de FinancialPulse durante las pruebas ha sido:

https://subtext-anteater-consoling.ngrok-free.dev

Para acceder, simplemente hay que abrir esta dirección en cualquier navegador.
La aplicación puede ejecutarse de dos formas:

- *Con Docker*: _docker-compose up --build_ (la aplicación estará en
  http://localhost).

- *Sin Docker*: backend con _python app.py_ y frontend con _ng serve --host
  0.0.0.0_ _--port 4200_.

A continuación se muestra un código QR que dirige directamente a la URL pública,
para facilitar el acceso desde dispositivos móviles:

#figure(
  image("../Figures/Template/Apendices/qr.png", width: 70%),
  caption: [Código QR de acceso a la URL pública de FinancialPulse.],
) <fig:qr>

== E. Código fuente

El código completo está en GitHub:

#figure(
  ```bash
    https://github.com/rafaelluqueframit/FinancialPulse
  ```,
  caption: [Repositorio del proyecto.],
) <code:github>

La estructura es:

- `frontend/`: aplicación Angular (TypeScript, componentes, servicios,
  directivas, pipes, modelos).
- `backend/`: aplicación Flask con `app.py`, modelos SQLAlchemy, funciones
  auxiliares y Dockerfile.
- `doc/`: memoria en Typst (capítulos, figuras, bibliografía).
- `docker-compose.yml`: orquestación de los tres servicios.
- `.gitignore`: archivos ignorados por Git.

Para clonarlo y trabajar en local:

```bash
git clone https://github.com/rafaelluqueframit/FinancialPulse.git
cd FinancialPulse
```

== F. Enlaces de interés y recursos

- Repositorio de GitHub: https://github.com/rafaelluqueframit/FinancialPulse

- Vídeo explicativo de la aplicación subido a YouTube:
  https://youtu.be/nQdJkLslpP0
Muestra un recorrido por todas las funcionalidades.

- Documentación de APIs externas:

  - Yahoo Finance (yfinance): https://finance.yahoo.com/lookup

  - NewsAPI: https://newsapi.org/docs/endpoints/everything

- Documentación de herramientas y librerías:

  - Angular: https://angular.io/docs

  - Flask: https://flask.palletsprojects.com/

  - PostgreSQL: https://www.postgresql.org/docs/

  - Docker: https://docs.docker.com/

  - Prophet: https://facebook.github.io/prophet/docs/quick_start.html

  - FinBERT: https://huggingface.co/ProsusAI/finbert

  - Typst: https://typst.app/docs

- La plantilla de la memoria está basada en la proporcionada por la UGR,
  modificada para adaptarla al proyecto.

Toda la documentación adicional (diagramas de secuencia, capturas originales,
archivos de configuración, etc.) está en la carpeta doc/Figures/ del
repositorio, o se puede solicitar al autor.
