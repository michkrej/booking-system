import { Booking, Plan } from "@/utils/interfaces";
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

import { cn, formatDate, getCommittee } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useMemo, useState } from "react";
import { useUserPlans } from "@/hooks/useUserPlans";
import { usePublicPlans } from "@/hooks/usePublicPlans";
import { useBoundStore } from "@/state/store";
import { useNavigate } from "react-router-dom";
import { findRoomCollisionsBetweenEvents } from "@/utils/roomCollisions";
import { findInventoryCollisionsBetweenEvents } from "@/utils/inventoryCollisions";

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
  const [inventoryCollisions, setInventoryCollisions] = useState<
    Record<string, Booking[]>
  >({});

  const publicPlansWithoutUserPlans = useMemo(() => {
    const userPublicPlan = userPlans.find((plan) => plan.public);
    if (!userPublicPlan) return publicPlans;
    return publicPlans.filter((plan) => plan.id !== userPublicPlan.id);
  }, [userPlans, publicPlans]);

  const findCollisions = (userPlan: Plan, publicPlans: Plan[]) => {
    const allCollisions: {
      roomCollisions: Record<string, Plan["events"]>;
      inventoryCollisions: Record<string, Booking[]>;
      items: Record<
        string,
        ReturnType<typeof findInventoryCollisionsBetweenEvents>["items"]
      >;
    } = {
      roomCollisions: {},
      inventoryCollisions: {},
      items: {},
    };

    publicPlans.forEach((plan) => {
      const roomCollisions = findRoomCollisionsBetweenEvents([
        ...userPlan.events,
        ...plan.events,
      ]);

      const inventoryCollisions = findInventoryCollisionsBetweenEvents([
        ...userPlan.events,
        ...plan.events,
      ]);

      allCollisions.roomCollisions[plan.id] = roomCollisions;
      allCollisions.inventoryCollisions[plan.id] =
        inventoryCollisions.collisions;
      allCollisions.items[plan.id] = inventoryCollisions.items;
    });

    return allCollisions;
  };

  const onChangeSelect = (id: string) => {
    const plan = userPlans.find((plan) => plan.id === id);
    if (!plan) return;

    setSelectedUserPlan(plan);

    const collisions = findCollisions(plan, publicPlansWithoutUserPlans);
    setCollisions(collisions.roomCollisions);
    setInventoryCollisions(collisions.inventoryCollisions);
  };

  const onButtonClick = () => {
    const roomCollisionEntries = Object.entries(collisions);
    const inventoryCollisionEntries = Object.entries(inventoryCollisions);

    if (
      roomCollisionEntries.length === 0 &&
      inventoryCollisionEntries.length === 0
    ) {
      return;
    }

    const roomPlanIds = roomCollisionEntries
      .filter(([, value]) => value.length > 0)
      .map(([key]) => key);
    const inventoryPlanIds = inventoryCollisionEntries
      .filter(([, value]) => value.length > 0)
      .map(([key]) => key);

    changedActivePlans([
      ...publicPlans.filter((plan) =>
        [...roomPlanIds, ...inventoryPlanIds].includes(plan.id),
      ),
      ...(selectedUserPlan ? [selectedUserPlan] : []),
    ]);

    if (roomPlanIds.length === 0 && inventoryPlanIds.length > 0) {
      loadedBookings(inventoryCollisionEntries.flatMap(([, events]) => events));
      navigate(`/inventory/view-collisions`);
      return;
    }

    loadedBookings(roomCollisionEntries.flatMap(([, events]) => events));
    navigate(`/booking/view-collisions`);
  };

  const showCollisionsButtonEnabled = useMemo(() => {
    const col = Object.values(collisions).flat();
    const inventoryCol = Object.values(inventoryCollisions).flat();
    return (col.length > 0 || inventoryCol.length > 0) && selectedUserPlan;
  }, [collisions, inventoryCollisions]);

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
          inventoryCollisions={inventoryCollisions}
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
  inventoryCollisions: Record<string, Booking[]>;
};

const CollisionsTable = ({
  publicPlans,
  collisions,
  inventoryCollisions,
}: CollisionsTableProps) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Kår</TableHead>
          <TableHead>Fadderi</TableHead>
          <TableHead className="hidden sm:table-cell">Uppdaterad</TableHead>
          <TableHead>Krockar på lokal</TableHead>
          <TableHead>Krockar på inventarie</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {publicPlans.map((plan) => {
          const committee = getCommittee(plan.committeeId);

          const collisnsForPlan = collisions[plan.id];
          const numCollisions = collisnsForPlan
            ? Math.ceil(collisnsForPlan.length / 2)
            : null;

          const collisnsForInventoryPlan = inventoryCollisions[plan.id];
          const numInventoryCollisions = collisnsForInventoryPlan
            ? Math.ceil(collisnsForInventoryPlan.length / 2)
            : null;
          return (
            <TableRow
              key={plan.id}
              className={cn(
                numCollisions === 0 &&
                  numInventoryCollisions === 0 &&
                  "opacity-50",
              )}
            >
              <TableCell>
                {committee?.kår === "Övrigt" ? plan.label : committee.name}
              </TableCell>
              <TableCell className="font-medium">{committee.name}</TableCell>
              <TableCell className="hidden md:table-cell">
                {formatDate(plan.updatedAt)}
              </TableCell>
              <TableCell>{numCollisions ?? "-"}</TableCell>
              <TableCell>{numInventoryCollisions ?? "-"}</TableCell>
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
