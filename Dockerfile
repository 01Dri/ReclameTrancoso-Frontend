FROM node:18 AS build-stage
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

RUN npm run build -- --configuration production --project reclama-trancoso

FROM nginx:alpine
COPY --from=build-stage /app/dist/reclama-trancoso /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
