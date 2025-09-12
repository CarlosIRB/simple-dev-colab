# Despliegue en Google Cloud Run

Este documento explica cómo desplegar **Simple Dev Colab** en GCP usando Cloud Run y Cloud SQL.


## Requisitos previos

- Tener una cuenta de Google Cloud.
- Tener instalado `gcloud` CLI y estar autenticado.
- Crear un proyecto en GCP y habilitar:
  - Cloud Run
  - Cloud SQL (PostgreSQL)


## Pasos de despliegue

### 1. Crear base de datos en Cloud SQL
- Crear una instancia PostgreSQL (nivel gratuito si aplica).
- Crear base de datos `simple_dev_colab`.
- Obtener la cadena de conexión.

### 2. Configurar variables de entorno
- Crear un archivo `.env.production` con:
  ```env
  DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/simple_dev_colab
  JWT_SECRET=clave-secreta-produccion

### 3. Construir e implementar en Cloud Run

gcloud builds submit --tag gcr.io/PROJECT_ID/simple-dev-colab
gcloud run deploy simple-dev-colab \
  --image gcr.io/PROJECT_ID/simple-dev-colab \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars DATABASE_URL="..." \
  --set-env-vars JWT_SECRET="..."

###  4. Conectar Cloud SQL con Cloud Run

Configurar la conexión privada entre Cloud Run y Cloud SQL (si aplica).

Usar cloudsql-proxy o conectores nativos.

## Resultado

Una vez desplegado, obtendrás una URL pública de Cloud Run para acceder a la aplicación.

