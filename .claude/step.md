# Execution Checklist — AI-Assisted Workload Distribution Platform

Check items off as completed. See `plan.md` for the full roadmap and rationale.

## Phase 1 — The First Page (New Request UI + Foundation)

- [x] 1. Start Docker Desktop; run a Postgres 15 container; create the `tsd_workload`
      database; set `DATABASE_URL` in `.env.local`
- [x] 2. Scaffold Next.js 14 app at project root (`create-next-app@14`, TypeScript,
      Tailwind, App Router, ESLint, import alias `@/*`); initial git commit
- [x] 3. Add `.env.example` with all keys from CLAUDE.md Section 12 (empty values)
- [x] 4. Add Tailwind design tokens — `STATUS_STYLES`, `STATUS_TH`, `DEPT_TH`
      (CLAUDE.md Section 10) in a shared constants file
- [x] 5. Write `prisma/schema.prisma` — all enums + models from CLAUDE.md Section 6
      (base audit fields, onDelete behavior, soft delete)
- [x] 6. Run first Prisma migration; write `lib/prisma.ts` singleton
- [x] 7. Write `prisma/seed.ts` — distinct creator/approver users (for Rule 2 later)
      + dept assignees matching the mockup (Suthida T., Piyawat K., Natcha W.,
      Ananya R.)
- [x] 8. Set up NextAuth v5 (JWT): `lib/auth.ts`,
      `app/api/auth/[...nextauth]/route.ts`, `middleware.ts`, `app/login/page.tsx`
- [x] 9. Define `types/index.ts` mirroring the Prisma schema
- [x] 10. Build `components/ui/` — Button, StatusBadge, Modal
- [x] 11. Build `components/AISidebar.tsx` with mocked suggestion cards (4 cards:
      BA/Dev/QA/Registrar, Accept/Edit inline forms, risk bubbles, refine textarea
      + Regenerate button placeholder)
- [x] 12. Build `app/requests/new/page.tsx` — two-column layout: client/title
      inputs, requirement textarea, request-type tags, 2x2 DeptAssignmentGrid,
      add-task form (RHF + Zod, Thai labels); action bar (Save draft / Submit for
      approval, can be disabled until Phase 2)
- [x] 13. Verify: `npm run dev` runs; `tsc --noEmit` clean; `prisma migrate dev` +
      `prisma db seed` work; `/login` and `/requests/new` reachable with auth
      redirect; compare `/requests/new` against `workload_platform_ui_mockup.html`
      for layout/behavior parity

## Phase 2 — Real Data + AI

- [ ] 14. `POST/GET /api/workload` + `/api/workload/[id]` route handlers (auditLog,
      bilingual errors, soft delete)
- [ ] 15. `lib/gemini.ts` + SSE endpoint `/api/ai/recommend` (gemini-2.5-flash)
- [ ] 16. Wire `AISidebar.tsx` EventSource to real endpoint (keep mock as fallback)
- [ ] 17. Persist accepted/edited suggestions to `DepartmentAssignment` /
      `AIRecommendation`
- [ ] 18. Dashboard (`app/page.tsx`) + request list (`app/requests/page.tsx`)
- [ ] 19. First Jest unit tests
- [ ] 20. Verify: create-and-reload persists data; live AI stream visible; audit
      rows written

## Phase 3 — Approval Gate + Integrations + E2E

- [ ] 21. `app/requests/[id]/approval/page.tsx` with PhaseTracker + ApprovalPanel +
      confirm modals
- [ ] 22. `POST /api/workload/[id]/approve` and `/reject` — enforce no-self-approval
      (403), audit log
- [ ] 23. `lib/jira.ts` (post-approval only) + `lib/mailer.ts`
- [ ] 24. `NotificationLog` + `app/notifications/page.tsx` + `/api/notifications`
- [ ] 25. Full end-to-end manual run: create → AI recommend → approve → Jira →
      email → notification

## Phase 4 — Sequential Triggers, Hardening, Demo

- [ ] 26. Sequential phase-DONE → next-dept notification (Rule 4); simplify to
      manual "mark phase DONE" button + polling if behind schedule
- [ ] 27. Bug fixes, QA checklist, realistic seed data
- [ ] 28. README + Thai user manual
- [ ] 29. Slides + presentation script
- [ ] 30. Reserve final 2-3 days for rehearsal only — no new features
