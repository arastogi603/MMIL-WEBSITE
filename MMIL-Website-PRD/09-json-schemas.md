# 16. JSON Schemas (Draft 2020-12)

These schemas define the wire format for each resource's `data` payload (inside the standard
response envelope). They are the source both frontend Zod validators and backend DTO
validators should be generated from or kept in lockstep with.

## 16.1 User
```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "https://mmil.dev/schemas/user.json",
  "title": "User",
  "type": "object",
  "properties": {
    "id": { "type": "string" },
    "name": { "type": "string", "minLength": 2, "maxLength": 80 },
    "email": { "type": "string", "format": "email" },
    "role": {
      "type": "string",
      "enum": ["student", "alumni", "recruiter", "coordinator", "core-team", "faculty", "leadership", "admin"]
    },
    "domainScope": { "type": "array", "items": { "type": "string" } },
    "isEmailVerified": { "type": "boolean" },
    "avatarUrl": { "type": ["string", "null"], "format": "uri" },
    "bio": { "type": ["string", "null"], "maxLength": 500 },
    "skills": { "type": "array", "items": { "type": "string" } },
    "socialLinks": {
      "type": "object",
      "properties": {
        "github": { "type": ["string", "null"], "format": "uri" },
        "linkedin": { "type": ["string", "null"], "format": "uri" },
        "portfolio": { "type": ["string", "null"], "format": "uri" }
      }
    },
    "resumeUrl": { "type": ["string", "null"], "format": "uri" },
    "graduationYear": { "type": ["integer", "null"] },
    "isPublicProfile": { "type": "boolean" },
    "status": { "type": "string", "enum": ["active", "suspended"] },
    "createdAt": { "type": "string", "format": "date-time" },
    "updatedAt": { "type": "string", "format": "date-time" }
  },
  "required": ["id", "name", "email", "role", "isEmailVerified", "status"]
}
```

## 16.2 Event
```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "https://mmil.dev/schemas/event.json",
  "title": "Event",
  "type": "object",
  "properties": {
    "id": { "type": "string" },
    "title": { "type": "string", "minLength": 3, "maxLength": 120 },
    "slug": { "type": "string", "pattern": "^[a-z0-9-]+$" },
    "description": { "type": "string" },
    "type": { "type": "string", "enum": ["event", "hackathon", "workshop"] },
    "status": { "type": "string", "enum": ["draft", "published", "cancelled", "completed"] },
    "coverImageUrl": { "type": ["string", "null"], "format": "uri" },
    "startDate": { "type": "string", "format": "date-time" },
    "endDate": { "type": "string", "format": "date-time" },
    "registrationOpensAt": { "type": "string", "format": "date-time" },
    "registrationClosesAt": { "type": "string", "format": "date-time" },
    "capacity": { "type": ["integer", "null"], "minimum": 1 },
    "seatsTaken": { "type": "integer", "minimum": 0 },
    "isTeamEvent": { "type": "boolean" },
    "teamSizeMin": { "type": ["integer", "null"], "minimum": 1 },
    "teamSizeMax": { "type": ["integer", "null"], "minimum": 1 },
    "domain": { "type": ["string", "null"] },
    "version": { "type": "integer" }
  },
  "required": ["id", "title", "slug", "type", "status", "startDate", "endDate"]
}
```

## 16.3 Project
```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "https://mmil.dev/schemas/project.json",
  "title": "Project",
  "type": "object",
  "properties": {
    "id": { "type": "string" },
    "title": { "type": "string" },
    "slug": { "type": "string" },
    "description": { "type": "string" },
    "ownerId": { "type": "string" },
    "collaboratorIds": { "type": "array", "items": { "type": "string" } },
    "techStack": { "type": "array", "items": { "type": "string" } },
    "repoUrl": { "type": "string", "format": "uri" },
    "demoUrl": { "type": ["string", "null"], "format": "uri" },
    "images": { "type": "array", "items": { "type": "string", "format": "uri" }, "maxItems": 10 },
    "status": { "type": "string", "enum": ["pending", "approved", "rejected"] },
    "visibility": { "type": "string", "enum": ["public", "private"] },
    "isFeatured": { "type": "boolean" }
  },
  "required": ["id", "title", "slug", "ownerId", "status", "visibility"]
}
```

## 16.4 Blog
```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "https://mmil.dev/schemas/blog.json",
  "title": "Blog",
  "type": "object",
  "properties": {
    "id": { "type": "string" },
    "title": { "type": "string" },
    "slug": { "type": "string" },
    "excerpt": { "type": "string", "maxLength": 300 },
    "contentRichText": { "type": "object" },
    "authorId": { "type": "string" },
    "category": { "type": "string" },
    "tags": { "type": "array", "items": { "type": "string" } },
    "coverImageUrl": { "type": ["string", "null"], "format": "uri" },
    "status": { "type": "string", "enum": ["draft", "published", "scheduled"] },
    "publishAt": { "type": ["string", "null"], "format": "date-time" }
  },
  "required": ["id", "title", "slug", "authorId", "status"]
}
```

## 16.5 Recruitment Cycle
```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "https://mmil.dev/schemas/recruitmentCycle.json",
  "title": "RecruitmentCycle",
  "type": "object",
  "properties": {
    "id": { "type": "string" },
    "title": { "type": "string" },
    "slug": { "type": "string" },
    "status": { "type": "string", "enum": ["draft", "open", "closed"] },
    "opensAt": { "type": "string", "format": "date-time" },
    "closesAt": { "type": "string", "format": "date-time" },
    "allowMultiDomain": { "type": "boolean" },
    "domains": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "name": { "type": "string" },
          "slug": { "type": "string" },
          "formSchema": {
            "type": "array",
            "items": {
              "type": "object",
              "properties": {
                "fieldKey": { "type": "string" },
                "label": { "type": "string" },
                "type": { "type": "string", "enum": ["text", "textarea", "select", "file", "number", "url"] },
                "required": { "type": "boolean" },
                "options": { "type": "array", "items": { "type": "string" } }
              },
              "required": ["fieldKey", "label", "type", "required"]
            }
          }
        },
        "required": ["name", "slug", "formSchema"]
      }
    }
  },
  "required": ["id", "title", "slug", "status", "domains"]
}
```

## 16.6 Application
```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "https://mmil.dev/schemas/application.json",
  "title": "Application",
  "type": "object",
  "properties": {
    "id": { "type": "string" },
    "cycleId": { "type": "string" },
    "domainSlug": { "type": "string" },
    "applicantId": { "type": "string" },
    "answers": { "type": "object" },
    "status": { "type": "string", "enum": ["applied", "shortlisted", "interview", "offered", "rejected"] },
    "reviewerNotes": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "reviewerId": { "type": "string" },
          "note": { "type": "string" },
          "createdAt": { "type": "string", "format": "date-time" }
        }
      }
    }
  },
  "required": ["id", "cycleId", "domainSlug", "applicantId", "status"]
}
```

## 16.7 Team
```json
{
  "$id": "https://mmil.dev/schemas/team.json",
  "type": "object",
  "properties": {
    "id": { "type": "string" },
    "eventId": { "type": "string" },
    "name": { "type": "string" },
    "leaderId": { "type": "string" },
    "memberIds": { "type": "array", "items": { "type": "string" } },
    "isLocked": { "type": "boolean" }
  },
  "required": ["id", "eventId", "name", "leaderId", "memberIds"]
}
```

## 16.8 Certificate
```json
{
  "$id": "https://mmil.dev/schemas/certificate.json",
  "type": "object",
  "properties": {
    "certificateId": { "type": "string", "format": "uuid" },
    "userId": { "type": "string" },
    "type": { "type": "string", "enum": ["participation", "winner", "coordinator", "appreciation"] },
    "eventId": { "type": ["string", "null"] },
    "cycleId": { "type": ["string", "null"] },
    "pdfUrl": { "type": "string", "format": "uri" },
    "status": { "type": "string", "enum": ["active", "revoked"] },
    "issuedAt": { "type": "string", "format": "date-time" }
  },
  "required": ["certificateId", "userId", "type", "pdfUrl", "status", "issuedAt"]
}
```

## 16.9 Notification
```json
{
  "$id": "https://mmil.dev/schemas/notification.json",
  "type": "object",
  "properties": {
    "id": { "type": "string" },
    "userId": { "type": ["string", "null"] },
    "type": { "type": "string" },
    "title": { "type": "string" },
    "body": { "type": "string" },
    "isRead": { "type": "boolean" },
    "link": { "type": ["string", "null"] },
    "createdAt": { "type": "string", "format": "date-time" }
  },
  "required": ["id", "type", "title", "body", "isRead"]
}
```

## 16.10 Gallery Item
```json
{
  "$id": "https://mmil.dev/schemas/galleryItem.json",
  "type": "object",
  "properties": {
    "id": { "type": "string" },
    "albumId": { "type": "string" },
    "mediaUrl": { "type": "string", "format": "uri" },
    "mediaType": { "type": "string", "enum": ["image", "video"] },
    "caption": { "type": ["string", "null"] }
  },
  "required": ["id", "albumId", "mediaUrl", "mediaType"]
}
```

## 16.11 Announcement
```json
{
  "$id": "https://mmil.dev/schemas/announcement.json",
  "type": "object",
  "properties": {
    "id": { "type": "string" },
    "title": { "type": "string" },
    "body": { "type": "string" },
    "priority": { "type": "string", "enum": ["normal", "urgent"] },
    "startsAt": { "type": "string", "format": "date-time" },
    "endsAt": { "type": "string", "format": "date-time" },
    "audience": { "type": "string", "enum": ["all", "students", "staff"] }
  },
  "required": ["id", "title", "body", "priority", "startsAt", "endsAt", "audience"]
}
```

## 16.12 Resource
```json
{
  "$id": "https://mmil.dev/schemas/resource.json",
  "type": "object",
  "properties": {
    "id": { "type": "string" },
    "title": { "type": "string" },
    "description": { "type": "string" },
    "url": { "type": "string", "format": "uri" },
    "track": { "type": "string" },
    "type": { "type": "string", "enum": ["article", "video", "course"] }
  },
  "required": ["id", "title", "url", "track", "type"]
}
```

## 16.13 Sponsor
```json
{
  "$id": "https://mmil.dev/schemas/sponsor.json",
  "type": "object",
  "properties": {
    "id": { "type": "string" },
    "name": { "type": "string" },
    "logoUrl": { "type": "string", "format": "uri" },
    "tier": { "type": "string", "enum": ["platinum", "gold", "silver", "partner"] },
    "websiteUrl": { "type": ["string", "null"], "format": "uri" },
    "isActive": { "type": "boolean" }
  },
  "required": ["id", "name", "logoUrl", "tier", "isActive"]
}
```

## 16.14 Role & Permission
```json
{
  "$id": "https://mmil.dev/schemas/role.json",
  "type": "object",
  "properties": {
    "key": { "type": "string" },
    "label": { "type": "string" },
    "description": { "type": ["string", "null"] },
    "permissionKeys": { "type": "array", "items": { "type": "string" } }
  },
  "required": ["key", "label", "permissionKeys"]
}
```

## 16.15 Audit Log
```json
{
  "$id": "https://mmil.dev/schemas/auditLog.json",
  "type": "object",
  "properties": {
    "id": { "type": "string" },
    "actorId": { "type": "string" },
    "action": { "type": "string" },
    "entityType": { "type": "string" },
    "entityId": { "type": "string" },
    "before": {},
    "after": {},
    "ipAddress": { "type": ["string", "null"] },
    "createdAt": { "type": "string", "format": "date-time" }
  },
  "required": ["id", "actorId", "action", "entityType", "entityId", "createdAt"]
}
```

## 16.16 Settings
```json
{
  "$id": "https://mmil.dev/schemas/settings.json",
  "type": "object",
  "properties": {
    "siteName": { "type": "string" },
    "socialLinks": { "type": "object" },
    "featureFlags": {
      "type": "object",
      "properties": {
        "chatbotEnabled": { "type": "boolean" },
        "pushNotificationsEnabled": { "type": "boolean" }
      }
    }
  },
  "required": ["siteName"]
}
```
