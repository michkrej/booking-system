import { useTranslation } from "react-i18next";
import { Booking, Kår, Plan } from "@utils/interfaces";
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

type TabCommitteeSectionProps = {
  kår: Kår;
  plans: Plan[];
  isPending: boolean;
  roomCollisions: Booking[];
  inventoryCollisions: Booking[];
  handleFindCollisionsClick: (plans: Plan[]) => void;
  handleViewCollisionsClick: (plans: Plan[]) => void;
  handleViewBookingsClick: (plans: Plan[]) => void;
  handlePlanClick: (plan: Plan) => void;
};

export const TabCommitteeSection = ({
  kår,
  plans,
  isPending,
  roomCollisions,
  inventoryCollisions,
  handleFindCollisionsClick,
  handleViewCollisionsClick,
  handleViewBookingsClick,
  handlePlanClick,
}: TabCommitteeSectionProps) => {
  const { t } = useTranslation();

  return (
    <TabsContent value={kår.toLowerCase()}>
      <Card>
        <CardHeader className="px-7">
          <CardTitle>{t("public_plans.title_x", { x: kår })}</CardTitle>
          <CardDescription>
            {t("public_plans.description_x", { x: kår })}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("committee")}</TableHead>
                <TableHead className="hidden sm:table-cell">
                  {t("updated")}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {plans.map((plan) => {
                const committee = getCommittee(plan.committeeId);
                return (
                  <TableRow
                    key={plan.id}
                    onClick={() => handlePlanClick(plan)}
                    className="hover:cursor-pointer"
                  >
                    <TableCell className="font-medium">
                      {committee?.name}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {formatDate(plan.updatedAt)}
                    </TableCell>
                  </TableRow>
                );
              })}
              {!isPending && plans.length === 0 && (
                <TableRow>
                  <TableCell colSpan={2}>{t("no_plans_exist")}</TableCell>
                </TableRow>
              )}
              {isPending && plans.length === 0 ? (
                <TableRow>
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
