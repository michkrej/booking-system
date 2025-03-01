import { committees } from "@/data/committees";
import { useBoundStore } from "@/state/store";

export const useStoreUser = () => {
  const user = useBoundStore((state) => state.user);

  if (!user) throw new Error("User should be loaded");

  return {
    user: {
      ...user,
      kår: committees[user.committeeId].kår,
    },
  };
};
