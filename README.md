# Residencial Alamedas de Santa Ana - Portal Web

Este proyecto es un portal web para el residencial "Alamedas de Santa Ana" que permite mostrar información general, noticias, calendario de actividades y consulta de pagos de cuotas de mantenimiento.

## Características

- Diseño responsivo utilizando HTML5/CSS3
- Base de datos SQLite gestionada del lado del cliente
- Página inicial con información del residencial y noticias recientes
- Calendario de actividades con visualización por mes
- Sistema de consulta de estado de pagos de cuotas de mantenimiento
- Historial de pagos con filtrado por fechas

## Tecnologías Utilizadas

- HTML5
- CSS3
- JavaScript
- SQL.js (SQLite en el navegador)

## Estructura del Proyecto

```
/
├── index.html              # Página principal
├── calendario.html         # Página de calendario de actividades
├── consulta.html           # Página de consulta de pagos
├── css/
│   └── styles.css          # Estilos CSS
├── js/
│   ├── database.js         # Operaciones de base de datos
│   ├── news.js             # Funcionalidad de noticias
│   ├── calendar.js         # Funcionalidad de calendario
│   └── consulta.js         # Funcionalidad de consulta de pagos
├── lib/
│   ├── sql-wasm.js         # Biblioteca SQL.js
│   └── sql-wasm.wasm       # Archivo WASM para SQL.js
└── vercel.json             # Configuración para despliegue en Vercel
```

## Instalación y Ejecución Local

### Método 1: Usando npm scripts

1. Clona este repositorio:
   ```
   git clone https://github.com/gchinchilla-umg/dw-proyecto-uno.git
   cd dw-proyecto-uno
   ```

2. Ejecuta el script de configuración:
   ```
   npm run setup
   ```
   
   Este script descargará las dependencias necesarias e iniciará un servidor local automáticamente.

   Alternativamente, puedes iniciar el servidor directamente si ya tienes las dependencias:
   ```
   npm start
   ```

### Método 2: Configuración manual

1. Clona este repositorio:
   ```
   git clone https://github.com/gchinchilla-umg/dw-proyecto-uno.git
   cd dw-proyecto-uno
   ```

2. Crea el directorio lib y descarga SQL.js:
   ```
   mkdir -p lib
   curl -o lib/sql-wasm.js https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.8.0/sql-wasm.js
   curl -o lib/sql-wasm.wasm https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.8.0/sql-wasm.wasm
   ```

3. Inicia un servidor local:
   ```
   python -m http.server 8000
   ```

4. Abre en tu navegador:
   ```
   http://localhost:8000
   ```

## Control de Versiones

### Inicialización del Repositorio

#### Método 1: Usando npm scripts

1. Para inicializar un nuevo repositorio Git:
   ```
   npm run init-repo
   ```
   
   O si deseas configurar un repositorio remoto al mismo tiempo:
   ```
   npm run init-repo "https://github.com/usuario/repositorio.git"
   ```
   
   Este script inicializará un nuevo repositorio Git, creará un README.md básico si no existe, realizará un primer commit y configurará el repositorio remoto si se proporciona una URL.

#### Método 2: Usando Git directamente

1. Inicializa un nuevo repositorio Git:
   ```
   git init
   ```

2. Configura un repositorio remoto (opcional):
   ```
   git remote add origin https://github.com/usuario/repositorio.git
   ```

### Commits y Push

#### Método 1: Usando npm scripts

1. Para realizar un commit de tus cambios:
   ```
   npm run commit "Mensaje de commit"
   ```
   
   Este script verificará si Git está inicializado, agregará todos los archivos al staging area, realizará el commit con el mensaje proporcionado y te preguntará si deseas hacer push a origin.

#### Método 2: Usando Git directamente

1. Agrega los archivos al staging area:
   ```
   git add .
   ```

2. Realiza el commit:
   ```
   git commit -m "Mensaje de commit"
   ```

3. Haz push a origin (opcional):
   ```
   git push origin master
   ```

## Despliegue en Vercel

### Método 1: Usando npm scripts

1. Asegúrate de tener instalada la CLI de Vercel:
   ```
   npm install -g vercel
   ```

2. Inicia sesión en Vercel:
   ```
   vercel login
   ```

3. Despliega el proyecto usando el script:
   ```
   npm run deploy
   ```

### Método 2: Despliegue manual

1. Instala la CLI de Vercel:
   ```
   npm install -g vercel
   ```

2. Inicia sesión en Vercel:
   ```
   vercel login
   ```

3. Despliega el proyecto:
   ```
   vercel
   ```

4. Para producción:
   ```
   vercel --prod
   ```

## Base de Datos

El proyecto utiliza SQLite a través de SQL.js para gestionar la base de datos en el navegador. La estructura de la base de datos incluye:

- Tabla Noticias: Fecha y Noticia
- Tabla Calendario: Fecha, Título y Descripción/Nota
- Tabla Inquilino: DPI, Primer Nombre, Primer Apellido, Fecha de Nacimiento y Número de Casa
- Tabla PagoDeCuotas: Número de Casa, Año de Cuota pagada, Mes de Cuota pagada y fecha de pago

## Autores

- Guillermo Chinchilla

## Licencia

Este proyecto está bajo la Licencia MIT.
