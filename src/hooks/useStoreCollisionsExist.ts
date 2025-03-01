import { useBoundStore } from "@/state/store";

export const useStoreCollisionsExist = () => {
  return {
    collisionsExist: useBoundStore((state) => state.collisionsExist),
    changedCollisionsExist: useBoundStore(
      (state) => state.changedCollisionsExist,
    ),
  };
};
