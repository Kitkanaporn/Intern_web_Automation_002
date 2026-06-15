-- CreateEnum
CREATE TYPE "RequestType" AS ENUM ('REGULATORY_CHANGE', 'SYSTEM_DEVELOPMENT', 'UAT_SUPPORT', 'DATA_MIGRATION', 'DOCUMENTATION');

-- CreateEnum
CREATE TYPE "RequestStatus" AS ENUM ('DRAFT', 'PENDING_APPROVAL', 'APPROVED', 'REJECTED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "Priority" AS ENUM ('CRITICAL', 'HIGH', 'MEDIUM', 'LOW');

-- CreateEnum
CREATE TYPE "Department" AS ENUM ('BUSINESS_ANALYSIS', 'DEVELOPMENT', 'QA_TESTING', 'REGISTRAR_OPS');

-- CreateEnum
CREATE TYPE "AssignmentStatus" AS ENUM ('NOT_STARTED', 'IN_PROGRESS', 'DONE', 'BLOCKED');

-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('ASSIGNMENT_EMAIL', 'PHASE_TRIGGER', 'REMINDER', 'APPROVAL_REQUEST');

-- CreateEnum
CREATE TYPE "NotificationStatus" AS ENUM ('PENDING', 'SENT', 'FAILED');

-- CreateEnum
CREATE TYPE "ApprovalAction" AS ENUM ('SUBMITTED', 'APPROVED', 'REJECTED', 'REVISION_REQUESTED');

-- CreateTable
CREATE TABLE "WorkloadRequest" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdBy" TEXT NOT NULL,
    "updatedBy" TEXT,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "title" TEXT NOT NULL,
    "clientName" TEXT NOT NULL,
    "requirementText" TEXT NOT NULL,
    "requestType" "RequestType" NOT NULL,
    "status" "RequestStatus" NOT NULL DEFAULT 'DRAFT',
    "priority" "Priority" NOT NULL,
    "submittedBy" TEXT NOT NULL,
    "approvedBy" TEXT,
    "approvedAt" TIMESTAMP(3),
    "rejectionReason" TEXT,

    CONSTRAINT "WorkloadRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DepartmentAssignment" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdBy" TEXT NOT NULL,
    "updatedBy" TEXT,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "requestId" TEXT NOT NULL,
    "department" "Department" NOT NULL,
    "assigneeId" TEXT NOT NULL,
    "assigneeName" TEXT NOT NULL,
    "assigneeEmail" TEXT NOT NULL,
    "phaseNumber" INTEGER NOT NULL,
    "taskCount" INTEGER NOT NULL DEFAULT 0,
    "dueDate" TIMESTAMP(3),
    "jiraEpicKey" TEXT,
    "status" "AssignmentStatus" NOT NULL DEFAULT 'NOT_STARTED',
    "isSequential" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "DepartmentAssignment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ApprovalRecord" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdBy" TEXT NOT NULL,
    "updatedBy" TEXT,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "requestId" TEXT NOT NULL,
    "action" "ApprovalAction" NOT NULL,
    "actorId" TEXT NOT NULL,
    "actorName" TEXT NOT NULL,
    "comment" TEXT,
    "snapshot" JSONB NOT NULL,

    CONSTRAINT "ApprovalRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AIRecommendation" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdBy" TEXT NOT NULL,
    "updatedBy" TEXT,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "requestId" TEXT NOT NULL,
    "rawResponse" JSONB NOT NULL,
    "distributionSuggestion" JSONB NOT NULL,
    "riskFlags" JSONB NOT NULL,
    "confidenceScore" DOUBLE PRECISION NOT NULL,
    "modelUsed" TEXT NOT NULL,
    "promptTokens" INTEGER NOT NULL,
    "completionTokens" INTEGER NOT NULL,
    "wasAccepted" BOOLEAN,
    "humanChanges" JSONB,

    CONSTRAINT "AIRecommendation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NotificationLog" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdBy" TEXT NOT NULL,
    "updatedBy" TEXT,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "requestId" TEXT NOT NULL,
    "notificationType" "NotificationType" NOT NULL,
    "recipientEmail" TEXT NOT NULL,
    "recipientName" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "bodyPreview" TEXT NOT NULL,
    "sentAt" TIMESTAMP(3),
    "status" "NotificationStatus" NOT NULL DEFAULT 'PENDING',
    "errorMessage" TEXT,

    CONSTRAINT "NotificationLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuditTrail" (
    "id" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "action" TEXT NOT NULL,
    "actorId" TEXT NOT NULL,
    "actorName" TEXT NOT NULL,
    "targetType" TEXT NOT NULL,
    "targetId" TEXT NOT NULL,
    "payload" JSONB NOT NULL,
    "ipAddress" TEXT,
    "userAgent" TEXT,

    CONSTRAINT "AuditTrail_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AIRecommendation_requestId_key" ON "AIRecommendation"("requestId");

-- AddForeignKey
ALTER TABLE "DepartmentAssignment" ADD CONSTRAINT "DepartmentAssignment_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES "WorkloadRequest"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ApprovalRecord" ADD CONSTRAINT "ApprovalRecord_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES "WorkloadRequest"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AIRecommendation" ADD CONSTRAINT "AIRecommendation_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES "WorkloadRequest"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NotificationLog" ADD CONSTRAINT "NotificationLog_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES "WorkloadRequest"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
