# Galería de Arte

Red social minimalista para artistas. Permite registrarse, crear colecciones, subir obras y dar likes.

## Arquitectura

- **Frontend**: HTML, CSS y JavaScript puro
- **Backend**: Node.js con Express
- **Microservicio**: FastAPI (Python) para validación de imágenes
- **Base de datos**: MySQL

## Requisitos previos

- Node.js 18+
- Python 3.9+
- MySQL 8+
- npm o yarn

## Instalación

### 1. Base de datos MySQL

```bash
mysql -u root -p < database/schema.sql
```

O ejecuta el contenido de `database/schema.sql` en tu cliente MySQL.

### 2. Backend (Express)

```bash
cd backend
npm install
cp .env.example .env
# Edita .env con tus credenciales de MySQL, JWT_SECRET, etc.
npm start
```

El backend corre en http://localhost:3000

### 3. Microservicio (FastAPI)

```bash
cd microservicio
pip install -r requirements.txt
python main.py
```

O con uvicorn:
```bash
uvicorn main:app --reload --port 8000
```

El microservicio corre en http://localhost:8000

### 4. Frontend

Abre `frontend/index.html` en tu navegador o sirve con un servidor local:

```bash
cd frontend
npx serve .
```

**Nota**: Para evitar problemas de CORS, usa un servidor que sirva el frontend (por ejemplo, serve o live-server).

## Configuración

### Backend (.env)

```
PORT=3000
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=tu_contraseña
DB_NAME=galeria_arte
JWT_SECRET=tu_clave_secreta_muy_segura
JWT_EXPIRES_IN=7d
FASTAPI_URL=http://localhost:8000
```

### Frontend

Edita `frontend/js/config.js` si tu API o microservicio corren en otros puertos/hosts.

## API REST

| Endpoint | Método | Descripción |
|----------|--------|-------------|
| /api/auth/registro | POST | Registro de usuario |
| /api/auth/login | POST | Inicio de sesión |
| /api/auth/verificar | GET | Verificar token (auth) |
| /api/usuarios/:id | GET | Perfil público |
| /api/usuarios/perfil | PUT | Editar perfil (auth) |
| /api/usuarios/cuenta | DELETE | Eliminar cuenta (auth) |
| /api/colecciones | GET, POST | Listar/Crear colecciones (auth) |
| /api/colecciones/:id | GET, PUT, DELETE | CRUD colección (auth) |
| /api/obras | GET, POST | Listar/Crear obras |
| /api/obras/buscar?q= | GET | Buscar por título |
| /api/obras/:id | GET, PUT, DELETE | CRUD obra |
| /api/likes/:id_obra | POST, DELETE | Dar/Quitar like (auth) |

## Estructura del proyecto

```
tarea2/
├── backend/           # Express API
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middlewares/
│   │   ├── models/
│   │   ├── routes/
│   │   └── validators/
│   └── package.json
├── microservicio/     # FastAPI
│   ├── main.py
│   └── requirements.txt
├── frontend/          # HTML/CSS/JS
│   ├── index.html
│   ├── css/
│   └── js/
├── database/
│   └── schema.sql
└── README.md
```

## Licencia

ISC
