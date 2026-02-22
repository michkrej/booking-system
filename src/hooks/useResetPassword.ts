import { useState } from "react";
import { toast } from "sonner";
import { authService } from "@/services";
import { getErrorMessage } from "@/utils/error.utils";

export const useResetPassword = () => {
  const [isPending, setIsPending] = useState(false);

  const resetPassword = async (email: string) => {
    setIsPending(true);

    authService
      .resetPassword(email)
      .then(async () => {
        toast.success("Ett mail har skickats till din e-postadress", {
          duration: 1000 * 10,
        });
      })
      .catch((error) => {
        const errorMessage = getErrorMessage(error);
        console.log(errorMessage);
        toast.error(errorMessage, {
          duration: 1000 * 10,
        });
      });
    setIsPending(false);
  };

  return { resetPassword, isPending };
};
