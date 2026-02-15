import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import type { Booking, Plan } from "@utils/interfaces";
import { formatDate, getCommittee } from "@lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@ui/table";
import { useFindCollisionsCard } from "@/hooks/useFindCollisionsCard";

const calculateNumCollisions = (
  bookings: Booking[] | undefined,
): number | null => {
  if (!bookings) return null;
  return Math.ceil(bookings.length / 2);
};

const numberOfColumns = 5;

export const CollisionsTable = () => {
  const { t } = useTranslation();

  const { publicPlansWithoutUserPlans, selectedUserPlan, collisions } =
    useFindCollisionsCard();

  const plansWithCollisions = useMemo(() => {
    if (!selectedUserPlan) return [];

    const planIdsWithCollisions = new Set([
      ...Object.keys(collisions?.roomCollisions || {}),
      ...Object.keys(collisions?.inventoryCollisions || {}),
    ]);

    return publicPlansWithoutUserPlans.filter((plan) =>
      planIdsWithCollisions.has(plan.id),
    );
  }, [selectedUserPlan, collisions, publicPlansWithoutUserPlans]);

  const noPlansWithCollisions =
    plansWithCollisions.length === 0 && selectedUserPlan !== undefined;

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
        {!selectedUserPlan ? (
          <TableRow>
            <TableCell
              colSpan={numberOfColumns}
              className="text-center text-gray-500"
            >
              {t("choose_a_plan")}
            </TableCell>
          </TableRow>
        ) : noPlansWithCollisions ? (
          <TableRow>
            <TableCell
              colSpan={numberOfColumns}
              className="text-center text-gray-500"
            >
              {t("no_plans_collisions_exist")}
            </TableCell>
          </TableRow>
        ) : (
          plansWithCollisions.map((plan) => (
            <CollisionsTableRow
              key={plan.id}
              plan={plan}
              roomCollisionsForPlan={collisions?.roomCollisions?.[plan.id]}
              inventoryCollisionsForPlan={
                collisions?.inventoryCollisions?.[plan.id]
              }
            />
          ))
        )}
      </TableBody>
    </Table>
  );
};

interface CollisionsTableRowProps {
  plan: Plan;
  roomCollisionsForPlan: Booking[] | undefined;
  inventoryCollisionsForPlan: Booking[] | undefined;
}

const CollisionsTableRow = ({
  plan,
  roomCollisionsForPlan,
  inventoryCollisionsForPlan,
}: CollisionsTableRowProps) => {
  const committee = getCommittee(plan.committeeId);

  if (!committee) {
    return null;
  }

  const numRoomCollisions = calculateNumCollisions(roomCollisionsForPlan);
  const numInventoryCollisions = calculateNumCollisions(
    inventoryCollisionsForPlan,
  );

  return (
    <TableRow>
      <TableCell>
        {committee?.kår === "Övrigt" ? plan.label : committee.name}
      </TableCell>
      <TableCell className="font-medium">{committee.name}</TableCell>
      <TableCell className="hidden md:table-cell">
        {formatDate(plan.updatedAt)}
      </TableCell>
      <TableCell>{numRoomCollisions ?? "-"}</TableCell>
      <TableCell>{numInventoryCollisions ?? "-"}</TableCell>
    </TableRow>
  );
};
