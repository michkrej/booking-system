import { useNavigate } from "react-router-dom";
import { useCurrentDate } from "@hooks/useCurrentDate";
import { useUserPlans } from "@hooks/useUserPlans";
import { useBoundStore } from "@state/store";
import { type Plan } from "@utils/interfaces";
import { formatDate } from "@lib/utils";
import { PlanChangeNameButton } from "@components/molecules/planChangeNameButton";
import { PlanDeleteButton } from "@components/molecules/planDeleteButton";
import { PlanTogglePublicButton } from "@components/molecules/planTogglePublicButton";
import { Card, CardContent, CardHeader, CardTitle } from "@ui/card";
import { Separator } from "@ui/separator";
import { Skeleton } from "@ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@ui/table";

const loadingTableEntries = Array.from({ length: 1 }, (_, i) => i);

export const UserPlansListCard = () => {
  const { isPending, userPlans } = useUserPlans();

  const loadedBookings = useBoundStore((state) => state.loadedBookings);
  const changedActivePlans = useBoundStore((state) => state.changedActivePlans);
  const navigate = useNavigate();
  const { resetCurrentDate } = useCurrentDate();

  const handlePlanClick = (plan: Plan) => {
    loadedBookings(plan.events);
    changedActivePlans([plan]);
    resetCurrentDate();
    navigate(`/booking/${plan.id}`);
  };

  return (
    <Card className="col-span-full">
      <CardHeader className="pb-3">
        <CardTitle>Dina planeringar</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Namn</TableHead>
              <TableHead>Antal bokningar</TableHead>
              <TableHead>Skapad</TableHead>
              <TableHead>Uppdaterad</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {!isPending
              ? userPlans.map((plan) => {
                  const createdAt = formatDate(plan.createdAt);
                  const updatedAt = formatDate(plan.updatedAt);
                  return (
                    <TableRow key={plan.id}>
                      <TableCell
                        className="hover:cursor-pointer hover:underline"
                        onClick={() => handlePlanClick(plan)}
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
                })
              : loadingTableEntries.map((index) => (
                  <TableRow key={`table-row-${index}`}>
                    <TableCell>
                      <Skeleton className="h-5 w-full" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-5 w-full" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-5 w-full" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-5 w-full" />
                    </TableCell>
                  </TableRow>
                ))}
            {!userPlans.length && !isPending ? (
              <TableRow>
                <TableCell colSpan={4}>Du har inga planeringar än...</TableCell>
              </TableRow>
            ) : null}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
