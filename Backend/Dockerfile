# Use Eclipse Temurin's Java 21 as base image
FROM eclipse-temurin:21-jdk-jammy as builder

# Set the working directory
WORKDIR /app

# Copy maven executable and pom.xml
COPY mvnw .
COPY .mvn .mvn
COPY pom.xml .

# Make the maven wrapper executable
RUN chmod +x ./mvnw

# Download dependencies (this layer can be cached)
RUN ./mvnw dependency:go-offline -B

# Copy source code
COPY src src

# Build the application
RUN ./mvnw package -DskipTests

# Runtime stage
FROM eclipse-temurin:21-jre-jammy

WORKDIR /app

# Copy the built jar from the builder stage
COPY --from=builder /app/target/*.jar app.jar

# Set the entrypoint to run the application
ENTRYPOINT ["java", "-jar", "app.jar"]
