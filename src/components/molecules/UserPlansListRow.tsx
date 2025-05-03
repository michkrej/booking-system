import { formatDate } from "@/lib/utils";
import { Plan } from "@/utils/interfaces";
import { Separator } from "../ui/separator";
import { TableCell, TableRow } from "../ui/table";
import { PlanChangeNameButton } from "./planChangeNameButton";
import { PlanDeleteButton } from "./planDeleteButton";
import { PlanTogglePublicButton } from "./planTogglePublicButton";

interface UserPlansListRowProps {
  plan: Plan;
  onPlanClick: (plan: Plan) => void;
}

export const UserPlansListRow = ({
  plan,
  onPlanClick,
}: UserPlansListRowProps) => {
  const createdAt = formatDate(plan.createdAt);
  const updatedAt = formatDate(plan.updatedAt);

  return (
    <TableRow key={plan.id}>
      <TableCell
        className="hover:cursor-pointer hover:underline"
        onClick={() => onPlanClick(plan)}
      >
        {plan.label}
      </TableCell>
      <TableCell>{plan.events.length}</TableCell>
      <TableCell>{createdAt}</TableCell>
      <TableCell>{updatedAt}</TableCell>
      <TableCell className="flex items-center justify-end gap-4">
        <PlanDeleteButton plan={plan} />
        <Separator orientation="vertical" className="h-5" />
        <PlanChangeNameButton plan={plan} />
        <PlanTogglePublicButton plan={plan} />
      </TableCell>
    </TableRow>
  );
};
