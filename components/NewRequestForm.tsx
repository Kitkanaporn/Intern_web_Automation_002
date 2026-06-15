"use client";

import { useState } from "react";
import type { JSX } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { RequestType, Priority, Department } from "@/types";
import type { DeptAssignmentDraft, NewTaskFormValues } from "@/types";
import { DEPT_TH, PRIORITY_STYLES, PRIORITY_TH, REQUEST_TYPE_TH } from "@/lib/constants";
import AISidebar from "./AISidebar";
import Button from "./ui/Button";

const newRequestSchema = z.object({
  clientName: z.string().min(1, { message: "กรุณากรอกชื่อ client / project" }),
  title: z.string().min(1, { message: "กรุณากรอกชื่อคำขอ" }),
  requirementText: z
    .string()
    .min(10, { message: "กรุณากรอกรายละเอียดอย่างน้อย 10 ตัวอักษร" }),
  requestType: z.nativeEnum(RequestType),
  priority: z.nativeEnum(Priority),
});

type NewRequestFormValues = z.infer<typeof newRequestSchema>;

const newTaskSchema = z.object({
  name: z.string().min(1, { message: "กรุณากรอกชื่องาน" }),
  department: z.nativeEnum(Department),
  priority: z.nativeEnum(Priority),
  assigneeName: z.string().min(1, { message: "กรุณากรอกผู้รับผิดชอบ" }),
  dueDate: z.string().min(1, { message: "กรุณาเลือกวันครบกำหนด" }),
});

// REVIEW NEEDED (Phase 1): mirrors prisma/seed.ts department assignments and
// the AISidebar's mocked suggestion priorities. Phase 2 should derive this
// grid from accepted AI suggestions / persisted DepartmentAssignment rows
// instead of this static array.
const DEPT_ASSIGNMENTS: DeptAssignmentDraft[] = [
  {
    department: Department.BUSINESS_ANALYSIS,
    assigneeName: "Suthida T.",
    priority: Priority.HIGH,
    taskCount: 3,
    dueDate: "2027-01-20",
    highlighted: true,
  },
  {
    department: Department.DEVELOPMENT,
    assigneeName: "Piyawat K.",
    priority: Priority.HIGH,
    taskCount: 5,
    dueDate: "2027-02-10",
    highlighted: true,
  },
  {
    department: Department.QA_TESTING,
    assigneeName: "Natcha W.",
    priority: Priority.MEDIUM,
    taskCount: 4,
    dueDate: "2027-02-20",
    highlighted: false,
  },
  {
    department: Department.REGISTRAR_OPS,
    assigneeName: "Ananya R.",
    priority: Priority.MEDIUM,
    taskCount: 2,
    dueDate: "2027-03-01",
    highlighted: false,
  },
];

const ASSIGNEE_AVATAR_STYLES: Record<string, string> = {
  "Suthida T.": "bg-[#E6F1FB] text-[#0C447C]",
  "Piyawat K.": "bg-[#E1F5EE] text-[#085041]",
  "Natcha W.": "bg-[#EEEDFE] text-[#3C3489]",
  "Ananya R.": "bg-[#FAECE7] text-[#712B13]",
};

const MONTH_LABELS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((part) => part.charAt(0))
    .join("")
    .toUpperCase();
}

function formatDueDate(isoDate: string): string {
  const [, month, day] = isoDate.split("-");
  return `${MONTH_LABELS[Number(month) - 1]} ${Number(day)}`;
}

export default function NewRequestForm(): JSX.Element {
  const [isSavingDraft, setIsSavingDraft] = useState<boolean>(false);
  const [isSubmittingForApproval, setIsSubmittingForApproval] = useState<boolean>(false);
  const [submitMessage, setSubmitMessage] = useState<string | null>(null);
  const [addedTasks, setAddedTasks] = useState<NewTaskFormValues[]>([]);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<NewRequestFormValues>({
    resolver: zodResolver(newRequestSchema),
    defaultValues: {
      clientName: "",
      title: "",
      requirementText: "",
      requestType: RequestType.REGULATORY_CHANGE,
      priority: Priority.HIGH,
    },
  });

  const {
    register: registerTask,
    handleSubmit: handleSubmitTask,
    formState: { errors: taskErrors },
    reset: resetTaskForm,
  } = useForm<NewTaskFormValues>({
    resolver: zodResolver(newTaskSchema),
    defaultValues: {
      name: "",
      department: Department.BUSINESS_ANALYSIS,
      priority: Priority.MEDIUM,
      assigneeName: "",
      dueDate: "",
    },
  });

  const selectedRequestType = watch("requestType");
  const selectedPriority = watch("priority");

  // NEED: Backend — add route POST /api/workload (creates WorkloadRequest +
  // DepartmentAssignment rows + ApprovalRecord(SUBMITTED) + auditLog, per
  // CLAUDE.md Rule 5). This handler mocks the request/response cycle for
  // Phase 1 so the loading-state + bilingual-feedback UX can be reviewed.
  async function onSubmitForm(
    values: NewRequestFormValues,
    targetStatus: "DRAFT" | "PENDING_APPROVAL"
  ): Promise<void> {
    setSubmitMessage(null);
    if (targetStatus === "DRAFT") {
      setIsSavingDraft(true);
    } else {
      setIsSubmittingForApproval(true);
    }

    await new Promise<void>((resolve) => window.setTimeout(resolve, 600));

    console.log("Mock submit (Phase 1 — no API route yet):", { ...values, status: targetStatus, addedTasks });

    setSubmitMessage(
      targetStatus === "DRAFT"
        ? "บันทึกแบบร่างแล้ว (mock — ยังไม่เชื่อมต่อ API)"
        : "ส่งคำขอเพื่อรออนุมัติแล้ว (mock — ยังไม่เชื่อมต่อ API)"
    );

    if (targetStatus === "DRAFT") {
      setIsSavingDraft(false);
    } else {
      setIsSubmittingForApproval(false);
    }
  }

  function onAddTask(values: NewTaskFormValues): void {
    setAddedTasks((prev) => [...prev, values]);
    resetTaskForm();
  }

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 overflow-y-auto p-4">
          <h1 className="mb-1 text-sm font-medium text-gray-900">New workload request</h1>
          <p className="mb-3 text-xs text-gray-400">
            กรอกความต้องการของ client — AI จะแนะนำการกระจายงานใน sidebar
          </p>

          <div className="mb-3 flex gap-2">
            <div className="max-w-[200px] flex-1">
              <input
                {...register("clientName")}
                placeholder="Client name / Project name"
                className="w-full rounded-md border border-gray-300 px-2.5 py-1.5 text-xs text-gray-600 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              {errors.clientName && (
                <p className="mt-1 text-[10px] text-red-600">{errors.clientName.message}</p>
              )}
            </div>
            <div className="flex-1">
              <input
                {...register("title")}
                placeholder="Request title"
                className="w-full rounded-md border border-gray-300 px-2.5 py-1.5 text-xs text-gray-600 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              {errors.title && <p className="mt-1 text-[10px] text-red-600">{errors.title.message}</p>}
            </div>
          </div>

          <div className="mb-3">
            <textarea
              {...register("requirementText")}
              placeholder="อธิบายความต้องการของ client..."
              className="min-h-[80px] w-full resize-y rounded-md border border-gray-300 px-2.5 py-2 text-xs leading-relaxed text-gray-600 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            {errors.requirementText && (
              <p className="mt-1 text-[10px] text-red-600">{errors.requirementText.message}</p>
            )}
          </div>

          {/* REVIEW NEEDED: WorkloadRequest.priority is required by the schema
              but workload_platform_ui_mockup.html does not show a priority
              selector on this screen. Added here so the form can submit a
              valid payload; confirm placement/wording with senior. */}
          <p className="mb-1.5 text-[10px] font-medium uppercase tracking-wide text-gray-400">
            ความสำคัญ
          </p>
          <div className="mb-3 flex flex-wrap gap-1.5">
            {Object.values(Priority).map((priority) => (
              <button
                key={priority}
                type="button"
                onClick={() => setValue("priority", priority)}
                className={`rounded-full border px-2.5 py-1 text-[10px] ${
                  selectedPriority === priority
                    ? "border-[#85B7EB] bg-[#E6F1FB] text-[#0C447C]"
                    : "border-gray-200 text-gray-600"
                }`}
              >
                {PRIORITY_TH[priority]}
              </button>
            ))}
          </div>

          <p className="mb-1.5 text-[10px] font-medium uppercase tracking-wide text-gray-400">
            ประเภทงาน
          </p>
          <div className="mb-3 flex flex-wrap gap-1.5">
            {Object.values(RequestType).map((requestType) => (
              <button
                key={requestType}
                type="button"
                onClick={() => setValue("requestType", requestType)}
                className={`rounded-full border px-2 py-1 text-[10px] ${
                  selectedRequestType === requestType
                    ? "border-[#85B7EB] bg-[#E6F1FB] text-[#0C447C]"
                    : "border-gray-200 text-gray-600"
                }`}
              >
                {REQUEST_TYPE_TH[requestType]}
              </button>
            ))}
          </div>

          <p className="mb-2 text-[10px] font-medium uppercase tracking-wide text-gray-400">
            กระจายงานให้แผนก
          </p>
          <div className="mb-3 grid grid-cols-2 gap-2">
            {DEPT_ASSIGNMENTS.map((assignment) => (
              <div
                key={assignment.department}
                className={`rounded-md border p-2.5 ${
                  assignment.highlighted ? "border-[#85B7EB] bg-[#E6F1FB]" : "border-gray-200 bg-white"
                }`}
              >
                <div className="mb-1.5 flex items-start justify-between gap-2">
                  <span className="text-xs font-medium text-gray-900">{DEPT_TH[assignment.department]}</span>
                  <span
                    className={`rounded px-1.5 py-0.5 text-[9px] font-medium ${PRIORITY_STYLES[assignment.priority]}`}
                  >
                    {PRIORITY_TH[assignment.priority]}
                  </span>
                </div>
                <div className="mb-1 flex items-center gap-1.5">
                  <span
                    className={`flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full text-[8px] font-medium ${ASSIGNEE_AVATAR_STYLES[assignment.assigneeName]}`}
                  >
                    {getInitials(assignment.assigneeName)}
                  </span>
                  <span className="text-[10px] text-gray-600">{assignment.assigneeName}</span>
                </div>
                <span className="text-[10px] text-gray-400">
                  {assignment.taskCount} tasks · due {formatDueDate(assignment.dueDate)}
                </span>
              </div>
            ))}
          </div>

          <div className="border-t border-gray-200 pt-3">
            <p className="mb-2 text-[10px] font-medium uppercase tracking-wide text-gray-400">
              เพิ่มงานเข้า workflow
            </p>
            <form onSubmit={handleSubmitTask(onAddTask)} className="flex flex-col gap-2">
              <div>
                <input
                  {...registerTask("name")}
                  placeholder="ชื่องาน"
                  className="w-full rounded-md border border-gray-300 px-2.5 py-1.5 text-xs text-gray-600 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                {taskErrors.name && (
                  <p className="mt-1 text-[10px] text-red-600">{taskErrors.name.message}</p>
                )}
              </div>
              <div className="flex gap-2">
                <select
                  {...registerTask("department")}
                  className="flex-1 rounded-md border border-gray-300 px-2.5 py-1.5 text-xs text-gray-600 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  {Object.values(Department).map((dept) => (
                    <option key={dept} value={dept}>
                      {DEPT_TH[dept]}
                    </option>
                  ))}
                </select>
                <select
                  {...registerTask("priority")}
                  className="flex-1 rounded-md border border-gray-300 px-2.5 py-1.5 text-xs text-gray-600 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  {Object.values(Priority).map((priority) => (
                    <option key={priority} value={priority}>
                      {PRIORITY_TH[priority]}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex gap-2">
                <div className="flex-1">
                  <input
                    {...registerTask("assigneeName")}
                    placeholder="ผู้รับผิดชอบ"
                    className="w-full rounded-md border border-gray-300 px-2.5 py-1.5 text-xs text-gray-600 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                  {taskErrors.assigneeName && (
                    <p className="mt-1 text-[10px] text-red-600">{taskErrors.assigneeName.message}</p>
                  )}
                </div>
                <div className="flex-1">
                  <input
                    {...registerTask("dueDate")}
                    type="date"
                    className="w-full rounded-md border border-gray-300 px-2.5 py-1.5 text-xs text-gray-600 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                  {taskErrors.dueDate && (
                    <p className="mt-1 text-[10px] text-red-600">{taskErrors.dueDate.message}</p>
                  )}
                </div>
              </div>
              <Button type="submit" variant="primary" className="self-start">
                + เพิ่มงาน
              </Button>
            </form>

            {addedTasks.length > 0 && (
              <ul className="mt-2 flex flex-col gap-1">
                {addedTasks.map((task, index) => (
                  <li
                    key={`${task.name}-${index}`}
                    className="rounded-md border border-gray-200 px-2.5 py-1.5 text-[10px] text-gray-600"
                  >
                    {task.name} — {DEPT_TH[task.department]} · {PRIORITY_TH[task.priority]} ·{" "}
                    {task.assigneeName} · {task.dueDate}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <AISidebar />
      </div>

      <div className="flex items-center justify-end gap-2 border-t border-gray-200 bg-white px-4 py-2.5">
        {submitMessage && <p className="mr-auto text-xs text-gray-500">{submitMessage}</p>}
        <Button
          variant="secondary"
          isLoading={isSavingDraft}
          onClick={() => void handleSubmit((values) => onSubmitForm(values, "DRAFT"))()}
        >
          Save draft
        </Button>
        <Button
          variant="primary"
          isLoading={isSubmittingForApproval}
          onClick={() => void handleSubmit((values) => onSubmitForm(values, "PENDING_APPROVAL"))()}
        >
          Submit for approval
        </Button>
      </div>
    </div>
  );
}
