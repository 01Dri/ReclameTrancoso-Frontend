<<<<<<< HEAD
=======
# Etapa de build
>>>>>>> 67bed740522e20f82129072af46be8815b6784d2
FROM node:18 AS build-stage
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

<<<<<<< HEAD
RUN npm run build -- --configuration production --project reclama-trancoso

FROM nginx:alpine
COPY --from=build-stage /app/dist/reclama-trancoso /usr/share/nginx/html
=======
# Instala o Angular CLI
RUN npm install -g @angular/cli

# Executa a construção do aplicativo Angular
RUN ng build --configuration production --project reclama-trancoso
RUN ls -R /app/dist


# Etapa do Nginx
FROM nginx:alpine
COPY --from=build-stage /app/dist/reclama-trancoso/browser /usr/share/nginx/html

>>>>>>> 67bed740522e20f82129072af46be8815b6784d2
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
