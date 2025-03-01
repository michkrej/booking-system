import { useBoundStore } from "@/state/store";

export const useStoreAdminSettings = () => {
  return {
    bookableItems: useBoundStore((state) => state.bookableItems),
    planEditLocked: useBoundStore((state) => state.planEditLocked),
    mottagningStart: useBoundStore((state) => state.mottagningStart),

    updatedPlanEditLock: useBoundStore((state) => state.updatedPlanEditLock),
    updatedMottagningStartDateForKår: useBoundStore(
      (state) => state.updatedMottagningStartDateForKår,
    ),
    updatedBookableItems: useBoundStore((state) => state.updatedBookableItems),
    loadedAdminSettings: useBoundStore((state) => state.loadedAdminSettings),
  };
};
