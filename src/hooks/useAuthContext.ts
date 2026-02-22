import { useContext } from "react";
import { AuthContext } from "@/providers/AuthProvider";

export const useAuthContext = () => {
  const { user, isLoading } = useContext(AuthContext);
  return { user, isLoading };
};
