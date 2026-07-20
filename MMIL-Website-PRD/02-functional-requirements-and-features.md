# 3. Functional Requirements

Format per feature: **Description, Business Rules, Edge Cases, Acceptance Criteria,
Priority, Dependencies, Validation Rules.** Priority uses MoSCoW (Must/Should/Could/Won't —
for MVP). The full feature inventory (with short descriptions) is in Section 4; this section
gives full requirement detail for the highest-complexity, highest-risk features. Simpler CRUD
features (Gallery, FAQs, Testimonials, Announcements) follow the same pattern at reduced
depth and are not individually expanded to keep this document navigable — their schemas are
in `07-database-design.md` and their endpoints in `08-api-design-and-openapi.md`.

## 3.1 Authentication & Registration
**Description:** Users register/login via email+password (JWT) or OAuth (Google, Microsoft).
**Business Rules:**
- Email must be unique across the `users` collection.
- OAuth accounts auto-verify email; email/password accounts require email verification before
  they can register for events or apply to recruitment.
- Password: bcrypt hash, min 8 chars, at least 1 letter + 1 number.
- JWT access token TTL: 15 minutes. Refresh token TTL: 7 days, rotated on use, stored as
  httpOnly secure cookie.
**Edge Cases:**
- OAuth email collides with an existing email/password account → link accounts after
  verifying ownership (re-auth prompt), never silently merge.
- Refresh token reuse detected (stolen token) → revoke entire token family, force re-login.
- User deletes account mid-active-recruitment-application → application soft-cancelled, not
  hard-deleted (audit trail).
**Acceptance Criteria:**
- Given valid credentials, user receives access+refresh tokens and a 200 with user profile.
- Given invalid credentials, user receives 401 with generic "invalid credentials" (no user
  enumeration).
- Given expired access token, protected routes return 401 with `TOKEN_EXPIRED` error code,
  frontend silently refreshes via refresh endpoint once, then retries the original request.
**Priority:** Must
**Dependencies:** None (foundational)
**Validation Rules:** Email RFC 5322 format; password policy above; OAuth `state` param
CSRF-checked; rate limit login endpoint to 5 attempts/15 min per IP+email pair.

## 3.2 Event Registration
**Description:** Students browse published events and register (with optional capacity limits,
team-based registration for hackathons).
**Business Rules:**
- Registration only open between `event.registrationOpensAt` and `event.registrationClosesAt`.
- If `event.capacity` is set and reached, further registrations go to a `waitlisted` status.
- Team events: team size between `event.teamSizeMin` and `event.teamSizeMax`; one member is
  `teamLeader`; only the leader can finalize/submit the team roster.
- A user cannot register twice for the same event (unique `userId+eventId` in `registrations`).
**Edge Cases:**
- Team leader removes a member after roster lock → blocked once `event.registrationClosesAt`
  has passed; allowed before.
- Capacity reached exactly as two concurrent requests land → use MongoDB transaction with
  `findOneAndUpdate` atomic increment on a `seatsTaken` counter to avoid overbooking.
- Event cancelled after registrations exist → all registrants notified, status set to
  `cancelled`, no certificate flow triggered.
**Acceptance Criteria:**
- Given an open event under capacity, registering returns 201 with status `confirmed`.
- Given a full event, registering returns 201 with status `waitlisted` and a queue position.
- Given registration window closed, attempt returns 409 `REGISTRATION_CLOSED`.
**Priority:** Must
**Dependencies:** Auth, Event Management, Notification Service
**Validation Rules:** `teamSize` within event bounds; each team member must be a verified,
distinct registered user.

## 3.3 Hackathon Module
**Description:** Specialized event subtype with team formation, project submission per team,
judging/scoring, and leaderboard.
**Business Rules:**
- A hackathon is an `event` with `event.type = "hackathon"` plus a linked `hackathonDetails`
  sub-document (tracks, judging criteria, prize pool, submission deadline).
- Submissions locked at `submissionDeadline`; late submissions rejected server-side (not just
  UI-hidden).
- Judges (a subset of `coordinator`/`core-team` users tagged `isJudge`) score submissions
  against rubric criteria (each 0–10); final score is a weighted average.
**Edge Cases:**
- Judge assigned to a team they are personally part of → excluded from scoring that team
  (conflict-of-interest check on `teamMembers` vs `judgeId`).
- Submission repo URL is private/inaccessible at judging time → flagged for manual review,
  does not auto-fail.
**Acceptance Criteria:**
- Given the submission deadline has passed, POST to submissions endpoint returns 409
  `SUBMISSION_CLOSED`.
- Given all judges have scored a team, the team's average score and rank are computed and
  visible on the (admin-only until results published) leaderboard.
**Priority:** Should (MVP can launch with generic Event Management; Hackathon-specific judging
UI can follow in Phase 2 — see roadmap).
**Dependencies:** Event Registration, Project Submission, Notification Service
**Validation Rules:** Score range 0–10 per criterion; submission repo URL must be valid HTTPS
URL; one submission per team (updatable until deadline).

## 3.4 Recruitment Portal
**Description:** Seasonal recruitment cycles with configurable domains (e.g., Frontend,
Backend, Design, PR), application forms, review pipeline (Applied → Shortlisted →
Interview → Offered/Rejected).
**Business Rules:**
- Only one `recruitment` cycle can be `status: "open"` at a time per chapter.
- Each domain can define custom application questions (dynamic form schema stored on the
  `recruitmentCycle` document, rendered dynamically on frontend — no redeploy needed to
  change questions).
- Status transitions are one-directional except `Rejected`/`Offered` which are terminal;
  moving backward requires `admin`/`leadership` override with an audit log entry.
**Edge Cases:**
- Applicant applies to 2 domains in the same cycle → allowed unless
  `recruitmentCycle.allowMultiDomain === false`.
- Cycle closes while an applicant has a draft (unsubmitted) application → draft is discarded
  from the "active" view but retained for 30 days (soft delete) for support purposes.
**Acceptance Criteria:**
- Given a closed cycle, the apply endpoint returns 403 `CYCLE_CLOSED`.
- Given a valid submission before the deadline, applicant receives a confirmation and the
  application appears in the coordinator's review queue in `Applied` status.
**Priority:** Must
**Dependencies:** Auth, Notification Service, Role Management
**Validation Rules:** Required dynamic-form fields enforced server-side (not just client);
resume upload restricted to PDF, max 5MB, via Cloudinary signed upload.

## 3.5 Project Showcase & Submission
**Description:** Students submit projects (title, description, tech stack, repo/demo links,
media) for public showcase; core team can feature/approve.
**Business Rules:**
- New submissions default to `status: "pending"`, invisible on public showcase until a
  `core-team`/`coordinator` sets `status: "approved"`.
- A project can be linked to a hackathon (`hackathonId`) or standalone.
**Edge Cases:**
- Submitter edits an already-approved project → edited version goes back to `pending` for
  re-approval (prevents post-approval content swap), original stays visible until
  re-approved.
**Acceptance Criteria:**
- Given `status=approved` and `visibility=public`, project appears on `/projects` without auth.
- Given `status=pending`, project is visible only to its owner and staff roles.
**Priority:** Must
**Dependencies:** Auth, Media Management (Cloudinary)
**Validation Rules:** Max 10 images/project via Cloudinary; repo URL validated as reachable
HTTPS format (not liveness-checked synchronously — done async via a background job).

## 3.6 Certificate Verification
**Description:** Public page where anyone can verify a certificate's authenticity via
certificate ID or QR code.
**Business Rules:**
- Certificates are generated server-side (PDF) at event/recruitment completion, each with a
  unique `certificateId` (UUID) and a `verificationHash`.
- Verification endpoint is public, rate-limited, and returns only non-sensitive fields
  (name, event, date, certificate type) — never internal user IDs or emails.
**Edge Cases:**
- Certificate revoked (e.g., issued in error) → verification returns `status: "revoked"`
  instead of 404, with reason omitted from public response but logged internally.
**Acceptance Criteria:**
- Given a valid certificate ID, `/verify/:certificateId` returns 200 with holder name/event/date.
- Given an invalid ID, returns 404 `CERTIFICATE_NOT_FOUND` (generic, no enumeration hints).
**Priority:** Should
**Dependencies:** Event Management, Attendance, PDF generation service
**Validation Rules:** `certificateId` UUID v4 format; rate limit 20 req/min/IP on public
verification endpoint.

## 3.7 Attendance (QR-based)
**Description:** Coordinators generate a rotating/static QR per event session; attendees scan
via the web app (camera access) to mark attendance.
**Business Rules:**
- QR payload encodes `eventId + sessionId + short-lived signed token` (5-minute TTL,
  regenerated by the coordinator's screen automatically) to prevent screenshot sharing across
  a whole event's duration.
- Only `confirmed` registrants can mark attendance; walk-ins require coordinator manual
  add first.
**Edge Cases:**
- Same user scans twice → idempotent, second scan returns "already marked" without creating
  a duplicate record.
- Token expired between scan and submit (slow network) → return 409 `QR_EXPIRED`, frontend
  auto-refetches a new QR image.
**Acceptance Criteria:**
- Given a valid, unexpired token and a confirmed registrant, POST attendance returns 201 and
  updates `registrations.attendanceStatus = "present"`.
**Priority:** Should
**Dependencies:** Event Registration
**Validation Rules:** Signed token (HMAC) validated server-side; geofencing optional (future).

## 3.8 Admin Dashboard / CMS / Role Management / Analytics
**Description:** Central console for all staff roles, scoped by permission (see
`12-auth-authorization-security.md`), covering content CRUD, member/role management,
recruitment pipeline, event pipeline, and an analytics overview (charts driven by aggregation
pipelines over `events`, `registrations`, `applications`, `users`).
**Business Rules:** Every write action performed in admin dashboard writes an `auditLogs`
entry (`actorId`, `action`, `entityType`, `entityId`, `before`, `after`, `timestamp`).
**Edge Cases:** Concurrent edits to the same entity (e.g., two coordinators editing one event)
→ optimistic concurrency via a `version` field; second writer gets 409 `VERSION_CONFLICT` and
must reload.
**Acceptance Criteria:** Given a role without permission for a module, the corresponding nav
item is hidden client-side AND the API rejects the action server-side with 403 — never rely on
UI hiding alone.
**Priority:** Must
**Dependencies:** Auth, RBAC, all content modules
**Validation Rules:** Every admin mutation server-side validated against the same DTOs/schemas
used for public creation endpoints, plus an extra `permission` check middleware.

---

# 4. Complete Feature List

Grouped by domain, each with a one-line scope note. Full data models live in
`07-database-design.md`; full endpoints in `08-api-design-and-openapi.md`.

### Public / Marketing
- **Landing Page** — hero, highlights, upcoming events strip, latest blogs, CTA to join.
- **About MMIL** — vision, mission, timeline (org history), values.
- **Timeline** — chronological milestones (founding, major hackathons, awards).
- **Achievements** — awards/recognitions with media proof.
- **Core Team** — current leadership directory with photos/roles/socials.
- **Faculty Coordinators** — faculty directory.
- **Sponsors** — sponsor tiers/logos/links.
- **Testimonials** — member/alumni quotes.
- **FAQs** — categorized Q&A, searchable.
- **Contact** — contact form → email + stored `contactMessages` for admin follow-up.
- **Newsletter** — email capture, double opt-in, integrates with email provider.
- **Announcements** — site-wide banner/feed for time-sensitive notices.
- **Gallery** — photo/video albums per event.

### Content
- **Projects Showcase** — public project cards, filter by tech/domain/year.
- **Research** — research papers/publications listing (PDF links).
- **Blogs** — full CMS: drafts, categories, tags, cover image, rich text (MDX-like) body.
- **Resources** — curated learning links/materials by track (Frontend, Backend, AI, Cloud…).

### Events & Participation
- **Events** — listing, detail, registration, calendar view.
- **Hackathons** — event subtype with teams, submissions, judging, leaderboard.
- **Workshops** — event subtype, simpler (no teams), often single-session.
- **Attendance** — QR-based check-in.
- **Volunteer Management** — sign-up for volunteering roles per event, assigned by coordinators.

### People & Growth
- **Recruitment Portal** — public apply flow across open cycles/domains.
- **Recruitment Management** — admin pipeline (Kanban-style status board).
- **Member Portal** — logged-in student's personal hub (my events, my certificates, my applications).
- **Alumni Network** — alumni directory (opt-in), mentor sign-up, mentor-mentee matching (manual admin-assisted in MVP).
- **Profile Management** — edit personal info, avatar, socials, skills, resume link.
- **Certificate Verification** — public verify page + personal certificate wallet in Member Portal.

### Platform / Utility
- **Search** — global search across events/blogs/projects/resources (MongoDB Atlas Search or text index in MVP).
- **Dark Mode** — theme toggle, persisted preference.
- **Notifications** — in-app notification center + email; push notifications are a Phase 2/future item.
- **Chatbot** — FAQ-answering assistant; MVP is a simple rules/FAQ-matching widget, AI upgrade is a future feature (`15-roadmap-timeline-risks-future.md`).

### Admin / Ops
- **Admin Dashboard** — landing console with role-scoped module tiles.
- **Analytics Dashboard** — charts: registrations over time, recruitment funnel, member growth, event attendance rate.
- **CMS** — unified content editor powering Blogs/Projects/Gallery/Announcements.
- **Role Management** — assign/revoke roles, scope coordinators to domains.
- **Event Management** — full lifecycle CRUD, publish/unpublish, capacity, teams.
- **Recruitment Management** — cycles, domains, dynamic form builder, pipeline board.
- **Project Submission (review)** — approve/reject/feature.
- **Blog Management** — draft/publish/schedule.
- **Media Management** — Cloudinary asset browser, usage tracking.
- **Email Notifications** — transactional templates (registration confirmed, application status changed, certificate issued).
- **Push Notifications** — Phase 2 (web push via service worker).
- **Audit Logs** — searchable log of all admin mutations.
- **Settings** — org-level settings (site name, social links, feature flags, integration keys — secrets never returned to client).

Each feature above maps to one or more MongoDB collections (`07-database-design.md`) and one
or more REST resources (`08-api-design-and-openapi.md`). Feature → collection → endpoint
traceability table is provided at the top of `08-api-design-and-openapi.md`.
