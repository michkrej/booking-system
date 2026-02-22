import { useEffect, useState } from "react";
import { authService } from "@/services";
import { getErrorMessage } from "@/utils/error.utils";

export const useSignOut = () => {
  const [isCancelled, setIsCancelled] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const logout = async () => {
    setError(null);
    setIsPending(true);
    try {
      await authService.signOut();

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
