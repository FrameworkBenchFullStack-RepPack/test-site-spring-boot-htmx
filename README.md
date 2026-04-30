# test-site-spring-boot-htmx

Spring Boot + HTMX website.

## Prerequisites

- Java 25+ (I used Adoptium Temurin Java 25 LTS OpenJDK)
- PostgreSQL running on `localhost:5432` with a database named `benchmark`

## Build

```bash
./gradlew build
```

The production JAR is written to `build/libs/`.

## Run

### Production (from JAR)

```bash
PORT=8080 \
SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:5432/benchmark \
SPRING_DATASOURCE_USERNAME=benchmark \
SPRING_DATASOURCE_PASSWORD=benchmark \
java -jar build/libs/test-site-spring-boot-htmx-*.jar
```

If `PORT` is not set, the app defaults to **8080**.

### Development (Gradle wrapper)

```bash
PORT=8080 \
SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:5432/benchmark \
SPRING_DATASOURCE_USERNAME=benchmark \
SPRING_DATASOURCE_PASSWORD=benchmark \
./gradlew bootRun
```

## Configuration

| Environment variable         | Default                                      | Description          |
| ---------------------------- | -------------------------------------------- | -------------------- |
| `PORT`                       | `8080`                                       | HTTP port to bind to |
| `SPRING_DATASOURCE_URL`      | `jdbc:postgresql://localhost:5432/benchmark` | JDBC connection URL  |
| `SPRING_DATASOURCE_USERNAME` | `benchmark`                                  | Database username    |
| `SPRING_DATASOURCE_PASSWORD` | `benchmark`                                  | Database password    |

## Endpoints

Once running, the app is available at `http://localhost:{PORT}`.
