$ErrorActionPreference = "Stop"

# Helper function to create file if not exists
function New-EmptyFile {
    param([string]$Path)
    $dir = Split-Path $Path -Parent
    if (-not (Test-Path $dir)) {
        New-Item -ItemType Directory -Force -Path $dir | Out-Null
    }
    if (-not (Test-Path $Path)) {
        New-Item -ItemType File -Force -Path $Path | Out-Null
    }
}

# --- Frontend Scaffolding ---
Write-Host "Scaffolding Frontend..."
$feRoot = "frontend/src"

$feDirs = @(
    "app/(public)/about/vision-mission",
    "app/(public)/about/timeline",
    "app/(public)/about/team",
    "app/(public)/about/achievements",
    "app/(public)/events/[slug]",
    "app/(public)/events/hackathons/[slug]",
    "app/(public)/events/workshops/[slug]",
    "app/(public)/projects/[slug]",
    "app/(public)/projects/submit",
    "app/(public)/research/[slug]",
    "app/(public)/blog/[slug]",
    "app/(public)/blog/category/[category]",
    "app/(public)/gallery/[albumSlug]",
    "app/(public)/recruitment/[cycleSlug]",
    "app/(public)/recruitment/[cycleSlug]/apply/[domainSlug]",
    "app/(public)/resources/[trackSlug]",
    "app/(public)/alumni",
    "app/(public)/sponsors",
    "app/(public)/achievements",
    "app/(public)/faqs",
    "app/(public)/contact",
    "app/(public)/verify/[certificateId]",
    "app/(auth)/login",
    "app/(auth)/signup",
    "app/(auth)/forgot-password",
    "app/(auth)/reset-password/[token]",
    "app/(auth)/verify-email/[token]",
    "app/(portal)/portal/dashboard",
    "app/(portal)/portal/profile",
    "app/(portal)/portal/my-events",
    "app/(portal)/portal/my-applications",
    "app/(portal)/portal/my-certificates",
    "app/(portal)/portal/notifications",
    "app/(admin)/admin/dashboard",
    "app/(admin)/admin/analytics",
    "app/(admin)/admin/events/[id]/attendance",
    "app/(admin)/admin/recruitment/[cycleId]/pipeline",
    "app/(admin)/admin/projects",
    "app/(admin)/admin/blogs",
    "app/(admin)/admin/gallery",
    "app/(admin)/admin/members",
    "app/(admin)/admin/roles",
    "app/(admin)/admin/announcements",
    "app/(admin)/admin/sponsors",
    "app/(admin)/admin/settings",
    "app/(admin)/admin/audit-logs",
    "components/ui",
    "components/layout",
    "components/events",
    "components/recruitment",
    "components/blog",
    "components/projects",
    "components/admin",
    "components/shared",
    "lib/api",
    "lib/hooks",
    "lib/validators",
    "lib/store",
    "lib/utils",
    "types"
)

foreach ($dir in $feDirs) {
    $fullPath = Join-Path $feRoot $dir
    if (-not (Test-Path $fullPath)) {
        New-Item -ItemType Directory -Force -Path $fullPath | Out-Null
    }
    # Create page.tsx for app routes
    if ($dir.StartsWith("app/")) {
        New-EmptyFile -Path (Join-Path $fullPath "page.tsx")
    }
}

# Create standard frontend files
New-EmptyFile "$feRoot/app/(portal)/portal/layout.tsx"
New-EmptyFile "$feRoot/app/(admin)/admin/layout.tsx"
New-EmptyFile "$feRoot/lib/api/client.ts"
New-EmptyFile "$feRoot/lib/api/events.ts"
New-EmptyFile "$feRoot/lib/api/recruitment.ts"
New-EmptyFile "$feRoot/lib/api/auth.ts"
New-EmptyFile "$feRoot/lib/hooks/useEvents.ts"
New-EmptyFile "$feRoot/lib/hooks/useAuth.ts"

# --- Backend Scaffolding ---
Write-Host "Scaffolding Backend..."
$beRoot = "backend/src/main/java/com/mmil/backend"

$beModules = @(
    "auth", "user", "event", "hackathon", "recruitment", "project",
    "blog", "gallery", "certificate", "notification", "announcement",
    "sponsor", "role", "auditlog", "setting"
)

# Core structures
$coreDirs = @(
    "config", "common/response", "common/exception", "common/pagination", "security"
)

foreach ($dir in $coreDirs) {
    $fullPath = Join-Path $beRoot $dir
    if (-not (Test-Path $fullPath)) {
        New-Item -ItemType Directory -Force -Path $fullPath | Out-Null
    }
}

# Backend core files
New-EmptyFile "$beRoot/config/SecurityConfig.java"
New-EmptyFile "$beRoot/config/DatabaseConfig.java"
New-EmptyFile "$beRoot/config/CorsConfig.java"
New-EmptyFile "$beRoot/config/CloudinaryConfig.java"
New-EmptyFile "$beRoot/common/response/ApiResponse.java"
New-EmptyFile "$beRoot/common/pagination/PageRequestDto.java"
New-EmptyFile "$beRoot/security/JwtAuthFilter.java"
New-EmptyFile "$beRoot/security/JwtService.java"
New-EmptyFile "$beRoot/security/RbacAspect.java"

# Scaffolding modules
foreach ($module in $beModules) {
    $modDir = Join-Path $beRoot "modules/$module"
    New-Item -ItemType Directory -Force -Path $modDir | Out-Null
    New-Item -ItemType Directory -Force -Path "$modDir/dto" | Out-Null
    
    # Capitalize module name for class names
    $capName = (Get-Culture).TextInfo.ToTitleCase($module)
    
    # Create empty Controller, Service, Repo
    New-EmptyFile "$modDir/${capName}Controller.java"
    New-EmptyFile "$modDir/${capName}Service.java"
    New-EmptyFile "$modDir/${capName}Repository.java"
    New-EmptyFile "$modDir/${capName}.java"
}

Write-Host "Scaffolding completed!"
