# 14. API Design — REST

## 14.0 Feature → Collection → Endpoint Traceability (excerpt of the most-used resources)

| Feature | Collection(s) | Base route |
|---|---|---|
| Auth | users | `/api/v1/auth` |
| Events/Hackathons/Workshops | events, hackathonDetails, teams | `/api/v1/events` |
| Registration | registrations | `/api/v1/events/:id/registrations` |
| Recruitment | recruitmentCycles, applications | `/api/v1/recruitment-cycles` |
| Projects | projects | `/api/v1/projects` |
| Blogs | blogs | `/api/v1/blogs` |
| Certificates | certificates | `/api/v1/certificates`, public `/api/v1/verify/:certificateId` |
| Notifications | notifications | `/api/v1/notifications` |
| Admin: Roles | roles, permissions | `/api/v1/admin/roles` |
| Admin: Audit | auditLogs | `/api/v1/admin/audit-logs` |

## 14.1 Global API Rules
- **Base path:** `/api/v1` — all future breaking changes ship as `/api/v2`, old version kept
  running until frontend fully migrates (no big-bang cutover).
- **Auth header:** `Authorization: Bearer <accessToken>` on all protected routes.
- **Response envelope (all responses, success or error):**
  ```json
  { "success": true, "message": "string", "data": {}, "errors": null, "timestamp": "ISO-8601" }
  ```
- **Pagination (list endpoints):** query params `?page=1&limit=20&sort=-createdAt&search=&filter[status]=published`.
  Response `data` shape for lists:
  ```json
  { "items": [...], "page": 1, "limit": 20, "totalItems": 143, "totalPages": 8 }
  ```
- **Status codes:** `200` read/update ok, `201` created, `204` deleted (no body), `400`
  validation error, `401` unauthenticated, `403` forbidden (authenticated but lacking
  permission), `404` not found, `409` conflict (capacity/version/duplicate), `422` semantic
  validation failure, `429` rate limited, `500` unhandled server error.
- **Error codes** (in `errors` array, each `{code, field?, message}`): stable machine-readable
  strings (`TOKEN_EXPIRED`, `REGISTRATION_CLOSED`, `VERSION_CONFLICT`, `CYCLE_CLOSED`,
  `SUBMISSION_CLOSED`, `CERTIFICATE_NOT_FOUND`, `QR_EXPIRED`, `VALIDATION_ERROR`), consumed by
  the frontend for targeted UX (not just a generic toast).

## 14.2 Endpoint Catalog — Auth
| Method | Route | Auth | Notes |
|---|---|---|---|
| POST | `/auth/signup` | No | email/password |
| POST | `/auth/login` | No | rate-limited |
| POST | `/auth/oauth/google` | No | exchanges OAuth code |
| POST | `/auth/oauth/microsoft` | No | exchanges OAuth code |
| POST | `/auth/refresh` | Refresh cookie | rotates refresh token |
| POST | `/auth/logout` | Yes | revokes refresh token family |
| POST | `/auth/forgot-password` | No | rate-limited |
| POST | `/auth/reset-password/:token` | No | |
| GET | `/auth/verify-email/:token` | No | |
| GET | `/auth/me` | Yes | current user profile |

## 14.3 Endpoint Catalog — Events
| Method | Route | Auth | Permission |
|---|---|---|---|
| GET | `/events` | No | public, `status=published` only unless staff |
| GET | `/events/:slug` | No | public |
| POST | `/events` | Yes | `event:create` (coordinator+) |
| PATCH | `/events/:id` | Yes | `event:update` (owner coordinator or admin) |
| POST | `/events/:id/publish` | Yes | `event:publish` |
| DELETE | `/events/:id` | Yes | `event:delete` (soft delete) |
| POST | `/events/:id/registrations` | Yes | any authenticated student |
| GET | `/events/:id/registrations` | Yes | `event:manage` (owner coordinator/admin) |
| POST | `/events/:id/attendance` | Yes | QR-signed token required |
| POST | `/events/:id/teams` | Yes | team creation for team events |
| PATCH | `/events/:id/teams/:teamId` | Yes | leader or admin |

## 14.4 Endpoint Catalog — Hackathons
| Method | Route | Auth | Notes |
|---|---|---|---|
| POST | `/events/:id/submissions` | Yes | team leader, pre-deadline only |
| PATCH | `/events/:id/submissions/:subId` | Yes | update before deadline |
| POST | `/events/:id/submissions/:subId/score` | Yes | judge only, excludes own team |
| GET | `/events/:id/leaderboard` | Yes/No | public after `resultsPublished=true` |

## 14.5 Endpoint Catalog — Recruitment
| Method | Route | Auth | Notes |
|---|---|---|---|
| GET | `/recruitment-cycles` | No | `status=open` public list |
| GET | `/recruitment-cycles/:slug` | No | includes dynamic form schema |
| POST | `/recruitment-cycles` | Yes | `recruitment:manage` |
| POST | `/recruitment-cycles/:id/applications` | Yes | applicant |
| GET | `/recruitment-cycles/:id/applications` | Yes | `recruitment:review`, filterable by status/domain |
| PATCH | `/applications/:id/status` | Yes | `recruitment:review`, logs audit entry |
| GET | `/applications/me` | Yes | applicant's own applications |

## 14.6 Endpoint Catalog — Projects, Blogs, Gallery, Certificates, Notifications
Standard REST CRUD (`GET list`, `GET :slug/:id`, `POST`, `PATCH`, `DELETE`) for `/projects`,
`/blogs`, `/gallery-albums`, plus:
- `GET /verify/:certificateId` — public, no auth.
- `GET /notifications` (own), `PATCH /notifications/:id/read`, `PATCH /notifications/read-all`.

## 14.7 Endpoint Catalog — Admin
`/admin/roles`, `/admin/permissions`, `/admin/audit-logs` (read-only), `/admin/settings`,
`/admin/analytics/*` (aggregation-backed read endpoints, e.g.
`/admin/analytics/registrations-over-time`, `/admin/analytics/recruitment-funnel`).

## 14.8 Filtering, Sorting, Search
- Filtering: `filter[field]=value`, supports `filter[status]=published`,
  `filter[domain]=AI`, combinable.
- Sorting: `sort=-createdAt` (prefix `-` = descending), whitelisted sortable fields per
  resource (prevents arbitrary/unindexed sort abuse).
- Search: `search=` triggers a MongoDB text-index query on the resource's designated
  searchable fields (title/description/tags), or Atlas Search for the global `/search`
  endpoint spanning multiple collections.

## 14.9 Pagination Details
Page-number pagination for all admin/list endpoints (predictable, jump-to-page UX in
DataTables); the same envelope also supports cursor-style consumption by passing
`page` values sequentially from public infinite-scroll feeds — no separate cursor
implementation needed at this scale (documented decision, revisit if a collection exceeds
~1M documents where skip-based pagination degrades — Atlas Search or range-based cursor
pagination would replace it then).

## 14.10 Versioning
URL-path versioning (`/api/v1`, `/api/v2` when needed) — never header-based, for simplicity
of caching/CDN behavior and debuggability in browser network tabs.

---

# 15. API Contract — OpenAPI Specification

Below is a representative OpenAPI 3.1 excerpt (Events + Auth resources) establishing the
pattern every other resource follows. The full spec (all 20+ resources) should be generated
into `openapi.yaml` at repo root and kept in sync via a CI check (spec-vs-implementation
drift test) — see `13-performance-scalability-devops.md` CI/CD section.

```yaml
openapi: 3.1.0
info:
  title: MMIL Backend Interface Layer (BIL) API
  version: "1.0.0"
  description: >
    Backend-agnostic REST contract. Both the Node/Express and Spring Boot
    implementations MUST satisfy this spec identically.
servers:
  - url: https://api.mmil.dev/api/v1
    description: Production (backend-agnostic base URL)

components:
  securitySchemes:
    bearerAuth:
      type: http
      scheme: bearer
      bearerFormat: JWT
  schemas:
    ApiResponse:
      type: object
      properties:
        success: { type: boolean }
        message: { type: string }
        data: {}
        errors:
          type: array
          nullable: true
          items:
            type: object
            properties:
              code: { type: string }
              field: { type: string, nullable: true }
              message: { type: string }
        timestamp: { type: string, format: date-time }
    Event:
      type: object
      properties:
        id: { type: string }
        title: { type: string }
        slug: { type: string }
        description: { type: string }
        type: { type: string, enum: [event, hackathon, workshop] }
        status: { type: string, enum: [draft, published, cancelled, completed] }
        startDate: { type: string, format: date-time }
        endDate: { type: string, format: date-time }
        registrationOpensAt: { type: string, format: date-time }
        registrationClosesAt: { type: string, format: date-time }
        capacity: { type: integer, nullable: true }
        seatsTaken: { type: integer }
        isTeamEvent: { type: boolean }
        teamSizeMin: { type: integer, nullable: true }
        teamSizeMax: { type: integer, nullable: true }
      required: [id, title, slug, type, status, startDate, endDate]
    CreateEventRequest:
      type: object
      required: [title, description, type, startDate, endDate, registrationOpensAt, registrationClosesAt]
      properties:
        title: { type: string, minLength: 3, maxLength: 120 }
        description: { type: string, minLength: 10 }
        type: { type: string, enum: [event, hackathon, workshop] }
        startDate: { type: string, format: date-time }
        endDate: { type: string, format: date-time }
        registrationOpensAt: { type: string, format: date-time }
        registrationClosesAt: { type: string, format: date-time }
        capacity: { type: integer, nullable: true, minimum: 1 }
        isTeamEvent: { type: boolean, default: false }
        teamSizeMin: { type: integer, minimum: 1 }
        teamSizeMax: { type: integer, minimum: 1 }

paths:
  /events:
    get:
      summary: List published events (public) or all events (staff)
      parameters:
        - in: query
          name: page
          schema: { type: integer, default: 1 }
        - in: query
          name: limit
          schema: { type: integer, default: 20 }
        - in: query
          name: sort
          schema: { type: string, default: "-startDate" }
        - in: query
          name: filter[status]
          schema: { type: string }
        - in: query
          name: filter[type]
          schema: { type: string }
        - in: query
          name: search
          schema: { type: string }
      responses:
        "200":
          description: Paginated list of events
          content:
            application/json:
              schema:
                allOf:
                  - $ref: "#/components/schemas/ApiResponse"
    post:
      summary: Create a new event (draft)
      security: [{ bearerAuth: [] }]
      requestBody:
        required: true
        content:
          application/json:
            schema: { $ref: "#/components/schemas/CreateEventRequest" }
      responses:
        "201": { description: Event created }
        "400": { description: Validation error }
        "403": { description: Missing event:create permission }

  /events/{slug}:
    get:
      summary: Get event details by slug
      parameters:
        - in: path
          name: slug
          required: true
          schema: { type: string }
      responses:
        "200": { description: Event detail }
        "404": { description: Event not found }

  /events/{id}/registrations:
    post:
      summary: Register the current user for an event
      security: [{ bearerAuth: [] }]
      parameters:
        - in: path
          name: id
          required: true
          schema: { type: string }
      responses:
        "201": { description: Registration created (confirmed or waitlisted) }
        "409": { description: "REGISTRATION_CLOSED or already registered" }

  /auth/login:
    post:
      summary: Login with email + password
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required: [email, password]
              properties:
                email: { type: string, format: email }
                password: { type: string, minLength: 8 }
      responses:
        "200": { description: "Access + refresh token issued" }
        "401": { description: Invalid credentials }
        "429": { description: Rate limited }
```

**Swagger UI:** Both backends expose interactive docs generated from this spec — Node via
`swagger-ui-express` served at `/api/v1/docs`, Spring via `springdoc-openapi` at
`/swagger-ui.html`, both rendering the *same* `openapi.yaml` (Spring's auto-generated spec is
diffed against the canonical file in CI to prevent drift; Node's is hand-authored from the
same canonical file since Express doesn't reflect types at runtime).

**Backend Interface Layer (BIL) contract test suite:** a shared Postman/Newman or Dredd
collection runs against whichever backend is deployed to staging on every PR, asserting
response shape, status codes, and error codes match this spec — this is the enforcement
mechanism that guarantees frontend portability between the two backends.
