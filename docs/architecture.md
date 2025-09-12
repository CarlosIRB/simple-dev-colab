# Arquitectura del proyecto

Este documento describe la arquitectura utilizada en **Simple Dev Colab**, sus capas, responsabilidades y justificación técnica.


## Patrón arquitectónico

El proyecto sigue una **arquitectura modular en capas** o modular monolith, dividiendo claramente las responsabilidades en:

### Controller (API Routes)
- Residen en `src/app/api`.
- Reciben y validan solicitudes HTTP.
- Delegan la lógica de negocio a los servicios.
- Devuelven respuestas formateadas al cliente.

### Service (Business Logic)
- Residen en `src/modules/<modulo>/*.service.ts`.
- Contienen la lógica de negocio pura.
- Orquestan operaciones entre modelos, aplican validaciones y reglas de negocio.
- No conocen detalles del framework web.

### Model (Data Access Layer)
- Residen en `src/modules/<modulo>/*.model.ts`.
- Ejecutan consultas SQL usando el cliente `pg`.
- Gestionan la interacción directa con PostgreSQL.
- No implementan lógica de negocio.

###  UI (Presentation Layer)
- Residen en `src/app` y `src/components`.
- Implementadas con Next.js y React.
- Consumen la API vía fetch/axios.
- Aplican Tailwind CSS para estilos básicos.


## Estructura de carpetas

/src
    /modules
        /auth
            auth.service.ts
        /users
            user.model.ts
            user.service.ts
        /projects
            project.model.ts
            project.service.ts
        /tasks
            task.model.ts
            task.service.ts
        /analytics
            analytics.service.ts
    /app
        /api           # Endpoints → importan controladores de modules
        .../pages      # Vistas Next.js
    /components        # UI compartida
    /lib               # utilidades (db.ts, auth.ts, etc.)



## 📋 Justificación de la arquitectura

- **Separación de responsabilidades**: cada capa tiene un propósito claro, facilitando pruebas y mantenibilidad.
- **Escalabilidad**: la modularidad permite añadir nuevos módulos (dominios) sin afectar otros.
- **Trazabilidad**: cada request sigue un flujo claro `Controller → Service → Model`, facilitando el debugging.
- **Compatibilidad**: sigue buenas prácticas comunes en entornos Node.js/Next.js.


## Consideraciones adicionales

- Cada módulo es autocontenido: modelos, servicios y controladores residen en la misma carpeta para mantener cohesión.
- La capa de servicios expone métodos reutilizables, permitiendo su uso desde otros servicios o controladores.
- Los controladores no deben contener lógica de negocio, solo delegar y manejar errores.
- Las pruebas unitarias se escribirán principalmente sobre servicios.

