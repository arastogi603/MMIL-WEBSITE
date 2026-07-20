# 18. Backend Architecture (Detailed — Dual Stack)

This section details the internal layering shared conceptually by both backend
implementations. Folder-level structure is in `06-lld-folder-structures.md`; this section
covers the responsibilities and code-level conventions of each layer.

## 18.1 Controllers
- Parse and validate the incoming request against the resource DTO (Zod in Node,
  Bean Validation in Spring).
- Call exactly one service method — controllers never contain business logic or direct DB
  access.
- Map the service's return value (or thrown domain exception) into the standard response
  envelope; never leak internal domain objects or stack traces to the client.
- Example (Node/Express):
```ts
// modules/events/events.controller.ts
export async function createEvent(req: Request, res: Response, next: NextFunction) {
  try {
    const dto = createEventSchema.parse(req.body);       // Zod validation
    const event = await eventsService.create(dto, req.user!.id);
    return res.status(201).json(envelope.success(event, "Event created"));
  } catch (err) {
    next(err);                                            // centralized error middleware
  }
}
```
- Example (Spring Boot):
```java
@RestController
@RequestMapping("/api/v1/events")
public class EventController {
    private final EventService eventService;

    @PostMapping
    @PreAuthorize("hasAuthority('event:create')")
    public ResponseEntity<ApiResponse<EventResponseDto>> createEvent(
            @Valid @RequestBody CreateEventDto dto,
            @AuthenticationPrincipal UserPrincipal principal) {
        EventResponseDto event = eventService.create(dto, principal.getId());
        return ResponseEntity.status(201).body(ApiResponse.success(event, "Event created"));
    }
}
```

## 18.2 Services
- Own all business rules from Section 3 (capacity checks, recruitment state machine, judging
  score computation, certificate issuance triggers).
- Orchestrate across repositories and external integrations (Cloudinary signed uploads,
  email sends) but never talk to the DB driver directly — always through a repository.
- Throw typed domain exceptions (`RegistrationClosedError`, `CapacityExceededError`,
  `VersionConflictError`) that the global error handler maps to the correct HTTP status +
  error code.

## 18.3 Repositories
- Node: Mongoose models + a thin repository wrapper exposing intention-revealing methods
  (`findPublishedUpcoming()`, `incrementSeatsTakenIfAvailable(eventId, capacity)` — the latter
  implemented as an atomic `findOneAndUpdate` with a `$expr` capacity guard to prevent race
  conditions on concurrent registrations).
- Spring: `MongoRepository<Event, String>` extended with custom `@Query`-annotated methods for
  the same intention-revealing operations; the atomic capacity increment uses
  `MongoTemplate.findAndModify` with the equivalent guard condition.

## 18.4 DTOs
- Strict separation between **request DTOs** (what clients may send — never includes
  server-controlled fields like `status`, `seatsTaken`, `version`), **domain models** (internal
  persistence shape), and **response DTOs** (what's serialized back — excludes internal-only
  fields like `passwordHash`, raw audit `before/after` diffs on non-admin routes).

## 18.5 Validators
- Node: Zod schemas colocated per module (`events.validator.ts`), reused for both `create` and
  `update` (update schema = `.partial()` of create schema, plus a required `version` field for
  optimistic concurrency).
- Spring: `jakarta.validation` annotations on DTO fields (`@NotBlank`, `@Size`, `@Future`),
  plus custom validators (`@ValidTeamSize`) for cross-field rules Bean Validation can't express
  natively.

## 18.6 Middlewares / Filters (both stacks, equivalent order)
1. CORS (env-driven allow-list of frontend origins)
2. Security headers (Helmet in Node; Spring Security's default header suite)
3. Request logging (structured JSON, correlation ID per request)
4. Rate limiting (auth + public write endpoints)
5. JWT authentication (populates `req.user` / `SecurityContext`)
6. RBAC / permission check (route-declared required permission checked against the user's
   role→permission mapping, cached in-memory from the `roles`/`permissions` collections)
7. Request body validation (DTO parse)
8. Controller
9. Centralized error handler (last middleware / `@ControllerAdvice`)

## 18.7 Security (implementation-level — policy detail in `12-auth-authorization-security.md`)
- Passwords: bcrypt (Node `bcrypt` lib, cost factor 12) / Spring `BCryptPasswordEncoder`
  (strength 12).
- JWT signing: RS256 (asymmetric) preferred over HS256 so the public key can be distributed to
  any future service that needs to verify tokens without holding the signing secret.
- All secrets (DB URI, JWT keys, OAuth client secrets, Cloudinary keys, email provider keys)
  read exclusively from environment variables (see `17-env-vars-response-format-error-logging.md`
  Section 33) — never hardcoded, never logged.

## 18.8 Exception Handling
- Node: a single `errorHandler.middleware.ts` catches all thrown/forwarded errors, maps known
  `AppError` subclasses to their status+code, falls back to `500 INTERNAL_ERROR` for anything
  unrecognized (and logs the full stack server-side only).
- Spring: `@ControllerAdvice` + `@ExceptionHandler` methods per exception type, same mapping
  philosophy, using `ResponseEntityExceptionHandler` as the base for framework-level exceptions
  (e.g. malformed JSON → 400 `VALIDATION_ERROR`).

## 18.9 Logging
Structured JSON logs at each layer boundary (request in/out, service-level business events like
`event.published`, `application.status_changed`), always including a `requestId`/correlation ID
propagated from the request-logging middleware so a single user action can be traced across log
lines. Full log field standard in `17-env-vars-response-format-error-logging.md` Section 36.
