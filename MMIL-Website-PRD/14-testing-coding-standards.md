# 25. Testing Strategy

## 25.1 Unit Testing
- **Frontend:** Vitest/Jest + React Testing Library for components/hooks; pure logic (Zod
  schemas, utility functions) tested in isolation without rendering.
- **Node backend:** Jest — services tested with repositories mocked (no real DB), covering
  every business rule from Section 3 (capacity edge cases, recruitment state machine
  transitions, judging conflict-of-interest exclusion).
- **Spring backend:** JUnit5 + Mockito — services tested with repositories mocked, same
  business-rule coverage target as the Node suite (parity is a stated goal, since both must
  satisfy identical behavior per the BIL contract).
- **Coverage target:** ≥80% line coverage on `services/` (business logic) in both backends;
  100% coverage is not required on `controllers/`/`repositories/` where logic is thin.

## 25.2 Integration Testing
- Both backends run integration tests against a real (ephemeral) MongoDB instance —
  Testcontainers (Spring) / `mongodb-memory-server` (Node) — exercising the full
  Controller→Service→Repository→DB path per endpoint, including index-dependent queries
  (verifying capacity race-condition handling under concurrent requests, uniqueness
  constraints, etc.).

## 25.3 E2E Testing
Playwright (frontend) covering the critical user journeys end-to-end against a staging
deployment: signup→verify→login, browse→register for event, apply to recruitment cycle,
submit project, admin creates+publishes an event, admin reviews an application. Run on every
PR against `staging` before allowing merge to `main`.

## 25.4 API/Contract Testing
The **BIL contract test suite** (Dredd or Postman/Newman collection derived from the OpenAPI
spec in `08-api-design-and-openapi.md`) runs against whichever backend is deployed to
staging, asserting response envelope shape, status codes, and error codes match the spec
exactly. This is the mechanism that guarantees the two backend implementations remain
truly interchangeable — it must pass identically against both the Node and Spring
deployments before either is promoted to production.

## 25.5 Performance Testing
k6 (or Artillery) load test scripts targeting the highest-traffic endpoints (`GET /events`,
`POST /events/:id/registrations` under simulated concurrent registration bursts at event
launch, `GET /blogs`) — run manually before major launches (e.g., recruitment cycle opening,
flagship hackathon registration opening) to validate the capacity-check atomic operation holds
under real concurrency and that P95 latency stays under the 400ms target from Section 1.6.

## 25.6 Security Testing
- Automated: `npm audit`/`OWASP Dependency-Check` (Maven) in CI, failing the build on
  high/critical vulnerabilities.
- Manual/periodic: a lightweight OWASP ZAP baseline scan against staging before major
  releases; annual manual review of the Authorization Matrix (Section 20) against actual
  route-level permission declarations to catch drift.

---

# 27. Coding Standards

## 27.1 Naming
- **TypeScript/React:** `PascalCase` components/types, `camelCase` variables/functions,
  `kebab-case` file names for non-component files, `PascalCase.tsx` for component files.
- **Java:** standard Java conventions — `PascalCase` classes, `camelCase` methods/fields,
  `UPPER_SNAKE_CASE` constants.
- **MongoDB fields:** `camelCase` consistently across all collections (matches JSON/JS/TS
  naming, avoids case-mapping friction at the API boundary).
- **API routes:** `kebab-case`, plural nouns (`/recruitment-cycles`, not `/recruitmentCycle`).

## 27.2 Architecture Rules (enforced in code review, not just documented)
- SOLID principles — most concretely enforced via the Controller→Service→Repository
  separation (Single Responsibility) and the `CacheService`/`NotificationService` interface
  boundaries (Dependency Inversion, Section 22.4/23.6).
- Clean Architecture — dependencies point inward (controllers depend on services, services
  depend on repository *interfaces*, never the reverse).
- Repository Pattern — no direct Mongoose/Spring Data model access from services; always
  through a repository method.
- DTO Pattern — request/response DTOs are never the same object as the domain/persistence
  model (Section 18.4).
- Service Layer Pattern — all business rules live in services, never in controllers or
  repositories.
- Feature-Based Folder Structure — code organized by domain module (`events/`, `recruitment/`)
  not by technical layer at the top level (Section 12.2/12.3 folder structures).

## 27.3 Documentation & Comments
- Every exported function/service method has a doc comment (JSDoc/TSDoc for TS, Javadoc for
  Java) describing intent, not restating the signature.
- Comments explain **why**, not **what** (the code should be readable enough to convey what).
- Every module has a short `README.md` describing its business rules with a link back to the
  relevant Section 3 requirement in this PRD, so the spec and the code stay traceable to each
  other.

## 27.4 Git Strategy
- **Trunk-based with short-lived feature branches:** `main` is always deployable; feature
  branches (`feat/event-capacity-race-fix`) merge via PR after CI passes + 1 review.
- **Branch naming:** `feat/...`, `fix/...`, `chore/...`, `docs/...`, `refactor/...`.
- Protected `main`: no direct pushes, required status checks (lint, typecheck, test, build,
  contract test) before merge.

## 27.5 Commit Convention
Conventional Commits (`feat:`, `fix:`, `chore:`, `docs:`, `refactor:`, `test:`, `perf:`), e.g.
`feat(events): add atomic capacity check to prevent overbooking`. Enables automated changelog
generation and semantic-release-style versioning for the backend packages if desired later.
