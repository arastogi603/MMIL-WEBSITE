# 28. Development Roadmap

## Phase 1 — MVP (Foundation)
- Auth (email/password + Google/Microsoft OAuth), RBAC skeleton (roles + core permissions).
- Public marketing pages (Landing, About, Achievements, Team, FAQs, Contact, Newsletter).
- Events (standard + workshop types), registration (solo only), basic notifications (in-app +
  email).
- Blogs (CMS: draft/publish), Projects (submit + admin approve + public showcase).
- Member Portal (profile, my-events, my-applications skeleton).
- Admin Dashboard shell + Role Management + basic Audit Logs.
- **One backend variant fully built first** (recommend Node/Express for MVP velocity), Spring
  Boot variant built against the same finalized OpenAPI contract once it's stable (avoids
  building two backends against a moving spec simultaneously).

## Phase 2 — Core Growth Features
- Hackathon module (teams, submissions, judging, leaderboard).
- Recruitment Portal + Recruitment Management (dynamic form builder, pipeline board).
- Attendance (QR-based), Certificate generation + public verification.
- Analytics Dashboard (aggregation-driven).
- Gallery, Sponsors, Testimonials, Announcements, Resources modules.
- Spring Boot backend reaches full parity with Node (if not already built in Phase 1);
  BIL contract test suite gates both.
- Redis introduced (rate-limit counters, hot analytics cache).

## Phase 3 — Scale & Polish
- Alumni Network (mentor sign-up/matching), Recruiter-facing views.
- Push notifications (web push).
- Search upgrade (MongoDB Atlas Search across collections) if the basic text-index search
  proves insufficient.
- Volunteer Management.
- Multi-chapter tenancy activated (if a second college chapter launches) — `chapterId`
  scoping already present in schema/API from Phase 1, this phase is primarily admin tooling
  to manage multiple chapters from one dashboard.
- Event-driven/queue adoption if the scaling triggers in `13-performance-scalability-devops.md`
  Section 23.6 are hit.

## Phase 4 — Intelligence & Community (see Section 31 for full list)
- AI Chatbot (upgrade from FAQ-matching to LLM-backed), Resume Review, Recommendation System,
  Gamification/Leaderboard, Discord/GitHub/Azure integrations, Discussion Forum, Placement
  Tracker.

## Versioning
- **MVP = v1.0** (Phase 1 feature set).
- **v2.0** = Phase 2 complete (Hackathons + Recruitment live).
- **v3.0** = Phase 3 complete (Alumni + multi-chapter ready).

---

# 29. Timeline (indicative — team-size dependent, assumes a small dedicated student dev team
of ~4–6 across frontend/backend/design working part-time alongside coursework)

| Weeks | Milestone | Deliverables |
|---|---|---|
| 1–2 | Foundation | Repo scaffolding (frontend + one backend), CI/CD pipeline, design tokens/system in Storybook or ShadCN theme, finalized OpenAPI spec v1 |
| 3–5 | Auth + Public Pages | Auth (JWT+OAuth) end-to-end, Landing/About/FAQs/Contact live, Member Portal shell |
| 6–8 | Events Core | Event CRUD, registration (solo), notifications, Admin event management |
| 9–10 | Content | Blogs CMS, Projects submit/approve/showcase |
| 11 | MVP Hardening | E2E tests, security review pass, staging deploy, Phase 1 launch (v1.0) |
| 12–15 | Hackathons + Recruitment | Team formation, submissions, judging, dynamic recruitment forms, pipeline board |
| 16–17 | Attendance + Certificates | QR attendance, certificate generation + verification |
| 18 | Analytics + Spring Boot Parity | Analytics Dashboard, second backend variant contract-tested and deployable |
| 19–20 | Phase 2 Hardening | Load testing, v2.0 launch |
| 21+ | Phase 3 | Alumni Network, multi-chapter readiness, Redis, ongoing |

---

# 30. Risk Analysis

## 30.1 Technical Risks
| Risk | Impact | Mitigation |
|---|---|---|
| Dual-backend contract drift (Node and Spring diverge in behavior) | High — breaks the core "frontend-agnostic" promise | BIL contract test suite (`08-api-design-and-openapi.md`, `25-...` Section 25.4) gates every deploy of either backend |
| Event capacity race conditions under registration bursts | Medium — overbooking, data integrity | Atomic `findOneAndUpdate`/`findAndModify` capacity checks (Section 13.5, 18.3), load-tested (Section 25.5) |
| Student dev team turnover (graduating members) | High — knowledge loss is the core problem this project solves for the *society itself*, and the dev team is not immune to it | This PRD + inline doc comments + module READMEs (Section 27.3) are the institutional-memory mechanism; onboarding doc should be maintained alongside this PRD |
| Scope creep against a 40-section spec | Medium — MVP delay | Strict Phase 1/MVP scope discipline (Section 28); this PRD's size is intentionally the *full* long-term vision, not the MVP cut |
| MongoDB schema drift without migrations | Medium | Adopt a lightweight migration tool (e.g., `migrate-mongo`) from Phase 1 for any schema-shape change beyond additive optional fields |

## 30.2 Business Risks
| Risk | Impact | Mitigation |
|---|---|---|
| Low initial adoption (students keep using WhatsApp/Forms) | Medium | Make the platform the *only* channel for official registration/certificates from launch — no parallel Google Form track once live |
| Faculty/admin resistance to a new system | Low–Medium | Faculty role is read-heavy/approval-only by design (Section 2.2) — low learning curve |
| Leadership handover breaking admin continuity | High | Role Management + Audit Logs (Sections 13.21, 13.22) give incoming leadership full visibility with no tribal knowledge required |
| Sponsor/recruiter-facing features going unused without a critical mass of projects | Low | Sequenced to Phase 3, after Project Showcase has organically built up content in Phase 1–2 |

## 30.3 Mitigation Ownership
Each risk above should be assigned an explicit owner (Tech Lead, President, or Faculty
Coordinator as appropriate) in the project's tracking tool at kickoff — this PRD identifies the
risk and mitigation strategy but does not assign individuals, since that is a per-cohort
staffing decision.

---

# 31. Future Features

Ordered roughly by expected sequencing (not a hard commitment — re-prioritized each cohort):

1. **AI Chatbot** — upgrade the Phase 1 FAQ-matching widget to an LLM-backed assistant grounded
   on MMIL's own content (events, resources, FAQs) via retrieval, for higher-quality answers.
2. **Resume Review** — AI-assisted resume feedback tied to the Recruitment Portal's resume
   upload.
3. **Interview Preparation** — curated question banks / mock-interview scheduling tied to
   Alumni mentors.
4. **Recommendation System** — surface relevant events/resources/mentors based on a member's
   stated skills/interests.
5. **Leaderboard / Gamification** — points for event participation, hackathon placement,
   blog contributions — surfaced on the Member Portal.
6. **Community / Discussion Forum** — threaded discussion tied to events/tracks.
7. **Discord Integration** — sync event announcements/role assignment with the society's
   Discord server.
8. **Microsoft Learn Integration** — surface/track Microsoft Learn module completions as part
   of Resources.
9. **GitHub Integration** — pull repo stats/activity into Project Showcase automatically.
10. **Azure Integration** — for hackathons using Azure credits, integrate credit
    provisioning/tracking.
11. **Hackathon Portal enhancements** — live leaderboard during judging, sponsor-track
    filtering.
12. **Certificate Generator UI** — self-serve template designer for coordinators (currently a
    fixed template in Phase 2).
13. **QR Attendance enhancements** — geofencing, offline-mode scan queueing.
14. **Live Streaming** — embed streams for hybrid/virtual sessions.
15. **Placement Tracker** — alumni placement outcomes, linked to Alumni Network, useful for
    faculty/sponsor reporting.

None of these are required for v1.0–v3.0 scope defined in Section 28; they are captured here
so future cohorts inherit a prioritized backlog rather than starting from a blank page.
