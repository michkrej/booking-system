import { CircleUser, Globe } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { useSignOut } from "@hooks/useSignOut";
import { useStoreUser } from "@hooks/useStoreUser";
import { SiteLogo } from "@components/atoms/siteLogo";
import { ChangePasswordDialog } from "@components/molecules/changePasswordDialog";
import { Button } from "@ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@ui/dropdown-menu";
import { siteConfig } from "@/config/site";
import { auth } from "@/services/config";

export const Header = () => {
  const { logout } = useSignOut();
  const { user } = useStoreUser();
  const { i18n, t } = useTranslation();

  const [changePasswordDialogOpen, setChangePasswordDialogOpen] =
    useState(false);

  const handleToggleLanguage = () => {
    i18n.changeLanguage(i18n.language === "sv" ? "en" : "sv");
  };

  const isEmailPasswordUser = () => {
    const currentUser = auth.currentUser;
    if (!currentUser) return false;

    return currentUser.providerData.some(
      (provider) => provider.providerId === "password",
    );
  };

  return (
    <header className="bg-background sticky top-0 z-10 flex h-16 items-center gap-4 border-b px-4 md:px-6">
      <nav className="flex flex-1 flex-row items-center gap-4 text-sm font-medium md:gap-5 lg:gap-6">
        <Link to="/dashboard">
          <SiteLogo />
        </Link>
        <div className="h-8 border-r" />
        <Link
          to="/dashboard"
          className="text-foreground hover:text-foreground transition-colors"
        >
          {t("dashboard")}
        </Link>
        <a
          href={siteConfig.links.TF_2024}
          className="text-muted-foreground hover:text-foreground transition-colors"
          target="_blank"
          rel="noreferrer"
        >
          {t("map_tf")}
        </a>

        {user.admin && (
          <Link
            to="/admin"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            {t("admin")}
          </Link>
        )}
      </nav>

      <div className="flex items-center justify-end gap-4 md:ml-auto md:gap-2 lg:gap-4">
        {import.meta.env.DEV ? (
          <Button
            size="icon"
            className="rounded-full"
            variant="ghost"
            onClick={handleToggleLanguage}
          >
            <Globe className="h-5 w-5" />
          </Button>
        ) : null}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="secondary" size="icon" className="rounded-full">
              <CircleUser className="h-5 w-5" />
              <span className="sr-only">Toggle user menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
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
            <DropdownMenuItem
              onClick={() => logout()}
              className="font-semibold"
            >
              {t("signout")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <ChangePasswordDialog
        open={changePasswordDialogOpen}
        onOpenChange={setChangePasswordDialogOpen}
      />
    </header>
  );
};
