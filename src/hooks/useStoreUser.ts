import { useContext } from "react";
import { committees } from "@/data/committees";
import { AuthContext } from "@/providers/AuthProvider";

export const useStoreUser = () => {
  const user = useContext(AuthContext).user;

  if (!user) throw new Error("User should be loaded");

  return {
    user: {
      ...user,
      kår: committees[user.committeeId]!.kår,
      committee: committees[user.committeeId],
    },
  };
};
