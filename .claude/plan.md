# 4-Phase Development Roadmap — AI-Assisted Workload Distribution Platform

## Overview

Day 1, Week 1 of 8. Nothing built yet. The build is organized into **4 development
phases (~2 weeks each)**, mapping onto Detail.txt's 4 system-workflow phases and
grouping the existing CLAUDE.md 8-week calendar into bigger, demoable vertical
slices — more realistic for a solo intern than 8 discrete weekly goals.

| Phase | Weeks | Theme | Demoable outcome |
|---|---|---|---|
| 1 | 1-2 | **First page**: New Request UI + project foundation | `/requests/new` renders like the mockup, with a mocked AI sidebar, on a working Next.js + Prisma + NextAuth foundation |
| 2 | 3-4 | Real data + AI | Requests persist to Postgres; AI sidebar streams real Gemini recommendations (SSE) |
| 3 | 5-6 | Approval gate + integrations | Approve → Jira tasks created → emails sent → notifications logged (live or convincingly mocked) |
| 4 | 7-8 | Sequential triggers + hardening + demo | Phase-DONE triggers next-dept notification (or simplified); bug fixes, docs, rehearsal |

## Phase 1 (Weeks 1-2) — The First Page: New Request UI + Foundation

**Goal:** The New Request page renders matching `workload_platform_ui_mockup.html`
with a mocked AI sidebar, on a scaffolded Next.js app with Prisma migrated and
NextAuth login working.

**Scope:**
- Local Postgres (Docker) + `tsd_workload` database
- Next.js 14 scaffold (TS, Tailwind, App Router, ESLint)
- Tailwind design tokens (STATUS_STYLES, STATUS_TH, DEPT_TH — CLAUDE.md Section 10)
- Prisma schema (CLAUDE.md Section 6) + first migration + `lib/prisma.ts`
- Seed data with distinct creator/approver users + dept assignees matching the mockup
- NextAuth v5 (JWT) + `middleware.ts` route protection + login page
- `types/index.ts` mirroring the Prisma schema
- `app/requests/new/page.tsx` (two-column layout: form + tags + DeptAssignmentGrid +
  add-task form via RHF+Zod) and `AISidebar.tsx` with mocked suggestion cards
- `components/ui/` (Button, StatusBadge, Modal)

**Dependencies:** None external — no API keys needed yet.

**Risks:** Postgres/Prisma setup friction on Windows; NextAuth v5 config quirks;
over-matching mockup pixels instead of structure/behavior.

**Definition of Done:**
- App runs (`npm run dev`); login gates protected routes via middleware.
- `/requests/new` visually and structurally matches the mockup's first screen.
- Mocked AI sidebar is interactive (accept/edit/save suggestion cards work client-side).
- `tsc --noEmit` clean; Zod validation works on the form.
- `.env.example` present with all keys from CLAUDE.md Section 12 (empty values).

## Phase 2 (Weeks 3-4) — Real Data + AI

**Goal:** A request created in the UI persists to Postgres; AI sidebar streams a
real Gemini recommendation.

- `POST/GET /api/workload` + `/api/workload/[id]` Route Handlers (auditLog,
  bilingual errors, soft delete)
- `lib/gemini.ts` + SSE endpoint `/api/ai/recommend` (gemini-2.5-flash) — AI
  advisory only (Rule 3, never triggers Jira)
- Wire `AISidebar.tsx`'s `EventSource` to the real endpoint, replacing mocked data
- Persist accepted/edited suggestions to `DepartmentAssignment` / `AIRecommendation`
- Dashboard + request list server components
- First Jest unit tests

**Dependencies:** Phase 1 schema/pages + `GEMINI_API_KEY`.

**Definition of Done:** Create-and-reload shows persisted data; live AI stream
visible in sidebar; audit rows written for every write.

## Phase 3 (Weeks 5-6) — Approval Gate + Integrations + E2E

**Goal:** Full workflow — approve → Jira tasks → email → notifications.

- `app/requests/[id]/approval/page.tsx` with PhaseTracker + ApprovalPanel + confirm modals
- `POST /api/workload/[id]/approve` and `/reject` — enforce no-self-approval (403,
  Rule 2), audit log
- `lib/jira.ts` (post-approval only) + `lib/mailer.ts`
- `NotificationLog` usage, `app/notifications/page.tsx` + `/api/notifications`
- First full end-to-end manual run

**Dependencies:** Phase 2 routes; Jira token + SMTP creds (both cut/mock candidates
if delayed).

**Definition of Done:** One full happy path works live, or with convincingly
mocked Jira/email responses.

## Phase 4 (Weeks 7-8) — Sequential Triggers, Hardening, Demo

**Goal:** Phase-DONE triggers work (or are simplified), bugs fixed, demo rehearsed.

- Sequential phase-DONE → next-dept notification (Rule 4) — prefer manual
  "mark phase DONE" button + polling over a full Jira webhook if behind
- Bug fixes, QA checklist, realistic seed data
- README + Thai user manual
- Slides + presentation script
- Reserve final 2-3 days for rehearsal only — no new features

**Definition of Done:** Demo script runs start-to-finish without developer
intervention; slides ready.

## Recommended Cuts (ranked, only if behind schedule)

1. Jira webhook phase trigger → manual "mark phase DONE" button
2. Live Jira API → mocked response with fake epic keys
3. Live SMTP → log to `NotificationLog` + render "email sent" card
4. Dashboard metrics → static/seeded numbers

**Never cut:** New Request page + AI sidebar, the human approval gate, and a
*visible* Jira/email/notification flow (even if mocked).
