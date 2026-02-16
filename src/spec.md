# Specification

## Summary
**Goal:** Build an ICP portal hub that lets users discover and open integrated starter micro-app shells with shared identity, multi-tenant organization context, RBAC, multilingual UI, and basic admin metrics.

**Planned changes:**
- Create a portal landing page with a fun, playful theme (non-blue/purple primary) and a navigation pattern shared across pages.
- Implement a searchable, filterable micro-app directory grouped by category (including the provided categories plus additional best-of-breed categories), with consistent color-coding and icons per category.
- Add routing so each directory item opens a dedicated micro-app page; include at least 6 starter micro-app shells with basic UI and placeholder content.
- Integrate Internet Identity login/logout and display authenticated state (principal/handle) in the UI; add a backend endpoint to return the caller principal.
- Add multi-tenant organizations: create/join/select active organization; show active org context on micro-app pages; restrict org-scoped data to members.
- Implement RBAC with Owner/Admin/User roles, including at least one admin-only page and one owner-only action protected end-to-end.
- Add an Admin/Owner dashboard with org-scoped metrics (orgs, users, members, micro-app opens, recent activity) using simple tables/charts.
- Create shared backend APIs for identity, orgs/membership, roles, activity logging, and metrics; log activity from at least two micro-app pages.
- Add i18n infrastructure with English default plus at least one additional locale toggle covering core navigation and directory UI.
- Add vendor profiles scoped to organizations, a basic vendor management UI for Admin/Owner, and show vendors in a marketplace-style micro-app shell.
- Add a “Pricing & Plans” page backed by editable, per-category guidance content stored in the backend with an Admin/Owner edit form.
- Add generated static assets (hero + category icons) under `frontend/public/assets/generated` and render them in the landing and directory UI.

**User-visible outcome:** Users can sign in with Internet Identity, choose an organization, browse/search a playful micro-app directory, open starter micro-app pages, switch languages, and (with proper roles) manage vendors, edit pricing guidance, and view an org-scoped admin dashboard with basic usage metrics.
