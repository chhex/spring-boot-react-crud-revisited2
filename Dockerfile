# A 3 stage Dockerfile, whoch first installs pnpm and builds the frontend,
# since the maven build expects pnpm installed and the built frontend assets to be present.

# ---- frontend build stage ----------------------------------------------------------
FROM node:20-alpine AS web
WORKDIR /app
# enable pnpm (you can pin a version if you like)
RUN corepack enable && corepack prepare pnpm@10.20.0 --activate
ENV CI=1 PNPM_UPDATE_NOTIFIER=false NO_UPDATE_NOTIFIER=1
# copy only lock + manifest to leverage Docker layer cache
COPY frontend/pnpm-lock.yaml frontend/package.json ./frontend/
WORKDIR /app/frontend
RUN pnpm install --frozen-lockfile
# now copy the rest of the frontend sources and build
COPY frontend/ .
RUN pnpm build   # -> /app/frontend/dist

# ---- backend build stage , single jar -----------------------------------------------------------
FROM maven:3.9-eclipse-temurin-21 AS build
WORKDIR /app
COPY pom.xml .
RUN mvn -q -DskipTests dependency:go-offline
# copy backend sources
COPY src ./src
# copy the built frontend into the location the pom expects
COPY --from=web /app/frontend/dist ./frontend/dist
RUN mvn -q -Psingle-jar -DskipTests -Dskip.frontend=true clean package

# ---- run stage ---------------------------------------------------------------
FROM gcr.io/distroless/java21-debian12
WORKDIR /app
COPY --from=build /app/target/*-SNAPSHOT.jar /app/app.jar
EXPOSE 8080
ENV SPRING_PROFILES_ACTIVE=demo
USER nonroot:nonroot
ENTRYPOINT ["java","-jar","/app/app.jar"]