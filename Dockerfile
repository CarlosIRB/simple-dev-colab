# Dockerfile (desarrollo)
FROM node:20-alpine

WORKDIR /src/app

ENV NODE_ENV=development

COPY package*.json ./
RUN npm ci

COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]

