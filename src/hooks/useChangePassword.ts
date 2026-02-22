import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { authService } from "@/services";
import { getErrorMessage } from "@/utils/error.utils";

export const useChangePassword = () => {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { t } = useTranslation();

  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  const changePassword = async (
    currentPassword: string,
    newPassword: string,
  ) => {
    setError(null);
    setIsPending(true);
    try {
      await authService.changePassword(currentPassword, newPassword);

      if (isMounted.current) {
        setIsPending(false);
        setError(null);
        toast.success(t("change_password_dialog.success"));
      }
    } catch (error) {
      if (isMounted.current) {
        const errorMessage = getErrorMessage(error);
        console.log(errorMessage);

        let userMessage = t("change_password_dialog.error.generic");
        if (errorMessage.includes("wrong-password")) {
          userMessage = t("change_password_dialog.error.wrong_password");
        } else if (errorMessage.includes("too-many-requests")) {
          userMessage = "För många försök, försök igen senare";
        }

        setError(userMessage);
        setIsPending(false);
        toast.error(userMessage);
      }
    }
  };

  return {
    changePassword,
    isPending,
    error,
  };
};
