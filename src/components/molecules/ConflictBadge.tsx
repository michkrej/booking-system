import { cn } from "@lib/utils";

interface ConflictBadgeProps {
  location: number;
  inventory: number;
  compact?: boolean;
  className?: string;
}

export const ConflictBadge = ({
  location,
  inventory,
  compact = false,
  className,
}: ConflictBadgeProps) => {
  const total = location + inventory;

  if (total === 0) {
    return (
      <span
        className={cn("text-xs font-semibold text-green-600", className)}
      >
        &#10003; Inga krockar
      </span>
    );
  }

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-2 py-0.5 text-xs font-semibold",
        "bg-red-50 border border-red-200 text-red-600",
        className
      )}
    >
      &#9888; {total} krockar
      {!compact && (
        <span className="font-normal text-red-700">
          ({location} lokal, {inventory} inv.)
        </span>
      )}
    </span>
  );
};
