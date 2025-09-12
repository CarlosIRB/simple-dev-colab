# Reglas de nomenclatura

Este documento define las convenciones de nombres, estilos y estructura a utilizar en **Simple Dev Colab**. Su propósito es mantener un código coherente, legible y fácil de mantener.


## Archivos y carpetas

- Nombrados solo en inglés
- Carpetas: kebab-case → project-members/, task-service/
- Archivos de módulo: Modulo singular lowerCase
    model.ts, service.ts, controller.ts dentro de cada módulo
    Ejemplo: src/modules/tasks/task.model.ts
- Componentes React: PascalCase → TaskList.tsx
- Hooks: camelCase prefijado con use → useAuth.ts

## Variables y funciones

- Nombrados solo en inglés
- camelCase → getUserById, taskList
- Constantes globales: UPPER_SNAKE_CASE → DEFAULT_STATUS

## Rutas API

- Nombrados solo en inglés
    /api/{recurso} en plural
    /api/users, /api/projects/:id/tasks

- Operaciones CRUD estándar HTTP:

    GET /api/tasks → listar
    POST /api/tasks → crear
    PUT /api/tasks/:id → actualizar
    DELETE /api/tasks/:id → eliminar

## Base de datos

- Nombrados solo en inglés
- Tablas: snake_case plural → users, project_members
- Columnas: snake_case → created_at, project_id
- Claves foráneas: {referenced_table}_id

## Comentarios y logs

- Comentarios en inglés y solo cuando aporten valor:
    Explicación de bloques complejos
    Decisiones de diseño o limitaciones técnicas

- Logs de debug en inglés y con contexto:
    console.log("[TASK_SERVICE] Creating task", payload)

## Commits

- Títulos y body de commits solo en inglés
- Convención basada en Conventional Commits:
    {tipo}({módulo}): {descripción 50 char máx}

- Tipos permitidos:
    feat → nueva funcionalidad
    fix → corrección de bugs
    docs → cambios en documentación
    style → formato, sin cambio funcional
    refactor → reestructuración sin cambio funcional
    test → añadir o modificar pruebas
    chore → cambios de configuración o mantenimiento

- Ejemplos:
    feat(users): add user registration endpoint
    fix(tasks): correct status update logic
    docs: add conventions.md file