# TallerApp 🧵

[![TypeScript](https://img.shields.io/badge/TypeScript-5.9.3-blue.svg)](https://www.typescriptlang.org/)
[![Vitest](https://img.shields.io/badge/Vitest-3.2.4-green.svg)](https://vitest.dev/)

**TallerApp** es una aplicación basada en TypeScript diseñada para gestionar pedidos de prendas, asignación de empleados e información de clientes.  
La aplicación utiliza una arquitectura modular que separa la lógica de dominio de las implementaciones específicas de la aplicación.  
Incluye pruebas unitarias completas y se enfoca en hacer cumplir las reglas de negocio a través de sus casos de uso.

## 📌 Tabla de Contenidos

- [📌 Tabla de Contenidos](#-tabla-de-contenidos)
- [✨ Características](#-características)
- [🛠️ Stack Tecnológico](#️-stack-tecnológico)
- [📦 Instalación](#-instalación)
- [💽 Uso](#-uso)
  - [Casos de Uso Reales](#casos-de-uso-reales)
  - [Cómo Usar](#cómo-usar)
- [📂 Estructura del Proyecto](#-estructura-del-proyecto)
- [🛠️ Referencia de la API](#️-referencia-de-la-api)
  - [Entidades](#entidades)
  - [Servicios](#servicios)
  - [Casos de Uso](#casos-de-uso)

---

## ✨ Características

- **Diseño Modular**: La aplicación está estructurada en espacios de trabajo (`domain` y `apps/*`) para una mejor organización y mantenibilidad del código.  
- **Gestión de Entidades**: Administra entidades principales como `User`, `Customer`, `Employee`, `Garment`, `Order` y `OrderDetail`.  
- **Abstracción de Servicios**: Utiliza interfaces de servicio para interactuar con las entidades, promoviendo bajo acoplamiento y facilidad de prueba.  
- **Implementación de Casos de Uso**: Implementa casos como `AssignOrder`, `CreateCustomer`, `CreateEmployee` y `CreateOrder`, aplicando reglas de negocio.  
- **Pruebas Completas**: Incluye pruebas unitarias con Vitest para garantizar la fiabilidad de la aplicación.  
- **Gestión de Empleados**: Administra información de empleados, asignando roles (`Costurero`, `Cortador`, `Supervisor`) y controlando su estado activo.  
- **Gestión de Pedidos**: Crea, asigna, reasigna y desasigna pedidos a empleados, con seguimiento de estados (`Pending`, `InProcess`, `Completed`).  
- **Gestión de Clientes**: Administra información de clientes y asocia pedidos con ellos.  

---

## 🛠️ Stack Tecnológico

- **Lenguaje**: [TypeScript](https://www.typescriptlang.org/)
- **Framework de Testing**: [Vitest](https://vitest.dev/)
- **Arquitectura**: Estructura modular basada en workspaces

---

## 📦 Instalación

1. **Clonar el repositorio:**

    ```bash
    git clone https://github.com/becca221b/TallerApp.git
    cd TallerApp
    ```

2. **Instalar dependencias:**

    ```bash
    npm install
    ```

3. **Compilar el proyecto:**

    ```bash
    npm run build
    ```

---

## 💽 Uso

### Casos de Uso Reales

- **Gestión de Pedidos de Prendas**: Permite crear, asignar y hacer seguimiento de pedidos dentro de un taller de costura.  
- **Asignación de Tareas a Empleados**: Asigna pedidos a empleados disponibles según su rol y carga de trabajo.  
- **Gestión de Relaciones con Clientes**: Permite registrar y consultar datos e historial de pedidos de los clientes.  

---

### Cómo Usar

1. **Compilar la capa de dominio:**

    ```bash
    cd domain
    npm run build
    ```

2. **Ejecutar pruebas:**

    ```bash
    npm run test
    ```

3. **Iniciar el backend:**

    ```bash
    cd apps/backend
    npm install
    npm run dev
    ```

---

## 📂 Estructura del Proyecto

```
TallerApp/
├── apps/
│   └── backend/
│       ├── package.json
│       └── tsconfig.json
├── domain/
│   ├── src/
│   │   ├── entities/
│   │   │   ├── Customer.ts
│   │   │   ├── Employee.ts
│   │   │   ├── Garment.ts
│   │   │   ├── index.ts
│   │   │   ├── Order.ts
│   │   │   ├── OrderDetail.ts
│   │   │   └── User.ts
│   │   ├── mocks/
│   │   │   ├── mock-customer-service.ts
│   │   │   ├── mock-employee-service.ts
│   │   │   ├── mock-garment-service.ts
│   │   │   ├── mock-order-detail-service.ts
│   │   │   └── mock-order-service.ts
│   │   ├── services/
│   │   │   ├── customer-service.ts
│   │   │   ├── employee-service.ts
│   │   │   ├── garment-service.ts
│   │   │   ├── order-detail-service.ts
│   │   │   ├── order-service.ts
│   │   │   └── user-service.ts
│   │   └── use-cases/
│   │       ├── assign-order.test.ts
│   │       ├── assign-order.ts
│   │       ├── create-customer.test.ts
│   │       ├── create-customer.ts
│   │       ├── create-employee.test.ts
│   │       ├── create-employee.ts
│   │       ├── create-order.test.ts
│   │       ├── create-order.ts
│   │       ├── list-order-by-employee.test.ts
│   │       └── list-order-by-employee.ts
│   ├── package.json
│   └── tsconfig.json
├── package.json
└── tsconfig.json
```


### Entities

El directorio `domain/src/entities` define las estructuras de datos principales utilizadas en la aplicación.

*   **User**: Representa a un usuario with an ID and username.

    ```typescript
    export type Role = 'admin' | 'employee' ;

    export interface User {
    readonly id: string,
    username: string,
    passwordHash: string,
    role: Role,
    email?: string,
    }
    ```

*   **Customer**: Representa a un cliente con los detalles como nombre, dirección, teléfono y correo electrónico.

    ```typescript
    export interface Customer {
        readonly id: string,
        customerName: string,
        phone: number,
        address: string,
        email?: string
    }
    ```

*   **Employee**: Representa un empleado con detalles como nombre, apellido, número de documento, teléfono y tipo de empleado.

    ```typescript
    export type employeeType = 'Costurero' | 'Cortador' | 'Supervisor';

    export interface Employee {
        readonly id: string,
        name: string,
        surname: string,
        documentNumber: string,
        phone: string,
        isActive?: boolean,
        employeeType: employeeType,
        username?: string,
        password?: string
    }
    ```

*   **Garment**: Represents a garment with details like name, color, price, and image URL.

    ```typescript
    export type GarmentType = 'shirt' | 'shorts' | 'jacket';

    export interface Garment {
        id: string,
        name: GarmentType,
        color: string,
        description?: string,
        price: number,
        imageUrl: string,
        neck: string,
        cuff: string,
        flap: string,
        zipper: string,
        pocket: string,
        waist: string,
    }
    ```

*   **Order**: Representa una orden de compra con detalles como cliente, estado, total, empleado, detalles de la orden, fecha de la orden y fecha de entrega.

    ```typescript
    import type { OrderDetail } from "./OrderDetail.js";

    export enum OrderStatus {
        Pending = 'pending',
        InProcess = 'in process',
        Completed = 'completed'
    }

    export interface Order {
        id: string,
        customerId: string,
        status?: OrderStatus,
        totalPrice?: number,
        employeeId: string,
        orderDetails: OrderDetail[],
        orderDate: Date,
        deliveryDate: Date,
    }
    ```

*   **OrderDetail**: Representa un detalle de la orden con detalles como id, orderId, garmentId, size, sex, quantity y subtotal.

    ```typescript
    export type orderSize = 'S' | 'M' | 'L' | 'XL';

    export interface OrderDetail {
        id: string,
        orderId?: string,
        garmentId: string,
        size: orderSize,
        sex: 'F' | 'M',
        quantity: number,
        subtotal: number,
    }
    ```

### Services

El directorio `domain/src/services` define las interfaces de servicio usadas en la aplicación.

*   **CustomerService**: Maneja las operaciones realcionadas al cliente.

    ```typescript
    import type { Customer } from "../entities/Customer.js";

    export interface CustomerService {
      saveCustomer(customer: Customer): Promise<Customer>;
      findCustomerById(id: string): Promise<Customer | null>;
    }
    ```

*   **EmployeeService**: Maneja las operaciones relacionadas al empleado.

    ```typescript
    import type { Employee, employeeType } from "../entities/Employee.js";

    export interface EmployeeService {
        saveEmployee(employee: Employee): Promise<Employee>;
        findEmployeeById(id: string): Promise<Employee | null>;
        findEmployeesByType(type: employeeType): Promise<Employee[]>;
        updateEmployee(id: string, employee: Partial<Employee>): Promise<Employee | null>;
        deleteEmployee(id: string): Promise<boolean>;
        findAllEmployees(): Promise<Employee[]>;
    }
    ```

*   **GarmentService**: Maneja las operaciones relacionadas a la prenda.

    ```typescript
    import type { Garment } from "../entities/Garment.js";

    export interface GarmentService {
        saveGarment(garment: Garment): Promise<Garment>;
        findGarmentById(id: string): Promise<Garment | null>;
        findGarmentPriceById(id: string): Promise<number | null>;
    }
    ```

*   **OrderDetailService**: Maneja las operaciones relacionadas al detalle de la orden.

    ```typescript
    import type { OrderDetail } from "../entities/OrderDetail.js";

    export interface OrderDetailService {
        saveMany(orderDetails: Omit<OrderDetail, 'id'>[]): Promise<OrderDetail[]>;
    }
    ```

*   **OrderService**: Maneja las operaciones relacionadas a la orden.

    ```typescript
    import type { Order } from "../entities/Order.js";

    export interface OrderService {
        saveOrder(order: Order): Promise<Order>;
        findOrderById(id: string): Promise<Order | null>;
        findOrdersByEmployeeId(employeeId: string): Promise<Order[]>;
        findOrdersByCustomerId(customerId: string): Promise<Order[]>;
        updateOrder(id: string, order: Partial<Order>): Promise<Order | null>;
        deleteOrder(id: string): Promise<boolean>;
        findAllOrders(): Promise<Order[]>;
    }
    ```
### Use Cases

El directorio `domain/src/use-cases` define los casos de uso implementados en la aplicación.

- **AssignOrder**: Asigna un pedido a un empleado. Aplica reglas de negocio como que solo los supervisores pueden asignar pedidos y que los pedidos solo pueden asignarse a costureros.  
- **CreateCustomer**: Crea un nuevo cliente.  
- **CreateEmployee**: Crea un nuevo empleado.  
- **CreateOrder**: Crea un nuevo pedido asociándolo con cliente, empleado y detalles de prendas. Implementa un enfoque paso a paso para construir los detalles y la estructura del pedido.  
- **ListOrderByEmployee**: Lista los pedidos asignados a un empleado específico.  
- **UpdateOrderStatus**: Actualiza el estado de un pedido.  


