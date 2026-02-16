import { type PlanConflictCounts } from "@/hooks/useUserPlanConflicts";
import { formatDate, getCommittee } from "@/lib/utils";
import type { Plan } from "@/utils/interfaces";
import { Separator } from "../ui/separator";
import { TableCell, TableRow } from "../ui/table";
import { ConflictBadge } from "./ConflictBadge";
import { StatusBadge } from "./StatusBadge";
import { PlanChangeNameButton } from "./planChangeNameButton";
import { PlanDeleteButton } from "./planDeleteButton";
import { PlanTogglePublicButton } from "./planTogglePublicButton";

interface UserPlansListRowProps {
  plan: Plan;
  conflicts: PlanConflictCounts;
  onPlanClick: (plan: Plan) => void;
}

export const UserPlansListRow = ({
  plan,
  conflicts,
  onPlanClick,
}: UserPlansListRowProps) => {
  const updatedAt = formatDate(plan.updatedAt);
  const committee = getCommittee(plan.committeeId);
  const status = plan.public ? "public" : "draft";

  return (
    <TableRow key={plan.id}>
      <TableCell
        className="hover:cursor-pointer hover:underline"
        onClick={() => onPlanClick(plan)}
      >
        <div className="flex items-center gap-2">
          {committee && (
            <span
              className="w-2 h-2 shrink-0"
              style={{ backgroundColor: committee.color }}
            />
          )}
          <span className="font-medium">{plan.label}</span>
        </div>
      </TableCell>
      <TableCell className="hidden sm:table-cell">
        {plan.events.length}
      </TableCell>
      <TableCell className="hidden sm:table-cell">
        <StatusBadge status={status} />
      </TableCell>
      <TableCell>
        <ConflictBadge
          location={conflicts.location}
          inventory={conflicts.inventory}
          compact
        />
      </TableCell>
      <TableCell className="hidden md:table-cell text-muted-foreground text-sm">
        {updatedAt}
      </TableCell>
      <TableCell className="flex items-center justify-end gap-2">
        <PlanDeleteButton plan={plan} />
        <Separator orientation="vertical" className="h-5 hidden sm:block" />
        <PlanChangeNameButton plan={plan} />
        <PlanTogglePublicButton plan={plan} />
      </TableCell>
    </TableRow>
  );
};
