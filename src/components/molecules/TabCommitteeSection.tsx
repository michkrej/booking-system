import { Booking, Kår, Plan } from "@utils/interfaces";
import { TabsContent } from "@ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@ui/table";
import { formatDate, getCommittee } from "@lib/utils";
import { Skeleton } from "@ui/skeleton";
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
  return (
    <TabsContent value={kår.toLowerCase()}>
      <Card>
        <CardHeader className="px-7">
          <CardTitle>{kår} planeringar</CardTitle>
          <CardDescription>
            Publika planeringar för fadderier inom {kår}.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Fadderi</TableHead>
                <TableHead className="hidden sm:table-cell">
                  Uppdaterad
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
                  <TableCell colSpan={2}>
                    Det finns inga publika planeringar för {kår}.
                  </TableCell>
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
