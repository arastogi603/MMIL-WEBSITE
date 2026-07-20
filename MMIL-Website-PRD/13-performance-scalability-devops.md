# 22. Performance

## 22.1 Lazy Loading
- Route-based code splitting is automatic with Next.js App Router (per-route bundles).
- Heavy, rarely-needed components (Rich Text Editor, QR Scanner, Analytics Charts) loaded via
  `next/dynamic(() => import(...), { ssr: false })` so their JS never ships to visitors who
  never open the Admin Dashboard or Event Submission form.

## 22.2 Image Optimization
- `next/image` everywhere — automatic responsive `srcset`, WebP/AVIF negotiation, lazy loading
  below the fold by default.
- Cloudinary transformations (`f_auto,q_auto`) applied at the URL level for all
  user-uploaded media (gallery, avatars, project images) so format/quality adapt per-client
  automatically without a manual re-encode pipeline.

## 22.3 Caching
See `05-hld-architecture.md` Section 11.11 for the full strategy: Next.js ISR (edge), React
Query (client), Redis (Phase 2, backend hot-path aggregates + rate-limit counters).

## 22.4 Redis Readiness
Backend service interfaces are written against a `CacheService` abstraction
(`get/set/invalidate`) from day one, backed by an in-memory no-op implementation at MVP scale
and swapped for a real Redis-backed implementation at Phase 2 without touching any caller —
this is a **dependency-inversion boundary**, not a promise to deploy Redis at launch.

## 22.5 Compression
gzip/Brotli response compression enabled at the platform/proxy level (Vercel does this
automatically for the frontend; Node backend uses the `compression` middleware; Spring Boot
enables `server.compression.enabled=true`).

## 22.6 Database Indexes
Every collection's indexing strategy is specified in `07-database-design.md` per-collection —
compound indexes chosen to match the actual query patterns from Section 14's endpoint catalog
(e.g., `{status:1, startDate:1}` on `events` because the public list query always filters by
status and sorts by date). Index usage is verified via `.explain("executionStats")` in CI
integration tests for the highest-traffic queries before merge.

## 22.7 Virtualization
Long admin lists/tables (audit logs, member directory at scale) use row virtualization
(`@tanstack/react-virtual`) once a table's typical row count exceeds ~200, to keep DOM node
count bounded regardless of dataset size.

---

# 23. Scalability

## 23.1 Horizontal Scaling
Both backend variants are fully stateless (JWT auth, no server-side session, no in-process
sticky state beyond the in-memory permission cache which is safely re-derivable per instance)
— any number of replicas can run behind the platform's load balancer with zero
coordination requirements.

## 23.2 Vertical Scaling
Used only as a stop-gap for MongoDB Atlas tier upgrades (M10 → M20 → …) under sudden load
spikes; the default and expected scaling lever for the app tier is horizontal (Section 23.1).

## 23.3 Microservices Readiness
The codebase is a **modular monolith** at launch (both backend variants), deliberately
structured so any module (`notifications`, `certificates`, `analytics`) can be extracted into
a standalone deployable service later because:
- Each module already has a clean Controller→Service→Repository boundary with no cross-module
  direct DB access (modules call each other's **service interfaces**, never reach into another
  module's repository/collection directly).
- The Notification module already communicates via a `NotificationService.send()` interface
  that could become a queue publish call (`publish("notification.created", payload)`) with zero
  change to any caller.

## 23.4 CDN
Vercel Edge Network (frontend/ISR) + Cloudinary CDN (media) — covered fully in
`05-hld-architecture.md` Section 11.12.

## 23.5 Redis
See Section 22.4 — cache-ready abstraction, deployed at Phase 2 (see roadmap in
`15-roadmap-timeline-risks-future.md`).

## 23.6 Queue / Event-Driven Architecture Readiness
At MVP scale, all side effects (send confirmation email, generate certificate PDF, notify on
recruitment status change) run synchronously within the request or as simple `setImmediate`/
`@Async` fire-and-forget calls. The `NotificationService` and a proposed `JobDispatcher`
interface are written so that, at Phase 3 scale, these can move to a real queue
(e.g., BullMQ on Redis, or Azure Service Bus/AWS SQS equivalent) by swapping the dispatcher
implementation — no controller/service caller code changes required. This is documented as a
**scaling trigger**: adopt a real queue when P95 request latency on write endpoints exceeds
~500ms due to synchronous side-effect work, or when email volume requires retry/backoff
semantics a simple `try/catch` can't provide.

## 23.7 Scale Target Validation (100,000+ users)
- MongoDB Atlas: indexed queries + Atlas auto-scaling storage comfortably serve 100k+ user
  collections; sharding by `chapterId` is the pre-planned path if/when multi-chapter write
  volume requires it (not needed at single-chapter, 100k-user scale — read/write volume per
  user in this domain is low-frequency, not high-frequency like a chat app).
- Stateless app tier scales horizontally to match traffic; the only genuinely stateful,
  harder-to-scale-later piece is MongoDB itself, which is why the `chapterId` tenancy key and
  index strategy are established from day one rather than retrofitted.

---

# 24. DevOps

## 24.1 Docker
Both backends ship a multi-stage `Dockerfile` (build stage compiles/installs deps, final stage
copies only the production artifact + runtime deps, non-root user, `HEALTHCHECK` instruction
pointing at `/api/v1/health`).

```dockerfile
# Node backend — representative multi-stage Dockerfile
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine AS production
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules
COPY package*.json ./
USER node
HEALTHCHECK --interval=30s --timeout=5s CMD wget -qO- http://localhost:8080/api/v1/health || exit 1
EXPOSE 8080
CMD ["node", "dist/server.js"]
```

## 24.2 Docker Compose (local dev)
```yaml
version: "3.9"
services:
  mongo:
    image: mongo:7
    ports: ["27017:27017"]
    volumes: ["mongo-data:/data/db"]
  backend-node:
    build: ./mmil-backend-node
    env_file: ./mmil-backend-node/.env
    ports: ["8080:8080"]
    depends_on: [mongo]
  frontend:
    build: ./mmil-frontend
    env_file: ./mmil-frontend/.env.local
    ports: ["3000:3000"]
    depends_on: [backend-node]
volumes:
  mongo-data:
```
(A parallel `backend-spring` service definition follows the same pattern for local Spring
Boot development, run instead of `backend-node`, never both against the same writable DB
simultaneously in dev either, to keep local behavior consistent with production's
single-active-backend model.)

## 24.3 GitHub Actions CI/CD (representative pipeline, per repo: frontend, backend-node,
backend-spring each have their own workflow)
```yaml
name: CI
on: [pull_request, push]
jobs:
  lint-test-build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20 }
      - run: npm ci
      - run: npm run lint
      - run: npm run typecheck
      - run: npm run test -- --coverage
      - run: npm run build
      - name: BIL contract test (against staging deploy)
        run: npm run test:contract
  deploy:
    needs: lint-test-build
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - run: echo "Deploy step — Vercel/Render/Railway/Azure provider action"
```

## 24.4 Environment Variables
Full catalog in `17-env-vars-response-format-error-logging.md` Section 33. CI validates that
every variable referenced in code exists in the corresponding `.env.example`.

## 24.5 Monitoring
Sentry (frontend + both backends) for error tracking; platform-native metrics (Vercel
Analytics, Render/Railway/Azure dashboards) for infra-level CPU/memory/latency; MongoDB Atlas
built-in performance advisor for slow-query detection.

## 24.6 Logging
Structured JSON logs shipped to the platform's native log aggregation; format standard defined
in Section 36 of `17-env-vars-response-format-error-logging.md`.

## 24.7 Health Checks
`GET /api/v1/health` (liveness — process is up) and `GET /api/v1/health/ready` (readiness —
Mongo ping succeeds) on both backend variants; used by the deploy platform for zero-downtime
rolling deploys (new instance must pass readiness before old instance is drained).
