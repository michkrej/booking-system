import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { type User } from "@/interfaces/interfaces";
import { authService } from "@/services";
import { getErrorMessage } from "@/utils/error.utils";

export const useSignUp = () => {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;

    return () => {
      isMounted.current = false;
    };
  }, []);

  const _signup = async (login: () => Promise<User>) => {
    setError(null);
    setIsPending(true);

    try {
      await login();

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
    await _signup(() =>
      authService.signUpWithEmailAndPassword({
        email,
        password,
        committeeId,
        displayName,
      }),
    );
  };

  const signupWithGoogle = async (committeeId: User["committeeId"]) => {
    await _signup(() => authService.signupWithGoogle(committeeId));
  };

  return {
    signupWithEmailAndPassword,
    signupWithGoogle,
    isPending,
    error,
  };
};
