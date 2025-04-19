import { useTranslation } from "react-i18next";
import { Booking, Plan } from "@utils/interfaces";
import { cn, formatDate, getCommittee } from "@lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@ui/table";

type CollisionsTableProps = {
  publicPlans: Plan[];
  collisions: Record<string, Plan["events"]>;
  inventoryCollisions: Record<string, Booking[]>;
};

export const CollisionsTable = ({
  publicPlans,
  collisions,
  inventoryCollisions,
}: CollisionsTableProps) => {
  const { t } = useTranslation();
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>{t("corps")}</TableHead>
          <TableHead>{t("committee")}</TableHead>
          <TableHead className="hidden sm:table-cell">{t("updated")}</TableHead>
          <TableHead>{t("collisions_on_locale")}</TableHead>
          <TableHead>{t("collisions_on_inventory")}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {publicPlans.map((plan) => {
          const committee = getCommittee(plan.committeeId);

          if (!committee) return null;

          const collisnsForPlan = collisions[plan.id];
          const numCollisions = collisnsForPlan
            ? Math.ceil(collisnsForPlan.length / 2)
            : null;

          const collisnsForInventoryPlan = inventoryCollisions[plan.id];
          const numInventoryCollisions = collisnsForInventoryPlan
            ? Math.ceil(collisnsForInventoryPlan.length / 2)
            : null;
          return (
            <TableRow
              key={plan.id}
              className={cn(
                numCollisions === 0 &&
                  numInventoryCollisions === 0 &&
                  "opacity-50",
              )}
            >
              <TableCell>
                {committee?.kår === "Övrigt" ? plan.label : committee.name}
              </TableCell>
              <TableCell className="font-medium">{committee.name}</TableCell>
              <TableCell className="hidden md:table-cell">
                {formatDate(plan.updatedAt)}
              </TableCell>
              <TableCell>{numCollisions ?? "-"}</TableCell>
              <TableCell>{numInventoryCollisions ?? "-"}</TableCell>
            </TableRow>
          );
        })}
        {publicPlans.length === 0 && (
          <TableRow>
            <TableCell colSpan={3}>{t("no_plans_exist")}</TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};
