# Microsoft Mobile Innovation Lab (MMIL) — Official Website
## Complete Product Requirement Document (PRD) — Master Index

**Document Version:** 1.0
**Status:** Ready for Development
**Owners:** Product, Architecture, Engineering (Frontend, Backend, DevOps, Data), UI/UX

This PRD is split into modular files so that different teams (Product, Frontend, Backend,
DevOps, QA, Design) can work from the section that concerns them without loading the entire
document. All files together form one specification. Cross-references use file names.

### How to read this PRD

| # | File | Covers |
|---|------|--------|
| 1 | `01-executive-summary-and-personas.md` | Executive Summary, Vision/Mission/Goals, Success Metrics, User Personas |
| 2 | `02-functional-requirements-and-features.md` | Functional Requirements (with acceptance criteria), Complete Feature List |
| 3 | `03-user-flows-sitemap-navigation-ia.md` | User Flows, Site Map, Navigation (Desktop/Tablet/Mobile), Information Architecture |
| 4 | `04-uiux-guidelines-design-system.md` | UI/UX Guidelines, Design System, Tokens, Components |
| 5 | `05-hld-architecture.md` | High-Level Design, System/Frontend/Backend Architecture, Mermaid diagrams |
| 6 | `06-lld-folder-structures.md` | Low-Level Design, Folder Structures (Next.js, Node, Spring Boot), Class/Component Diagrams |
| 7 | `07-database-design.md` | MongoDB Collections, Fields, Indexes, Relationships, Validation |
| 8 | `08-api-design-and-openapi.md` | REST API Design, Endpoint Catalog, OpenAPI 3.1 Spec, Backend Interface Layer |
| 9 | `09-json-schemas.md` | JSON Schema (Draft 2020-12) for every resource |
| 10 | `10-frontend-state-management.md` | Redux Toolkit / Zustand, React Query, API layer, Hooks |
| 11 | `11-backend-architecture.md` | Controllers, Services, Repositories, DTOs, Middlewares (dual-stack) |
| 12 | `12-auth-authorization-security.md` | Auth (JWT/OAuth), RBAC, Authorization Matrix, OWASP Security |
| 13 | `13-performance-scalability-devops.md` | Performance, Scalability, Docker/CI-CD/DevOps |
| 14 | `14-testing-coding-standards.md` | Testing Strategy, Coding Standards, Git Strategy |
| 15 | `15-roadmap-timeline-risks-future.md` | Roadmap, Timeline, Risk Analysis, Future Features |
| 16 | `16-sample-json-payloads.md` | Complete sample JSON payloads for all resources |
| 17 | `17-env-vars-response-format-error-logging.md` | Env Variables, API Response Format, Error/Logging Standards |
| 18 | `18-sequence-diagrams.md` | Mermaid sequence diagrams for critical flows |
| 19 | `19-final-deliverables-checklist.md` | Final Deliverables, Production Readiness Checklist |

### Core Architectural Principle

The **single most important constraint** in this PRD: the frontend (Next.js) is 100%
backend-agnostic. It talks only to a versioned REST contract (`/api/v1/...`) defined once
in `08-api-design-and-openapi.md`. Two interchangeable backend implementations satisfy
that exact contract:

- **Backend Option 1:** Node.js + Express + MongoDB (Mongoose)
- **Backend Option 2:** Spring Boot (Java 21) + Spring Security + Spring Data MongoDB

Switching backends is a **single environment variable change** (`NEXT_PUBLIC_API_BASE_URL`)
on the frontend — no frontend code changes, no type changes, no request/response shape
changes. This is enforced via the **Backend Interface Layer (BIL)** contract described in
`08-api-design-and-openapi.md`, which both backend teams must implement byte-for-byte
identically (same response envelope, same error codes, same pagination shape, same auth
headers, same status codes).
