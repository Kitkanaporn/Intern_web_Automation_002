"use client";

import { useState } from "react";
import type { JSX } from "react";
import { Priority } from "@/types";
import { PRIORITY_STYLES } from "@/lib/constants";

// REVIEW NEEDED (Phase 1): this sidebar renders mocked AI suggestions that
// mirror workload_platform_ui_mockup.html. Phase 2 will replace the static
// AI_BUBBLE_TEXT / INITIAL_SUGGESTIONS / RISK_FLAGS with a live SSE stream from
// GET /api/ai/recommend (EventSource), per CLAUDE.md Section 7 AISidebar pattern.
// NEED: Backend — add route GET /api/ai/recommend (SSE)

interface SuggestionCardState {
  id: string;
  departmentLabel: string;
  phaseLabel: string;
  assigneeOptions: string[];
  selectedAssignee: string;
  priorityOptions: Priority[];
  selectedPriority: Priority;
  accepted: boolean;
  editing: boolean;
  draftAssignee: string;
  draftPriority: Priority;
}

const ASSIGNEE_OPTIONS = ["Suthida T.", "Piyawat K.", "Natcha W.", "Ananya R."];
const PRIORITY_OPTIONS: Priority[] = [Priority.HIGH, Priority.MEDIUM, Priority.LOW];

const INITIAL_SUGGESTIONS: SuggestionCardState[] = [
  {
    id: "aiSugg1",
    departmentLabel: "BA dept",
    phaseLabel: "Phase 1",
    assigneeOptions: ASSIGNEE_OPTIONS,
    selectedAssignee: "Suthida T.",
    priorityOptions: PRIORITY_OPTIONS,
    selectedPriority: Priority.HIGH,
    accepted: false,
    editing: false,
    draftAssignee: "Suthida T.",
    draftPriority: Priority.HIGH,
  },
  {
    id: "aiSugg2",
    departmentLabel: "Dev dept",
    phaseLabel: "Phase 2",
    assigneeOptions: ASSIGNEE_OPTIONS,
    selectedAssignee: "Piyawat K.",
    priorityOptions: PRIORITY_OPTIONS,
    selectedPriority: Priority.HIGH,
    accepted: false,
    editing: true,
    draftAssignee: "Piyawat K.",
    draftPriority: Priority.HIGH,
  },
  {
    id: "aiSugg3",
    departmentLabel: "QA dept",
    phaseLabel: "Phase 3",
    assigneeOptions: ASSIGNEE_OPTIONS,
    selectedAssignee: "Natcha W.",
    priorityOptions: PRIORITY_OPTIONS,
    selectedPriority: Priority.MEDIUM,
    accepted: false,
    editing: false,
    draftAssignee: "Natcha W.",
    draftPriority: Priority.MEDIUM,
  },
  {
    id: "aiSugg4",
    departmentLabel: "Registrar",
    phaseLabel: "Phase 4",
    assigneeOptions: ASSIGNEE_OPTIONS,
    selectedAssignee: "Ananya R.",
    priorityOptions: PRIORITY_OPTIONS,
    selectedPriority: Priority.MEDIUM,
    accepted: false,
    editing: false,
    draftAssignee: "Ananya R.",
    draftPriority: Priority.MEDIUM,
  },
];

const AI_BUBBLE_TEXT =
  "วิเคราะห์แล้ว — งานนี้เกี่ยวข้องกับ SEC circular และ corporate action calculation ควรเริ่มที่ BA ก่อนเพื่อแปลง requirement";

const RISK_FLAGS = [
  {
    id: "risk-deadline",
    text: "deadline Q1 กระชั้นชิด — Dev อาจไม่มีเวลาเพียงพอหาก BA ล่าช้า",
    tone: "danger" as const,
  },
  {
    id: "risk-dependency",
    text: "แนะนำตั้ง dependency: Dev เริ่มได้ก็ต่อเมื่อ BA อนุมัติ spec แล้วเท่านั้น",
    tone: "neutral" as const,
  },
];

const PRIORITY_LABEL: Record<Priority, string> = {
  CRITICAL: "Critical",
  HIGH: "High",
  MEDIUM: "Medium",
  LOW: "Low",
};

export default function AISidebar(): JSX.Element {
  const [suggestions, setSuggestions] = useState<SuggestionCardState[]>(INITIAL_SUGGESTIONS);
  const [refineText, setRefineText] = useState<string>("");
  const [isRegenerating, setIsRegenerating] = useState<boolean>(false);

  function handleAccept(id: string): void {
    setSuggestions((prev) =>
      prev.map((card) => (card.id === id ? { ...card, accepted: true, editing: false } : card))
    );
  }

  function handleToggleEdit(id: string): void {
    setSuggestions((prev) =>
      prev.map((card) =>
        card.id === id
          ? {
              ...card,
              editing: true,
              draftAssignee: card.selectedAssignee,
              draftPriority: card.selectedPriority,
            }
          : card
      )
    );
  }

  function handleCancelEdit(id: string): void {
    setSuggestions((prev) => prev.map((card) => (card.id === id ? { ...card, editing: false } : card)));
  }

  function handleSaveEdit(id: string): void {
    setSuggestions((prev) =>
      prev.map((card) =>
        card.id === id
          ? {
              ...card,
              selectedAssignee: card.draftAssignee,
              selectedPriority: card.draftPriority,
              editing: false,
            }
          : card
      )
    );
  }

  function handleDraftAssigneeChange(id: string, assigneeName: string): void {
    setSuggestions((prev) =>
      prev.map((card) => (card.id === id ? { ...card, draftAssignee: assigneeName } : card))
    );
  }

  function handleDraftPriorityChange(id: string, priority: Priority): void {
    setSuggestions((prev) =>
      prev.map((card) => (card.id === id ? { ...card, draftPriority: priority } : card))
    );
  }

  // REVIEW NEEDED: mocked regenerate — Phase 2 will re-open the SSE connection
  // to GET /api/ai/recommend with refineText as additional context.
  function handleRegenerate(): void {
    setIsRegenerating(true);
    window.setTimeout(() => {
      setIsRegenerating(false);
    }, 800);
  }

  return (
    <aside className="flex w-full flex-col overflow-hidden border-l border-gray-200 bg-white lg:w-[260px]">
      <div className="flex items-center gap-1.5 border-b border-gray-200 px-3 py-2.5">
        <span
          className={`h-1.5 w-1.5 rounded-full ${isRegenerating ? "animate-pulse bg-[#1D9E75]" : "bg-[#1D9E75]"}`}
        />
        <span className="text-xs font-medium text-gray-900">AI guide</span>
        <span className="ml-auto text-xs text-[#1D9E75]">✦</span>
      </div>

      <div className="flex flex-1 flex-col gap-2.5 overflow-y-auto px-3 py-2.5">
        <div className="rounded-lg bg-gray-100 px-2.5 py-2 text-xs leading-relaxed text-gray-600">
          {AI_BUBBLE_TEXT}
        </div>

        <span className="mt-1 text-[10px] font-medium uppercase tracking-wide text-gray-400">
          แนะนำการกระจายงาน
        </span>

        <div className="flex flex-col gap-1.5">
          {suggestions.map((card) => (
            <div
              key={card.id}
              className={`rounded-lg border p-2 ${
                card.accepted ? "border-[#9FE1CB] bg-[#E1F5EE]" : "border-gray-200 bg-white"
              }`}
            >
              <div className="mb-1.5 flex items-center justify-between">
                <span className="text-xs text-gray-600">{card.departmentLabel}</span>
                <span
                  className={`rounded px-1.5 py-0.5 text-[10px] font-medium ${PRIORITY_STYLES[card.selectedPriority]}`}
                >
                  {card.phaseLabel}
                </span>
              </div>

              {card.accepted ? (
                <div className="flex items-center gap-1 py-1 text-[10px] font-medium text-[#085041]">
                  <span>✓</span>
                  <span>Accepted</span>
                </div>
              ) : !card.editing ? (
                <div className="flex gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleAccept(card.id)}
                    className="flex flex-1 items-center justify-center gap-1 rounded-md bg-[#9FE1CB] px-1.5 py-1 text-[10px] font-medium text-[#085041]"
                  >
                    ✓ Accept
                  </button>
                  <button
                    type="button"
                    onClick={() => handleToggleEdit(card.id)}
                    className="flex flex-1 items-center justify-center gap-1 rounded-md border border-gray-300 px-1.5 py-1 text-[10px] text-gray-600"
                  >
                    ✎ Edit
                  </button>
                </div>
              ) : null}

              {card.editing && (
                <div className="mt-1.5 flex flex-col gap-1.5 border-t border-gray-200 pt-1.5">
                  <div className="flex items-center gap-1.5">
                    <label className="w-[58px] shrink-0 text-[10px] text-gray-400">ผู้รับผิดชอบ</label>
                    <select
                      value={card.draftAssignee}
                      onChange={(event) => handleDraftAssigneeChange(card.id, event.target.value)}
                      className="flex-1 rounded-md border border-gray-300 bg-white px-1.5 py-1 text-[10px] text-gray-600"
                    >
                      {card.assigneeOptions.map((assignee) => (
                        <option key={assignee} value={assignee}>
                          {assignee}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <label className="w-[58px] shrink-0 text-[10px] text-gray-400">Priority</label>
                    <select
                      value={card.draftPriority}
                      onChange={(event) =>
                        handleDraftPriorityChange(card.id, event.target.value as Priority)
                      }
                      className="flex-1 rounded-md border border-gray-300 bg-white px-1.5 py-1 text-[10px] text-gray-600"
                    >
                      {card.priorityOptions.map((priority) => (
                        <option key={priority} value={priority}>
                          {PRIORITY_LABEL[priority]}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex justify-end gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleCancelEdit(card.id)}
                      className="rounded-md border border-gray-300 px-2.5 py-1 text-[10px] text-gray-600"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSaveEdit(card.id)}
                      className="rounded-md bg-[#185FA5] px-2.5 py-1 text-[10px] text-white"
                    >
                      Save
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        <span className="text-[10px] font-medium uppercase tracking-wide text-gray-400">
          ความเสี่ยงที่ตรวจพบ
        </span>

        {RISK_FLAGS.map((risk) => (
          <div
            key={risk.id}
            className={`rounded-lg px-2.5 py-2 text-xs leading-relaxed ${
              risk.tone === "danger" ? "bg-red-50 text-red-800" : "bg-gray-100 text-gray-600"
            }`}
          >
            {risk.text}
          </div>
        ))}

        <div className="mt-1.5 flex flex-col gap-1.5 border-t border-gray-200 pt-2.5">
          <span className="text-[10px] font-medium uppercase tracking-wide text-gray-400">
            ปรับปรุงคำแนะนำด้วย AI
          </span>
          <textarea
            value={refineText}
            onChange={(event) => setRefineText(event.target.value)}
            placeholder="เพิ่ม context หรือบอก AI ว่าควรแก้อะไร เช่น 'เพิ่ม buffer ให้ Dev อีก 1 สัปดาห์'"
            className="min-h-[46px] w-full resize-y rounded-md border border-gray-300 px-2 py-1.5 text-xs text-gray-600"
          />
          <button
            type="button"
            onClick={handleRegenerate}
            disabled={isRegenerating}
            className="flex items-center justify-center gap-1.5 rounded-md border border-gray-300 px-2.5 py-1.5 text-xs text-gray-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isRegenerating && (
              <span className="h-2.5 w-2.5 animate-spin rounded-full border-2 border-current/40 border-t-current" />
            )}
            {isRegenerating ? "กำลังวิเคราะห์..." : "↻ Regenerate"}
          </button>
        </div>
      </div>
    </aside>
  );
}
