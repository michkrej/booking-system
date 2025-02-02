import { formatDate } from "@/lib/utils";
import { PlanChangeNameButton } from "../molecules/planChangeNameButton";
import { PlanDeleteButton } from "../molecules/planDeleteButton";
import { PlanTogglePublicButton } from "../molecules/planTogglePublicButton";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Separator } from "../ui/separator";
import { Skeleton } from "../ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { useUserPlans } from "@/hooks";

const loadingTableEntries = Array.from({ length: 4 }, (_, i) => i);

export const UserPlansListCard = () => {
  const { isPending, userPlans } = useUserPlans();

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
                      <TableCell>{plan.label}</TableCell>
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
                  <TableRow key={index}>
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
                      <Skeleton className="h-4 w-full" />
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
