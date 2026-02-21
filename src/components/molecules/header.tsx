import { Globe } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { useStoreUser } from "@hooks/useStoreUser";
import { SiteLogo } from "@components/atoms/siteLogo";
import { Button } from "@ui/button";
import { siteConfig } from "@/config/site";
import { AccountDropdown } from "./AccountDropdown";

export const Header = () => {
  const { user } = useStoreUser();
  const { i18n, t } = useTranslation();

  const handleToggleLanguage = () => {
    console.log(i18n.language);
    i18n.changeLanguage(i18n.language === "sv" ? "en" : "sv");
  };

  return (
    <header className="bg-background sticky top-0 z-12 flex h-16 items-center gap-4 border-b px-4 md:px-6">
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
        <AccountDropdown />
      </div>
    </header>
  );
};
