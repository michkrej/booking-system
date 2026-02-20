import { format } from "date-fns";
import { CheckIcon, DotIcon } from "lucide-react";
import { committees } from "@/data/committees";
import type { Plan } from "@/interfaces/interfaces";
import { KAR_COLORS } from "@/utils/colors";

export const SidebarPlanItem = ({
  item,
  conflictCount,
  onClick,
}: {
  item: Plan;
  conflictCount: number;
  onClick: () => void;
}) => {
  const committee = committees[item.committeeId]!;

  return (
    <button
      className="flex items-center justify-between px-5 py-[9px] border-b cursor-pointer hover:bg-muted/50 w-full"
      onClick={onClick}
    >
      <div>
        <div className="flex items-center gap-1.5">
          <span
            className="w-2 h-2"
            style={{ backgroundColor: committee?.color }}
          />
          <span className="text-[13px] font-semibold">{committee.name}</span>
          <span
            className="text-[11px] font-semibold"
            style={{ color: KAR_COLORS[committee.kår].color }}
          >
            {committee.kår}
          </span>
        </div>
        <div className="text-[11px] text-muted-foreground ml-3.5 flex items-center">
          {item.events.length} bokn. <DotIcon />{" "}
          {format(item.updatedAt, "yyyy-MM-dd")}
        </div>
      </div>
      {conflictCount > 0 ? (
        <span className="text-xs font-bold bg-red-50 border border-red-200 text-red-600 px-1.5 py-0.5">
          {conflictCount}
        </span>
      ) : (
        <CheckIcon className="size-4 text-green-600" />
      )}
    </button>
  );
};
