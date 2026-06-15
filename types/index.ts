// Shared TypeScript types mirroring prisma/schema.prisma (CLAUDE.md Section 6).
// Re-export Prisma enums so UI code never hardcodes string-literal unions.

// Enums are real JS objects at runtime (Prisma generates them as TS enums),
// so they must be imported/re-exported as values, not `export type`, so UI
// code can reference e.g. Priority.HIGH. Model interfaces are types only.
import {
  RequestType,
  RequestStatus,
  Priority,
  Department,
  AssignmentStatus,
  NotificationType,
  NotificationStatus,
  ApprovalAction,
} from "@prisma/client";
import type {
  WorkloadRequest,
  DepartmentAssignment,
  ApprovalRecord,
  AIRecommendation,
  NotificationLog,
  AuditTrail,
} from "@prisma/client";

export {
  RequestType,
  RequestStatus,
  Priority,
  Department,
  AssignmentStatus,
  NotificationType,
  NotificationStatus,
  ApprovalAction,
};

export type {
  WorkloadRequest,
  DepartmentAssignment,
  ApprovalRecord,
  AIRecommendation,
  NotificationLog,
  AuditTrail,
};

// API contract shapes — CLAUDE.md Section 11

export interface ApiSuccess<T> {
  success: true;
  data: T;
}

export interface ApiError {
  error: true;
  code: string;
  messageEn: string;
  messageTh: string;
}

export interface ApiPaginatedSuccess<T> {
  success: true;
  data: T[];
  meta: {
    page: number;
    perPage: number;
    total: number;
  };
}

// View-model types for the New Request page (Phase 1).
// REVIEW NEEDED: these are UI-only shapes for the mocked AI sidebar and
// department assignment grid — no corresponding API route exists yet
// (Phase 2 will persist DepartmentAssignment / AIRecommendation records).

export interface DeptAssignmentDraft {
  department: Department;
  assigneeName: string;
  priority: Priority;
  taskCount: number;
  dueDate: string;
  highlighted: boolean;
}

export interface AISuggestionCard {
  id: string;
  departmentLabel: string;
  phaseLabel: string;
  assigneeOptions: string[];
  selectedAssignee: string;
  priorityOptions: Priority[];
  selectedPriority: Priority;
  accepted: boolean;
  editing: boolean;
}

export interface NewTaskFormValues {
  name: string;
  department: Department;
  priority: Priority;
  assigneeName: string;
  dueDate: string;
}
