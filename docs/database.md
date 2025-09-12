## Base de datos

Se utiliza **PostgreSQL** como motor relacional y el cliente `pg` para la conexión desde Node.js.

El esquema se encuentra en db/schema.sql


## Relaciones clave

- Cada usuario puede crear proyectos.
- Un proyecto tiene miembros registrados en project_members.
- Las tareas solo pertenecen a un proyecto y pueden estar asignadas a un miembro.
- status de tareas: pending, completed, discarded.