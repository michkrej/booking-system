import { useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import type { Booking } from "@/interfaces/interfaces";
import { useBoundStore } from "@/state/store";
import { viewCollisionsPath } from "@/utils/constants";
import { findCollisionsBetweenUserAndPublicPlans } from "@/utils/helpers";
import { usePublicPlans } from "./usePublicPlans";
import { useUserPlans } from "./useUserPlans";

const getPlanIdsWithCollisions = (
  collisions: Record<string, unknown[]>,
): string[] => {
  return Object.entries(collisions)
    .filter(([, value]) => value.length > 0)
    .map(([key]) => key);
};

export const useFindCollisionsCard = () => {
  const { publicPlans } = usePublicPlans();
  const { userPlans } = useUserPlans();
  const loadedBookings = useBoundStore((state) => state.loadedBookings);
  const changedActivePlans = useBoundStore((state) => state.changedActivePlans);
  const navigate = useNavigate();

  const selectedUserPlan = useBoundStore((state) => state.selectedUserPlan);
  const setSelectedUserPlan = useBoundStore(
    (state) => state.setSelectedUserPlan,
  );

  const publicPlansWithoutUserPlans = useMemo(() => {
    const userPublicPlan = userPlans.find((plan) => plan.public);
    if (!userPublicPlan) return publicPlans;

    return publicPlans.filter((plan) => plan.id !== userPublicPlan.id);
  }, [userPlans, publicPlans]);

  const collisions = useMemo(() => {
    if (!selectedUserPlan)
      return { roomCollisions: {}, inventoryCollisions: {} };

    const res = findCollisionsBetweenUserAndPublicPlans(
      selectedUserPlan,
      publicPlansWithoutUserPlans,
    );

    const filterRoomCollisions = Object.fromEntries(
      Object.values(res.roomCollisions).filter((value) => value.length > 0),
    );

    const filterInventoryCollisions = Object.fromEntries(
      Object.values(res.inventoryCollisions).filter(
        (value) => value.length > 0,
      ),
    );

    return {
      roomCollisions: filterRoomCollisions,
      inventoryCollisions: filterInventoryCollisions,
    };
  }, [selectedUserPlan, publicPlansWithoutUserPlans]);

  const onChangeSelect = (id: string) => {
    const plan = userPlans.find((plan) => plan.id === id);
    setSelectedUserPlan(plan);
  };

  const onButtonClick = useCallback(() => {
    if (!selectedUserPlan) return; // Should not happen if button is disabled

    const roomCollisionPlanIds = getPlanIdsWithCollisions(
      collisions.roomCollisions,
    );
    const inventoryCollisionPlanIds = getPlanIdsWithCollisions(
      collisions.inventoryCollisions,
    );

    const allCollisionPlanIds = [
      ...roomCollisionPlanIds,
      ...inventoryCollisionPlanIds,
    ];

    if (allCollisionPlanIds.length === 0) {
      return; // Should not happen if button is disabled
    }

    const plansToActivate = [
      ...publicPlans.filter((plan) => allCollisionPlanIds.includes(plan.id)),
      selectedUserPlan,
    ];

    changedActivePlans(plansToActivate);

    if (
      roomCollisionPlanIds.length === 0 &&
      inventoryCollisionPlanIds.length > 0
    ) {
      const allInventoryCollisions = Object.values(
        collisions.inventoryCollisions,
      ).flat() as Booking[];
      loadedBookings(allInventoryCollisions);
      navigate(`/inventory/${viewCollisionsPath}`);
      return;
    }

    const allRoomCollisions = Object.values(
      collisions.roomCollisions,
    ).flat() as Booking[];
    loadedBookings(allRoomCollisions);

    navigate(`/booking/${viewCollisionsPath}`);
  }, [
    selectedUserPlan,
    collisions,
    publicPlans,
    changedActivePlans,
    loadedBookings,
    navigate,
  ]);

  const showCollisionsButtonEnabled = useMemo(() => {
    const roomCollisions = collisions?.roomCollisions || {};
    const inventoryCollisions = collisions?.inventoryCollisions || {};

    const hasRoomCollisions = Object.keys(roomCollisions).some(
      (key) => (roomCollisions[key]?.length ?? 0) > 0,
    );

    const hasInventoryCollisions = Object.keys(inventoryCollisions).some(
      (key) => (inventoryCollisions[key]?.length ?? 0) > 0,
    );

    return (
      (hasRoomCollisions || hasInventoryCollisions) &&
      selectedUserPlan !== undefined
    );
  }, [collisions, selectedUserPlan]);

  return {
    userPlans,
    publicPlansWithoutUserPlans,
    selectedUserPlan,
    collisions,
    onChangeSelect,
    onButtonClick,
    showCollisionsButtonEnabled,
  };
};
