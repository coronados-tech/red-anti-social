# UnaHur Anti-Social Net — Frontend

Red social desarrollada como **Trabajo Práctico 2** de Construcción de Interfaces de Usuario (CIU).

**Stack:** React 19 + TypeScript + Vite + React Router + Bootstrap + Context API + `fetch`

## Descripción

Frontend de **UnaHur Anti-Social Net** conectado a la API relacional del grupo (Estrategia de Persistencia). Permite registrarse, iniciar sesión con JWT, ver un feed filtrable con scroll infinito, explorar perfiles públicos, seguir usuarios, comentar, editar publicaciones, reportar contenido y gestionar el perfil propio (datos, privacidad y foto).

## API utilizada

Repo backend (relacional): [red-anti-social-backend-relacional](https://github.com/coronados-tech/red-anti-social-backend-relacional)

URL local por defecto: `http://localhost:3001`

### Variables de entorno

Copiar `.env.example` a `.env.local` para desarrollo:

```bash
cp .env.example .env.local
```

```env
VITE_API_URL=http://localhost:3001
```

En **Vercel**, configurar la misma variable en *Settings → Environment Variables*:

```
VITE_API_URL=https://tu-backend-en-produccion.com
```

### CORS en el backend

El backend debe permitir requests desde el frontend. En producción, incluir la URL de Vercel del frontend además de `http://localhost:5173`.

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
│   ├── ReportPostModal.tsx    # Modal para reportar publicaciones
│   ├── UsuarioFormFields.tsx  # Campos compartidos registro/perfil
│   ├── UserFollowList.tsx     # Lista de seguidores/seguidos
│   └── ...
├── pages/                     # Una página por ruta
├── utils/
│   ├── filterPosts.ts         # Orquestador de filtros
│   ├── postFilterStrategies.ts# Strategy: un filtro por función
│   ├── userProfile.ts         # Rutas y carga de usuario por nickname
│   ├── validacionUsuario.ts
│   ├── validacionPost.ts
│   ├── validacionContacto.ts
│   └── validacionReportePost.ts
├── types/index.ts
└── data/integrantes.ts
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

Frontend: **Vercel** (SPA con rewrite en `vercel.json`)

### Pasos en Vercel

1. Importar el repo desde GitHub
2. Framework preset: **Vite**
3. Agregar variable `VITE_API_URL` apuntando al backend desplegado
4. Deploy
5. En el backend, agregar la URL de Vercel a la lista de orígenes CORS permitidos

### Checklist antes de entregar

```bash
npm run build
git shortlog -sn          # deben aparecer los 4 integrantes
git log --format="%an: %s"
```

En GitHub → **Insights → Contributors** deben verse los 4 autores.

Mail de entrega: `lucas.figarola@unahur.edu.ar`  
Incluir: link al repo frontend + datos de integrantes + link al repo backend.

---

Universidad Nacional de Hurlingham — Construcción de Interfaces de Usuario
