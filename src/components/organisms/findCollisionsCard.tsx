import { Plan } from "@/utils/interfaces";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { formatDate, getCommittee } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { findCollisionsBetweenPlans } from "@/utils/collisionHandling";
import { useMemo, useState } from "react";
import { useStoreCollisionsExist } from "@/hooks/useStoreCollisionsExist";
import { useUserPlans } from "@/hooks/useUserPlans";
import { usePublicPlans } from "@/hooks/usePublicPlans";

export const FindCollisionsCard = () => {
  const { publicPlans } = usePublicPlans();
  const { userPlans } = useUserPlans();
  const { collisionsExist } = useStoreCollisionsExist();

  const [selectedUserPlan, setSelectedUserPlan] = useState<Plan>();

  const publicPlansWithoutUserPlans = useMemo(() => {
    const userPublicPlan = userPlans.find((plan) => plan.public);
    if (!userPublicPlan) return publicPlans;
    return publicPlans.filter((plan) => plan.id !== userPublicPlan.id);
  }, [userPlans, publicPlans]);

  return (
    <Card className="col-span-full">
      <CardHeader className="grid content-between sm:grid-cols-[1fr_auto]">
        <div className="flex flex-col space-y-1.5">
          <CardTitle>Hitta krockar</CardTitle>
          <CardDescription>
            Hitta krockar mellan fadderiers bokningar
          </CardDescription>
        </div>
        <div className="flex space-x-2">
          <Select
            onValueChange={(val) =>
              setSelectedUserPlan(userPlans.find((plan) => plan.id === val))
            }
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Välj planering..." />
            </SelectTrigger>
            <SelectContent>
              {userPlans.map((plan) => (
                <SelectItem key={plan.id} value={plan.id}>
                  {plan.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button>Hitta</Button>
        </div>
      </CardHeader>
      <CardContent className="grid grid-cols-1 gap-6">
        <CollisionsTable
          publicPlans={publicPlansWithoutUserPlans}
          userPlan={selectedUserPlan}
        />
      </CardContent>
      <CardFooter className="justify-end">
        <Button variant="outline" size="sm" disabled={!collisionsExist}>
          Se krockar grafiskt
        </Button>
      </CardFooter>
    </Card>
  );
};

type CollisionsTableProps = {
  publicPlans: Plan[];
  userPlan?: Plan;
};

const CollisionsTable = ({ publicPlans, userPlan }: CollisionsTableProps) => {
  const { findCollisions } = useFindAllCollisions();

  const collisions = useMemo(() => {
    if (userPlan) {
      return findCollisions(userPlan, publicPlans);
    }
    return {};
  }, [userPlan, publicPlans]);

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Kår</TableHead>
          <TableHead>Fadderi</TableHead>
          <TableHead className="hidden sm:table-cell">Uppdaterad</TableHead>
          <TableHead>Krockar</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {publicPlans.map((plan) => {
          const committee = getCommittee(plan.committeeId);

          const numCollisions = collisions[plan.id]?.length ?? null;
          return (
            <TableRow key={plan.id}>
              <TableCell>{committee?.kår}</TableCell>
              <TableCell className="font-medium">{committee.name}</TableCell>
              <TableCell className="hidden md:table-cell">
                {formatDate(plan.updatedAt)}
              </TableCell>
              <TableCell>{numCollisions ?? "-"}</TableCell>
            </TableRow>
          );
        })}
        {publicPlans.length === 0 && (
          <TableRow>
            <TableCell colSpan={3}>
              Det finns inga publika planeringar.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};

const useFindAllCollisions = () => {
  const { collisionsExist, changedCollisionsExist } = useStoreCollisionsExist();

  const findCollisions = (userPlan: Plan, publicPlans: Plan[]) => {
    const allCollisions: Record<string, Plan["events"]> = {};
    publicPlans.forEach((plan) => {
      const collisions = findCollisionsBetweenPlans(userPlan, plan);
      allCollisions[plan.id] = collisions;

      if (collisions.length > 0 && !collisionsExist) {
        changedCollisionsExist();
      }
    });
    return allCollisions;
  };

  return { findCollisions };
};
