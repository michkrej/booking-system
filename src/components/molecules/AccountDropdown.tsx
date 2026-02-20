import { CircleUser } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { siteConfig } from "@/config/site";
import { useSignOut } from "@/hooks/useSignOut";
import { useStoreUser } from "@/hooks/useStoreUser";
import { auth } from "@/services/config";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { ChangePasswordDialog } from "./changePasswordDialog";

export const AccountDropdown = () => {
  const { t } = useTranslation();
  const { user } = useStoreUser();
  const { logout } = useSignOut();

  const [changePasswordDialogOpen, setChangePasswordDialogOpen] =
    useState(false);

  const isEmailPasswordUser = () => {
    const currentUser = auth.currentUser;
    if (!currentUser) return false;

    return currentUser.providerData.some(
      (provider) => provider.providerId === "password",
    );
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="secondary" size="icon" className="rounded-full">
            <CircleUser className="h-5 w-5" />
            <span className="sr-only">Toggle user menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="min-w-39">
          <DropdownMenuItem
            disabled
            onClick={() => window.open(siteConfig.links.instructionVideo)}
          >
            {user.email}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => window.open(siteConfig.links.instructionVideo)}
          >
            {t("instruction_video")}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => window.open(siteConfig.links.feedback)}
          >
            {t("feedback")}
          </DropdownMenuItem>
          {isEmailPasswordUser() && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => setChangePasswordDialogOpen(true)}
              >
                {t("change_password")}
              </DropdownMenuItem>
            </>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => logout()} className="font-semibold">
            {t("signout")}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <ChangePasswordDialog
        open={changePasswordDialogOpen}
        onOpenChange={setChangePasswordDialogOpen}
      />
    </>
  );
};
