#Etapa 1: Build


FROM maven:3.9.11-eclipse-temurin-17-alpine as build

WORKDIR /app

COPY  pom.xml ./

COPY src ./src

# Compila e gera o JAR da aplicação
RUN mvn clean package


#Etapa 2: Execução do Backend

FROM eclipse-temurin:17-jre-alpine

WORKDIR /app

#Copiar o JAR que foi gerado na etapa build

COPY  --from=build /app/target/*.jar app.jar