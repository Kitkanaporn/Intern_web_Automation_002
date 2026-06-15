// Shared design tokens — CLAUDE.md Section 10 (Frontend Design System)
// Safe to import from both server and client components: contains no
// secrets and no imports of lib/prisma.ts, lib/gemini.ts, lib/jira.ts,
// or lib/mailer.ts (Rule 8).

export const STATUS_STYLES: Record<string, string> = {
  DRAFT: "bg-gray-100 text-gray-700",
  PENDING_APPROVAL: "bg-amber-100 text-amber-800",
  APPROVED: "bg-blue-100 text-blue-800",
  IN_PROGRESS: "bg-purple-100 text-purple-800",
  COMPLETED: "bg-green-100 text-green-800",
  REJECTED: "bg-red-100 text-red-800",
};

export const STATUS_TH: Record<string, string> = {
  DRAFT: "แบบร่าง",
  PENDING_APPROVAL: "รออนุมัติ",
  APPROVED: "อนุมัติแล้ว",
  IN_PROGRESS: "กำลังดำเนินการ",
  COMPLETED: "เสร็จสิ้น",
  REJECTED: "ถูกปฏิเสธ",
};

export const DEPT_TH: Record<string, string> = {
  BUSINESS_ANALYSIS: "Business Analysis",
  DEVELOPMENT: "Development",
  QA_TESTING: "QA & Testing",
  REGISTRAR_OPS: "Registrar Operations",
};

// REVIEW NEEDED: CLAUDE.md Section 10 only defines STATUS_STYLES,
// STATUS_TH, and DEPT_TH. The additions below (priority + request type
// presentation) follow the same Tailwind-class convention and mirror
// workload_platform_ui_mockup.html so the New Request page can render
// without inventing untracked schema fields. Confirm with senior if a
// different palette/wording is expected.

export const PRIORITY_STYLES: Record<string, string> = {
  CRITICAL: "bg-red-100 text-red-800",
  HIGH: "bg-amber-100 text-amber-800",
  MEDIUM: "bg-emerald-100 text-emerald-800",
  LOW: "bg-gray-100 text-gray-700",
};

export const PRIORITY_TH: Record<string, string> = {
  CRITICAL: "Critical",
  HIGH: "High",
  MEDIUM: "Medium",
  LOW: "Low",
};

export const REQUEST_TYPE_TH: Record<string, string> = {
  REGULATORY_CHANGE: "Regulatory change",
  SYSTEM_DEVELOPMENT: "System development",
  UAT_SUPPORT: "UAT support",
  DATA_MIGRATION: "Data migration",
  DOCUMENTATION: "Documentation",
};

export const ASSIGNMENT_STATUS_TH: Record<string, string> = {
  NOT_STARTED: "ยังไม่เริ่ม",
  IN_PROGRESS: "กำลังดำเนินการ",
  DONE: "เสร็จสิ้น",
  BLOCKED: "ติดปัญหา",
};
