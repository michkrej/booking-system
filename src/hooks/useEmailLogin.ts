import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { authService } from "@/services";
import { useBoundStore } from "@/state/store";
import { getErrorMessage } from "@/utils/error.util";

export const useEmailLogin = () => {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const userUpdated = useBoundStore((state) => state.userUpdated);

  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;

    return () => {
      isMounted.current = false;
    };
  }, []);

  const loginWithEmail = async (email: string, password: string) => {
    setError(null);
    setIsPending(true);
    try {
      const user = await authService.loginWithEmailAndPassword(email, password);
      userUpdated(user);

      if (isMounted.current) {
        setIsPending(false);
        setError(null);
      }
    } catch (error) {
      if (isMounted.current) {
        const errorMessage = getErrorMessage(error);
        console.log(errorMessage);
        setError(errorMessage);
        setIsPending(false);
        toast.error(errorMessage);
      }
    } finally {
      setIsPending(false);
    }
  };

  return {
    loginWithEmail,
    isPending,
    error,
  };
};
