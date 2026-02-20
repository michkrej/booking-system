import { PlusIcon } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useStorePlanYear } from "@hooks/useStorePlanYear";
import { Button } from "@ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@ui/card";
import { Skeleton } from "@ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@ui/table";
import { usePlansListCard } from "@/hooks/usePlansListCard";
import { useUserPlanConflicts } from "@/hooks/useUserPlanConflicts";
import { CURRENT_YEAR } from "@/utils/constants";
import { CreateNewPlanDialog } from "../molecules/CreateNewPlanDialog";
import { UserPlansListRow } from "../molecules/UserPlansListRow";

const loadingTableEntries = Array.from({ length: 1 }, (_, i) => i);

interface UserPlansListCardProps {
  showCreateButton?: boolean;
}

export const UserPlansListCard = ({
  showCreateButton = true,
}: UserPlansListCardProps) => {
  const { t } = useTranslation();
  const { userPlans, isPending, handlePlanClick } = usePlansListCard();
  const { getConflictsForPlan } = useUserPlanConflicts();
  const { planYear } = useStorePlanYear();
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  const canCreatePlan = showCreateButton && planYear >= CURRENT_YEAR;

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>{t("your_plans")}</CardTitle>
          {canCreatePlan && (
            <Button
              size="sm"
              className="flex gap-x-1"
              onClick={() => setShowCreateDialog(true)}
            >
              <PlusIcon className="size-4" />{" "}
              <span className="hidden md:inline">Ny planering</span>
            </Button>
          )}
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("name")}</TableHead>
                <TableHead className="hidden sm:table-cell">
                  {t("num_bookings")}
                </TableHead>
                <TableHead className="hidden sm:table-cell">Status</TableHead>
                <TableHead>Krockar</TableHead>
                <TableHead className="hidden md:table-cell">
                  {t("updated")}
                </TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {!isPending ? (
                userPlans.length > 0 ? (
                  userPlans.map((plan) => (
                    <UserPlansListRow
                      key={plan.id}
                      plan={plan}
                      conflicts={getConflictsForPlan(plan.id)}
                      onPlanClick={handlePlanClick}
                    />
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="text-center text-muted-foreground"
                    >
                      {t("you_do_not_have_any_plans_yet")}
                    </TableCell>
                  </TableRow>
                )
              ) : (
                loadingTableEntries.map((index) => (
                  <TableRow key={`table-row-${index}`}>
                    <TableCell>
                      <Skeleton className="h-5 w-full" />
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <Skeleton className="h-5 w-full" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-5 w-16" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-5 w-20" />
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <Skeleton className="h-5 w-full" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-5 w-20" />
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <CreateNewPlanDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
      />
    </>
  );
};
