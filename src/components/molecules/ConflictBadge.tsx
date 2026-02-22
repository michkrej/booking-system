import { CheckIcon, TriangleAlertIcon } from "lucide-react";
import { cn } from "@/utils/utils";

interface ConflictBadgeProps {
  numConflicts: number;
  className?: string;
}

export const ConflictBadge = ({
  numConflicts,
  className,
}: ConflictBadgeProps) => {
  if (numConflicts === 0) {
    return (
      <span
        className={cn(
          "text-xs font-semibold text-green-600 flex items-center gap-1",
          className,
        )}
      >
        <CheckIcon className="sm:size-4 size-5" />
        <span className="hidden sm:inline"> Inga krockar</span>
      </span>
    );
  }

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-2 py-0.5 text-xs font-semibold",
        "bg-red-50 border border-red-200 text-red-600",
        className,
      )}
    >
      <TriangleAlertIcon className="size-5 sm:size-4" />
      <span className="hidden sm:inline"> {numConflicts} krockar</span>
    </span>
  );
};
