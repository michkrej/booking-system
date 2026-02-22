import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { authService } from "@/services";
import { getErrorMessage } from "@/utils/error.utils";

export const useGoogleLogin = () => {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;

    return () => {
      isMounted.current = false;
    };
  }, []);

  const loginWithGoogle = async () => {
    setError(null);
    setIsPending(true);

    try {
      await authService.signInWithGoogle();

      if (isMounted.current) {
        setIsPending(false);
        setError(null);
      }
    } catch (error) {
      if (isMounted.current) {
        const errorMessage = getErrorMessage(error);
        console.error(errorMessage);
        setError(errorMessage);
        setIsPending(false);
        toast.error(errorMessage);
      }
    }
  };

  return {
    loginWithGoogle,
    isPending,
    error,
  };
};
