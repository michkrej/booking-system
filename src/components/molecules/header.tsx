import { CircleUser } from "lucide-react";
import { Link } from "react-router-dom";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@ui/dropdown-menu";
import { Button } from "@ui/button";
import { SiteLogo } from "../atoms/siteLogo";
import { siteConfig } from "@/config/site";
import { useStoreUser } from "@hooks/useStoreUser";
import { useStorePlanYear } from "@hooks/useStorePlanYear";
import { useSignOut } from "@hooks/useSignOut";

export const Header = () => {
  const { logout } = useSignOut();
  const { planYear } = useStorePlanYear();
  const { user } = useStoreUser();

  const TF_URL =
    planYear > 2023 ? siteConfig.links.TF_2024 : siteConfig.links.TF_2023;

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
          Dashboard
        </Link>
        <a
          href={TF_URL}
          className="text-muted-foreground hover:text-foreground transition-colors"
          target="_blank"
          rel="noreferrer"
        >
          Karta Trädgårdsföreningen
        </a>

        {user.admin && (
          <Link
            to="/admin"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            Admin
          </Link>
        )}
      </nav>

      <div className="flex items-center justify-end gap-4 md:ml-auto md:gap-2 lg:gap-4">
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
              Instruktionsvideo
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => window.open(siteConfig.links.feedback)}
            >
              Feedback
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => logout()}
              className="font-semibold"
            >
              Logga ut
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};
