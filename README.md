[![Frontend (pnpm)](https://github.com/chhex/spring-boot-react-crud-revisited2/actions/workflows/frontend.yml/badge.svg)](https://github.com/chhex/spring-boot-react-crud-revisited2/actions/workflows/frontend.yml)
[![Backend (Maven)](https://github.com/chhex/spring-boot-react-crud-revisited2/actions/workflows/backend.yml/badge.svg)](https://github.com/chhex/spring-boot-react-crud-revisited2/actions/workflows/backend.yml)
[![CI (frontend + backend + docker)](https://github.com/chhex/spring-boot-react-crud-revisited2/actions/workflows/ci.yml/badge.svg)](https://github.com/chhex/spring-boot-react-crud-revisited2/actions/workflows/ci.yml)
[![Deploy to Google Cloud Run (from GHCR image)](https://github.com/chhex/spring-boot-react-crud-revisited2/actions/workflows/deploy-cloudrun.yml/badge.svg)](https://github.com/chhex/spring-boot-react-crud-revisited2/actions/workflows/deploy-cloudrun.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
![PRs welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)

# Revisited Baeldung Tutorial – React & Spring Boot CRUD

Revisited Baeldung Tutorial CRUD Application with React and Spring Boot — see <https://www.baeldung.com/spring-boot-react-crud>

The original article is ~4 years old and mixes libraries whose majors changed since.

I migrated the initial tutorial to the Vite starter [Template Vitamin 2.0](https://github.com/wtchnm/Vitamin) to use:

- [Vite 6](https://vitejs.dev) with [React 19](https://reactjs.org), [TypeScript 5](https://www.typescriptlang.org) and [absolute imports](https://github.com/aleclarson/vite-tsconfig-paths).
- [Tailwind CSS v4](https://tailwindcss.com) for inline stylization.
- [Biome V2](https://next.biomejs.dev) for linting, formatting and automatic import sorting.
- [Vitest 3](https://vitest.dev/) and [Testing Library 16](https://testing-library.com/) for teasting.

The Java maven build supports a single jar execution of Spring Boot, with all the necessary Frontend assets.

A Dockerfile supports a Multistep Docker Image build for building and run the App as Single jar.

Additionaly there are Google Actions, which support among other a Github Docker image and a Action, whoch builds a Docker image and deploys it to Google Cloud Run.

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

This opens on <http://localhost:8080>

### Frontend and Backend in seperate Processes

Backend (Spring Boot)

```bash
./mvnw clean spring-boot:run -Dspring-boot.run.profiles=dev
```

Change in file .env.development VITE_USE_MOCK=false

```bash
cd frontend
pnpm dev
```

This opens to the Frontend port <http://localhost:5173> and proxies for the Rest calls to
Frontend (port 5173, proxies to 8080) : <http://localhost:8080>

### Only Frontend with Mock Data

Change in file .env.development VITE_USE_MOCK=true

```bash
cd frontend
pnpm dev
```

This opens to the Frontend port <http://localhost:5173> only and takes it's data from frontend/src/mocks/data/clients.json

## TODO's and next Steps

##### 1️⃣ Frontend API Layer (`src/api/clients.ts`)

- [x] Implement all CRUD calls aligned with Spring Boot endpoints:
- [x] Include `credentials: 'include'` for session support

##### 2️⃣ React Query Integration

- [x] Add CUD (Create , Update , Delete) Actions

##### 3️⃣ Backend (Spring Boot)

- [ ] Validate payloads
- [x] Tenant scoping already active via Hibernate filter
- [x] Extend `ClientRepository` with `deleteByTenantId()`

##### 4️⃣ Forms & Validation

- [ ] Convert forms to controlled inputs or use `react-hook-form`
- [ ] Add simple client-side checks (e.g. name required, valid email)
- [ ] Later integrate Valibot/Zod with `@hookform/resolvers`
- [ ] Provide visual feedback (e.g. Tailwind form styling)

##### 6️⃣ Session & Tenant Management

- [x] Use **Spring Session JDBC**
- [x] Store `TENANT_ID` in session (`anon:<sessionId>` or username)
- [x] Enable `tenantFilter` for all Hibernate sessions
- [x] On session timeout: delete rows by tenant id
- [x] On logout (if added): wipe tenant’s rows
- [x] Optional janitor job for stale tenants

##### 7️⃣ Build & Deployment

- [x] Add GitHub Actions:
  - [x] Java 21 + pnpm setup
  - [x] Cache Maven + pnpm deps
  - [x] Run backend & frontend tests
  - [x] Publish JAR / Docker image
- [x] Dockerfile:
  - [x] Multi-stage build
  - [x] Deployable to Render or Fly.io or Cloud Run
  - [x] Deploy to Google Cloud Run

#### 8️⃣ UX & Polish

- [ ] Add header bar with "Reset Demo" + "Logout" buttons
- [ ] Add loading spinners, empty states, and error boundaries

#### 9️⃣ Future Enhancements

- [ ] Pagination & search
- [ ] Toast notifications for CRUD actions
- [ ] Login / per-user tenants
- [x] Automated cleanup job (`@Scheduled`)
- [ ] E2E tests (Playwright)
- [ ] Modern component refactor (Hooks + Context)
- [x] Deploy live demo
