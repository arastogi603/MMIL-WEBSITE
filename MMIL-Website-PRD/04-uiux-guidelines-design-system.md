# 9. UI/UX Guidelines

## 9.1 Color Palette
Design language: Microsoft-inspired (Fluent-adjacent) but distinctly MMIL — a deep blue/azure
primary (nods to Microsoft brand) with a high-contrast accent for CTAs. All colors expressed
as CSS variables / Tailwind theme tokens (see Design System, Section 10.2) so light/dark mode
is a token swap, not a component rewrite.

| Token | Light | Dark | Usage |
|---|---|---|---|
| `--color-primary` | `#0F6CBD` | `#3AA0FF` | Primary buttons, links, active nav |
| `--color-primary-foreground` | `#FFFFFF` | `#0B1220` | Text on primary bg |
| `--color-accent` | `#7C3AED` | `#A78BFA` | Highlights, badges, hackathon branding |
| `--color-success` | `#16A34A` | `#4ADE80` | Confirmed states |
| `--color-warning` | `#D97706` | `#FBBF24` | Waitlisted / pending states |
| `--color-destructive` | `#DC2626` | `#F87171` | Errors, rejected states |
| `--color-background` | `#FFFFFF` | `#0B1220` | App background |
| `--color-surface` | `#F5F7FA` | `#111827` | Cards, panels |
| `--color-border` | `#E5E7EB` | `#1F2937` | Dividers, card borders |
| `--color-muted-foreground` | `#6B7280` | `#9CA3AF` | Secondary text |

## 9.2 Typography
- **Font family:** `Segoe UI Variable` fallback stack → `"Segoe UI Variable", "Inter", system-ui, sans-serif`
  (Segoe UI reinforces the Microsoft affinity; Inter as a robust open-source fallback).
- **Scale (Tailwind-mapped):** `text-xs` (12px) → `text-6xl` (60px) using a 1.25 modular scale.
- **Headings:** `font-semibold` to `font-bold`, tight `leading-tight` (1.15–1.25).
- **Body:** `text-base` (16px), `leading-relaxed` (1.625), `font-normal`.
- **Code/mono (project tech-stack tags, IDs):** `"Cascadia Code", ui-monospace, monospace`.

## 9.3 Spacing & Grid
- 4px base spacing unit (Tailwind default scale). Section vertical rhythm: `py-16` desktop /
  `py-10` mobile between major landing-page sections.
- 12-column responsive grid (`grid-cols-12`), content max-width `1280px` (`max-w-7xl`),
  gutters `gap-6` desktop / `gap-4` mobile.

## 9.4 Cards, Buttons, Forms, Tables
- **Cards:** `rounded-2xl`, `shadow-sm` resting / `shadow-md` on hover, `border border-border`,
  `bg-surface`, consistent `p-6` padding. Hover lifts translateY(-2px) with a 150ms ease-out
  transition (Framer Motion `whileHover`).
- **Buttons:** ShadCN `Button` primitive extended with MMIL variants — `primary`, `secondary`
  (outline), `ghost`, `destructive`. Min touch target 44×44px on mobile. Loading state shows an
  inline spinner and disables the button (never removes it, to avoid layout shift).
- **Forms:** Label above field (never placeholder-only labels — accessibility). Inline
  validation on blur, not on every keystroke. Error text `text-destructive text-sm` directly
  under the field. Multi-step forms (recruitment application) show a progress stepper.
- **Tables (admin):** Sticky header, row hover highlight, right-aligned numeric columns,
  built on ShadCN `DataTable` (TanStack Table) with column sort, pagination, and a per-column
  filter row for admin views with >20 typical rows.

## 9.5 Animations & Micro-interactions
- Framer Motion for: page-transition fade/slide (150–250ms), card hover lift, stagger-in for
  list/grid items on first viewport entry (`whileInView`), skeleton shimmer.
- Respect `prefers-reduced-motion`: all non-essential motion disabled/reduced when set.

## 9.6 Accessibility (WCAG 2.1 AA target)
- Color contrast ≥4.5:1 for body text, ≥3:1 for large text/UI components (verified against
  both light and dark token sets).
- All interactive elements keyboard-reachable and operable (visible focus ring using
  `--color-primary` at 2px offset outline).
- Semantic HTML first (`<nav>`, `<main>`, `<button>` not `<div onClick>`), ARIA only to fill
  genuine gaps (custom dropdowns, modals get `role`, `aria-expanded`, `aria-modal`, focus trap).
- Images require `alt`; decorative images use `alt=""`.
- Forms: every input has a programmatically associated `<label>`; errors announced via
  `aria-live="polite"` region.

## 9.7 Dark Mode
- Implemented via a `class` strategy (`<html class="dark">`) toggled by a persisted preference
  (stored server-side on the user profile if logged in, else `localStorage`-free — persisted
  via a first-party cookie so SSR renders the correct theme with no flash).
- All custom components consume CSS variables, never hardcoded hex, so dark mode requires zero
  component logic branching.

## 9.8 Responsive Design
- Mobile-first Tailwind breakpoints: `sm 640` `md 768` `lg 1024` `xl 1280` `2xl 1536`.
- Admin data tables collapse to stacked "card per row" layout below `md`.
- Images use `next/image` with responsive `sizes` for automatic responsive `srcset`.

## 9.9 Loading, Skeleton, Error, Success States
- **Loading:** Skeleton screens (shimmer) matching final content's layout shape — never a
  bare spinner for content areas; spinners reserved for button/inline actions only.
- **Error states:** Friendly illustration + short message + retry action for full-page errors
  (e.g., failed data fetch); inline error banners (ShadCN `Alert` `variant="destructive"`) for
  form/section-level errors.
- **Success states:** Toast notifications (ShadCN `Sonner`/`Toast`) for transient confirmations
  (e.g., "Registered successfully"); persistent success banners for durable state changes
  (e.g., "Application submitted — track status in your Portal").
- **Empty states:** Every list view (no events, no notifications, no applications) has a
  dedicated empty-state illustration + primary CTA (e.g., "Browse upcoming events").

---

# 10. Design System

## 10.1 Component Inventory (built on ShadCN UI primitives, MMIL-themed)
Navbar, Footer, Sidebar (admin), Mega-menu, Card (Event/Blog/Project/Member variants), Badge
(status: confirmed/waitlisted/pending/rejected/approved), Button, Input, Textarea, Select,
Combobox, DatePicker, FileUpload (Cloudinary-backed), Modal/Dialog, Drawer (mobile nav),
Dropdown Menu, Tabs, Stepper (multi-step forms), DataTable (admin), Pagination, Toast,
Tooltip, Avatar, Skeleton, EmptyState, Accordion (FAQs), Timeline (About page), StatCard
(Analytics), Chart wrappers (Recharts-based line/bar/pie), QR Scanner component (Attendance),
Rich Text Editor (Blog/Project descriptions — Tiptap recommended).

## 10.2 Design Tokens (source of truth: `tailwind.config.ts` + CSS variables)
```ts
// tailwind.config.ts (excerpt)
export default {
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: "hsl(var(--color-primary))",
        accent: "hsl(var(--color-accent))",
        success: "hsl(var(--color-success))",
        warning: "hsl(var(--color-warning))",
        destructive: "hsl(var(--color-destructive))",
        background: "hsl(var(--color-background))",
        surface: "hsl(var(--color-surface))",
        border: "hsl(var(--color-border))",
        "muted-foreground": "hsl(var(--color-muted-foreground))",
      },
      borderRadius: { xl: "1rem", "2xl": "1.25rem" },
      fontFamily: {
        sans: ["Segoe UI Variable", "Inter", "system-ui", "sans-serif"],
        mono: ["Cascadia Code", "ui-monospace", "monospace"],
      },
    },
  },
};
```

## 10.3 Icons & Illustrations
- **Icons:** `lucide-react` exclusively (consistent stroke weight, tree-shakeable).
- **Illustrations:** Custom SVG set for empty/error states and landing-page hero, stored under
  `/public/illustrations`, themed via `currentColor` so they adapt to dark mode.

## 10.4 Navbar / Footer / Sidebar Behavior
- **Navbar:** `position: sticky; top: 0`, backdrop-blur on scroll, elevates with a subtle
  shadow after 8px scroll.
- **Footer:** 4-column grid desktop → accordion-collapsed sections on mobile.
- **Admin Sidebar:** collapsible (icon-only collapsed state persisted in a cookie), sections
  grouped by domain (Content, People, Operations, System) with role-based item visibility.

## 10.5 Modals, Dialogs, Dropdowns, Pagination, Forms
- **Modals/Dialogs:** ShadCN `Dialog` (Radix-based) — focus-trapped, `Esc`-closable, backdrop
  click closes unless a destructive confirm ("Delete event") requires explicit button click.
- **Dropdowns:** Radix `DropdownMenu`, keyboard-navigable (arrow keys, `Enter`/`Space` select).
- **Pagination:** Cursor-based for infinite-scroll public feeds (Blogs, Events); page-number
  based for admin tables (predictable jump-to-page). Both shapes are supported by the same
  API pagination envelope (see `08-api-design-and-openapi.md`, Section 14.9).
- **Forms:** React Hook Form + Zod resolver for all forms — one shared Zod schema per resource
  reused for both client-side validation and (mirrored) server-side DTO validation, keeping
  validation rules single-sourced conceptually even though they're duplicated across the
  frontend/backend boundary (necessary since backend must never trust client validation alone).
