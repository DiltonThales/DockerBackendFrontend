# Etapa 1: Build

FROM node:22-alpine AS build 

WORKDIR /app 


COPY angular.json package.json tsconfig.app.json tsconfig.json ./

COPY src ./src  

#Build do front
RUN npm install && npm run build

#Etapa 2: Start do serviço web

FROM nginx:alpine 

WORKDIR /usr/share/nginx/html

#Apaga is arquivos default do nginx
RUN rm -rf ./*

COPY --from=build /app/dist/mini-trello-frontend/browser .

COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

# Inicia o serviço do nginx
ENTRYPOINT [ "nginx", "-g", "daemon off;" ]