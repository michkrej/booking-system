import { useBoundStore } from "@/state/store";

export const useStorePlanActions = () => {
  const userPlansLoaded = useBoundStore((state) => state.userPlansLoaded);
  const publicPlansLoaded = useBoundStore((state) => state.publicPlansLoaded);
  const userPlanDeleted = useBoundStore((state) => state.userPlanDeleted);
  const userPlanUpdated = useBoundStore((state) => state.userPlanUpdated);
  const userPlanCreated = useBoundStore((state) => state.userPlanCreated);
  const userPlanPublicToggled = useBoundStore(
    (state) => state.planPublicToggled,
  );

  return {
    userPlansLoaded,
    publicPlansLoaded,
    userPlanDeleted,
    userPlanUpdated,
    userPlanCreated,
    userPlanPublicToggled,
  };
};
