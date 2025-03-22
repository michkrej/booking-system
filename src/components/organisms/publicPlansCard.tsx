import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCurrentDate } from "@/hooks/useCurrentDate";
import { usePublicPlans } from "@/hooks/usePublicPlans";
import { useStoreBookings } from "@/hooks/useStoreBookings";
import { useStoreUser } from "@/hooks/useStoreUser";
import { formatDate, getCommittee } from "@/lib/utils";
import { useBoundStore } from "@/state/store";
import { type Booking, type Plan } from "@/utils/interfaces";
import { findInventoryCollisionsBetweenEvents } from "@/utils/inventoryCollisions";
import { findRoomCollisionsBetweenEvents } from "@/utils/roomCollisions";
import { ExportPlansButton } from "../molecules/exportPlansButton";
import { Button } from "../ui/button";
import { Skeleton } from "../ui/skeleton";
import { TabCommitteeSection } from "../molecules/TabCommitteeSection";

export const PublicPlansCard = () => {
  const { user } = useStoreUser();
  const { publicPlans, isPending } = usePublicPlans();
  const { loadedBookings } = useStoreBookings();
  const changedActivePlans = useBoundStore((state) => state.changedActivePlans);
  const navigate = useNavigate();
  const { resetCurrentDate } = useCurrentDate();

  const [inventoryCollisions, setInventoryCollisions] = useState<Booking[]>([]);
  const [roomCollisions, setRoomCollisions] = useState<Booking[]>([]);

  const defaultTab = useMemo(() => {
    const committee = getCommittee(user.committeeId);
    if (!committee) return "all";
    if (committee.kår === "Övrigt") return "all";
    return committee.kår.toLowerCase();
  }, [user.committeeId]);

  const plansLinTek = useMemo(() => {
    return publicPlans.filter(
      (plan) => getCommittee(plan.committeeId)?.kår === "LinTek",
    );
  }, [publicPlans]);

  const plansConsensus = useMemo(() => {
    return publicPlans.filter(
      (plan) => getCommittee(plan.committeeId)?.kår === "Consensus",
    );
  }, [publicPlans]);

  const plansStuFF = useMemo(() => {
    return publicPlans.filter(
      (plan) => getCommittee(plan.committeeId)?.kår === "StuFF",
    );
  }, [publicPlans]);

  const handleViewBookingsClick = (plans: Plan[]) => {
    const events = plans.flatMap((plan) => plan.events);
    loadedBookings(events);
    changedActivePlans(plans);
    resetCurrentDate();
    navigate(`/booking/view`);
  };

  const handlePlanClick = (plan: Plan) => {
    loadedBookings(plan.events);
    changedActivePlans([plan]);
    resetCurrentDate();
    navigate(`/booking/view`);
  };

  const handleFindCollisionsClick = (plans: Plan[]) => {
    const events = plans.flatMap((plan) => plan.events);
    const eventCollisions = findRoomCollisionsBetweenEvents(events);

    const inventoryCollisions = findInventoryCollisionsBetweenEvents(events);

    if (eventCollisions.length === 0 && inventoryCollisions.length === 0) {
      toast.warning(
        "Det finns inga bokningar som krockar på lokal eller inventariet",
      );
      return;
    }

    if (eventCollisions.length > 0) {
      toast.warning("Det finns bokningar som krockar på lokal");
      setRoomCollisions(eventCollisions);
    }

    if (inventoryCollisions.length > 0) {
      toast.warning("Det finns bokningar som krockar på inventariet");
      setInventoryCollisions(inventoryCollisions);
    }
  };

  const handleViewCollisionsClick = (plans: Plan[]) => {
    const hasRoomCollisions = roomCollisions.length > 0;
    const hasInventoryCollisions = inventoryCollisions.length > 0;

    // Load the bookings
    if (hasRoomCollisions || hasInventoryCollisions) {
      loadedBookings(hasRoomCollisions ? roomCollisions : inventoryCollisions);
      changedActivePlans(plans);
    }

    // Navigate to the appropriate page based on the collisions
    if (hasRoomCollisions) {
      navigate(`/booking/view-collisions`);
    } else if (hasInventoryCollisions) {
      navigate(`/inventory/view-collisions`);
    }
  };

  return (
    <Tabs defaultValue={defaultTab} className="col-span-2">
      <div className="flex items-center">
        <TabsList>
          <TabsTrigger value="all">Alla</TabsTrigger>
          <TabsTrigger value="consensus">Consensus</TabsTrigger>
          <TabsTrigger value="lintek">LinTek</TabsTrigger>
          <TabsTrigger value="stuff">StuFF</TabsTrigger>
        </TabsList>
        <div className="ml-auto flex items-center gap-2">
          <ExportPlansButton />
        </div>
      </div>
      {/* SECTION - all */}
      <TabsContent value="all">
        <Card>
          <CardHeader className="px-7">
            <CardTitle>Alla planeringar</CardTitle>
            <CardDescription>
              Publika planeringar för alla kårer.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Fadderi</TableHead>
                  <TableHead>Kår</TableHead>
                  <TableHead className="hidden sm:table-cell">
                    Uppdaterad
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {publicPlans.map((plan) => {
                  const committee = getCommittee(plan.committeeId);
                  const isÖvrigt = committee.kår === "Övrigt";
                  return (
                    <TableRow
                      key={plan.id}
                      onClick={() => handlePlanClick(plan)}
                      className="hover:cursor-pointer"
                    >
                      <TableCell className="font-medium">
                        {isÖvrigt ? plan.label : committee.name}
                      </TableCell>
                      <TableCell>{committee?.kår}</TableCell>
                      <TableCell className="hidden md:table-cell">
                        {formatDate(plan.updatedAt)}
                      </TableCell>
                    </TableRow>
                  );
                })}
                {!isPending && !publicPlans.length ? (
                  <TableRow>
                    <TableCell colSpan={3}>
                      Det finns inga publika planeringar.
                    </TableCell>
                  </TableRow>
                ) : null}
                {isPending && publicPlans.length === 0 ? (
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
            <Button
              onClick={() => handleViewBookingsClick(publicPlans)}
              disabled={publicPlans.length === 0}
              variant="outline"
            >
              Se bokningar
            </Button>
            {roomCollisions.length > 0 || inventoryCollisions.length > 0 ? (
              <Button
                onClick={() => handleViewCollisionsClick(publicPlans)}
                className="w-32"
              >
                Se krockar
              </Button>
            ) : (
              <Button
                onClick={() => handleFindCollisionsClick(publicPlans)}
                variant={"secondary"}
                className="w-32"
              >
                Hitta krockar
              </Button>
            )}
          </CardFooter>
        </Card>
      </TabsContent>
      {/* SECTION - Consensus */}
      <TabCommitteeSection
        plans={plansConsensus}
        kår={"Consensus"}
        isPending={isPending}
        roomCollisions={roomCollisions}
        inventoryCollisions={inventoryCollisions}
        handleFindCollisionsClick={handleFindCollisionsClick}
        handleViewCollisionsClick={handleViewCollisionsClick}
        handleViewBookingsClick={handleViewBookingsClick}
        handlePlanClick={handlePlanClick}
      />
      {/* SECTION - LinTek */}
      <TabCommitteeSection
        plans={plansLinTek}
        kår={"LinTek"}
        isPending={isPending}
        roomCollisions={roomCollisions}
        inventoryCollisions={inventoryCollisions}
        handleFindCollisionsClick={handleFindCollisionsClick}
        handleViewCollisionsClick={handleViewCollisionsClick}
        handleViewBookingsClick={handleViewBookingsClick}
        handlePlanClick={handlePlanClick}
      />
      {/* SECTION - StuFF */}
      <TabCommitteeSection
        plans={plansStuFF}
        kår={"StuFF"}
        isPending={isPending}
        roomCollisions={roomCollisions}
        inventoryCollisions={inventoryCollisions}
        handleFindCollisionsClick={handleFindCollisionsClick}
        handleViewCollisionsClick={handleViewCollisionsClick}
        handleViewBookingsClick={handleViewBookingsClick}
        handlePlanClick={handlePlanClick}
      />
    </Tabs>
  );
};
