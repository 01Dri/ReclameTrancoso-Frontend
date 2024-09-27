# Etapa de build
FROM node:18 AS build-stage
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

# Instala o Angular CLI
RUN npm install -g @angular/cli

# Executa a construção do aplicativo Angular
RUN ng build --configuration production --project reclama-trancoso
RUN ls -R /app/dist


# Etapa do Nginx
FROM nginx:alpine
COPY --from=build-stage /app/dist/reclama-trancoso/browser /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
