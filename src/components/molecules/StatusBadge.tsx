import { CircleSmall, GlobeIcon, LockIcon } from "lucide-react";
import { cn } from "@/utils/utils";

type Status = "draft" | "public" | "locked";

interface StatusBadgeProps {
  status: Status;
  className?: string;
}

const statusConfig = {
  draft: {
    bg: "bg-orange-50",
    border: "border-orange-200",
    text: "text-orange-600",
    label: "Utkast",
    icon: <CircleSmall className="size-3" />,
  },
  public: {
    bg: "bg-green-50",
    border: "border-green-200",
    text: "text-green-600",
    label: "Publik",
    icon: <GlobeIcon className="size-3" />,
  },
  locked: {
    bg: "bg-muted",
    border: "border-border",
    text: "text-muted-foreground",
    label: "Låst",
    icon: <LockIcon className="size-3" />,
  },
} as const;

export const StatusBadge = ({ status, className }: StatusBadgeProps) => {
  const config = statusConfig[status];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-2 py-0.5 text-xs font-semibold border",
        config.bg,
        config.border,
        config.text,
        className,
      )}
    >
      {config.icon} {config.label}
    </span>
  );
};
