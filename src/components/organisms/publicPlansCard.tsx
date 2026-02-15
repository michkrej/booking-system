import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useCurrentDate } from "@hooks/useCurrentDate";
import { usePublicPlansByKår } from "@hooks/usePlansByKår";
import { usePublicPlans } from "@hooks/usePublicPlans";
import { useStoreBookings } from "@hooks/useStoreBookings";
import { useStoreUser } from "@hooks/useStoreUser";
import { useAllConflicts } from "@hooks/useAllConflicts";
import { useBoundStore } from "@state/store";
import { type Booking, type Plan } from "@utils/interfaces";
import { findInventoryCollisionsBetweenEvents } from "@utils/inventoryCollisions";
import { findRoomCollisionsBetweenEvents } from "@utils/roomCollisions";
import { getCommittee } from "@lib/utils";
import { TabAllCommitteesSection } from "@components/molecules/TabAllCommitteesSection";
import { TabCommitteeSection } from "@components/molecules/TabCommitteeSection";
import { ExportPlansButton } from "@components/molecules/exportPlansButton";
import { Tabs, TabsList, TabsTrigger } from "@ui/tabs";
import { viewCollisionsPath } from "@/utils/CONSTANTS";

export const PublicPlansCard = () => {
  const { user } = useStoreUser();
  const { publicPlans, isPending } = usePublicPlans();
  const { loadedBookings } = useStoreBookings();
  const changedActivePlans = useBoundStore((state) => state.changedActivePlans);
  const navigate = useNavigate();
  const { resetCurrentDate } = useCurrentDate();
  const { t } = useTranslation();

  const {
    stuff: plansStuFF,
    lintek: plansLinTek,
    consensus: plansConsensus,
  } = usePublicPlansByKår();

  const { getConflictsForPlan } = useAllConflicts();

  const [inventoryCollisions, setInventoryCollisions] = useState<Booking[]>([]);
  const [roomCollisions, setRoomCollisions] = useState<Booking[]>([]);

  const defaultTab = useMemo(() => {
    const committee = getCommittee(user.committeeId);
    if (!committee) return "all";
    if (committee.kår === "Övrigt") return "all";
    return committee.kår.toLowerCase();
  }, [user.committeeId]);

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

    const { collisions: inventoryCollisions } =
      findInventoryCollisionsBetweenEvents(events);

    if (eventCollisions.length === 0 && inventoryCollisions.length === 0) {
      toast.success(
        "Det finns inga bokningar som krockar på lokal eller inventarier",
      );
      return;
    }

    if (eventCollisions.length > 0 && inventoryCollisions.length > 0) {
      toast.warning("Det finns krockar på både lokal och inventarier");
      setRoomCollisions(eventCollisions);
      setInventoryCollisions(inventoryCollisions);
      return;
    }

    if (eventCollisions.length > 0) {
      toast.warning("Det finns bokningar som krockar på lokal");
      setRoomCollisions(eventCollisions);
    }

    if (inventoryCollisions.length > 0) {
      toast.warning("Det finns bokningar som krockar på inventarier");
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
      navigate(`/booking/${viewCollisionsPath}`);
    } else if (hasInventoryCollisions) {
      navigate(`/inventory/${viewCollisionsPath}`);
    }
  };

  return (
    <Tabs defaultValue={defaultTab}>
      <div className="flex items-center">
        <TabsList>
          <TabsTrigger value="all">{t("all")}</TabsTrigger>
          <TabsTrigger value="consensus">Consensus</TabsTrigger>
          <TabsTrigger value="lintek">LinTek</TabsTrigger>
          <TabsTrigger value="stuff">StuFF</TabsTrigger>
        </TabsList>
        <div className="ml-auto flex items-center gap-2">
          <ExportPlansButton />
        </div>
      </div>
      {/* SECTION - all */}
      <TabAllCommitteesSection
        plans={publicPlans}
        isPending={isPending}
        roomCollisions={roomCollisions}
        inventoryCollisions={inventoryCollisions}
        handleFindCollisionsClick={handleFindCollisionsClick}
        handleViewCollisionsClick={handleViewCollisionsClick}
        handleViewBookingsClick={handleViewBookingsClick}
        handlePlanClick={handlePlanClick}
        getConflictsForPlan={getConflictsForPlan}
      />
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
        getConflictsForPlan={getConflictsForPlan}
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
        getConflictsForPlan={getConflictsForPlan}
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
        getConflictsForPlan={getConflictsForPlan}
      />
    </Tabs>
  );
};
