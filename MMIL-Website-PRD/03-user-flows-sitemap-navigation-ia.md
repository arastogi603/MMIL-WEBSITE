# 5. Complete User Flow (text-diagram form)

## 5.1 Guest Flow
```
Guest lands on Home
 ├─ Browses About / Events / Blogs / Projects / Gallery / FAQs   (all public, no auth)
 ├─ Clicks "Join MMIL" / "Register for Event" / "Apply for Recruitment"
 │    └─ Redirected to /auth/signup?redirect=<original-page>
 │         ├─ Signs up via Email/Password → Email verification sent → verifies → redirected back
 │         └─ Signs up via Google/Microsoft OAuth → auto-verified → redirected back
 └─ Submits Contact form / Newsletter signup (no auth required)
```

## 5.2 Member (Student) Flow
```
Login → Member Portal (Dashboard)
 ├─ My Profile → edit info/avatar/skills/resume
 ├─ Events
 │    ├─ Browse → Register (solo) → Confirmation + Notification
 │    └─ Browse Hackathon → Form/Join Team → Team Leader submits roster → Submit Project (pre-deadline) → View results post-judging
 ├─ Recruitment
 │    └─ Browse open cycle → choose domain → fill dynamic application → Submit → Track status in "My Applications"
 ├─ Projects
 │    └─ Submit new project → pending review → notified on approve/reject
 ├─ My Certificates
 │    └─ View/download issued certificates, share verification link
 └─ Notifications → in-app center, mark read, email digests
```

## 5.3 Recruiter Flow
```
Login (recruiter role) → Recruiter Landing
 ├─ Browse Projects Showcase → filter by skill/tech/domain
 ├─ View public member profile (only opted-in fields)
 └─ (Optional) Post an opportunity → visible on Careers board (if org enables it)
```

## 5.4 Admin Flow
```
Login (admin) → Admin Dashboard
 ├─ Analytics Dashboard → org-wide charts
 ├─ Role Management → assign/revoke roles, scope coordinators
 ├─ Settings → site config, feature flags, integrations
 ├─ Audit Logs → filter by actor/entity/date
 └─ Full access to every module below (Core Team flow) with no domain scoping restriction
```

## 5.5 Core Team Flow
```
Login (core-team / coordinator) → Admin Dashboard (modules scoped to role/domain)
 ├─ Event Management → create/edit/publish event → monitor registrations → run Attendance (QR) → issue certificates
 ├─ Recruitment Management (if assigned) → manage cycle/domain → move applicants through pipeline → send decision notifications
 ├─ Blog Management → draft → submit for review (if core-team) / publish directly (if coordinator+) 
 ├─ Media Management → upload/organize gallery assets
 └─ Project Submission review → approve/reject/feature
```

## 5.6 Faculty Flow
```
Login (faculty) → Dashboard (read-only + approvals)
 ├─ View upcoming events / recruitment status / budget requests
 └─ Approve/Reject flagged items (e.g., large-budget events, external sponsor MOUs)
```

---

# 6. Site Map (Complete Hierarchy)

```
/
├── /about
│   ├── /about/vision-mission
│   ├── /about/timeline
│   ├── /about/team               (core team + faculty coordinators)
│   └── /about/achievements
├── /events
│   ├── /events/[slug]
│   ├── /events/hackathons
│   │   └── /events/hackathons/[slug]
│   └── /events/workshops
│       └── /events/workshops/[slug]
├── /projects
│   ├── /projects/[slug]
│   └── /projects/submit          (auth required)
├── /research
│   └── /research/[slug]
├── /blog
│   ├── /blog/[slug]
│   └── /blog/category/[category]
├── /gallery
│   └── /gallery/[albumSlug]
├── /recruitment
│   ├── /recruitment/[cycleSlug]
│   └── /recruitment/[cycleSlug]/apply/[domainSlug]   (auth required)
├── /resources
│   └── /resources/[trackSlug]
├── /alumni                        (auth required, alumni-scoped features gated)
├── /sponsors
├── /achievements
├── /faqs
├── /contact
├── /verify/[certificateId]        (public certificate verification)
├── /auth
│   ├── /auth/login
│   ├── /auth/signup
│   ├── /auth/forgot-password
│   ├── /auth/reset-password/[token]
│   └── /auth/verify-email/[token]
├── /portal                        (Member Portal — auth required)
│   ├── /portal/dashboard
│   ├── /portal/profile
│   ├── /portal/my-events
│   ├── /portal/my-applications
│   ├── /portal/my-certificates
│   └── /portal/notifications
└── /admin                         (staff-only, role-gated at layout level)
    ├── /admin/dashboard
    ├── /admin/analytics
    ├── /admin/events
    │   └── /admin/events/[id]/attendance
    ├── /admin/recruitment
    │   └── /admin/recruitment/[cycleId]/pipeline
    ├── /admin/projects
    ├── /admin/blogs
    ├── /admin/gallery
    ├── /admin/members
    ├── /admin/roles
    ├── /admin/announcements
    ├── /admin/sponsors
    ├── /admin/settings
    └── /admin/audit-logs
```

---

# 7. Navigation Flow

## 7.1 Desktop (≥1024px)
- Sticky top navbar: Logo | About ▾ | Events ▾ | Projects | Blog | Resources | Recruitment |
  Search icon | Theme toggle | Auth state (Login/Signup buttons OR Avatar dropdown with
  Portal/Admin-if-staff/Logout).
- Mega-menu dropdowns for "About" (Vision/Mission, Timeline, Team, Achievements) and "Events"
  (All Events, Hackathons, Workshops, Calendar).
- Footer: sitemap columns (Explore, Get Involved, Resources, Legal), social links, newsletter
  signup, sponsor logos strip.

## 7.2 Tablet (768–1023px)
- Collapsed mega-menus into a single "Explore" dropdown with grouped links.
- Top navbar retains Logo, Search, Theme toggle, Auth state; remaining links move to a
  slide-out drawer triggered by a hamburger icon.

## 7.3 Mobile (<768px)
- Bottom tab bar (app-like) for authenticated members: Home | Events | Portal | Notifications |
  Profile.
- Guests get a top hamburger drawer instead of the bottom tab bar (fewer relevant destinations).
- Admin/staff on mobile: dashboard is view-optimized (cards stack, tables become card lists);
  heavy data-entry flows (e.g., dynamic recruitment form builder) show a "best on desktop"
  banner but remain functionally usable.

---

# 8. Information Architecture

**Content model layers:**
1. **Public marketing layer** — About, Achievements, Sponsors, Testimonials, FAQs, Contact:
   mostly static/CMS-editable singleton or small-collection content.
2. **Public dynamic layer** — Events, Blogs, Projects, Gallery, Research, Resources: growing
   collections, filterable/searchable, SEO-indexed (SSR/ISR via Next.js).
3. **Authenticated personal layer** — Member Portal: user-scoped views over shared
   collections (`registrations`, `applications`, `certificates`, `notifications`) filtered by
   `userId`.
4. **Operational/admin layer** — Admin Dashboard: role-scoped CRUD over every collection, plus
   aggregation-driven Analytics and immutable Audit Logs.

**Cross-cutting concerns present at every layer:** Search (global, layer-2 content only),
Notifications (layer-3 personal + layer-4 broadcast), Dark Mode (presentation-only, no IA
impact).

**URL design principles:**
- Public content uses human-readable slugs (`/events/hackathon-2026-spring`), never raw
  Mongo ObjectIds, for SEO and shareability. Slugs are generated from titles on creation and
  are immutable once published (editing title does not change the slug, to avoid breaking
  shared links).
- Authenticated/admin routes use IDs where slugs aren't needed (`/admin/events/64f.../attendance`).
- All list pages support `?page=&limit=&sort=&search=&filter[...]=` query params, mirrored
  exactly by the API (see `08-api-design-and-openapi.md`).
