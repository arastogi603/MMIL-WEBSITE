# 37. Complete Sequence Diagrams

## 37.1 Authentication (Email/Password Login)
```mermaid
sequenceDiagram
    participant U as Browser
    participant FE as Next.js Frontend
    participant BE as Backend (Node/Spring)
    participant DB as MongoDB

    U->>FE: Submit login form
    FE->>BE: POST /auth/login {email, password}
    BE->>DB: findOne(users, {email})
    DB-->>BE: user document
    BE->>BE: bcrypt.compare(password, passwordHash)
    alt credentials valid
        BE->>BE: sign access token (RS256, 15m)
        BE->>DB: persist refresh token family
        BE-->>FE: 200 {accessToken} + Set-Cookie(refreshToken)
        FE->>FE: store accessToken in memory, redirect
    else invalid
        BE-->>FE: 401 {code: "UNAUTHORIZED"}
        FE->>U: show generic error
    end
```

## 37.2 Registration (Signup)
```mermaid
sequenceDiagram
    participant U as Browser
    participant BE as Backend
    participant DB as MongoDB
    participant Mail as Email Service

    U->>BE: POST /auth/signup {name, email, password}
    BE->>DB: check email uniqueness
    alt email available
        BE->>BE: hash password (bcrypt)
        BE->>DB: insert users {isEmailVerified: false}
        BE->>Mail: send verification email (signed 24h token)
        BE-->>U: 201 {message: "Verify your email"}
        U->>BE: GET /auth/verify-email/:token
        BE->>DB: update user {isEmailVerified: true}
        BE-->>U: 200 verified
    else email taken
        BE-->>U: 409 {code: "EMAIL_EXISTS"}
    end
```

## 37.3 Recruitment Application Submission
```mermaid
sequenceDiagram
    participant U as Applicant
    participant BE as Backend
    participant DB as MongoDB
    participant Mail as Email Service

    U->>BE: GET /recruitment-cycles/:slug
    BE->>DB: fetch cycle + domain formSchema
    DB-->>BE: cycle document
    BE-->>U: 200 dynamic form definition
    U->>BE: POST /recruitment-cycles/:id/applications {domainSlug, answers}
    BE->>BE: validate cycle status=open, deadline not passed
    BE->>BE: validate answers against domain.formSchema (required fields)
    alt valid
        BE->>DB: insert application {status: "applied"}
        BE->>Mail: send confirmation email
        BE-->>U: 201 application created
    else cycle closed
        BE-->>U: 403 {code: "CYCLE_CLOSED"}
    else validation failed
        BE-->>U: 400 {code: "VALIDATION_ERROR", errors: [...]}
    end
```

## 37.4 Event Registration (with capacity race handling)
```mermaid
sequenceDiagram
    participant U as Student
    participant BE as Backend
    participant DB as MongoDB

    U->>BE: POST /events/:id/registrations
    BE->>DB: findOneAndUpdate(events,\n {_id: id, $expr: {$lt: ["$seatsTaken","$capacity"]}},\n {$inc: {seatsTaken: 1}})
    alt update matched (seat available)
        DB-->>BE: updated event doc
        BE->>DB: insert registrations {status: "confirmed"}
        BE-->>U: 201 {status: "confirmed"}
    else no match (full)
        DB-->>BE: null
        BE->>DB: insert registrations {status: "waitlisted", waitlistPosition: N}
        BE-->>U: 201 {status: "waitlisted"}
    end
```

## 37.5 Project Submission (Hackathon)
```mermaid
sequenceDiagram
    participant L as Team Leader
    participant BE as Backend
    participant DB as MongoDB

    L->>BE: POST /events/:id/submissions {repoUrl, demoUrl, description}
    BE->>DB: fetch hackathonDetails.submissionDeadline
    alt before deadline
        BE->>DB: upsert submissions {eventId, teamId}
        BE-->>L: 201 submission saved
    else after deadline
        BE-->>L: 409 {code: "SUBMISSION_CLOSED"}
    end
```

## 37.6 Admin Approval (Application Status Change)
```mermaid
sequenceDiagram
    participant C as Coordinator
    participant BE as Backend
    participant DB as MongoDB
    participant Mail as Email Service

    C->>BE: PATCH /applications/:id/status {status: "shortlisted"}
    BE->>BE: check permission recruitment:review
    BE->>DB: fetch current application (for audit "before")
    BE->>DB: update application.status
    BE->>DB: insert auditLogs {action: "application.status_change", before, after}
    BE->>Mail: notify applicant of status change
    BE->>DB: insert notifications {userId: applicantId, type: "application_status_changed"}
    BE-->>C: 200 updated application
```
