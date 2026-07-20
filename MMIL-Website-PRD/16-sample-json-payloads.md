# 32. Complete Backend JSON — Sample Payloads

All samples show the resource as it appears inside the `data` field of the standard response
envelope (Section 34). Full field-level types are in `09-json-schemas.md`.

## 32.1 User
```json
{
  "id": "665f1a2b3c4d5e6f7a8b9c01",
  "name": "Ananya Sharma",
  "email": "ananya.sharma@college.edu",
  "role": "student",
  "domainScope": [],
  "isEmailVerified": true,
  "avatarUrl": "https://res.cloudinary.com/mmil/image/upload/v1/avatars/ananya.jpg",
  "bio": "Third-year CS student interested in cloud and distributed systems.",
  "skills": ["React", "Node.js", "MongoDB", "Azure"],
  "socialLinks": {
    "github": "https://github.com/ananyasharma",
    "linkedin": "https://linkedin.com/in/ananyasharma",
    "portfolio": null
  },
  "resumeUrl": "https://res.cloudinary.com/mmil/raw/upload/v1/resumes/ananya.pdf",
  "graduationYear": 2027,
  "isPublicProfile": true,
  "status": "active",
  "createdAt": "2026-01-10T09:12:00.000Z",
  "updatedAt": "2026-06-02T14:20:00.000Z"
}
```

## 32.2 Member (Coordinator role example)
```json
{
  "id": "665f1a2b3c4d5e6f7a8b9c02",
  "name": "Rohan Verma",
  "email": "rohan.verma@college.edu",
  "role": "coordinator",
  "domainScope": ["frontend", "hackathons"],
  "isEmailVerified": true,
  "status": "active"
}
```

## 32.3 Event (Hackathon)
```json
{
  "id": "665f1a2b3c4d5e6f7a8b9d10",
  "title": "MMIL Hack Spring 2026",
  "slug": "mmil-hack-spring-2026",
  "description": "A 24-hour hackathon focused on cloud-native solutions for campus life.",
  "type": "hackathon",
  "status": "published",
  "coverImageUrl": "https://res.cloudinary.com/mmil/image/upload/v1/events/hack-spring-2026.jpg",
  "startDate": "2026-03-14T09:00:00.000Z",
  "endDate": "2026-03-15T09:00:00.000Z",
  "registrationOpensAt": "2026-02-01T00:00:00.000Z",
  "registrationClosesAt": "2026-03-10T23:59:59.000Z",
  "capacity": 150,
  "seatsTaken": 132,
  "isTeamEvent": true,
  "teamSizeMin": 2,
  "teamSizeMax": 4,
  "domain": "hackathons",
  "version": 7
}
```

## 32.4 Project
```json
{
  "id": "665f1a2b3c4d5e6f7a8b9e21",
  "title": "CampusConnect",
  "slug": "campusconnect",
  "description": "A real-time lost-and-found platform for campus built with Next.js and MongoDB.",
  "ownerId": "665f1a2b3c4d5e6f7a8b9c01",
  "collaboratorIds": ["665f1a2b3c4d5e6f7a8b9c02"],
  "techStack": ["Next.js", "TypeScript", "MongoDB", "Tailwind CSS"],
  "repoUrl": "https://github.com/ananyasharma/campusconnect",
  "demoUrl": "https://campusconnect.vercel.app",
  "images": [
    "https://res.cloudinary.com/mmil/image/upload/v1/projects/campusconnect-1.jpg"
  ],
  "hackathonEventId": "665f1a2b3c4d5e6f7a8b9d10",
  "status": "approved",
  "visibility": "public",
  "isFeatured": true
}
```

## 32.5 Blog
```json
{
  "id": "665f1a2b3c4d5e6f7a8b9f31",
  "title": "5 Lessons from Running Our First Hybrid Hackathon",
  "slug": "5-lessons-hybrid-hackathon",
  "excerpt": "What we learned coordinating 150 participants across in-person and remote tracks.",
  "authorId": "665f1a2b3c4d5e6f7a8b9c02",
  "category": "Events",
  "tags": ["hackathon", "retrospective"],
  "coverImageUrl": "https://res.cloudinary.com/mmil/image/upload/v1/blogs/hybrid-hackathon.jpg",
  "status": "published",
  "publishAt": "2026-03-20T08:00:00.000Z"
}
```

## 32.6 Recruitment Cycle
```json
{
  "id": "665f1a2b3c4d5e6f7a8ba041",
  "title": "MMIL Core Team Recruitment — Fall 2026",
  "slug": "core-recruitment-fall-2026",
  "status": "open",
  "opensAt": "2026-08-01T00:00:00.000Z",
  "closesAt": "2026-08-20T23:59:59.000Z",
  "allowMultiDomain": false,
  "domains": [
    {
      "name": "Frontend",
      "slug": "frontend",
      "formSchema": [
        { "fieldKey": "whyJoin", "label": "Why do you want to join MMIL Frontend?", "type": "textarea", "required": true },
        { "fieldKey": "portfolioUrl", "label": "Portfolio/GitHub URL", "type": "url", "required": true },
        { "fieldKey": "resume", "label": "Resume (PDF)", "type": "file", "required": true }
      ]
    }
  ]
}
```

## 32.7 Application
```json
{
  "id": "665f1a2b3c4d5e6f7a8ba152",
  "cycleId": "665f1a2b3c4d5e6f7a8ba041",
  "domainSlug": "frontend",
  "applicantId": "665f1a2b3c4d5e6f7a8b9c01",
  "answers": {
    "whyJoin": "I want to contribute to real production React projects and grow as an engineer.",
    "portfolioUrl": "https://github.com/ananyasharma",
    "resume": "https://res.cloudinary.com/mmil/raw/upload/v1/resumes/ananya.pdf"
  },
  "status": "shortlisted",
  "reviewerNotes": [
    { "reviewerId": "665f1a2b3c4d5e6f7a8b9c02", "note": "Strong portfolio, move to interview.", "createdAt": "2026-08-05T10:00:00.000Z" }
  ]
}
```

## 32.8 Gallery
```json
{
  "album": {
    "id": "665f1a2b3c4d5e6f7a8ba263",
    "title": "Hack Spring 2026 — Highlights",
    "slug": "hack-spring-2026-highlights",
    "eventId": "665f1a2b3c4d5e6f7a8b9d10",
    "coverImageUrl": "https://res.cloudinary.com/mmil/image/upload/v1/gallery/hack-spring-cover.jpg"
  },
  "items": [
    {
      "id": "665f1a2b3c4d5e6f7a8ba264",
      "albumId": "665f1a2b3c4d5e6f7a8ba263",
      "mediaUrl": "https://res.cloudinary.com/mmil/image/upload/v1/gallery/hack-spring-1.jpg",
      "mediaType": "image",
      "caption": "Opening ceremony"
    }
  ]
}
```

## 32.9 Certificate
```json
{
  "certificateId": "b6f1a2c4-9e3d-4a11-8f2a-7d6c5b4a3e21",
  "userId": "665f1a2b3c4d5e6f7a8b9c01",
  "type": "participation",
  "eventId": "665f1a2b3c4d5e6f7a8b9d10",
  "cycleId": null,
  "pdfUrl": "https://res.cloudinary.com/mmil/raw/upload/v1/certificates/b6f1a2c4.pdf",
  "verificationHash": "8f14e45fceea167a5a36dedd4bea2543",
  "status": "active",
  "issuedAt": "2026-03-16T12:00:00.000Z"
}
```

## 32.10 Notification
```json
{
  "id": "665f1a2b3c4d5e6f7a8ba375",
  "userId": "665f1a2b3c4d5e6f7a8b9c01",
  "type": "application_status_changed",
  "title": "Application Update",
  "body": "Your Frontend domain application has moved to Shortlisted.",
  "isRead": false,
  "link": "/portal/my-applications",
  "createdAt": "2026-08-05T10:01:00.000Z"
}
```

## 32.11 Announcement
```json
{
  "id": "665f1a2b3c4d5e6f7a8ba486",
  "title": "Recruitment Applications Closing Soon",
  "body": "Fall 2026 core team recruitment closes August 20. Apply now!",
  "priority": "urgent",
  "startsAt": "2026-08-15T00:00:00.000Z",
  "endsAt": "2026-08-20T23:59:59.000Z",
  "audience": "students"
}
```

## 32.12 Role & Permissions
```json
{
  "key": "coordinator",
  "label": "Coordinator",
  "description": "Manages events and content within an assigned domain.",
  "permissionKeys": [
    "event:create", "event:update", "event:publish", "event:manage",
    "blog:publish", "gallery:manage", "project:review", "attendance:mark",
    "certificate:issue"
  ]
}
```

## 32.13 Analytics (dashboard summary sample response)
```json
{
  "totalMembers": 1842,
  "activeMembersThisMonth": 612,
  "upcomingEvents": 4,
  "registrationsOverTime": [
    { "month": "2026-03", "count": 210 },
    { "month": "2026-04", "count": 185 }
  ],
  "recruitmentFunnel": {
    "applied": 340,
    "shortlisted": 120,
    "interview": 60,
    "offered": 35
  }
}
```

## 32.14 Audit Log
```json
{
  "id": "665f1a2b3c4d5e6f7a8ba597",
  "actorId": "665f1a2b3c4d5e6f7a8b9c02",
  "action": "application.status_change",
  "entityType": "application",
  "entityId": "665f1a2b3c4d5e6f7a8ba152",
  "before": { "status": "applied" },
  "after": { "status": "shortlisted" },
  "ipAddress": "10.20.30.40",
  "createdAt": "2026-08-05T10:00:00.000Z"
}
```

## 32.15 Settings
```json
{
  "siteName": "Microsoft Mobile Innovation Lab",
  "socialLinks": {
    "instagram": "https://instagram.com/mmil.official",
    "linkedin": "https://linkedin.com/company/mmil"
  },
  "featureFlags": {
    "chatbotEnabled": false,
    "pushNotificationsEnabled": false
  }
}
```
