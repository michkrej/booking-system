import type { committees } from "@/data/committees";
import { KAR_COLORS } from "@/utils/colors";
import { cn } from "@/utils/utils";

interface FadderiTagProps {
  name: string;
  kar: (typeof committees)[keyof typeof committees]["kår"];
  color: string;
  compact?: boolean;
  className?: string;
}

export const FadderiTag = ({
  name,
  kar,
  color,
  compact = false,
  className,
}: FadderiTagProps) => {
  const colorStyle = `text-[${KAR_COLORS[kar].color}]`;

  return (
    <div className={cn("flex items-center gap-1.5 min-w-0", className)}>
      <span className="w-2 h-2 shrink-0" style={{ backgroundColor: color }} />
      <span className="text-sm font-semibold text-foreground truncate">
        {name}
      </span>
      {!compact && (
        <span
          className={cn(
            "text-xs font-semibold shrink-0 hidden sm:inline",
            colorStyle,
          )}
        >
          {kar}
        </span>
      )}
    </div>
  );
};
