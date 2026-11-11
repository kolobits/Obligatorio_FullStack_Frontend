# Planificador de Viajes — Frontend

Aplicación web para planificar viajes. El usuario registra sus viajes y, para cada uno, obtiene un itinerario por día armado a partir del clima del destino, el recorrido sugerido en un mapa, una estimación de cómo llegar desde su ciudad y, en el plan premium, los lugares de interés más cercanos.

Este repositorio contiene el frontend. Consume la API desarrollada en el Obligatorio 1 de la materia.

| | |
|---|---|
| Aplicación publicada | `<URL de Vercel>` |
| API | https://obligatorio1-fullstack.vercel.app |
| Materia | Desarrollo Full Stack integrado con IA — Universidad ORT Uruguay |
| Autores | Camilo `<apellido>`, Rodrigo Gomez |

## Contenido

1. [Stack](#stack)
2. [Puesta en marcha](#puesta-en-marcha)
3. [Estructura del proyecto](#estructura-del-proyecto)
4. [Arquitectura](#arquitectura)
5. [Funcionalidades](#funcionalidades)
6. [Decisiones de diseño](#decisiones-de-diseño)
7. [Deploy](#deploy)
8. [Uso de inteligencia artificial](#uso-de-inteligencia-artificial)

## Stack

| Capa | Herramienta | Para qué se usa |
|---|---|---|
| UI | React 19, Vite 8 | Componentes y build |
| Estado global | Redux Toolkit, React Redux | Sesión, viajes, categorías y estado de carga |
| Navegación | React Router 8 | Rutas públicas y privadas, parámetros de URL |
| Formularios | React Hook Form, Yup | Formularios controlados y validación en el cliente |
| Gráficas | Chart.js, react-chartjs-2 | Distribución de viajes por estado |
| Mapas | Leaflet, react-leaflet | Recorrido del itinerario sobre OpenStreetMap |
| Diálogos y avisos | react-modal, react-hot-toast | Confirmaciones y notificaciones |
| Estilos | Bootstrap 5, Bootstrap Icons, CSS propio | Grilla, utilidades y sistema visual de la aplicación |

Las peticiones HTTP se hacen con `fetch`. No se usa ninguna capa de abstracción sobre la API.

## Puesta en marcha

Requisitos: Node.js 20 o superior y npm.

```bash
npm install
npm run dev
```

La aplicación queda disponible en `http://localhost:5173`.

### Variables de entorno

El frontend necesita una sola variable, definida en un archivo `.env` en la raíz del proyecto:

```
VITE_API_BASE_URL=https://obligatorio1-fullstack.vercel.app
```

Vite expone al código únicamente las variables con prefijo `VITE_`. Esta variable no es secreta: la URL de la API queda incluida en el build y es visible desde el navegador. Para apuntar a una API local alcanza con cambiar el valor, por ejemplo `http://localhost:3000`.

### Scripts

| Comando | Qué hace |
|---|---|
| `npm run dev` | Servidor de desarrollo con recarga en caliente |
| `npm run build` | Genera la versión de producción en `dist/` |
| `npm run preview` | Sirve `dist/` en local para revisar el build |
| `npm run lint` | Corre ESLint sobre el proyecto |

## Estructura del proyecto

```
src/
├── App.jsx                     Rutas, Provider de Redux, spinner y toaster globales
├── App.css                     Variables de diseño y estilos compartidos
├── main.jsx                    Punto de entrada
├── store/
│   ├── store.js                configureStore con los cuatro slices
│   └── slices/
│       ├── usuarioSlice.js     Token y perfil del usuario
│       ├── viajesSlice.js      Lista paginada, filtros, página actual y total
│       ├── categoriasSlice.js  Categorías disponibles
│       └── spinnerSlice.js     Contador de cargas pendientes del spinner global
└── componentes/
    ├── auth/                   Login, registro y panel ilustrativo
    ├── layout/                 Navbar con Outlet (contenedor de las rutas privadas)
    ├── viajes/                 Dashboard: encabezado, gráfica, filtros, lista, paginación y formulario
    ├── detalle/                Detalle del viaje: pase, itinerario, clima, cómo llegar, lugares cerca
    ├── mapa/                   Mapa del recorrido y utilidades de Leaflet
    ├── perfil/                 Foto de perfil, informe de uso y cambio de plan
    ├── categorias/             ABM de categorías (solo administradores)
    ├── comunes/                Spinner global y modal de confirmación
    └── cargando/               Botón con estado de carga y animación del avión
```

Cada carpeta de componentes agrupa sus estilos en `styles/` y sus esquemas de Yup en `validations/`.

## Arquitectura

### Rutas

| Ruta | Componente | Acceso |
|---|---|---|
| `/` | `Login` | Pública. Si ya hay sesión redirige a `/dashboard` |
| `/registro` | `Registro` | Pública |
| `/dashboard` | `Dashboard` | Privada |
| `/viajes/nuevo` | `FormViaje` | Privada |
| `/viajes/:id` | `ViajeDetalle` | Privada |
| `/viajes/:id/editar` | `FormViaje` | Privada |
| `/perfil` | `Perfil` | Privada |
| `/categorias` | `Categorias` | Privada |

Las rutas privadas están anidadas bajo una ruta sin `path` cuyo elemento es `Navbar`. `Navbar` renderiza la barra, un `<Outlet />` para la ruta hija y, al montarse, verifica que exista un token en `localStorage`; si no existe, o si la API lo rechaza, limpia la sesión y vuelve al login. `FormViaje` sirve tanto para crear como para editar: distingue el caso por la presencia del parámetro `id`.

### Estado global

Redux concentra la información que comparten varios componentes:

- `usuario`: el token (inicializado desde `localStorage`) y el perfil, que incluye el plan, el rol y la URL del avatar. Lo leen la barra, el perfil, el encabezado del dashboard y las pantallas que dependen del plan.
- `viajes`: la página actual de viajes, los filtros activos, el número de página, el total y la cantidad global de viajes del usuario. Los filtros y la paginación despachan acciones; la lista reacciona a esos cambios con un `useEffect` que vuelve a consultar la API. Al eliminar un viaje se incrementa un contador de recargas para que la página actual se vuelva a pedir y no quede un hueco.
- `categorias`: la lista completa, cargada una vez al iniciar sesión. El formulario de viaje la usa para el selector y las tarjetas para mostrar el nombre.
- `spinner`: un contador de cargas pendientes. Cada petición larga despacha `mostrarSpinner` al empezar y `ocultarSpinner` al terminar; el overlay se muestra mientras el contador sea mayor a cero. Así, cuando el detalle carga el viaje y el itinerario en paralelo se ve un único spinner.

El estado que pertenece a una sola pantalla (el viaje en el detalle, el resultado de la distancia, si un modal está abierto) se mantiene local con `useState`.

### Comunicación con la API

Todas las peticiones envían el token en la cabecera `Authorization`. La URL base sale de `import.meta.env.VITE_API_BASE_URL`. Los errores de red se capturan en cada petición y se informan en la interfaz, ya sea en el propio formulario o con una notificación.

| Pantalla | Endpoints |
|---|---|
| Registro y login | `POST /v1/auth/signup`, `POST /v1/auth/login` |
| Barra de navegación | `GET /v1/usuarios/perfil`, `GET /v1/categorias` |
| Dashboard | `GET /v1/viajes` (paginado y filtrado), `DELETE /v1/viajes/:id` |
| Formulario de viaje | `GET /v1/viajes/:id`, `POST /v1/viajes`, `PUT /v1/viajes/:id`, `POST /v1/uploads` |
| Detalle del viaje | `GET /v1/viajes/:id`, `GET /v1/viajes/:id/clima`, `GET /v1/viajes/:id/distancia`, `GET /v1/viajes/:id/puntos-interes` |
| Perfil | `POST /v1/uploads`, `PUT /v1/usuarios/avatar`, `PUT /v1/usuarios/plan` |
| Categorías | `POST`, `PUT` y `DELETE` sobre `/v1/categorias` |

### Formularios y validación

Todos los formularios usan React Hook Form con `Controller` y un esquema de Yup como resolver, en modo `onChange`. El botón de envío queda deshabilitado mientras el formulario sea inválido y pasa a un estado de carga mientras espera la respuesta. Las reglas del cliente replican las de la API para evitar peticiones que van a fallar: largo de usuario y contraseña, formato de email, coincidencia de contraseñas, fechas coherentes, duración máxima de 30 días por viaje, presupuesto positivo y largo de las notas.

## Funcionalidades

**Cuenta.** Registro con repetición de contraseña y auto-login al terminar. Login con mensajes de error en la propia interfaz. Cierre de sesión que limpia el token y el estado de Redux para que otro usuario pueda ingresar sin ver datos ajenos.

**Viajes.** Listado paginado de a cuatro, con filtros por estado y por categoría. Cada tarjeta tiene acceso al detalle, a la edición y a la eliminación con confirmación. El alta está deshabilitada cuando un usuario del plan plus llega al límite de cuatro viajes. El formulario muestra una vista previa de la tarjeta mientras se completa y permite subir una foto de portada.

**Detalle del viaje.** Pase con los datos principales y la foto de portada. Itinerario por día: el servidor reparte los lugares de interés según el pronóstico (o el histórico de los últimos años si el viaje está lejos), deja los lugares bajo techo para los días de lluvia y acompaña con una recomendación generada por IA. Mapa del recorrido con un color por día, marcadores numerados, ruta por calle y filtro por día. Estimación de cómo llegar desde una ciudad de origen, en avión o en auto según la distancia. En el plan premium, lugares de interés cercanos ordenados por distancia.

**Perfil.** Foto de perfil subida a Cloudinary, visible también en la barra. Informe de uso: porcentaje de viajes usados para el plan plus, cantidad para el premium. Cambio de plan a premium con confirmación.

**Categorías.** Los administradores crean, editan y eliminan categorías desde una tabla; el resto de los usuarios las consulta.

**Gráfica.** Distribución de todos los viajes del usuario por estado, con un resumen numérico al lado.

## Decisiones de diseño

**Sistema visual propio sobre Bootstrap.** Bootstrap aporta la grilla, las utilidades y los controles de formulario. La identidad de la aplicación (tipografías, paleta, tarjetas con forma de pase de abordar, etiquetas de estado, estados de carga) está definida con variables CSS en `App.css` y estilos por componente. Los colores de los estados de viaje son los mismos en las etiquetas, en la gráfica y en su leyenda.

**Un solo indicador de carga.** En lugar de un spinner por componente, un `spinnerSlice` con contador y un overlay global. Las recargas silenciosas (por ejemplo, al eliminar un viaje) no lo muestran, para que la pantalla no parpadee.

**Confirmaciones y avisos.** Las acciones destructivas o irreversibles (eliminar un viaje, borrar una categoría, pasar a premium) piden confirmación en un modal. Los resultados de las acciones se comunican con notificaciones breves.

**Fechas en UTC.** Las fechas de los viajes se guardan sin hora. Para que un viaje que empieza el 1 de diciembre no se muestre como 30 de noviembre según la zona horaria del navegador, el formato se hace con `timeZone: "UTC"`.

**Mapa con OpenStreetMap.** Se usan los tiles públicos de OpenStreetMap, que no requieren clave ni cuenta.

**Imágenes.** Las fotos se suben desde el navegador a la API con `FormData`, y la API las guarda en Cloudinary. Al mostrarlas se piden a Cloudinary con un tamaño máximo, para no descargar la imagen original completa.

## Deploy

La aplicación está publicada en Vercel. Para reproducir el deploy:

1. Importar el repositorio en Vercel. Detecta Vite automáticamente (`npm run build`, salida en `dist/`).
2. En *Settings → Environment Variables* definir `VITE_API_BASE_URL` con la URL de la API.
3. El archivo `vercel.json` incluido reescribe todas las rutas a `index.html`, necesario para que React Router resuelva las rutas al recargar o entrar por URL directa.

## Uso de inteligencia artificial

Durante el desarrollo se utilizó Claude (Anthropic) como asistente. Se lo usó para:

- Revisar el código escrito por los autores.
- Proponer soluciones a problemas puntuales (por ejemplo, la recarga de la página actual al eliminar un viaje, el conteo de cargas pendientes del spinner global y la validación de duración máxima en Yup).
- Generar el primer borrador de algunos componentes de presentación y sus estilos, que luego fueron revisados y ajustados por los autores.

Todo el código generado con asistencia fue leído, probado y entendido por los autores antes de incorporarlo. La IA también interviene en la aplicación en tiempo de ejecución: la recomendación de cada itinerario la genera la API con un modelo de lenguaje (Groq) a partir del pronóstico del destino.
