# # Dockerfile (desarrollo)
# FROM node:20-alpine

# WORKDIR /usr/src/app

# ENV NODE_ENV=development

# # Copiar archivos de dependencias
# COPY package*.json ./
# RUN npm ci

# # Copiar el código fuente
# COPY . .

# # Crear directorio .next para evitar problemas de permisos
# RUN mkdir -p .next

# EXPOSE 3000

# CMD ["npm", "run", "start"]


# build
FROM node:20-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm ci

ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

COPY . .
RUN npm run build

# runner
FROM node:20-alpine AS runner
WORKDIR /app

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules

EXPOSE 3000
CMD ["npm", "start"]

