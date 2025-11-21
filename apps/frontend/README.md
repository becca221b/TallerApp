# TallerApp Frontend

Frontend moderno basado en React para TallerApp, un sistema de gestión de talleres.

## 🚀 Tecnologías

- **Framework**: React 19
- **Herramienta de Construcción**: Vite
- **Tipado**: TypeScript
- **Estilos**: Módulos CSS
- **Gestión de Estado**: React Query
- **Enrutamiento**: React Router v7
- **Componentes UI**: Radix UI, Lucide Icons
- **Formularios**: React Hook Form
- **Pruebas**: Vitest, Storybook

## 📁 Estructura del Proyecto

```
src/
├── api/              # Configuración del cliente API
├── assets/           # Recursos estáticos (imágenes, fuentes, etc.)
├── components/       # Componentes UI reutilizables
├── contexts/         # Contextos de React para gestión de estado
├── dtos/             # Tipos de objetos de transferencia de datos
├── lib/              # Funciones y utilidades
├── pages/            # Componentes de páginas
│   ├── CostureroDashboard.tsx
│   ├── Login.tsx
│   ├── NotFound.tsx
│   └── SupervisorDashboard.tsx
└── services/         # Lógica de negocio y servicios API
```

## 🛠 Configuración y Desarrollo

1. **Instalar Dependencias**
   ```bash
   npm install
   # o
   yarn
   # o
   pnpm install
   ```

2. **Variables de Entorno**
   Crea un archivo `.env` en la raíz con las siguientes variables:
   ```
   VITE_API_URL=http://localhost:3000
   ```

3. **Iniciar Servidor de Desarrollo**
   ```bash
   npm run dev
   # o
   yarn dev
   # o
   pnpm dev
   ```

4. **Ejecutar Pruebas**
   ```bash
   npm test
   # o
   yarn test
   # o
   pnpm test
   ```

5. **Ejecutar Storybook**
   ```bash
   npm run storybook
   # o
   yarn storybook
   # o
   pnpm storybook
   ```

## 🌟 Características

- Costurero Dashboard
- Supervisor Dashboard
- Login
- Not Found

## 🧩 Dependencias Principales

- tanstack/react-query: Data fetching and state management
- react-router-dom: Client side routing
- lucid-react: Icons
- sonner: Toast notifications