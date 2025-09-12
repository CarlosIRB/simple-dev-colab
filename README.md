# Simple Dev Colab

Aplicación web colaborativa para gestionar tareas de desarrollo dentro de proyectos.  
Diseñada como ejercicio técnico para demostrar conocimientos en **Next.js + TypeScript**, **PostgreSQL**, **Docker**, test y buenas prácticas de arquitectura modular.

---

## Propósito del proyecto

**Simple Dev Colab** permite a los usuarios (devs):

- Registrarse e iniciar sesión.
- Crear proyectos colaborativos.
- Unirse a proyectos existentes.
- Crear, editar, completar o descartar tareas asociadas a cada proyecto.
- Consultar métricas agregadas de los proyectos en un panel de **Analytics**.

Este proyecto busca demostrar:

- Organización y claridad del código.
- Uso correcto de bases de datos relacionales.
- Configuración de entornos con Docker.
- Estructura modular por capas (Controller → Service → Model).
- Documentación técnica y pruebas unitarias básicas.

---

## Módulos principales

Ubicados en `src/modules`:

- **users/** → Registro, login y gestión de usuarios.
- **projects/** → Creación de proyectos y administración de miembros.
- **tasks/** → CRUD de tareas por proyecto y asignación a miembros.
- **analytics/** → Cálculos agregados de tareas (pendientes, completadas, descartadas).

---

## Documentación adicional

Toda la documentación está en la carpeta `docs/`:

- `conventions.md` → Reglas de nomenclatura, estilo, rutas y commits.  
- `architecture.md` → Explicación de la arquitectura modular utilizada y su justificación.  
- `database.md` → Diagrama y descripción del esquema relacional PostgreSQL.  
- `deployment.md` → Guía para desplegar el proyecto en GCP (Cloud Run) *(opcional)*.

---

## Ejecución del proyecto

### Requisitos
- Docker y Docker Compose instalados.
- Node.js (si se quiere ejecutar sin Docker).

### Configuración
1. Clonar el repositorio:
   
   >git clone https://github.com/CarlosIRB/simple-dev-colab.git
   >cd simple-dev-colab

2. Crear archivo .env basado en .env.template


### Scripts útiles para ejecución local

Levantar los contenedores:

    >docker-compose up --build

La aplicación estará disponible en: http://localhost:3000

- npm run dev → entorno de desarrollo
- npm run build → construir para producción
- npm run start → ejecutar en modo producción
- npm run test → ejecutar pruebas


## Pruebas unitarias



## Despliegue en GCP

