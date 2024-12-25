# Stage 1: Build application
FROM maven:3.8.4-openjdk-17-slim AS build
WORKDIR /app

# Copy toàn bộ mã nguồn vào container
COPY ./CarSystem /app/CarSystem

# Build ứng dụng với Maven
RUN mvn package -f /app/CarSystem/pom.xml -DskipTests

# Stage 2: Runtime environment
FROM openjdk:17-slim
WORKDIR /app

# Copy file JAR từ giai đoạn build vào runtime stage
COPY --from=build /app/CarSystem/target/*.jar app.jar
COPY --from=build /app/CarSystem/uploads /app/uploads

# Expose port ứng dụng
EXPOSE 8088

# Chạy ứng dụng
CMD ["java", "-jar", "app.jar"]
