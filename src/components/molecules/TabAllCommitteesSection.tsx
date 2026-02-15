import { useTranslation } from "react-i18next";
import type { Booking, Plan } from "@utils/interfaces";
import { formatDate, getCommittee } from "@lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@ui/card";
import { Skeleton } from "@ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@ui/table";
import { TabsContent } from "@ui/tabs";
import { TabCommitteeButtons } from "./TabCommitteeButtons";

type TabAllCommitteesSectionProps = {
  plans: Plan[];
  isPending: boolean;
  roomCollisions: Booking[];
  inventoryCollisions: Booking[];
  handleFindCollisionsClick: (plans: Plan[]) => void;
  handleViewCollisionsClick: (plans: Plan[]) => void;
  handleViewBookingsClick: (plans: Plan[]) => void;
  handlePlanClick: (plan: Plan) => void;
  getConflictsForPlan?: (planId: string) => number;
};

export const TabAllCommitteesSection = ({
  plans,
  isPending,
  roomCollisions,
  inventoryCollisions,
  handleFindCollisionsClick,
  handleViewCollisionsClick,
  handleViewBookingsClick,
  handlePlanClick,
  getConflictsForPlan,
}: TabAllCommitteesSectionProps) => {
  const { t } = useTranslation();

  return (
    <TabsContent value="all">
      <Card>
        <CardHeader className="grid grid-cols-[2fr_1fr] px-7">
          <div className="flex flex-col gap-y-2">
            <CardTitle>{t("public_plans.title")}</CardTitle>
            <CardDescription>{t("public_plans.description")}</CardDescription>
          </div>
          <div className="flex flex-col justify-end gap-y-2">
            <TabCommitteeButtons
              disabled={plans.length === 0}
              handleViewBookings={() => handleViewBookingsClick(plans)}
              handleFindCollisions={() => handleFindCollisionsClick(plans)}
              handleViewCollision={() => handleViewCollisionsClick(plans)}
              showCollisions={
                roomCollisions.length > 0 || inventoryCollisions.length > 0
              }
            />
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("committee")}</TableHead>
                <TableHead>{t("corps")}</TableHead>
                <TableHead className="hidden sm:table-cell">
                  {t("updated")}
                </TableHead>
                <TableHead className="text-right">Krockar</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {plans.map((plan) => {
                const committee = getCommittee(plan.committeeId);
                const isÖvrigt = committee?.kår === "Övrigt";
                const conflictCount = getConflictsForPlan?.(plan.id) || 0;
                return (
                  <TableRow
                    key={plan.id}
                    onClick={() => handlePlanClick(plan)}
                    className="hover:cursor-pointer"
                  >
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        {committee && (
                          <span
                            className="w-2 h-2 shrink-0"
                            style={{ backgroundColor: committee.color }}
                          />
                        )}
                        {isÖvrigt ? plan.label : committee?.name}
                      </div>
                    </TableCell>
                    <TableCell>{committee?.kår}</TableCell>
                    <TableCell className="hidden md:table-cell">
                      {formatDate(plan.updatedAt)}
                    </TableCell>
                    <TableCell className="text-right">
                      {conflictCount > 0 ? (
                        <span className="inline-flex items-center px-1.5 py-0.5 text-xs font-bold bg-red-50 border border-red-200 text-red-600">
                          {conflictCount}
                        </span>
                      ) : (
                        <span className="text-xs text-green-600">&#10003;</span>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
              {!isPending && !plans.length ? (
                <TableRow>
                  <TableCell colSpan={3}>{t("no_plans_exist")}</TableCell>
                </TableRow>
              ) : null}
              {isPending && plans.length === 0 ? (
                <TableRow>
                  <TableCell>
                    <Skeleton className="h-4 w-full" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-full" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-full" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-8 ml-auto" />
                  </TableCell>
                </TableRow>
              ) : null}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter className="flex justify-end gap-x-3">
          <TabCommitteeButtons
            disabled={plans.length === 0}
            handleViewBookings={() => handleViewBookingsClick(plans)}
            handleFindCollisions={() => handleFindCollisionsClick(plans)}
            handleViewCollision={() => handleViewCollisionsClick(plans)}
            showCollisions={
              roomCollisions.length > 0 || inventoryCollisions.length > 0
            }
          />
        </CardFooter>
      </Card>
    </TabsContent>
  );
};
