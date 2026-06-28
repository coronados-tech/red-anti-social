# UnaHur Anti-Social Net — Frontend

Red social desarrollada como **Trabajo Práctico 2** de Construcción de Interfaces de Usuario (CIU).

**Stack:** React 19 + TypeScript + Vite + React Router + Bootstrap + Context API + `fetch`

**Estado:** desplegado en producción · **App:** [red-anti-social.vercel.app](https://red-anti-social.vercel.app/)

## Descripción

Frontend de **UnaHur Anti-Social Net** conectado a la API relacional del grupo (Estrategia de Persistencia). Permite registrarse, iniciar sesión con JWT, ver un feed filtrable con scroll infinito, explorar perfiles públicos, seguir usuarios, comentar, editar publicaciones, reportar contenido y gestionar el perfil propio (datos, privacidad y foto).

## Enlaces

| Recurso | URL |
| ------- | --- |
| Frontend (producción) | [https://red-anti-social.vercel.app](https://red-anti-social.vercel.app) |
| Backend (producción) | [https://red-anti-social-backend-relacional.vercel.app](https://red-anti-social-backend-relacional.vercel.app) |
| Swagger (producción) | [https://red-anti-social-backend-relacional.vercel.app/swagger](https://red-anti-social-backend-relacional.vercel.app/swagger) |
| Repo frontend | [red-anti-social](https://github.com/coronados-tech/red-anti-social) |
| Repo backend | [red-social-relacional](https://github.com/coronados-tech/red-social-relacional) |
| Swagger (local) | `http://localhost:3001/swagger` |

## API utilizada

El frontend consume la API REST del backend relacional. En local corre en `http://localhost:3001`; en producción apunta al backend desplegado en Vercel (ver tabla anterior).

### Variables de entorno

Solo se usa una variable: `VITE_API_URL` (URL base del backend, **sin barra final**).

**Desarrollo local** — copiar `.env.example` a `.env` o `.env.local`:

```bash
cp .env.example .env.local
```

```env
VITE_API_URL=http://localhost:3001
```

**Producción (Vercel)** — *Settings → Environment Variables*:

```env
VITE_API_URL=https://red-anti-social-backend-relacional.vercel.app
```

> Si `VITE_API_URL` no está definida en el build de producción, el cliente cae en `http://localhost:3001` y la app fallará para usuarios reales. Verificar que la variable esté seteada en Production y Preview.

### CORS en el backend

El backend debe permitir requests desde el origen del frontend. En producción, `CORS_ORIGIN` del backend debe incluir:

```
http://localhost:5173,http://localhost:5174,https://red-anti-social.vercel.app
```

Detalle de variables del backend: ver `.env.Example` en el repo relacional.

## Funcionalidades

| Vista          | Ruta                            | Descripción                                                       |
| -------------- | ------------------------------- | ----------------------------------------------------------------- |
| Home           | `/`                             | Feed paginado con filtros (texto, usuario, fechas, tags)          |
| Login          | `/login`                        | Login con email o nickname + contraseña (`POST /auth/login`)      |
| Registro       | `/registro`                     | Alta de usuario (`POST /users`)                                   |
| Detalle        | `/post/:slug`                   | Post completo, comentarios, edición, borrado (dueño) y reporte    |
| Perfil propio  | `/perfil`                       | Editar datos, privacidad y foto (protegida)                       |
| Perfil público | `/usuario/:nickname`            | Posts de un usuario, seguir/dejar de seguir                       |
| Seguidores     | `/usuario/:nickname/seguidores` | Lista de seguidores                                               |
| Siguiendo      | `/usuario/:nickname/siguiendo`  | Lista de seguidos (dejar de seguir desde acá)                    |
| Nuevo post     | `/nuevo-post`                   | Crear post + subir imágenes (protegida)                           |
| Nosotros       | `/nosotros`                     | Equipo, misión/visión y links a redes                             |
| Términos       | `/terminos`                     | Página legal                                                      |
| Privacidad     | `/privacidad`                   | Página legal                                                      |
| Contacto       | `/contacto`                     | Formulario de contacto (simulado)                                 |
| 404            | `*`                             | Página no encontrada                                              |

### Autenticación

- Login real contra `POST /auth/login` (JWT en `localStorage`)
- Sesión restaurada con `GET /auth/me` al recargar
- Logout automático ante respuestas `401`

### Feed con scroll infinito

- Home carga posts paginados con `GET /posts?page=&limit=`
- Los filtros se aplican en el cliente sobre los posts ya cargados
- Si hay filtros activos y no hay coincidencias, se invita a seguir scrolleando

### Crear post con imágenes

1. `POST /posts` con `titulo`, `description`, `user_id` y `tags`
2. Por cada archivo: `POST /posts/:id/images` con `FormData` (campo `image`)

### Imágenes y media

- Posts sin imagen muestran un placeholder (`/post-placeholder.svg`)
- `resolveMediaUrl` (`utils/mediaUrl.ts`) reescribe URLs de seed que apuntan a `localhost` hacia `VITE_API_URL`
- Imágenes en producción pueden servirse desde Vercel Blob si el backend tiene `BLOB_READ_WRITE_TOKEN`

### Reportar publicación y contacto

- **Reportar post:** modal con validación en `validacionReportePost.ts`. Por ahora es simulado (no persiste en backend).
- **Contacto:** formulario validado en `validacionContacto.ts`. Simulado (no envía email real).

## Instalación

```bash
git clone <url-del-repo>
cd red-anti-social
npm install
cp .env.example .env.local   # opcional en local
npm run dev
```

La app corre en `http://localhost:5173`.

Requisito: tener el backend relacional corriendo en el puerto configurado en `VITE_API_URL` (por defecto `3001`).

```bash
npm run build   # compilar para producción
npm run preview # vista previa del build
```

## Estructura del proyecto

```
src/
├── api/
│   ├── client.ts              # fetch, JWT, errores HTTP (singleton de token)
│   ├── auth.ts                # login, sesión
│   ├── users.ts               # usuarios, seguidores, foto de perfil
│   ├── posts.ts               # posts, tags, comentarios, imágenes
│   └── index.ts               # Facade: re-export público (importar desde '../api')
├── assets/profile.images/     # Fotos del equipo (página Nosotros)
├── constants/
│   ├── assets.ts              # Placeholder de imágenes de posts
│   └── genderOptions.ts       # Opciones de género en formularios
├── context/
│   ├── AuthContext.tsx        # Sesión del usuario + reacción a 401
│   └── ThemeContext.tsx       # Tema claro/oscuro
├── hooks/
│   ├── useAsyncData.ts        # loading/error/data para fetches puntuales
│   ├── useInfinitePosts.ts    # Scroll infinito del feed (Home)
│   └── usePostFilters.ts      # Estado compartido de filtros del feed
├── components/                # UI reutilizable
│   ├── PostFilterPanel.tsx    # Panel de filtros (Home y perfil público)
│   ├── PostCard.tsx           # Tarjeta de post (layouts feed/profile)
│   ├── PostImageCarousel.tsx  # Carrusel de imágenes en posts
│   ├── ReportPostModal.tsx    # Modal para reportar publicaciones
│   ├── UserSearch.tsx         # Búsqueda de usuarios en filtros
│   ├── UsuarioFormFields.tsx  # Campos compartidos registro/perfil
│   ├── UserFollowList.tsx     # Lista de seguidores/seguidos
│   └── ...
├── pages/                     # Una página por ruta
├── utils/
│   ├── filterPosts.ts         # Orquestador de filtros
│   ├── postFilterStrategies.ts# Strategy: un filtro por función
│   ├── mediaUrl.ts            # Resolución de URLs de imágenes (localhost → API)
│   ├── postImages.ts          # Helpers de imágenes de post
│   ├── postPath.ts            # Rutas canónicas de posts por slug
│   ├── userProfile.ts         # Rutas y carga de usuario por nickname
│   ├── validacionUsuario.ts
│   ├── validacionPost.ts
│   ├── validacionContacto.ts
│   └── validacionReportePost.ts
├── types/index.ts
└── data/integrantes.ts
public/
└── post-placeholder.svg       # Imagen por defecto para posts sin foto
```

### Patrones usados

| Patrón | Dónde | Para qué |
| ------ | ----- | -------- |
| **Facade** | `api/index.ts` | Un único punto de import para toda la API |
| **Strategy** | `postFilterStrategies.ts` | Cada criterio de filtro es una función independiente |
| **Context / Observer** | `AuthContext`, `ThemeContext` | Estado global; Auth reacciona al 401 del cliente HTTP |
| **Singleton (módulo)** | `api/client.ts` | Token JWT y callback de sesión en un solo lugar |
| **Custom hook** | `usePostFilters`, `useAsyncData`, `useInfinitePosts` | Lógica reutilizable fuera de las páginas |
| **Utilidades puras** | `validacion*.ts`, `filterPosts.ts` | Validación y filtrado testeable sin JSX |
| **Componentes presentacionales** | `PostFilterPanel`, `LegalPage`, `ProfileAvatar` | Evitar JSX duplicado |

## Integrantes

| Nombre          | Apellido           | DNI        |
| --------------- | ------------------ | ---------- |
| Rafael Alberto  | Barberi Salcedo    | 95.151.120 |
| Malena Celeste  | Fernandez Mansilla | 34.101.003 |
| Carla Andrea    | Perez              | 34.259.069 |
| Micaela Natalia | Signorello         | 38.624.940 |

## Deploy

Frontend desplegado en **Vercel** como SPA (rewrite a `/index.html` en `vercel.json`).

Backend desplegado en **Vercel** (serverless). Ambos repos se conectan vía `VITE_API_URL` + CORS.

### Pasos para (re)desplegar el frontend

1. Importar el repo desde GitHub (o push a la rama conectada)
2. Framework preset: **Vite**
3. Variable de entorno: `VITE_API_URL=https://red-anti-social-backend-relacional.vercel.app`
4. Deploy automático en cada push a la rama principal
5. Confirmar que el backend tenga la URL del frontend en `CORS_ORIGIN`

### Checklist antes de entregar

```bash
npm run build
git shortlog -sn          # deben aparecer los 4 integrantes
git log --format="%an: %s"
```

En GitHub → **Insights → Contributors** deben verse los 4 autores.

Mail de entrega: `lucas.figarola@unahur.edu.ar`  
Incluir: link al repo frontend + link a la app en producción + datos de integrantes + link al repo backend.

---

Universidad Nacional de Hurlingham — Construcción de Interfaces de Usuario
