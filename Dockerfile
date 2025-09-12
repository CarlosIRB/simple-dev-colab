# Dockerfile (desarrollo)
FROM node:20-alpine

WORKDIR /usr/src/app

ENV NODE_ENV=development

# Copiar archivos de dependencias
COPY package*.json ./
RUN npm ci

# Copiar el código fuente
COPY . .

# Crear directorio .next para evitar problemas de permisos
RUN mkdir -p .next

EXPOSE 3000

CMD ["npm", "run", "dev"]

