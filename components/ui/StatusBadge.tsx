import type { JSX } from "react";
import { STATUS_STYLES, STATUS_TH, ASSIGNMENT_STATUS_TH } from "@/lib/constants";

interface StatusBadgeProps {
  status: string;
}

export default function StatusBadge({ status }: StatusBadgeProps): JSX.Element {
  const styles = STATUS_STYLES[status] ?? "bg-gray-100 text-gray-700";
  const label = STATUS_TH[status] ?? ASSIGNMENT_STATUS_TH[status] ?? status;

  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${styles}`}>
      {label}
    </span>
  );
}
