![build](https://github.com/chhex/spring-boot-react-crud-revisited/actions/workflows/build.yml/badge.svg?branch=main)

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
![PRs welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)

# Revisited Baeldung Tutorial – React & Spring Boot CRUD

Revisited Baeldung Tutorial CRUD Application with React and Spring Boot — see https://www.baeldung.com/spring-boot-react-crud — **with versions pinned** so it actually works with today’s ecosystem.

The original article is ~4 years old and mixes libraries whose majors changed since.

Also I migrated the initial tutorial to the Vite starter [Template Vitamin 2.0](https://github.com/wtchnm/Vitamin), which uses:

- [Vite 6](https://vitejs.dev) with [React 19](https://reactjs.org), [TypeScript 5](https://www.typescriptlang.org) and [absolute imports](https://github.com/aleclarson/vite-tsconfig-paths).
- [Tailwind CSS v4](https://tailwindcss.com) for easy stylization.
- [Biome V2](https://next.biomejs.dev) for linting, formatting and automatic import sorting.
- Write unit and integration tests with [Vitest 3](https://vitest.dev/) and [Testing Library 16](https://testing-library.com/).
- Write e2e tests with [Playwright 1.52](https://www.cypress.io).

## Project layout

```
reactboot/               # Maven Spring Boot backend
└── frontend/            # React app (npm)
```

## Dev setup

### Single Artifact

Running the Application as Single Artifact with Spring Boot

```bash
./mvnw clean spring-boot:run -Psingle-art
```

### Frontend and Backend in seperate Processes

Backend (Spring Boot)

bash
./mvnw clean spring-boot:run -Dspring-boot.run.profiles=dev
``

Frontend (port 5173, proxies to 8080):

Change in file .env.development VITE_USE_MOCK=false

```bash
cd frontend
pnpm dev
```

### Only Frontend with Mock Data

Frontend (port 5173)

Change in file .env.development VITE_USE_MOCK=true

```bash
cd frontend
pnpm dev
```
