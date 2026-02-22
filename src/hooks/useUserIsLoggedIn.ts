import { useContext } from "react";
import { AuthContext } from "@/providers/AuthProvider";

export const useUserIsLoggedIn = () => {
  const user = useContext(AuthContext).user;
  return user !== null;
};
