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
Método	Ruta	        Descripción
POST    /api/auth/register	Registro de nuevo usuario
POST    /api/auth/login	Autenticación JWT
POST    /api/orders	    Crear orden
POST    /api/orders/assign	Asignar orden a empleado
PUT     /api/orders/:id	Actualizar orden


### Autenticación
| Method | Endpoint       | Description                  | Auth Required |
|--------|----------------|------------------------------|---------------|
| POST   | /auth/register | User registration            | No            |
| POST   | /auth/login    | User login (JWT token)       | No            |

#### `POST /auth/register`
Registro de nuevo usuario
```json
// Request Body
{
  "username": "rebecaozuna",
  "password": "contraseñaSegura123"
}

// Response (201 Created)
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "username": "testuser",
    "role": "Costurero"
  }
}
```

#### `POST /auth/login`
Inicio de sesión
```json
// Request Body
{
  "username": "rebecaozuna",
  "password": "contraseñaSegura123"
}

// Response (200 OK)
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "65a1b2c3d4e5f6g7h8i9j0k",
    "email": "usuario@taller.com",
    "role": "technician"
  }
}
```

👥 Orders


### Autenticación
| Method | Endpoint       | Description                  | Auth Required |
|--------|----------------|------------------------------|---------------|
| POST   | /orders        | Create Order                 | Yes           |
| POST   | /orders/assign | Assign Order to Employee     | Yes           |
| PUT    | /orders/:id    | Update Order                 | Yes           |

#### `POST /orders`
Create Order
POST /api/orders (Requires Supervisor role)

Request:

```json
{
  "customerId": "507f1f77bcf86cd799439011",
  "employeeId": "507f1f77bcf86cd799439012",
  "garments": [
    {
      "garmentId": "507f1f77bcf86cd799439013",
      "quantity": 2,
      "price": 50,
      "size": "M",
      "sex": "M",
      "subtotal": 100
    }
  ],
  "deliveryDate": "2025-12-31T23:59:59.999Z"
}
```
Success Response (201 Created):

```json
{
  "id": "507f1f77bcf86cd799439014",
  "customerId": "507f1f77bcf86cd799439011",
  "status": "pending",
  "totalPrice": 100,
  "createdAt": "2025-10-31T18:30:00.000Z"
}
```

Assign Order
POST /api/orders/assign (Requires Supervisor role)

Request:

```json
{
  "orderId": "507f1f77bcf86cd799439014",
  "employeeId": "507f1f77bcf86cd799439012",
  "assignedBySupervisorId": "507f1f77bcf86cd799439015"
}
Success Response (200 OK):

json
{
  "message": "Order assigned successfully",
  "order": {
    "id": "507f1f77bcf86cd799439014",
    "employeeId": "507f1f77bcf86cd799439012",
    "status": "in_process"
  }
}
Get Orders by Employee
GET /api/orders/employee/:employeeId (Requires Authentication)

Success Response (200 OK):

json
{
  "orders": [
    {
      "id": "507f1f77bcf86cd799439014",
      "customerId": "507f1f77bcf86cd799439011",
      "status": "in_process",
      "totalPrice": 100,
      "createdAt": "2025-10-31T18:30:00.000Z"
    }
  ]
}
Update Order Status
POST /api/orders/update-status (Requires Authentication)

Request:

json
{
  "orderId": "507f1f77bcf86cd799439014",
  "newStatus": "completed",
  "employeeId": "507f1f77bcf86cd799439012"
}
Success Response (200 OK):

json
{
  "message": "Order status updated successfully",
  "order": {
    "id": "507f1f77bcf86cd799439014",
    "status": "completed",
    "updatedAt": "2025-10-31T19:30:00.000Z"
  }
}





