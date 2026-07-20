# 19. Authentication

## 19.1 JWT Strategy
- **Access token:** short-lived (15 min), signed RS256, payload: `{sub: userId, role,
  domainScope, iat, exp}` — no email/PII beyond what's needed for authorization decisions.
- **Refresh token:** long-lived (7 days), stored as an **httpOnly, secure, sameSite=strict**
  cookie (never accessible to JS, mitigating XSS token theft), rotated on every use
  ("refresh token rotation" — old token invalidated the moment a new one is issued), token
  family tracked so reuse of a rotated-out token triggers full family revocation (theft
  detection).
- Access token is held in memory on the client (a React context / Zustand slice), **never**
  in `localStorage`, to avoid XSS exfiltration.

## 19.2 OAuth (Google & Microsoft)
- Authorization Code flow + PKCE, initiated client-side, code exchanged **server-side** (the
  client secret never touches the browser).
- On first OAuth login: create a `users` document with `isEmailVerified: true`,
  `oauthProviders: [{provider, providerId}]`.
- If the OAuth email matches an existing password-based account: do **not** auto-merge;
  prompt the user to confirm ownership (re-enter password or verify via email link), then
  link `oauthProviders` onto the existing document.

## 19.3 Refresh Token Flow
```mermaid
sequenceDiagram
    participant C as Client
    participant B as Backend
    C->>B: POST /auth/refresh (httpOnly cookie)
    B->>B: verify refresh token + check family not revoked
    B->>B: issue new access + new refresh (rotate)
    B-->>C: 200 { accessToken } + Set-Cookie(new refresh)
    Note over B: old refresh token marked used;<br/>any future use of it revokes the whole family
```

## 19.4 Forgot / Reset Password
1. `POST /auth/forgot-password {email}` → always returns 200 regardless of whether the email
   exists (prevents user enumeration) → if it exists, emails a signed, single-use, 30-minute
   reset token.
2. `POST /auth/reset-password/:token {newPassword}` → validates token, updates
   `passwordHash`, invalidates all existing refresh token families for that user (forces
   re-login everywhere).

## 19.5 Email Verification
Signup (email/password) issues a signed 24-hour verification token emailed to the user.
Unverified accounts can browse public content and even log in, but are blocked (`403
EMAIL_NOT_VERIFIED`) from event registration, recruitment application, and project
submission until verified — balances friction vs. security.

## 19.6 Session Management
Fully stateless (no server-side session store) — horizontal scaling requires no sticky
sessions or shared session storage. "Logout" = client discards access token + backend
revokes the refresh token family server-side (a `revokedTokenFamilies` collection or, at
Phase 2 scale, a Redis set with TTL matching the refresh token lifetime).

## 19.7 RBAC (Role-Based Access Control)
Two-layer model:
1. **Role** (coarse) — one of the 9 roles in Section 2.10, stored on the user.
2. **Permission** (fine-grained) — e.g. `event:create`, `event:publish`, `recruitment:review`,
   `admin:settings`, stored in `permissions`/`rolePermissions` (Section 13.21), loaded at
   request time (cached in-memory, short TTL) and checked by the RBAC middleware/aspect
   against each route's declared required permission.
This indirection lets `admin` reconfigure what a `coordinator` can do without a code deploy
(e.g., granting `coordinator` the `blog:publish` permission for a semester without touching
code).

---

# 20. Authorization Matrix

`✅` = allowed, `➖` = allowed but scoped (own/domain only), `❌` = not allowed.

| Action | Guest | Student | Alumni | Recruiter | Coordinator | Core Team | Faculty | Leadership | Admin |
|---|---|---|---|---|---|---|---|---|---|
| View public content | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Register for event | ❌ | ✅ | ✅ | ❌ | ✅ | ✅ | ❌ | ✅ | ✅ |
| Apply to recruitment | ❌ | ✅ | ➖ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Submit project | ❌ | ✅ | ✅ | ❌ | ✅ | ✅ | ❌ | ✅ | ✅ |
| Create/Publish event | ❌ | ❌ | ❌ | ❌ | ➖ (own domain) | ❌ | ❌ | ✅ | ✅ |
| Manage recruitment cycle | ❌ | ❌ | ❌ | ❌ | ➖ (if assigned) | ❌ | ❌ | ✅ | ✅ |
| Review applications | ❌ | ❌ | ❌ | ❌ | ➖ (if assigned) | ❌ | ❌ | ✅ | ✅ |
| Publish blog | ❌ | ❌ | ❌ | ❌ | ✅ | ➖ (draft only, needs review) | ❌ | ✅ | ✅ |
| Manage gallery/media | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ | ❌ | ✅ | ✅ |
| Approve project submissions | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ | ❌ | ✅ | ✅ |
| Mark attendance | ❌ | ❌ | ❌ | ❌ | ✅ | ➖ (if assigned) | ❌ | ✅ | ✅ |
| Issue certificates | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ✅ | ✅ |
| View analytics dashboard | ❌ | ❌ | ❌ | ❌ | ➖ (own domain) | ❌ | ✅ (read) | ✅ | ✅ |
| Role management | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ➖ (core team only) | ✅ |
| Approve budget/sponsor MOUs | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ |
| System settings/integrations | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |
| View audit logs | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ (read) | ✅ |
| Alumni mentor sign-up | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Browse member portfolio (opt-in) | ❌ | ➖ | ➖ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |

This matrix is the source of truth for seeding the `rolePermissions` join collection
(Section 13.21) and must be kept in sync with any RBAC middleware/aspect changes.

---

# 21. Security

## 21.1 OWASP Top 10 Coverage
| Risk | Mitigation |
|---|---|
| Broken Access Control | Server-side permission check on every mutating route (never UI-only); ownership checks (`resource.ownerId === req.user.id`) for scoped actions |
| Cryptographic Failures | TLS everywhere (enforced by hosting platforms); bcrypt password hashing; RS256 JWTs; secrets never logged |
| Injection | Mongoose/Spring Data parameterized queries only — no raw string-concatenated queries; strict DTO validation before any DB call |
| Insecure Design | Threat-modeled flows (capacity race conditions, token replay) addressed explicitly in Section 3 edge cases |
| Security Misconfiguration | Helmet (Node) / Spring Security secure defaults; CORS allow-list per environment; no verbose stack traces in prod responses |
| Vulnerable Components | Dependabot/Renovate on both `package.json` and `pom.xml`; CI fails on high/critical CVEs |
| Auth Failures | Rate-limited login/forgot-password; refresh token rotation + reuse detection; generic error messages (no enumeration) |
| Data Integrity Failures | Optimistic concurrency (`version` field); signed webhooks/QR tokens (HMAC) |
| Logging/Monitoring Failures | Structured logs + Sentry on both backends; audit log for all admin mutations |
| SSRF | Repo/demo URL fields validated as HTTPS format only, never fetched server-side synchronously; any async liveness check runs through an allow-listed fetcher with no redirect-following into internal network ranges |

## 21.2 CSRF
JWT-in-header auth (not cookie-based for the access token) is inherently CSRF-resistant for
API calls. The refresh-token cookie is `sameSite=strict` + only sent to the `/auth/refresh`
endpoint, further limiting CSRF surface. Any state-changing endpoint that must accept a
cookie-based credential (none currently) would additionally require a CSRF token.

## 21.3 XSS
- React's default JSX escaping handles most output encoding automatically.
- Rich text content (blog bodies, project descriptions) is stored as structured JSON (Tiptap
  document format), rendered through a controlled renderer — **never** `dangerouslySetInnerHTML`
  with raw user HTML. If raw HTML input must ever be supported, it is sanitized server-side
  with a strict allow-list (e.g., DOMPurify) before storage.

## 21.4 CORS
Environment-specific allow-list (`https://mmil.dev`, `https://staging.mmil.dev`,
`http://localhost:3000` in dev only), credentials `true` only for the refresh-cookie origin,
no wildcard `*` in any environment with credentialed requests.

## 21.5 Rate Limiting
| Endpoint class | Limit |
|---|---|
| `/auth/login` | 5 attempts / 15 min / (IP + email) |
| `/auth/forgot-password` | 3 / hour / IP |
| Public write endpoints (contact, newsletter) | 10 / hour / IP |
| Public certificate verification | 20 / min / IP |
| General authenticated API | 300 / min / user (generous; guards against runaway client bugs, not normal use) |

## 21.6 Helmet / Security Headers
`Content-Security-Policy`, `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`,
`Strict-Transport-Security`, `Referrer-Policy: strict-origin-when-cross-origin` — applied via
Helmet (Node) and Spring Security's header suite (equivalent defaults, explicitly configured
rather than relying on framework defaults alone).

## 21.7 Input Validation
Every mutating endpoint validates the full request body against its DTO schema server-side,
regardless of client-side (React Hook Form + Zod) validation already having run — the backend
never trusts the client.

## 21.8 Encryption
TLS in transit everywhere (enforced by Vercel/Render/Railway/Azure/Atlas by default).
At-rest encryption via MongoDB Atlas's native encryption at rest. Field-level encryption is
not required for this data classification (no payment data; resumes/PII protected by access
control + TLS, not field encryption, consistent with a college-society risk profile).

## 21.9 Password Hashing
bcrypt cost factor 12 (Node) / `BCryptPasswordEncoder` strength 12 (Spring) — tuned to
~250ms hash time on target infrastructure, balancing brute-force resistance against login
latency.

## 21.10 Secrets Management
All secrets live in the hosting platform's environment variable store (Vercel/Render/
Railway/Azure Key Vault) — never committed to the repo, never present in client bundles
(anything prefixed `NEXT_PUBLIC_` is, by Next.js convention, treated as non-secret and must
never hold a real secret). `.env.example` files document required variable names with
placeholder values only.
