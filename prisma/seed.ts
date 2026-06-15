import {
  PrismaClient,
  RequestType,
  RequestStatus,
  Priority,
  Department,
  AssignmentStatus,
  ApprovalAction,
} from "@prisma/client";

const prisma = new PrismaClient();

// REVIEW NEEDED: prisma/schema.prisma has no User model, so seed data uses
// fixed user ids/names that mirror the demo accounts in lib/auth.ts.
// "user-kanya" (creator/submitter) and "user-somchai" (approver) are
// intentionally distinct to demonstrate Rule 2 (no self-approval).
const REQUESTER_ID = "user-kanya";
const REQUESTER_NAME = "Kanya N.";

async function main(): Promise<void> {
  const request = await prisma.workloadRequest.create({
    data: {
      title: "Corporate Action: Stock Dividend — Ex-date Recalculation",
      clientName: "SET Listed Co. ABC",
      requirementText:
        "Client ต้องการพัฒนาระบบ Corporate Action สำหรับการจ่าย Stock Dividend " +
        "รองรับ ex-date calculation ใหม่ตาม SEC circular ที่ออกมาเมื่อเดือนที่แล้ว " +
        "ต้องการให้เสร็จภายใน Q1",
      requestType: RequestType.REGULATORY_CHANGE,
      status: RequestStatus.PENDING_APPROVAL,
      priority: Priority.HIGH,
      submittedBy: REQUESTER_ID,
      createdBy: REQUESTER_ID,
    },
  });

  await prisma.departmentAssignment.createMany({
    data: [
      {
        requestId: request.id,
        department: Department.BUSINESS_ANALYSIS,
        assigneeId: "user-suthida",
        assigneeName: "Suthida T.",
        assigneeEmail: "suthida.t@set.or.th",
        phaseNumber: 1,
        taskCount: 3,
        dueDate: new Date("2027-01-20"),
        status: AssignmentStatus.NOT_STARTED,
        isSequential: true,
        createdBy: REQUESTER_ID,
      },
      {
        requestId: request.id,
        department: Department.DEVELOPMENT,
        assigneeId: "user-piyawat",
        assigneeName: "Piyawat K.",
        assigneeEmail: "piyawat.k@set.or.th",
        phaseNumber: 2,
        taskCount: 5,
        dueDate: new Date("2027-02-10"),
        status: AssignmentStatus.NOT_STARTED,
        isSequential: true,
        createdBy: REQUESTER_ID,
      },
      {
        requestId: request.id,
        department: Department.QA_TESTING,
        assigneeId: "user-natcha",
        assigneeName: "Natcha W.",
        assigneeEmail: "natcha.w@set.or.th",
        phaseNumber: 3,
        taskCount: 4,
        dueDate: new Date("2027-02-20"),
        status: AssignmentStatus.NOT_STARTED,
        isSequential: true,
        createdBy: REQUESTER_ID,
      },
      {
        requestId: request.id,
        department: Department.REGISTRAR_OPS,
        assigneeId: "user-ananya",
        assigneeName: "Ananya R.",
        assigneeEmail: "ananya.r@set.or.th",
        phaseNumber: 4,
        taskCount: 2,
        dueDate: new Date("2027-03-01"),
        status: AssignmentStatus.NOT_STARTED,
        isSequential: true,
        createdBy: REQUESTER_ID,
      },
    ],
  });

  await prisma.approvalRecord.create({
    data: {
      requestId: request.id,
      action: ApprovalAction.SUBMITTED,
      actorId: REQUESTER_ID,
      actorName: REQUESTER_NAME,
      comment: "ส่งคำขอกระจายงานสำหรับ Corporate Action: Stock Dividend",
      snapshot: {
        title: request.title,
        priority: request.priority,
        assignments: [
          { department: "BUSINESS_ANALYSIS", assigneeName: "Suthida T.", phaseNumber: 1 },
          { department: "DEVELOPMENT", assigneeName: "Piyawat K.", phaseNumber: 2 },
          { department: "QA_TESTING", assigneeName: "Natcha W.", phaseNumber: 3 },
          { department: "REGISTRAR_OPS", assigneeName: "Ananya R.", phaseNumber: 4 },
        ],
      },
      createdBy: REQUESTER_ID,
    },
  });

  console.log(`Seeded WorkloadRequest ${request.id} with 4 department assignments.`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error: unknown) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
