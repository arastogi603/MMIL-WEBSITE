# 33. Environment Variables

## 33.1 Frontend (`mmil-frontend/.env.example`)
```
NEXT_PUBLIC_API_BASE_URL=https://api.mmil.dev/api/v1
NEXT_PUBLIC_SITE_URL=https://mmil.dev
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=mmil
NEXT_PUBLIC_GOOGLE_OAUTH_CLIENT_ID=
NEXT_PUBLIC_MICROSOFT_OAUTH_CLIENT_ID=
NEXT_PUBLIC_SENTRY_DSN=
```
Note: only `NEXT_PUBLIC_*` variables reach the browser bundle by Next.js convention — no
secret ever uses this prefix.

## 33.2 Backend — Node/Express (`mmil-backend-node/.env.example`)
```
NODE_ENV=production
PORT=8080
MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/mmil
JWT_ACCESS_PRIVATE_KEY=
JWT_ACCESS_PUBLIC_KEY=
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_SECRET=
JWT_REFRESH_EXPIRES_IN=7d
GOOGLE_OAUTH_CLIENT_ID=
GOOGLE_OAUTH_CLIENT_SECRET=
MICROSOFT_OAUTH_CLIENT_ID=
MICROSOFT_OAUTH_CLIENT_SECRET=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
EMAIL_PROVIDER_API_KEY=
EMAIL_FROM_ADDRESS=no-reply@mmil.dev
CORS_ALLOWED_ORIGINS=https://mmil.dev,https://staging.mmil.dev
RATE_LIMIT_ENABLED=true
REDIS_URL=                     # optional, Phase 2
SENTRY_DSN=
```

## 33.3 Backend — Spring Boot (`mmil-backend-spring/.env.example`, mapped via `application.yml`)
```
SERVER_PORT=8080
SPRING_DATA_MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/mmil
JWT_ACCESS_PRIVATE_KEY=
JWT_ACCESS_PUBLIC_KEY=
JWT_ACCESS_EXPIRES_IN_MIN=15
JWT_REFRESH_SECRET=
JWT_REFRESH_EXPIRES_IN_DAYS=7
GOOGLE_OAUTH_CLIENT_ID=
GOOGLE_OAUTH_CLIENT_SECRET=
MICROSOFT_OAUTH_CLIENT_ID=
MICROSOFT_OAUTH_CLIENT_SECRET=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
EMAIL_PROVIDER_API_KEY=
EMAIL_FROM_ADDRESS=no-reply@mmil.dev
CORS_ALLOWED_ORIGINS=https://mmil.dev,https://staging.mmil.dev
REDIS_URL=                     # optional, Phase 2
SENTRY_DSN=
```

Both backend `.env.example` files must stay in lockstep in *meaning* (same logical config)
even though key names follow each ecosystem's convention (`camelCase`-ish env vars for Node,
Spring's typical `SCREAMING_SNAKE` mapped into `application.yml` placeholders) — this
asymmetry is expected and does not violate the BIL contract, since env vars are an operational
concern, not part of the wire contract.

---

# 34. API Response Format

**Every** response (2xx or error) uses this exact envelope, from both backends:
```json
{
  "success": true,
  "message": "Human-readable summary",
  "data": {},
  "errors": null,
  "timestamp": "2026-07-19T10:15:00.000Z"
}
```

**Error example:**
```json
{
  "success": false,
  "message": "Validation failed",
  "data": null,
  "errors": [
    { "code": "VALIDATION_ERROR", "field": "email", "message": "Must be a valid email address" }
  ],
  "timestamp": "2026-07-19T10:15:00.000Z"
}
```

**List/pagination example (`data` shape for any list endpoint):**
```json
{
  "success": true,
  "message": "Events retrieved",
  "data": {
    "items": [ { "id": "...", "title": "..." } ],
    "page": 1,
    "limit": 20,
    "totalItems": 143,
    "totalPages": 8
  },
  "errors": null,
  "timestamp": "2026-07-19T10:15:00.000Z"
}
```

Both backend implementations serialize this envelope via a shared helper
(`shared/responseEnvelope.ts` in Node; `common/response/ApiResponse.java` in Spring) so no
controller ever hand-builds a response object — eliminating envelope-shape drift between the
two stacks as new endpoints are added over time.

---

# 35. Error Handling Standards

- **Never** leak stack traces, internal file paths, or raw driver error messages
  (e.g. raw MongoDB duplicate-key errors) to the client — the global error handler maps every
  known error type to a stable `{code, message}` pair from a **shared error-code registry**
  (kept as a single source-of-truth table, mirrored in both backends and in frontend TS
  constants, so `if (error.code === "REGISTRATION_CLOSED")` is safe to branch on in the UI).
- **Error code registry (representative subset):** `VALIDATION_ERROR`, `UNAUTHORIZED`,
  `FORBIDDEN`, `NOT_FOUND`, `TOKEN_EXPIRED`, `TOKEN_INVALID`, `REGISTRATION_CLOSED`,
  `CAPACITY_EXCEEDED`, `ALREADY_REGISTERED`, `CYCLE_CLOSED`, `SUBMISSION_CLOSED`,
  `VERSION_CONFLICT`, `CERTIFICATE_NOT_FOUND`, `QR_EXPIRED`, `RATE_LIMITED`,
  `EMAIL_NOT_VERIFIED`, `INTERNAL_ERROR`.
- **Client-safe vs. internal-only detail:** domain exceptions carry both a client-safe
  `message` and an optional internal-only `debugDetail` that is logged but never serialized
  into the HTTP response.
- **Unhandled exceptions:** always caught by the outermost error handler/`@ControllerAdvice`,
  logged at `error` level with full stack + correlation ID, and returned to the client as a
  generic `500 INTERNAL_ERROR` with no implementation detail.

---

# 36. Logging Standards

**Structured JSON log line shape (both backends):**
```json
{
  "timestamp": "2026-07-19T10:15:00.000Z",
  "level": "info",
  "requestId": "b6f1a2c4-9e3d-4a11-8f2a-7d6c5b4a3e21",
  "userId": "665f1a2b3c4d5e6f7a8b9c01",
  "method": "POST",
  "route": "/api/v1/events/665.../registrations",
  "statusCode": 201,
  "durationMs": 42,
  "message": "Registration created",
  "context": { "eventId": "665f1a2b3c4d5e6f7a8b9d10", "status": "confirmed" }
}
```
- **Levels:** `debug` (dev only), `info` (normal request/business events), `warn` (recoverable
  anomalies — e.g. rate limit hit), `error` (unhandled exceptions, failed external calls).
- **Never log:** passwords/password hashes, full JWTs, OAuth client secrets, full request
  bodies containing PII beyond what's needed for the log's purpose.
- **Correlation:** every request gets a `requestId` (generated at the request-logging
  middleware, propagated through service/repository log calls via async-local-storage in Node
  / `MDC` in Spring/Logback) so a single user action's full log trail can be reconstructed.
- **Business events** (not just HTTP request logs) are logged explicitly at key domain
  transitions — `event.published`, `application.status_changed`, `certificate.issued`,
  `registration.waitlisted` — to make the Analytics/Audit story reconstructable from logs even
  independent of the `auditLogs` collection.
