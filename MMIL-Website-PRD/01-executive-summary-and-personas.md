# 1. Executive Summary

## 1.1 Purpose
MMIL's website is the single digital front door for a college technical society modeled on
Microsoft's student-community programs. It must let students discover MMIL, join it,
register for events/hackathons, apply for recruitment cycles, browse projects and blogs,
track their own membership/certificates, and let the core team run the society's entire
operational calendar (events, recruitment, content, members) from an admin dashboard —
without needing a developer for day-to-day operations.

## 1.2 Vision
To be the most active, most professionally run technical society website in the college
ecosystem — a platform students point to as proof that MMIL operates like a real product
team, not a student club with a static webpage.

## 1.3 Mission
- Give every student a frictionless way to discover and join MMIL.
- Give the core team a self-serve CMS/admin panel so no feature ships as a one-off hack.
- Make participation (events, hackathons, recruitment) fully digital and trackable.
- Preserve institutional memory: every event, project, and achievement stays discoverable
  for future batches and for recruiters/alumni.

## 1.4 Goals
| Goal | Measure |
|---|---|
| Increase membership sign-ups | +40% YoY sign-ups vs. manual/Google-Form era |
| Reduce admin operational load | Recruitment + event admin time cut by 60% |
| Improve event attendance tracking | 100% of events have digital attendance (QR-based) |
| Increase visibility | Public project/blog pages indexed and shareable |
| Cross-batch continuity | Zero loss of historical event/achievement data across leadership handovers |

## 1.5 Problem Statement
College society websites are typically one-off static sites built once by a graduating
batch, never maintained, and abandoned within a year. Recruitment, event registration, and
certificate issuance happen over Google Forms and WhatsApp, with no single source of truth,
no role-based access, and no way for new core-team members to safely operate the site
without a developer. MMIL needs a maintainable, role-based, API-driven platform that
survives leadership turnover.

## 1.6 Success Metrics / KPIs
- **Adoption:** monthly active members (MAM), % of registered students who log in ≥1x/month
- **Engagement:** average event registrations per event, hackathon team formation rate
- **Operational:** average admin time to publish an event (target: <5 minutes)
- **Content:** blog posts published/month, project submissions/semester
- **Reliability:** API uptime ≥99.5%, P95 API latency <400ms
- **Recruitment funnel:** application → interview → offer conversion, tracked per cycle

## 1.7 Expected User Base
- Year 1: 1,500–3,000 registered students (single college)
- Year 2–3: multi-chapter expansion (other colleges under the same MMIL brand) → 10,000–20,000 users
- Design target ceiling per this PRD: **100,000+ users**, so architecture must not require a
  rewrite at that scale (see `13-performance-scalability-devops.md`).

## 1.8 Scalability Goals
- Stateless backend (both Node and Spring variants) behind a load balancer — horizontal
  scale-out with zero session affinity (JWT, not server sessions).
- MongoDB Atlas with proper indexing, ready for sharding by `collegeId`/`chapterId` when
  multi-chapter expansion happens.
- CDN-fronted static assets and images (Cloudinary + Vercel Edge/CDN).
- Read-heavy public pages (projects, blogs, events) cached at the edge with revalidation.

## 1.9 Future Expansion
- Multi-chapter / multi-college tenancy (`chapterId` as a first-class tenant key from day one
  in the schema, even if only one chapter exists at launch — see `07-database-design.md`).
- Microservices split path: Notification, Analytics, and Media services can be peeled off the
  monolith later without changing the public API contract (see `05-hld-architecture.md`).
- AI features (chatbot, resume review, recommendations) — see `15-roadmap-timeline-risks-future.md`.

---

# 2. User Personas

Each persona lists **Goals**, **Permissions**, **Journey**, **Pain Points**, **Features Used**.
The formal permission set is enumerated as a matrix in `12-auth-authorization-security.md`;
here we summarize per-persona intent.

## 2.1 Student (Guest → Registered Member)
- **Goals:** Learn what MMIL does, join, register for events/hackathons, showcase projects, get certificates.
- **Permissions:** `student` role — read public content, create own profile, register for events, submit projects, apply for recruitment.
- **Journey:** Lands on homepage → browses About/Events → signs up (Google/Microsoft OAuth or email) → completes profile → registers for an event or applies to recruitment → receives certificate/notification.
- **Pain Points today:** Scattered Google Forms, no confirmation of registration, no certificate record, WhatsApp spam for updates.
- **Features Used:** Landing page, Events, Hackathons, Recruitment Portal, Member Portal, Profile, Resources, Certificate Verification, Notifications.

## 2.2 Faculty (Faculty Coordinator)
- **Goals:** Oversee society activity, approve high-visibility events/budgets, appear as coordinator on the About page.
- **Permissions:** `faculty` role — read-only dashboards + approval actions on flagged items (e.g., large events, sponsor MOUs).
- **Journey:** Logs in → views dashboard summary (upcoming events, recruitment status, budget requests) → approves/rejects flagged items.
- **Pain Points today:** No visibility into society operations except verbal updates.
- **Features Used:** Admin Dashboard (read-only + approvals), Analytics Dashboard, Announcements.

## 2.3 Coordinator (Event/Vertical Lead)
- **Goals:** Run their vertical's events/workshops end-to-end (create, manage registrations, mark attendance, issue certificates).
- **Permissions:** `coordinator` role, scoped to their vertical/domain — CRUD on events within their domain, view registrants, mark attendance.
- **Journey:** Logs in → Admin Dashboard → Events module → creates event → publishes → monitors registrations → runs QR attendance on event day → issues certificates.
- **Pain Points today:** No structured way to manage a full event lifecycle; attendance is manual.
- **Features Used:** Event Management, Attendance (QR), Certificate Generator, Volunteer Management, Media Management.

## 2.4 Core Team (General Member of Leadership)
- **Goals:** Contribute across content, recruitment, or events depending on their portfolio.
- **Permissions:** `core-team` role — CRUD on content (blogs, projects, gallery) and assigned modules; no system settings access.
- **Journey:** Logs in → Admin Dashboard → their assigned modules (e.g., Blog Management, Gallery).
- **Pain Points today:** No shared CMS; content lives in random Drive folders.
- **Features Used:** CMS, Blog Management, Media Management, Project Submission review, Resources.

## 2.5 President / Vice President
- **Goals:** Full operational oversight; approve recruitment decisions, publish announcements, view analytics, manage core team roles.
- **Permissions:** `leadership` role — near-admin, minus system-level settings (env/secrets, integrations) which stay with `admin`.
- **Journey:** Logs in → Analytics Dashboard (org health) → Recruitment Management (final approvals) → Role Management (assign core team) → Announcements.
- **Pain Points today:** No single dashboard for society health metrics.
- **Features Used:** Analytics Dashboard, Recruitment Management, Role Management, Announcements, Audit Logs (read).

## 2.6 Admin (System/Tech Lead)
- **Goals:** Full system control — users, roles, permissions, integrations, settings, audit.
- **Permissions:** `admin` role — full CRUD everywhere, including Role Management, Settings, Audit Logs, Sponsor Management.
- **Journey:** Logs in → Admin Dashboard → any module, including system Settings and Audit Logs.
- **Pain Points today:** N/A (this role doesn't exist today; it's being created by this project).
- **Features Used:** All admin features, including Role Management, Settings, Audit Logs.

## 2.7 Recruiter (External or Alumni Recruiter)
- **Goals:** Discover talent, browse project showcases and member profiles (public/consented data only), post opportunities.
- **Permissions:** `recruiter` role — read-only on public Projects/Members-with-consent, can post to a "Careers/Opportunities" board if enabled.
- **Journey:** Lands on Projects Showcase or Recruiter landing page → filters by skill/domain → views public profile/portfolio → contacts via listed channel.
- **Pain Points today:** No structured way to browse student projects/skills.
- **Features Used:** Projects Showcase, Member directory (public/opt-in fields only), Sponsors page.

## 2.8 Alumni
- **Goals:** Stay connected, mentor current members, see how the society has grown, get invited to alumni events.
- **Permissions:** `alumni` role — read all public content + Alumni Network features (mentor sign-up, alumni-only announcements).
- **Journey:** Logs in (retains account post-graduation, role auto-transitions from `student` → `alumni` on graduation-year trigger) → Alumni Network → registers as mentor → connects with current members.
- **Pain Points today:** No continuity; alumni lose touch entirely after graduating.
- **Features Used:** Alumni Network, Mentor connect, Achievements, Gallery, Newsletter.

## 2.9 Guest (Unauthenticated Visitor)
- **Goals:** Evaluate MMIL before committing — read About, browse public Events/Blogs/Projects, see achievements.
- **Permissions:** `guest` (no auth) — read-only access to all public-marked content; no registration/application actions (prompted to sign up).
- **Journey:** Lands on homepage (via search/social) → browses public pages → hits a gated action (Register/Apply) → redirected to sign-up.
- **Pain Points today:** N/A — this is the primary new-visitor experience being designed.
- **Features Used:** Landing Page, About, Events (view only), Blogs, Projects Showcase, Gallery, FAQs, Contact, Newsletter signup.

## 2.10 Persona → Role Mapping Summary

| Persona | Role key | Auth required | Scope |
|---|---|---|---|
| Guest | `guest` | No | Public read-only |
| Student | `student` | Yes | Self-scoped |
| Alumni | `alumni` | Yes | Self-scoped + alumni features |
| Recruiter | `recruiter` | Yes | Public/opt-in read-only |
| Coordinator | `coordinator` | Yes | Domain-scoped write |
| Core Team | `core-team` | Yes | Module-scoped write |
| Faculty | `faculty` | Yes | Read + approval actions |
| VP / President | `leadership` | Yes | Org-wide, minus system settings |
| Admin | `admin` | Yes | Full system |

Full permission-by-endpoint matrix: see `12-auth-authorization-security.md`.
