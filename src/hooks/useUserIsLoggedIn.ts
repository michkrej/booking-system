import { useBoundStore } from "@/state/store";

export const useUserIsLoggedIn = () => {
  return useBoundStore((state) => state.user) !== null;
};
