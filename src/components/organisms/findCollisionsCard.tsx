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
import { useUserPlans } from "@/hooks/useUserPlans";
import { usePublicPlans } from "@/hooks/usePublicPlans";
import { useBoundStore } from "@/state/store";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export const FindCollisionsCard = () => {
  const { publicPlans } = usePublicPlans();
  const { userPlans } = useUserPlans();
  const loadedBookings = useBoundStore((state) => state.loadedBookings);
  const changedActivePlans = useBoundStore((state) => state.changedActivePlans);
  const navigate = useNavigate();
  const [selectedUserPlan, setSelectedUserPlan] = useState<Plan>();
  const [collisions, setCollisions] = useState<Record<string, Plan["events"]>>(
    {},
  );

  const publicPlansWithoutUserPlans = useMemo(() => {
    const userPublicPlan = userPlans.find((plan) => plan.public);
    if (!userPublicPlan) return publicPlans;
    return publicPlans.filter((plan) => plan.id !== userPublicPlan.id);
  }, [userPlans, publicPlans]);

  const findCollisions = (userPlan: Plan, publicPlans: Plan[]) => {
    const allCollisions: Record<string, Plan["events"]> = {};
    publicPlans.forEach((plan) => {
      const collisions = findCollisionsBetweenPlans(userPlan, plan);
      allCollisions[plan.id] = collisions;
    });

    return allCollisions;
  };

  const onChangeSelect = (id: string) => {
    const plan = userPlans.find((plan) => plan.id === id);
    if (!plan) return;

    setSelectedUserPlan(plan);
    setCollisions(findCollisions(plan, publicPlansWithoutUserPlans));
  };

  const onButtonClick = () => {
    const plansWithCollisions = Object.keys(collisions);
    loadedBookings(Object.values(collisions).flat());
    changedActivePlans([
      ...publicPlans.filter((plan) => plansWithCollisions.includes(plan.id)),
      ...(selectedUserPlan ? [selectedUserPlan] : []),
    ]);

    navigate(`/booking/view`);
    toast.warning("Bokningar som inte krockar på område", {
      description:
        "Om du ser bokningar som inte krockar på område är det för att dem krockar på bokningsbart material.",
      position: "bottom-left",
      duration: Infinity,
      action: {
        label: "OK",
        onClick: () => toast.dismiss(),
      },
    });
  };

  const showCollisionsButtonEnabled = useMemo(() => {
    const col = Object.values(collisions).flat();
    return col.length > 0 && selectedUserPlan;
  }, [collisions]);

  return (
    <Card className="col-span-full">
      <CardHeader className="grid content-between sm:grid-cols-[1fr_auto]">
        <div className="flex flex-col space-y-1.5">
          <CardTitle>Hitta krockar</CardTitle>
          <CardDescription>
            Hitta krockar mellan dina och andra fadderiers bokningar.
          </CardDescription>
        </div>
        <div className="flex items-center space-x-2">
          <Select onValueChange={onChangeSelect}>
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
        </div>
      </CardHeader>
      <CardContent className="grid grid-cols-1 gap-6">
        <CollisionsTable
          publicPlans={publicPlansWithoutUserPlans}
          collisions={collisions}
        />
      </CardContent>
      <CardFooter className="justify-end">
        <Button
          variant="outline"
          size="sm"
          disabled={!showCollisionsButtonEnabled}
          onClick={onButtonClick}
        >
          Se krockar grafiskt
        </Button>
      </CardFooter>
    </Card>
  );
};

type CollisionsTableProps = {
  publicPlans: Plan[];
  collisions: Record<string, Plan["events"]>;
};

const CollisionsTable = ({ publicPlans, collisions }: CollisionsTableProps) => {
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

          const collisnsForPlan = collisions[plan.id];
          const numCollisions = collisnsForPlan
            ? Math.ceil(collisnsForPlan.length / 2)
            : null;
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
