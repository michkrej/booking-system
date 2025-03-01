import { useState, useEffect } from "react";

import { authService } from "@/services";
import { getErrorMessage } from "@/utils/error.util";
import { useBoundStore } from "@/state/store";
import { useStorePlanActions } from "./useStorePlanActions";

export const useSignOut = () => {
  const [isCancelled, setIsCancelled] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const userUpdated = useBoundStore((state) => state.userUpdated);
  const { userPlansLoaded, publicPlansLoaded } = useStorePlanActions();

  const logout = async () => {
    setError(null);
    setIsPending(true);
    try {
      await authService.signOut();
      userUpdated(null);
      userPlansLoaded([]);
      publicPlansLoaded([]);

      if (!isCancelled) {
        setIsPending(false);
      }
    } catch (error) {
      if (!isCancelled) {
        const errorMessage = getErrorMessage(error);
        console.log(errorMessage);
        setError(errorMessage);
        setIsPending(false);
      }
    }
  };

  useEffect(() => {
    return () => {
      setIsCancelled(true);
    };
  }, []);

  return { logout, isPending, error };
};
