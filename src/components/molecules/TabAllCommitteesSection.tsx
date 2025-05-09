import { useTranslation } from "react-i18next";
import { Booking, Plan } from "@utils/interfaces";
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
              </TableRow>
            </TableHeader>
            <TableBody>
              {plans.map((plan) => {
                const committee = getCommittee(plan.committeeId);
                const isÖvrigt = committee?.kår === "Övrigt";
                return (
                  <TableRow
                    key={plan.id}
                    onClick={() => handlePlanClick(plan)}
                    className="hover:cursor-pointer"
                  >
                    <TableCell className="font-medium">
                      {isÖvrigt ? plan.label : committee?.name}
                    </TableCell>
                    <TableCell>{committee?.kår}</TableCell>
                    <TableCell className="hidden md:table-cell">
                      {formatDate(plan.updatedAt)}
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
