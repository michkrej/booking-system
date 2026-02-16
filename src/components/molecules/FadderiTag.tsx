import { cn } from "@lib/utils";

const KAR_COLORS: Record<string, string> = {
  LinTek: "text-[#E1007A]",
  Consensus: "text-violet-600",
  StuFF: "text-orange-600",
  Övrigt: "text-muted-foreground",
};

interface FadderiTagProps {
  name: string;
  kar: string;
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
            KAR_COLORS[kar] || KAR_COLORS["Övrigt"],
          )}
        >
          {kar}
        </span>
      )}
    </div>
  );
};
