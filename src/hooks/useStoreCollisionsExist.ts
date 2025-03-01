import { useBoundStore } from "@/state/store";

export const useStoreCollisionsExist = () => {
  return {
    collisionsExist: useBoundStore((state) => state.collisionsExist),
    toggleCollisionsExist: useBoundStore(
      (state) => state.toggleCollisionsExist,
    ),
  };
};
