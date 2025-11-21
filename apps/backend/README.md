# 🧠 Backend - TallerApp

Este módulo implementa la **API REST** y la infraestructura de persistencia.

## 📁 Estructura
```
src/
├── controllers/ → Controladores HTTP
├── routes/ → Definición de endpoints
├── repositories/ → Implementaciones de persistencia (MongoDB)
├── models/ → Esquemas Mongoose
├── config/ → Configuración (DB, middlewares, etc.)
└── tests/ → Tests de integraciones (Vitest + Supertest)
```


## 🧩 Arquitectura
Este backend implementa los casos de uso del dominio a través de controladores que interactúan con repositorios concretos.  
Se utiliza **inyección de dependencias** para desacoplar las 
capas.

## Requisitos Previos
- Node.js v18+ 
- npm v9+
- MongoDB instalado localmente o acceso a una instancia remota
- Variables de entorno configuradas (ver `.env.example`)

# Instalar dependencias
```bash
cd TallerApp/apps/backend
npm install
```

## 🧪 Ejecutar tests
```bash
cd TallerApp/apps/backend
npm run test
```

### Estructura de Tests
```
tests/
├── auth.test.ts       # Pruebas de autenticación
├── users.test.ts      # Pruebas de gestión de usuarios
└── setup.ts             # Utilidades para testing
```

### Configuración de Testing
- Base de datos: MongoDB en memoria (via `mongodb-memory-server`)
- Ambiente: `NODE_ENV=test`
- Timeout: 10000ms para operaciones de DB

> **Nota**: Los tests limpian la base de datos automáticamente después de cada ejecución.

---

## Configuración
1. Crear archivo `.env` basado en `.env.example`:
```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/tallerapp
JWT_SECRET=mi_secreto_super_seguro
```

## Ejecutar el Servidor
```bash
npm run dev  # Modo desarrollo con Vite
# o
npm start    # Modo producción
```
---

# Documentación de la API - TallerApp (Backend)

## 📚 Endpoints principales

### Autenticación
| Método | Ruta | Descripción | Requiere Autenticación |
|--------|------|-------------|------------------------|
| POST   | /api/auth/register | Registro de nuevo usuario | No |
| POST   | /api/auth/login | Inicio de sesión (obtener token JWT) | No |

#### `POST /api/auth/register`
Registro de nuevo usuario
```json
// Request Body
{
  "username": "usuario123",
  "password": "contraseñaSegura123"
}

// Response (201 Created)
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "username": "usuario123",
    "role": "costurero"
  }
}
```

#### `POST /api/auth/login`
Inicio de sesión
```json
// Request Body
{
  "username": "usuario123",
  "password": "contraseñaSegura123"
}

// Response (200 OK)
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "username": "usuario123",
    "role": "costurero"
  }
}
```

### Clientes
| Método | Ruta | Descripción | Requiere Autenticación | Permisos Requeridos |
|--------|------|-------------|------------------------|---------------------|
| POST   | /api/customers | Crear nuevo cliente | Sí | supervisor |
| GET    | /api/customers | Obtener todos los clientes | Sí | - |
| GET    | /api/customers/:id | Obtener cliente por ID | Sí | - |

#### `POST /api/customers`
Crear nuevo cliente
```json
// Request Body
{
  "name": "Juan Pérez",
  "email": "juan@example.com",
  "phone": "+541112345678",
  "address": "Calle Falsa 123"
}

// Response (201 Created)
{
  "id": "507f1f77bcf86cd799439011",
  "name": "Juan Pérez",
  "email": "juan@example.com",
  "phone": "+541112345678",
  "address": "Calle Falsa 123",
  "createdAt": "2025-11-21T16:30:00.000Z"
}
```

#### `GET /api/customers`
Obtener todos los clientes

```json
// Response (200 OK)
[
  {
    "id": "507f1f77bcf86cd799439011",
    "name": "Juan Pérez",
    "email": "juan@example.com",
    "phone": "+541112345678",
    "address": "Calle Falsa 123"
  },
  // ... más clientes
]
```

#### `GET /api/customers/:id`
Obtener cliente por ID

```json
// Response (200 OK)
{
  "id": "507f1f77bcf86cd799439011",
  "name": "Juan Pérez",
  "email": "juan@example.com",
  "phone": "+541112345678",
  "address": "Calle Falsa 123",
  "createdAt": "2025-11-21T16:30:00.000Z"
}
```

### Empleados
| Método | Ruta | Descripción | Requiere Autenticación | Permisos Requeridos |
|--------|------|-------------|------------------------|---------------------|
| POST   | /api/employees | Crear nuevo empleado | Sí | supervisor |
| GET    | /api/employees | Obtener todos los empleados | Sí | supervisor |
| GET    | /api/employees/:id | Obtener empleado por ID | Sí | supervisor |
| PUT    | /api/employees/:id | Actualizar empleado | Sí | supervisor |
| DELETE | /api/employees/:id | Eliminar empleado | Sí | supervisor |
| GET    | /api/employees/type/:type | Obtener empleados por tipo | Sí | supervisor |
| GET    | /api/employees/username/:username | Obtener empleado por nombre de usuario | Sí | - |

#### `POST /api/employees`
Crear nuevo empleado
```json
// Request Body
{
  "name": "María",
  "surname": "García",
  "documentNumber": "40123456",
  "phone": "+541112345679",
  "employeeType": "costurero"
}

// Response (201 Created)
{
  "id": "507f1f77bcf86cd799439012",
  "name": "María",
  "surname": "García",
  "documentNumber": "40123456",
  "phone": "+541112345679",
  "isActive": true,
  "employeeType": "costurero",
  "username": "MaríaGarcía",
  "password": "40123456"
}
```

#### `GET /api/employees/username/:username`
Obtener empleado por nombre de usuario

```json
// Response (200 OK)
{
  "id": "507f1f77bcf86cd799439012",
  "name": "María",
  "surname": "García",
  "documentNumber": "40123456",
  "phone": "+541112345679",
  "isActive": true,
  "employeeType": "costurero",
  "username": "MaríaGarcía"
}
```

### Prendas
| Método | Ruta | Descripción | Requiere Autenticación | Permisos Requeridos |
|--------|------|-------------|------------------------|---------------------|
| POST   | /api/garments | Crear nueva prenda | Sí | supervisor |
| GET    | /api/garments | Obtener todas las prendas | Sí | - |
| GET    | /api/garments/:id | Obtener prenda por ID | Sí | - |

#### `POST /api/garments`
Crear nueva prenda
```json
// Request Body
{
  "name": "shirt",
  "color": "azul",
  "description": "Camisa de algodón manga larga",
  "price": 2500,
  "imageUrl": "https://example.com/shirt.jpg",
  "neck": "cuello redondo",
  "cuff": "manga larga",
  "flap": "sin solapa",
  "zipper": "sin cierre",
  "pocket": "sin bolsillo",
  "waist": "recto"
}

// Response (201 Created)
{
  "id": "507f1f77bcf86cd799439013",
  "name": "shirt",
  "color": "azul",
  "description": "Camisa de algodón manga larga",
  "price": 2500,
  "imageUrl": "https://example.com/shirt.jpg",
  "neck": "cuello redondo",
  "cuff": "manga larga",
  "flap": "sin solapa",
  "zipper": "sin cierre",
  "pocket": "sin bolsillo",
  "waist": "recto"
}
```

#### `GET /api/garments`
Obtener todas las prendas

```json
// Response (200 OK)
[
  {
    "id": "507f1f77bcf86cd799439013",
    "name": "shirt",
    "color": "azul",
    "description": "Camisa de algodón manga larga",
    "price": 2500,
    "imageUrl": "https://example.com/shirt.jpg",
    "neck": "cuello redondo",
    "cuff": "manga larga",
    "flap": "sin solapa",
    "zipper": "sin cierre",
    "pocket": "sin bolsillo",
    "waist": "recto"
  },
  // ... más prendas
]
```

### Órdenes
| Método | Ruta | Descripción | Requiere Autenticación | Permisos Requeridos |
|--------|------|-------------|------------------------|---------------------|
| POST   | /api/orders | Crear nueva orden | Sí | supervisor |
| PUT    | /api/orders/assign | Asignar orden a empleado | Sí | supervisor |
| GET    | /api/orders/employee/:employeeId | Obtener órdenes por empleado | Sí | - |
| PUT    | /api/orders/update-status | Actualizar estado de orden | Sí | - |
| GET    | /api/orders | Obtener todas las órdenes | Sí | - |

#### `POST /api/orders`
Crear nueva orden
```json
// Request Body
{
  "customerId": "507f1f77bcf86cd799439011",
  "garments": [
    {
      "garmentId": "507f1f77bcf86cd799439013",
      "quantity": 2,
      "price": 2500,
      "size": "M",
      "sex": "M"
    }
  ],
  "totalPrice": 5000,
  "deliveryDate": "2025-12-15T18:00:00.000Z"
}

// Response (201 Created)
{
  "id": "507f1f77bcf86cd799439014",
  "customerId": "507f1f77bcf86cd799439011",
  "status": "pendiente",
  "totalPrice": 5000,
  "deliveryDate": "2025-12-15T18:00:00.000Z",
  "createdAt": "2025-11-21T16:30:00.000Z"
}
```

#### `PUT /api/orders/assign`
Asignar orden a empleado
```json
// Request Body
{
  "orderId": "507f1f77bcf86cd799439014",
  "employeeId": "507f1f77bcf86cd799439012",
  "assignedBySupervisorId": "507f1f77bcf86cd799439015"
}

// Response (200 OK)
{
  "message": "Orden asignada exitosamente",
  "order": {
    "id": "507f1f77bcf86cd799439014",
    "status": "en_proceso",
    "assignedTo": "507f1f77bcf86cd799439012"
  }
}
```

#### `PUT /api/orders/update-status`
Actualizar estado de orden
```json
// Request Body
{
  "orderId": "507f1f77bcf86cd799439014",
  "status": "completada",
  "updatedBy": "507f1f77bcf86cd799439012"
}

// Response (200 OK)
{
  "message": "Estado de la orden actualizado exitosamente",
  "order": {
    "id": "507f1f77bcf86cd799439014",
    "status": "completada",
    "updatedAt": "2025-11-21T17:30:00.000Z"
  }
}
```

### Notas:
- Todas las rutas (excepto /api/auth/*) requieren autenticación mediante JWT
- Los endpoints marcados con 'supervisor' en 'Permisos Requeridos' solo pueden ser accedidos por usuarios con rol de supervisor
- El token JWT debe incluirse en el header `Authorization: Bearer <token>`
