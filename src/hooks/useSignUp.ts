import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { authService } from "@/services";
import { useBoundStore } from "@/state/store";
import { getErrorMessage } from "@/utils/error.util";
import { type User } from "@/utils/interfaces";

export const useSignUp = () => {
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

  const signupWithEmailAndPassword = async ({
    email,
    password,
    displayName,
    committeeId,
  }: {
    email: string;
    password: string;
    displayName: string;
    committeeId: User["committeeId"];
  }) => {
    setError(null);
    setIsPending(true);
    try {
      const user = await authService.signUpWithEmailAndPassword({
        email,
        password,
        committeeId,
        displayName,
      });
      userUpdated(user);

      if (isMounted.current) {
        setIsPending(false);
        setError(null);
      }
    } catch (error) {
      if (isMounted.current) {
        const errorMessage = getErrorMessage(error);
        setError(errorMessage);
        setIsPending(false);
        toast.error(errorMessage);
      }
    }
  };

  const signUpWithGoogle = async (committeeId: User["committeeId"]) => {
    setError(null);
    setIsPending(true);

    try {
      const user = await authService.signUpWithGoogle(committeeId);
      userUpdated(user);

      if (isMounted.current) {
        setIsPending(false);
        setError(null);
      }
    } catch (error) {
      if (isMounted.current) {
        const errorMessage = getErrorMessage(error);
        setError(errorMessage);
        setIsPending(false);
        toast.error(errorMessage);
      }
    }
  };

  return {
    signupWithEmailAndPassword,
    signUpWithGoogle,
    isPending,
    error,
  };
};
